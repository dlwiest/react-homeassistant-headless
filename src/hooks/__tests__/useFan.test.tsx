import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFan } from '../useFan'
import { useEntity } from '../useEntity'
import { FanFeatures } from '../../types'

// Mock useEntity since useFan depends on it
vi.mock('../useEntity')

// Mock fan entity response
const createMockFanEntity = (
  state: string = 'on',
  attributes: Record<string, any> = {}
) => ({
  entityId: 'fan.test',
  state,
  attributes,
  lastChanged: new Date(),
  lastUpdated: new Date(),
  isUnavailable: state === 'unavailable',
  isConnected: true,
  callService: vi.fn(),
  refresh: vi.fn()
})

describe('useFan', () => {
  const mockUseEntity = useEntity as any
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should handle basic fan state correctly', () => {
    const mockEntity = createMockFanEntity('on', {
      friendly_name: 'Test Fan',
      percentage: 75,
      supported_features: FanFeatures.SUPPORT_SET_SPEED,
    })
    
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useFan('test'))
    
    expect(result.current.isOn).toBe(true)
    expect(result.current.percentage).toBe(75)
    expect(result.current.supportsSetSpeed).toBe(true)
    expect(result.current.supportsOscillate).toBe(false)
  })

  it('should handle fan off state', () => {
    const mockEntity = createMockFanEntity('off', {
      friendly_name: 'Test Fan',
      percentage: 0,
    })
    
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useFan('test'))
    
    expect(result.current.isOn).toBe(false)
    expect(result.current.percentage).toBe(0)
  })

  it('should handle all supported features', () => {
    const mockEntity = createMockFanEntity('on', {
      friendly_name: 'Advanced Fan',
      percentage: 50,
      preset_modes: ['low', 'medium', 'high'],
      preset_mode: 'medium',
      oscillating: true,
      direction: 'forward',
      supported_features: 
        FanFeatures.SUPPORT_SET_SPEED | 
        FanFeatures.SUPPORT_OSCILLATE | 
        FanFeatures.SUPPORT_DIRECTION | 
        FanFeatures.SUPPORT_PRESET_MODE
    })
    
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useFan('test'))
    
    expect(result.current.supportsSetSpeed).toBe(true)
    expect(result.current.supportsOscillate).toBe(true)
    expect(result.current.supportsDirection).toBe(true)
    expect(result.current.supportsPresetMode).toBe(true)
    expect(result.current.availablePresetModes).toEqual(['low', 'medium', 'high'])
    expect(result.current.presetMode).toBe('medium')
    expect(result.current.isOscillating).toBe(true)
    expect(result.current.direction).toBe('forward')
  })

  it('should call toggle service', async () => {
    const mockEntity = createMockFanEntity()
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useFan('test'))
    
    await act(async () => {
      await result.current.toggle()
    })
    
    expect(mockEntity.callService).toHaveBeenCalledWith('fan', 'toggle')
  })

  it('should call turn on service with parameters', async () => {
    const mockEntity = createMockFanEntity()
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useFan('test'))
    
    await act(async () => {
      await result.current.turnOn({ percentage: 80, preset_mode: 'high' })
    })
    
    expect(mockEntity.callService).toHaveBeenCalledWith('fan', 'turn_on', {
      percentage: 80,
      preset_mode: 'high'
    })
  })

  it('should call turn off service', async () => {
    const mockEntity = createMockFanEntity()
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useFan('test'))
    
    await act(async () => {
      await result.current.turnOff()
    })
    
    expect(mockEntity.callService).toHaveBeenCalledWith('fan', 'turn_off')
  })

  it('should set percentage with clamping', async () => {
    const mockEntity = createMockFanEntity('on', { supported_features: FanFeatures.SUPPORT_SET_SPEED })
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useFan('test'))
    
    // Test normal range
    await act(async () => {
      await result.current.setPercentage(75)
    })
    expect(mockEntity.callService).toHaveBeenCalledWith('fan', 'set_percentage', { percentage: 75 })

    // Test clamping - too high
    await act(async () => {
      await result.current.setPercentage(150)
    })
    expect(mockEntity.callService).toHaveBeenCalledWith('fan', 'set_percentage', { percentage: 100 })

    // Test clamping - too low
    await act(async () => {
      await result.current.setPercentage(-10)
    })
    expect(mockEntity.callService).toHaveBeenCalledWith('fan', 'set_percentage', { percentage: 0 })
  })

  it('should set preset mode', async () => {
    const mockEntity = createMockFanEntity('on', { supported_features: FanFeatures.SUPPORT_PRESET_MODE })
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useFan('test'))
    
    await act(async () => {
      await result.current.setPresetMode('high')
    })
    
    expect(mockEntity.callService).toHaveBeenCalledWith('fan', 'set_preset_mode', {
      preset_mode: 'high'
    })
  })

  it('should set oscillating', async () => {
    const mockEntity = createMockFanEntity('on', { supported_features: FanFeatures.SUPPORT_OSCILLATE })
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useFan('test'))
    
    await act(async () => {
      await result.current.setOscillating(true)
    })
    
    expect(mockEntity.callService).toHaveBeenCalledWith('fan', 'oscillate', {
      oscillating: true
    })
  })

  it('should set direction', async () => {
    const mockEntity = createMockFanEntity('on', { supported_features: FanFeatures.SUPPORT_DIRECTION })
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useFan('test'))
    
    await act(async () => {
      await result.current.setDirection('reverse')
    })
    
    expect(mockEntity.callService).toHaveBeenCalledWith('fan', 'set_direction', {
      direction: 'reverse'
    })
  })

  it('should normalize entity ID', () => {
    const mockEntity = createMockFanEntity()
    mockUseEntity.mockReturnValue(mockEntity)
    
    renderHook(() => useFan('test_fan'))
    
    expect(useEntity).toHaveBeenCalledWith('fan.test_fan')
  })

  it('should not normalize full entity ID', () => {
    const mockEntity = createMockFanEntity()
    mockUseEntity.mockReturnValue(mockEntity)
    
    renderHook(() => useFan('fan.test_fan'))
    
    expect(useEntity).toHaveBeenCalledWith('fan.test_fan')
  })

  describe('Warning Behavior', () => {
    let consoleMock: any

    beforeEach(() => {
      consoleMock = vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleMock.mockRestore()
    })

    it('should warn when trying to set percentage on unsupported fan', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockFanEntity('on', { supported_features: 0 }), // No features supported
        callService: mockCallService
      })

      const { result } = renderHook(() => useFan('fan.test'))

      await act(async () => {
        await result.current.setPercentage(50)
      })

      expect(consoleMock).toHaveBeenCalledWith(
        'Fan "fan.test" does not support speed control. Check the fan\'s supported_features.'
      )
      expect(mockCallService).not.toHaveBeenCalled()
    })

    it('should warn when trying to set preset mode on unsupported fan', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockFanEntity('on', { supported_features: 0 }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useFan('fan.test'))

      await act(async () => {
        await result.current.setPresetMode('high')
      })

      expect(consoleMock).toHaveBeenCalledWith(
        'Fan "fan.test" does not support preset modes. Check the fan\'s supported_features.'
      )
      expect(mockCallService).not.toHaveBeenCalled()
    })

    it('should warn when trying to set oscillating on unsupported fan', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockFanEntity('on', { supported_features: 0 }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useFan('fan.test'))

      await act(async () => {
        await result.current.setOscillating(true)
      })

      expect(consoleMock).toHaveBeenCalledWith(
        'Fan "fan.test" does not support oscillation control. Check the fan\'s supported_features.'
      )
      expect(mockCallService).not.toHaveBeenCalled()
    })

    it('should warn when trying to set direction on unsupported fan', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockFanEntity('on', { supported_features: 0 }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useFan('fan.test'))

      await act(async () => {
        await result.current.setDirection('reverse')
      })

      expect(consoleMock).toHaveBeenCalledWith(
        'Fan "fan.test" does not support direction control. Check the fan\'s supported_features.'
      )
      expect(mockCallService).not.toHaveBeenCalled()
    })

    it('should warn when trying to use unavailable preset mode', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockFanEntity('on', {
          supported_features: FanFeatures.SUPPORT_PRESET_MODE,
          preset_modes: ['low', 'medium']
        }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useFan('fan.test'))

      await act(async () => {
        await result.current.setPresetMode('turbo')
      })

      expect(consoleMock).toHaveBeenCalledWith(
        'Preset "turbo" is not available for fan "fan.test". Available presets: low, medium'
      )
      // Should still call service even with warning
      expect(mockCallService).toHaveBeenCalledWith('fan', 'set_preset_mode', { preset_mode: 'turbo' })
    })

    it('should warn when using wrong domain', () => {
      mockUseEntity.mockReturnValue(createMockFanEntity('on'))

      renderHook(() => useFan('light.ceiling_light'))

      expect(consoleMock).toHaveBeenCalledWith(
        'useFan: Entity "light.ceiling_light" has domain "light" but useFan expects "fan" domain. This may not work as expected. Use useEntity() or the appropriate domain-specific hook instead.'
      )
    })
  })
})