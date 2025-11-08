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
    const mockEntity = createMockFanEntity()
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
    const mockEntity = createMockFanEntity()
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
    const mockEntity = createMockFanEntity()
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
    const mockEntity = createMockFanEntity()
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
})