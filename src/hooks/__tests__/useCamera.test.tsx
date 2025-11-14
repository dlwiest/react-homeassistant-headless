import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CameraFeatures } from '../../types'
import { createMockEntity } from '../../test/utils'
import { FeatureNotSupportedError } from '../../utils/errors'

// Mock dependencies
vi.mock('../useEntity', () => ({
  useEntity: vi.fn()
}))

vi.mock('../../providers/HAProvider', () => ({
  useHAConnection: vi.fn()
}))

// Import after mocking
import { useCamera } from '../useCamera'
import { useEntity } from '../useEntity'
import { useHAConnection } from '../../providers/HAProvider'
import type { CameraAttributes } from '../../types'

// Helper to create mock camera entities
function createMockCameraEntity(
  entityName: string = 'test',
  state: string = 'idle', 
  attributes: Partial<CameraAttributes> = {}
) {
  const defaultAttributes = {
    friendly_name: `Test Camera ${entityName}`,
    access_token: 'mock-access-token-123',
  }
  
  // Merge attributes, allowing explicit undefined to override defaults
  const finalAttributes = { ...defaultAttributes }
  Object.keys(attributes).forEach(key => {
    finalAttributes[key] = attributes[key]
  })
  
  return createMockEntity<CameraAttributes>(
    `camera.${entityName}`, 
    state, 
    finalAttributes
  )
}

