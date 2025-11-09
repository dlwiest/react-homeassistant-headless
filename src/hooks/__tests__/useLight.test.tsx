import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLight } from '../useLight'
import { useEntity } from '../useEntity'
import { LightFeatures } from '../../types'

// Mock useEntity since useLight depends on it
vi.mock('../useEntity')

// Mock light entity response
const createMockLightEntity = (
  state: string = 'on',
  attributes: Record<string, any> = {}
) => ({
  entityId: 'light.test',
  state,
  attributes,
  lastChanged: new Date(),
  lastUpdated: new Date(),
  isUnavailable: state === 'unavailable',
  isConnected: true,
  callService: vi.fn(),
  refresh: vi.fn()
})

describe('useLight', () => {
  const mockUseEntity = useEntity as any
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock for useEntity
    mockUseEntity.mockReturnValue(createMockLightEntity())
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Feature Detection', () => {
    it('should detect brightness support correctly', () => {
      const attributes = {
        supported_features: LightFeatures.SUPPORT_BRIGHTNESS
      }
      mockUseEntity.mockReturnValue(createMockLightEntity('on', attributes))

      const { result } = renderHook(() => useLight('light.test'))

      expect(result.current.supportsBrightness).toBe(true)
      expect(result.current.supportsColorTemp).toBe(false)
      expect(result.current.supportsRgb).toBe(false)
      expect(result.current.supportsEffects).toBe(false)
    })

    it('should detect color temperature support correctly', () => {
      const attributes = {
        supported_features: LightFeatures.SUPPORT_COLOR_TEMP
      }
      mockUseEntity.mockReturnValue(createMockLightEntity('on', attributes))

      const { result } = renderHook(() => useLight('light.test'))

      expect(result.current.supportsColorTemp).toBe(true)
      expect(result.current.supportsBrightness).toBe(false)
      expect(result.current.supportsRgb).toBe(false)
      expect(result.current.supportsEffects).toBe(false)
    })

    it('should detect RGB color support correctly', () => {
      const attributes = {
        supported_features: LightFeatures.SUPPORT_COLOR
      }
      mockUseEntity.mockReturnValue(createMockLightEntity('on', attributes))

      const { result } = renderHook(() => useLight('light.test'))

      expect(result.current.supportsRgb).toBe(true)
      expect(result.current.supportsBrightness).toBe(false)
      expect(result.current.supportsColorTemp).toBe(false)
      expect(result.current.supportsEffects).toBe(false)
    })

    it('should detect effects support correctly', () => {
      const attributes = {
        supported_features: LightFeatures.SUPPORT_EFFECT
      }
      mockUseEntity.mockReturnValue(createMockLightEntity('on', attributes))

      const { result } = renderHook(() => useLight('light.test'))

      expect(result.current.supportsEffects).toBe(true)
      expect(result.current.supportsBrightness).toBe(false)
      expect(result.current.supportsColorTemp).toBe(false)
      expect(result.current.supportsRgb).toBe(false)
    })

    it('should detect multiple features correctly', () => {
      const attributes = {
        supported_features: LightFeatures.SUPPORT_BRIGHTNESS | LightFeatures.SUPPORT_COLOR | LightFeatures.SUPPORT_EFFECT
      }
      mockUseEntity.mockReturnValue(createMockLightEntity('on', attributes))

      const { result } = renderHook(() => useLight('light.test'))

      expect(result.current.supportsBrightness).toBe(true)
      expect(result.current.supportsRgb).toBe(true)
      expect(result.current.supportsEffects).toBe(true)
      expect(result.current.supportsColorTemp).toBe(false)
    })

    it('should handle missing supported_features attribute', () => {
      const attributes = {} // No supported_features
      mockUseEntity.mockReturnValue(createMockLightEntity('on', attributes))

      const { result } = renderHook(() => useLight('light.test'))

      expect(result.current.supportsBrightness).toBe(false)
      expect(result.current.supportsColorTemp).toBe(false)
      expect(result.current.supportsRgb).toBe(false)
      expect(result.current.supportsEffects).toBe(false)
    })

    it('should return available effects list', () => {
      const attributes = {
        effect_list: ['rainbow', 'colorloop', 'fire'],
        supported_features: LightFeatures.SUPPORT_EFFECT
      }
      mockUseEntity.mockReturnValue(createMockLightEntity('on', attributes))

      const { result } = renderHook(() => useLight('light.test'))

      expect(result.current.availableEffects).toEqual(['rainbow', 'colorloop', 'fire'])
      expect(result.current.supportsEffects).toBe(true)
    })

    it('should return empty array when no effect list available', () => {
      const attributes = {}
      mockUseEntity.mockReturnValue(createMockLightEntity('on', attributes))

      const { result } = renderHook(() => useLight('light.test'))

      expect(result.current.availableEffects).toEqual([])
    })
  })

  describe('Brightness Calculations', () => {
    it('should return correct brightness value', () => {
      const attributes = {
        brightness: 128,
        supported_features: LightFeatures.SUPPORT_BRIGHTNESS
      }
      mockUseEntity.mockReturnValue(createMockLightEntity('on', attributes))

      const { result } = renderHook(() => useLight('light.test'))

      expect(result.current.brightness).toBe(128)
      expect(result.current.brightnessPercent).toBe(50) // 128/255 * 100 = ~50%
    })

    it('should return 0 brightness when attribute is missing', () => {
      const attributes = {}
      mockUseEntity.mockReturnValue(createMockLightEntity('on', attributes))

      const { result } = renderHook(() => useLight('light.test'))

      expect(result.current.brightness).toBe(0)
      expect(result.current.brightnessPercent).toBe(0)
    })

    it('should calculate brightness percentage correctly for edge cases', () => {
      // Test maximum brightness
      let attributes = { brightness: 255 }
      mockUseEntity.mockReturnValue(createMockLightEntity('on', attributes))
      
      let { result } = renderHook(() => useLight('light.test'))
      expect(result.current.brightnessPercent).toBe(100)

      // Test minimum brightness
      attributes = { brightness: 1 }
      mockUseEntity.mockReturnValue(createMockLightEntity('on', attributes))
      
      result = renderHook(() => useLight('light.test')).result
      expect(result.current.brightnessPercent).toBe(0) // Math.round(1/255 * 100) = 0
    })

    it('should handle fractional brightness values', () => {
      const attributes = { brightness: 63.75 } // Should be 25%
      mockUseEntity.mockReturnValue(createMockLightEntity('on', attributes))

      const { result } = renderHook(() => useLight('light.test'))

      expect(result.current.brightness).toBe(63.75)
      expect(result.current.brightnessPercent).toBe(25) // Math.round(63.75/255 * 100)
    })
  })

  describe('Color Controls', () => {
    it('should return color temperature value', () => {
      const attributes = {
        color_temp: 300,
        supported_features: LightFeatures.SUPPORT_COLOR_TEMP
      }
      mockUseEntity.mockReturnValue(createMockLightEntity('on', attributes))

      const { result } = renderHook(() => useLight('light.test'))

      expect(result.current.colorTemp).toBe(300)
    })

    it('should return RGB color value', () => {
      const attributes = {
        rgb_color: [255, 128, 0] as [number, number, number],
        supported_features: LightFeatures.SUPPORT_COLOR
      }
      mockUseEntity.mockReturnValue(createMockLightEntity('on', attributes))

      const { result } = renderHook(() => useLight('light.test'))

      expect(result.current.rgbColor).toEqual([255, 128, 0])
    })

    it('should return effect value', () => {
      const attributes = {
        effect: 'rainbow',
        effect_list: ['rainbow', 'colorloop'],
        supported_features: LightFeatures.SUPPORT_EFFECT
      }
      mockUseEntity.mockReturnValue(createMockLightEntity('on', attributes))

      const { result } = renderHook(() => useLight('light.test'))

      expect(result.current.effect).toBe('rainbow')
    })

    it('should handle undefined color attributes', () => {
      const attributes = {}
      mockUseEntity.mockReturnValue(createMockLightEntity('on', attributes))

      const { result } = renderHook(() => useLight('light.test'))

      expect(result.current.colorTemp).toBeUndefined()
      expect(result.current.rgbColor).toBeUndefined()
      expect(result.current.effect).toBeUndefined()
    })
  })

  describe('Warning Behavior', () => {
    let consoleMock: any

    beforeEach(() => {
      consoleMock = vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleMock.mockRestore()
    })

    it('should warn when trying to set brightness on unsupported light', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLightEntity('on', { supported_features: 0 }), // No features supported
        callService: mockCallService
      })

      const { result } = renderHook(() => useLight('light.test'))

      await act(async () => {
        await result.current.setBrightness(100)
      })

      expect(consoleMock).toHaveBeenCalledWith(
        'Light "light.test" does not support brightness control. Check the light\'s supported_features.'
      )
      expect(mockCallService).not.toHaveBeenCalled()
    })

    it('should warn when trying to set color temperature on unsupported light', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLightEntity('on', { supported_features: 0 }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useLight('light.test'))

      await act(async () => {
        await result.current.setColorTemp(300)
      })

      expect(consoleMock).toHaveBeenCalledWith(
        'Light "light.test" does not support color temperature control. Check the light\'s supported_features.'
      )
      expect(mockCallService).not.toHaveBeenCalled()
    })

    it('should warn when trying to set RGB color on unsupported light', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLightEntity('on', { supported_features: 0 }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useLight('light.test'))

      await act(async () => {
        await result.current.setRgbColor([255, 128, 0])
      })

      expect(consoleMock).toHaveBeenCalledWith(
        'Light "light.test" does not support RGB color control. Check the light\'s supported_features.'
      )
      expect(mockCallService).not.toHaveBeenCalled()
    })

    it('should warn when trying to set effects on unsupported light', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLightEntity('on', { supported_features: 0 }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useLight('light.test'))

      await act(async () => {
        await result.current.setEffect('rainbow')
      })

      expect(consoleMock).toHaveBeenCalledWith(
        'Light "light.test" does not support effects. Check the light\'s supported_features.'
      )
      expect(mockCallService).not.toHaveBeenCalled()
    })

    it('should warn when trying to use unavailable effect', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLightEntity('on', {
          supported_features: LightFeatures.SUPPORT_EFFECT,
          effect_list: ['colorloop', 'pulse']
        }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useLight('light.test'))

      await act(async () => {
        await result.current.setEffect('rainbow')
      })

      expect(consoleMock).toHaveBeenCalledWith(
        'Effect "rainbow" is not available for light "light.test". Available effects: colorloop, pulse'
      )
      // Should still call service even with warning
      expect(mockCallService).toHaveBeenCalledWith('light', 'turn_on', { effect: 'rainbow' })
    })

    it('should warn when using wrong domain', () => {
      mockUseEntity.mockReturnValue(createMockLightEntity('on'))

      renderHook(() => useLight('fan.bedroom_fan'))

      expect(consoleMock).toHaveBeenCalledWith(
        'useLight: Entity "fan.bedroom_fan" has domain "fan" but useLight expects "light" domain. This may not work as expected. Use useEntity() or the appropriate domain-specific hook instead.'
      )
    })
  })

  describe('Service Calls', () => {
    it('should call light.toggle service on toggle()', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLightEntity(),
        callService: mockCallService
      })

      const { result } = renderHook(() => useLight('light.test'))

      await act(async () => {
        await result.current.toggle()
      })

      expect(mockCallService).toHaveBeenCalledWith('light', 'toggle')
    })

    it('should call light.turn_on service on turnOn() without parameters', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLightEntity('off'),
        callService: mockCallService
      })

      const { result } = renderHook(() => useLight('light.test'))

      await act(async () => {
        await result.current.turnOn()
      })

      expect(mockCallService).toHaveBeenCalledWith('light', 'turn_on', undefined)
    })

    it('should call light.turn_on service with brightness parameter', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLightEntity('off'),
        callService: mockCallService
      })

      const { result } = renderHook(() => useLight('light.test'))

      await act(async () => {
        await result.current.turnOn({ brightness: 128 })
      })

      expect(mockCallService).toHaveBeenCalledWith('light', 'turn_on', { brightness: 128 })
    })

    it('should call light.turn_on service with multiple parameters', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLightEntity('off'),
        callService: mockCallService
      })

      const { result } = renderHook(() => useLight('light.test'))

      await act(async () => {
        await result.current.turnOn({
          brightness: 200,
          rgb_color: [255, 128, 0] as [number, number, number],
          effect: 'rainbow'
        })
      })

      expect(mockCallService).toHaveBeenCalledWith('light', 'turn_on', {
        brightness: 200,
        rgb_color: [255, 128, 0],
        effect: 'rainbow'
      })
    })

    it('should call light.turn_off service on turnOff()', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLightEntity('on'),
        callService: mockCallService
      })

      const { result } = renderHook(() => useLight('light.test'))

      await act(async () => {
        await result.current.turnOff()
      })

      expect(mockCallService).toHaveBeenCalledWith('light', 'turn_off')
    })

    it('should call setBrightness with clamped values', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLightEntity('on', { supported_features: 1 }), // SUPPORT_BRIGHTNESS
        callService: mockCallService
      })

      const { result } = renderHook(() => useLight('light.test'))

      // Test normal value
      await act(async () => {
        await result.current.setBrightness(128)
      })
      expect(mockCallService).toHaveBeenCalledWith('light', 'turn_on', { brightness: 128 })

      // Test value above maximum (should clamp to 255)
      await act(async () => {
        await result.current.setBrightness(300)
      })
      expect(mockCallService).toHaveBeenCalledWith('light', 'turn_on', { brightness: 255 })

      // Test negative value (should clamp to 0)
      await act(async () => {
        await result.current.setBrightness(-10)
      })
      expect(mockCallService).toHaveBeenCalledWith('light', 'turn_on', { brightness: 0 })
    })

    it('should call setColorTemp correctly', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLightEntity('on', { supported_features: 2 }), // SUPPORT_COLOR_TEMP
        callService: mockCallService
      })

      const { result } = renderHook(() => useLight('light.test'))

      await act(async () => {
        await result.current.setColorTemp(350)
      })

      expect(mockCallService).toHaveBeenCalledWith('light', 'turn_on', { color_temp: 350 })
    })

    it('should call setRgbColor correctly', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLightEntity('on', { supported_features: 16 }), // SUPPORT_COLOR
        callService: mockCallService
      })

      const { result } = renderHook(() => useLight('light.test'))

      await act(async () => {
        await result.current.setRgbColor([255, 128, 64])
      })

      expect(mockCallService).toHaveBeenCalledWith('light', 'turn_on', { rgb_color: [255, 128, 64] })
    })

    it('should call setEffect correctly', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLightEntity('on', { 
          supported_features: 4, // SUPPORT_EFFECT
          effect_list: ['colorloop', 'rainbow', 'pulse']
        }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useLight('light.test'))

      await act(async () => {
        await result.current.setEffect('rainbow')
      })

      expect(mockCallService).toHaveBeenCalledWith('light', 'turn_on', { effect: 'rainbow' })
    })

    it('should handle service call errors', async () => {
      const mockCallService = vi.fn().mockRejectedValue(new Error('Service call failed'))
      mockUseEntity.mockReturnValue({
        ...createMockLightEntity('on', {
          supported_features: LightFeatures.SUPPORT_BRIGHTNESS | LightFeatures.SUPPORT_COLOR_TEMP
        }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useLight('light.test'))

      await expect(result.current.toggle()).rejects.toThrow('Service call failed')
      await expect(result.current.setBrightness(100)).rejects.toThrow('Service call failed')
      await expect(result.current.setColorTemp(300)).rejects.toThrow('Service call failed')
    })
  })

  describe('Integration and State Management', () => {
    it('should return isOn correctly based on state', () => {
      // Test on state
      mockUseEntity.mockReturnValue(createMockLightEntity('on'))
      let { result } = renderHook(() => useLight('light.test'))
      expect(result.current.isOn).toBe(true)

      // Test off state
      mockUseEntity.mockReturnValue(createMockLightEntity('off'))
      result = renderHook(() => useLight('light.test')).result
      expect(result.current.isOn).toBe(false)

      // Test unavailable state
      mockUseEntity.mockReturnValue(createMockLightEntity('unavailable'))
      result = renderHook(() => useLight('light.test')).result
      expect(result.current.isOn).toBe(false)
    })

    it('should inherit all base entity properties', () => {
      const mockEntity = createMockLightEntity('on', { test: 'value' })
      mockUseEntity.mockReturnValue(mockEntity)

      const { result } = renderHook(() => useLight('light.test'))

      // Should inherit all base properties
      expect(result.current.entityId).toBe(mockEntity.entityId)
      expect(result.current.state).toBe(mockEntity.state)
      expect(result.current.lastChanged).toBe(mockEntity.lastChanged)
      expect(result.current.lastUpdated).toBe(mockEntity.lastUpdated)
      expect(result.current.isUnavailable).toBe(mockEntity.isUnavailable)
      expect(result.current.isConnected).toBe(mockEntity.isConnected)
      expect(result.current.callService).toBe(mockEntity.callService)
      expect(result.current.refresh).toBe(mockEntity.refresh)
      
      // Plus light-specific properties
      expect(result.current.isOn).toBeDefined()
      expect(result.current.brightness).toBeDefined()
      expect(result.current.brightnessPercent).toBeDefined()
      expect(result.current.supportsBrightness).toBeDefined()
      expect(result.current.toggle).toBeDefined()
      expect(result.current.turnOn).toBeDefined()
      expect(result.current.turnOff).toBeDefined()
      expect(result.current.setBrightness).toBeDefined()
    })

    it('should update when useEntity data changes', () => {
      // Start with light off, no brightness
      mockUseEntity.mockReturnValue(createMockLightEntity('off', {}))

      const { result, rerender } = renderHook(() => useLight('light.test'))

      expect(result.current.isOn).toBe(false)
      expect(result.current.brightness).toBe(0)

      // Update to light on with brightness
      mockUseEntity.mockReturnValue(createMockLightEntity('on', { brightness: 200 }))
      rerender()

      expect(result.current.isOn).toBe(true)
      expect(result.current.brightness).toBe(200)
      expect(result.current.brightnessPercent).toBe(78) // 200/255 * 100 = ~78%
    })

    it('should maintain callback references for performance', () => {
      const mockEntityWithEffects = createMockLightEntity('on', {
        supported_features: LightFeatures.SUPPORT_EFFECT,
        effect_list: ['rainbow', 'colorloop']
      })
      mockUseEntity.mockReturnValue(mockEntityWithEffects)

      const { result, rerender } = renderHook(() => useLight('light.test'))

      const firstCallbacks = {
        toggle: result.current.toggle,
        turnOn: result.current.turnOn,
        turnOff: result.current.turnOff,
        setBrightness: result.current.setBrightness,
        setColorTemp: result.current.setColorTemp,
        setRgbColor: result.current.setRgbColor,
        setEffect: result.current.setEffect
      }

      // Re-render with the same mock entity to ensure callbacks remain stable
      mockUseEntity.mockReturnValue(mockEntityWithEffects)
      rerender()

      // Callbacks should be the same reference (useCallback working)
      expect(result.current.toggle).toBe(firstCallbacks.toggle)
      expect(result.current.turnOn).toBe(firstCallbacks.turnOn)
      expect(result.current.turnOff).toBe(firstCallbacks.turnOff)
      expect(result.current.setBrightness).toBe(firstCallbacks.setBrightness)
      expect(result.current.setColorTemp).toBe(firstCallbacks.setColorTemp)
      expect(result.current.setRgbColor).toBe(firstCallbacks.setRgbColor)
      expect(result.current.setEffect).toBe(firstCallbacks.setEffect)
    })
  })
})