describe('useCamera', () => {
  const mockUseEntity = useEntity as any
  const mockUseHAConnection = useHAConnection as any
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mocks
    mockUseEntity.mockReturnValue(createMockCameraEntity('test'))
    mockUseHAConnection.mockReturnValue({
      config: { url: 'http://homeassistant.local:8123' }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Feature Detection', () => {
    it('should detect on/off support correctly', () => {
      const attributes = {
        supported_features: CameraFeatures.SUPPORT_ON_OFF
      }
      mockUseEntity.mockReturnValue(createMockCameraEntity('test', 'idle', attributes))

      const { result } = renderHook(() => useCamera('camera.test'))

      expect(result.current.supportsOnOff).toBe(true)
      expect(result.current.supportsStream).toBe(false)
    })

    it('should detect stream support correctly', () => {
      const attributes = {
        supported_features: CameraFeatures.SUPPORT_STREAM
      }
      mockUseEntity.mockReturnValue(createMockCameraEntity('test', 'idle', attributes))

      const { result } = renderHook(() => useCamera('camera.test'))

      expect(result.current.supportsStream).toBe(true)
      expect(result.current.supportsOnOff).toBe(false)
    })

    it('should detect multiple features correctly', () => {
      const attributes = {
        supported_features: CameraFeatures.SUPPORT_ON_OFF | CameraFeatures.SUPPORT_STREAM
      }
      mockUseEntity.mockReturnValue(createMockCameraEntity('test', 'idle', attributes))

      const { result } = renderHook(() => useCamera('camera.test'))

      expect(result.current.supportsOnOff).toBe(true)
      expect(result.current.supportsStream).toBe(true)
    })

    it('should handle missing supported_features attribute', () => {
      const attributes = {} // No supported_features
      mockUseEntity.mockReturnValue(createMockCameraEntity('test', 'idle', attributes))

      const { result } = renderHook(() => useCamera('camera.test'))

      expect(result.current.supportsOnOff).toBe(false)
      expect(result.current.supportsStream).toBe(false)
    })
  })

  describe('State Derivations', () => {
    it('should determine isOn state correctly', () => {
      // Test different states
      const testCases = [
        { state: 'idle', expectedOn: true },
        { state: 'recording', expectedOn: true },
        { state: 'streaming', expectedOn: true },
        { state: 'off', expectedOn: false },
        { state: 'unavailable', expectedOn: false },
        { state: 'unknown', expectedOn: false }
      ]

      testCases.forEach(({ state, expectedOn }) => {
        mockUseEntity.mockReturnValue(createMockCameraEntity('test', state))
        const { result } = renderHook(() => useCamera('camera.test'))
        expect(result.current.isOn).toBe(expectedOn)
      })
    })

    it('should determine camera states correctly', () => {
      // Test idle state
      mockUseEntity.mockReturnValue(createMockCameraEntity('test', 'idle'))
      let { result } = renderHook(() => useCamera('camera.test'))
      expect(result.current.isIdle).toBe(true)
      expect(result.current.isRecording).toBe(false)
      expect(result.current.isStreaming).toBe(false)

      // Test recording state
      mockUseEntity.mockReturnValue(createMockCameraEntity('test', 'recording'))
      result = renderHook(() => useCamera('camera.test')).result
      expect(result.current.isRecording).toBe(true)
      expect(result.current.isIdle).toBe(false)
      expect(result.current.isStreaming).toBe(false)

      // Test streaming state
      mockUseEntity.mockReturnValue(createMockCameraEntity('test', 'streaming'))
      result = renderHook(() => useCamera('camera.test')).result
      expect(result.current.isStreaming).toBe(true)
      expect(result.current.isIdle).toBe(false)
      expect(result.current.isRecording).toBe(false)
    })

    it('should handle motion detection state correctly', () => {
      // Test motion detection enabled
      mockUseEntity.mockReturnValue(createMockCameraEntity('test', 'idle', { motion_detection: true }))
      let { result } = renderHook(() => useCamera('camera.test'))
      expect(result.current.motionDetectionEnabled).toBe(true)

      // Test motion detection disabled
      mockUseEntity.mockReturnValue(createMockCameraEntity('test', 'idle', { motion_detection: false }))
      result = renderHook(() => useCamera('camera.test')).result
      expect(result.current.motionDetectionEnabled).toBe(false)

      // Test missing motion_detection attribute (defaults to false)
      mockUseEntity.mockReturnValue(createMockCameraEntity('test', 'idle', {}))
      result = renderHook(() => useCamera('camera.test')).result
      expect(result.current.motionDetectionEnabled).toBe(false)
    })

    it('should extract camera metadata correctly', () => {
      const attributes = {
        brand: 'Hikvision',
        model: 'DS-2CD2T47G1-L',
        access_token: 'secret-token-456'
      }
      mockUseEntity.mockReturnValue(createMockCameraEntity('test', 'idle', attributes))

      const { result } = renderHook(() => useCamera('camera.test'))

      expect(result.current.brand).toBe('Hikvision')
      expect(result.current.model).toBe('DS-2CD2T47G1-L')
      expect(result.current.accessToken).toBe('secret-token-456')
    })
  })

  describe('Image URL Generation', () => {
    it('should generate correct image URL with access token', () => {
      const attributes = {
        access_token: 'test-token-123'
      }
      mockUseEntity.mockReturnValue(createMockCameraEntity('basement_door', 'idle', attributes))

      const { result } = renderHook(() => useCamera('camera.basement_door'))

      expect(result.current.imageUrl).toBe(
        'http://homeassistant.local:8123/api/camera_proxy/camera.basement_door?token=test-token-123&_cb=0'
      )
    })

    it('should handle different URL formats', () => {
      const testCases = [
        { configUrl: 'http://homeassistant.local:8123', expected: 'http://homeassistant.local:8123' },
        { configUrl: 'http://homeassistant.local:8123/', expected: 'http://homeassistant.local:8123' },
        { configUrl: 'https://my-hass.com', expected: 'https://my-hass.com' },
        { configUrl: 'ws://homeassistant.local:8123', expected: 'http://homeassistant.local:8123' },
        { configUrl: 'wss://my-hass.com', expected: 'https://my-hass.com' }
      ]

      testCases.forEach(({ configUrl, expected }) => {
        mockUseHAConnection.mockReturnValue({
          config: { url: configUrl }
        })
        mockUseEntity.mockReturnValue(createMockCameraEntity('test', 'idle', { access_token: 'token' }))

        const { result } = renderHook(() => useCamera('camera.test'))
        expect(result.current.imageUrl).toContain(expected)
      })
    })

    it('should return null when no access token', () => {
      const attributes = { access_token: undefined } // Explicitly no access token
      mockUseEntity.mockReturnValue(createMockCameraEntity('test', 'idle', attributes))

      const { result } = renderHook(() => useCamera('camera.test'))

      expect(result.current.imageUrl).toBeNull()
    })

    it('should return null when no config URL', () => {
      mockUseHAConnection.mockReturnValue({
        config: { url: null }
      })
      mockUseEntity.mockReturnValue(createMockCameraEntity('test', 'idle', { access_token: 'token' }))

      const { result } = renderHook(() => useCamera('camera.test'))

      expect(result.current.imageUrl).toBeNull()
    })

    it('should update cache-busting parameter on refresh', async () => {
      const mockRefresh = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockCameraEntity('test', 'idle', { access_token: 'token' }),
        refresh: mockRefresh
      })

      const { result } = renderHook(() => useCamera('camera.test'))

      const initialUrl = result.current.imageUrl
      expect(initialUrl).toContain('&_cb=0')

      await act(async () => {
        await result.current.refreshImage()
      })

      expect(result.current.imageUrl).toContain('&_cb=1')
      expect(result.current.imageUrl).not.toBe(initialUrl)
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  describe('Service Calls', () => {
    it('should call camera.turn_on service on turnOn()', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockCameraEntity('test', 'off', { supported_features: CameraFeatures.SUPPORT_ON_OFF }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useCamera('camera.test'))

      await act(async () => {
        await result.current.turnOn()
      })

      expect(mockCallService).toHaveBeenCalledWith('camera', 'turn_on')
    })

    it('should call camera.turn_off service on turnOff()', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockCameraEntity('test', 'idle', { supported_features: CameraFeatures.SUPPORT_ON_OFF }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useCamera('camera.test'))

      await act(async () => {
        await result.current.turnOff()
      })

      expect(mockCallService).toHaveBeenCalledWith('camera', 'turn_off')
    })

    it('should call camera.snapshot service on snapshot()', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockCameraEntity('test'),
        callService: mockCallService
      })

      const { result } = renderHook(() => useCamera('camera.test'))

      await act(async () => {
        await result.current.snapshot()
      })

      expect(mockCallService).toHaveBeenCalledWith('camera', 'snapshot')
    })

    it('should call motion detection services correctly', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockCameraEntity('test'),
        callService: mockCallService
      })

      const { result } = renderHook(() => useCamera('camera.test'))

      await act(async () => {
        await result.current.enableMotionDetection()
      })
      expect(mockCallService).toHaveBeenCalledWith('camera', 'enable_motion_detection')

      await act(async () => {
        await result.current.disableMotionDetection()
      })
      expect(mockCallService).toHaveBeenCalledWith('camera', 'disable_motion_detection')
    })

    it('should call camera.play_stream service with media player', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockCameraEntity('test', 'idle', { supported_features: CameraFeatures.SUPPORT_STREAM }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useCamera('camera.test'))

      await act(async () => {
        await result.current.playStream('media_player.living_room_tv')
      })

      expect(mockCallService).toHaveBeenCalledWith('camera', 'play_stream', { 
        media_player: 'media_player.living_room_tv' 
      })
    })

    it('should call camera.play_stream service without parameters', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockCameraEntity('test', 'idle', { supported_features: CameraFeatures.SUPPORT_STREAM }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useCamera('camera.test'))

      await act(async () => {
        await result.current.playStream()
      })

      expect(mockCallService).toHaveBeenCalledWith('camera', 'play_stream', undefined)
    })

    it('should call camera.record service with parameters', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockCameraEntity('test'),
        callService: mockCallService
      })

      const { result } = renderHook(() => useCamera('camera.test'))

      await act(async () => {
        await result.current.record('recording.mp4', 30)
      })

      expect(mockCallService).toHaveBeenCalledWith('camera', 'record', { 
        filename: 'recording.mp4',
        duration: 30
      })
    })

    it('should call camera.record service without parameters', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockCameraEntity('test'),
        callService: mockCallService
      })

      const { result } = renderHook(() => useCamera('camera.test'))

      await act(async () => {
        await result.current.record()
      })

      expect(mockCallService).toHaveBeenCalledWith('camera', 'record', undefined)
    })
  })

  describe('Error Handling', () => {
    it('should throw error when trying to turn on unsupported camera', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockCameraEntity('test', 'off', { supported_features: 0 }), // No features supported
        callService: mockCallService
      })

      const { result } = renderHook(() => useCamera('camera.test'))

      await expect(
        act(async () => {
          await result.current.turnOn()
        })
      ).rejects.toThrow(FeatureNotSupportedError)

      expect(mockCallService).not.toHaveBeenCalled()
    })

    it('should throw error when trying to turn off unsupported camera', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockCameraEntity('test', 'idle', { supported_features: 0 }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useCamera('camera.test'))

      await expect(
        act(async () => {
          await result.current.turnOff()
        })
      ).rejects.toThrow(FeatureNotSupportedError)

      expect(mockCallService).not.toHaveBeenCalled()
    })

    it('should throw error when trying to play stream on unsupported camera', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockCameraEntity('test', 'idle', { supported_features: 0 }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useCamera('camera.test'))

      await expect(
        act(async () => {
          await result.current.playStream()
        })
      ).rejects.toThrow(FeatureNotSupportedError)

      expect(mockCallService).not.toHaveBeenCalled()
    })

    it('should handle service call failures', async () => {
      const mockCallService = vi.fn().mockRejectedValue(new Error('Service call failed'))
      mockUseEntity.mockReturnValue({
        ...createMockCameraEntity('test', 'idle', { 
          supported_features: CameraFeatures.SUPPORT_ON_OFF | CameraFeatures.SUPPORT_STREAM
        }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useCamera('camera.test'))

      await expect(result.current.turnOn()).rejects.toThrow('Service call failed')
      await expect(result.current.snapshot()).rejects.toThrow('Service call failed')
      await expect(result.current.enableMotionDetection()).rejects.toThrow('Service call failed')
    })

    it('should handle play stream failures gracefully', async () => {
      const mockCallService = vi.fn().mockRejectedValue(new Error('play_stream not supported'))
      mockUseEntity.mockReturnValue({
        ...createMockCameraEntity('test', 'idle', { supported_features: CameraFeatures.SUPPORT_STREAM }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useCamera('camera.test'))

      await expect(result.current.playStream()).rejects.toThrow('Camera streaming not supported or media player required')
    })
  })

  describe('Domain Validation', () => {
    let consoleMock: any

    beforeEach(() => {
      consoleMock = vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleMock.mockRestore()
    })

    it('should warn when using wrong domain', () => {
      mockUseEntity.mockReturnValue(createMockCameraEntity('test'))

      renderHook(() => useCamera('light.bedroom_light'))

      expect(consoleMock).toHaveBeenCalledWith(
        'useCamera: Entity "light.bedroom_light" has domain "light" but expects "camera" domain. This may not work as expected. Use useEntity() or the appropriate domain-specific hook instead.'
      )
    })
  })

  describe('Integration and State Management', () => {
    it('should inherit all base entity properties', () => {
      const mockEntity = createMockCameraEntity('test', 'idle', { brand: 'TestBrand' })
      mockUseEntity.mockReturnValue(mockEntity)

      const { result } = renderHook(() => useCamera('camera.test'))

      // Should inherit all base properties
      expect(result.current.entityId).toBe(mockEntity.entityId)
      expect(result.current.state).toBe(mockEntity.state)
      expect(result.current.lastChanged).toBe(mockEntity.lastChanged)
      expect(result.current.lastUpdated).toBe(mockEntity.lastUpdated)
      expect(result.current.isUnavailable).toBe(mockEntity.isUnavailable)
      expect(result.current.isConnected).toBe(mockEntity.isConnected)
      expect(result.current.callService).toBe(mockEntity.callService)
      expect(result.current.refresh).toBe(mockEntity.refresh)
      
      // Plus camera-specific properties
      expect(result.current.isOn).toBeDefined()
      expect(result.current.isRecording).toBeDefined()
      expect(result.current.isStreaming).toBeDefined()
      expect(result.current.isIdle).toBeDefined()
      expect(result.current.motionDetectionEnabled).toBeDefined()
      expect(result.current.supportsOnOff).toBeDefined()
      expect(result.current.supportsStream).toBeDefined()
      expect(result.current.turnOn).toBeDefined()
      expect(result.current.snapshot).toBeDefined()
      expect(result.current.refreshImage).toBeDefined()
    })

    it('should update when useEntity data changes', () => {
      // Start with camera idle
      mockUseEntity.mockReturnValue(createMockCameraEntity('test', 'idle', { motion_detection: false }))

      const { result, rerender } = renderHook(() => useCamera('camera.test'))

      expect(result.current.isIdle).toBe(true)
      expect(result.current.motionDetectionEnabled).toBe(false)

      // Update to recording with motion detection
      mockUseEntity.mockReturnValue(createMockCameraEntity('test', 'recording', { motion_detection: true }))
      rerender()

      expect(result.current.isRecording).toBe(true)
      expect(result.current.isIdle).toBe(false)
      expect(result.current.motionDetectionEnabled).toBe(true)
    })

    it('should maintain callback references for performance', () => {
      const mockEntityWithFeatures = createMockCameraEntity('test', 'idle', {
        supported_features: CameraFeatures.SUPPORT_ON_OFF | CameraFeatures.SUPPORT_STREAM
      })
      mockUseEntity.mockReturnValue(mockEntityWithFeatures)

      const { result, rerender } = renderHook(() => useCamera('camera.test'))

      const firstCallbacks = {
        turnOn: result.current.turnOn,
        turnOff: result.current.turnOff,
        snapshot: result.current.snapshot,
        enableMotionDetection: result.current.enableMotionDetection,
        playStream: result.current.playStream,
        record: result.current.record,
        refreshImage: result.current.refreshImage
      }

      // Re-render with the same mock entity to ensure callbacks remain stable
      mockUseEntity.mockReturnValue(mockEntityWithFeatures)
      rerender()

      // Callbacks should be the same reference (useCallback working)
      expect(result.current.turnOn).toBe(firstCallbacks.turnOn)
      expect(result.current.turnOff).toBe(firstCallbacks.turnOff)
      expect(result.current.snapshot).toBe(firstCallbacks.snapshot)
      expect(result.current.enableMotionDetection).toBe(firstCallbacks.enableMotionDetection)
      expect(result.current.playStream).toBe(firstCallbacks.playStream)
      expect(result.current.record).toBe(firstCallbacks.record)
      expect(result.current.refreshImage).toBe(firstCallbacks.refreshImage)
    })
  })
})