import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSwitch } from '../useSwitch'
import { useEntity } from '../useEntity'

// Mock useEntity since useSwitch depends on it
vi.mock('../useEntity')

// Mock entity response
const createMockEntityResponse = (state: string = 'on', attributes: Record<string, any> = {}) => ({
  entityId: 'switch.test',
  state,
  attributes,
  lastChanged: new Date(),
  lastUpdated: new Date(),
  isUnavailable: state === 'unavailable',
  isConnected: true,
  callService: vi.fn(),
  refresh: vi.fn()
})

describe('useSwitch', () => {
  const mockUseEntity = useEntity as any
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock for useEntity
    mockUseEntity.mockReturnValue(createMockEntityResponse())
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('State Calculation', () => {
    it('should return isOn=true when switch state is "on"', () => {
      mockUseEntity.mockReturnValue(createMockEntityResponse('on'))

      const { result } = renderHook(() => useSwitch('switch.test'))

      expect(result.current.isOn).toBe(true)
      expect(result.current.state).toBe('on')
    })

    it('should return isOn=false when switch state is "off"', () => {
      mockUseEntity.mockReturnValue(createMockEntityResponse('off'))

      const { result } = renderHook(() => useSwitch('switch.test'))

      expect(result.current.isOn).toBe(false)
      expect(result.current.state).toBe('off')
    })

    it('should return isOn=false when switch state is "unavailable"', () => {
      mockUseEntity.mockReturnValue(createMockEntityResponse('unavailable'))

      const { result } = renderHook(() => useSwitch('switch.test'))

      expect(result.current.isOn).toBe(false)
      expect(result.current.state).toBe('unavailable')
      expect(result.current.isUnavailable).toBe(true)
    })

    it('should return isOn=false when switch state is "unknown"', () => {
      mockUseEntity.mockReturnValue(createMockEntityResponse('unknown'))

      const { result } = renderHook(() => useSwitch('switch.test'))

      expect(result.current.isOn).toBe(false)
      expect(result.current.state).toBe('unknown')
    })

    it('should handle custom switch attributes', () => {
      const customAttributes = { 
        friendly_name: 'Living Room Light Switch',
        device_class: 'outlet' 
      }
      mockUseEntity.mockReturnValue(createMockEntityResponse('on', customAttributes))

      const { result } = renderHook(() => useSwitch('switch.test'))

      expect(result.current.attributes).toEqual(customAttributes)
    })
  })

  describe('Service Calls', () => {
    it('should call switch.toggle service on toggle()', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockEntityResponse(),
        callService: mockCallService
      })

      const { result } = renderHook(() => useSwitch('switch.test'))

      await act(async () => {
        await result.current.toggle()
      })

      expect(mockCallService).toHaveBeenCalledWith('switch', 'toggle')
    })

    it('should call switch.turn_on service on turnOn()', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockEntityResponse('off'),
        callService: mockCallService
      })

      const { result } = renderHook(() => useSwitch('switch.test'))

      await act(async () => {
        await result.current.turnOn()
      })

      expect(mockCallService).toHaveBeenCalledWith('switch', 'turn_on')
    })

    it('should call switch.turn_off service on turnOff()', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockEntityResponse('on'),
        callService: mockCallService
      })

      const { result } = renderHook(() => useSwitch('switch.test'))

      await act(async () => {
        await result.current.turnOff()
      })

      expect(mockCallService).toHaveBeenCalledWith('switch', 'turn_off')
    })

    it('should handle service call errors', async () => {
      const mockCallService = vi.fn().mockRejectedValue(new Error('Service call failed'))
      mockUseEntity.mockReturnValue({
        ...createMockEntityResponse(),
        callService: mockCallService
      })

      const { result } = renderHook(() => useSwitch('switch.test'))

      await expect(result.current.toggle()).rejects.toThrow('Service call failed')
    })

    it('should maintain callback references for performance', () => {
      mockUseEntity.mockReturnValue(createMockEntityResponse())

      const { result, rerender } = renderHook(() => useSwitch('switch.test'))

      const firstToggle = result.current.toggle
      const firstTurnOn = result.current.turnOn
      const firstTurnOff = result.current.turnOff

      rerender()

      // Callbacks should be the same reference (useCallback working)
      expect(result.current.toggle).toBe(firstToggle)
      expect(result.current.turnOn).toBe(firstTurnOn)
      expect(result.current.turnOff).toBe(firstTurnOff)
    })
  })

  describe('Integration with useEntity', () => {
    it('should pass entityId to useEntity', () => {
      const entityId = 'switch.bedroom'
      
      renderHook(() => useSwitch(entityId))

      expect(mockUseEntity).toHaveBeenCalledWith(entityId)
    })

    it('should inherit all base entity properties', () => {
      const mockEntity = createMockEntityResponse('on', { test: 'value' })
      mockUseEntity.mockReturnValue(mockEntity)

      const { result } = renderHook(() => useSwitch('switch.test'))

      // Should inherit all base properties
      expect(result.current.entityId).toBe(mockEntity.entityId)
      expect(result.current.state).toBe(mockEntity.state)
      expect(result.current.attributes).toBe(mockEntity.attributes)
      expect(result.current.lastChanged).toBe(mockEntity.lastChanged)
      expect(result.current.lastUpdated).toBe(mockEntity.lastUpdated)
      expect(result.current.isUnavailable).toBe(mockEntity.isUnavailable)
      expect(result.current.isConnected).toBe(mockEntity.isConnected)
      expect(result.current.callService).toBe(mockEntity.callService)
      expect(result.current.refresh).toBe(mockEntity.refresh)
      
      // Plus switch-specific properties
      expect(result.current.isOn).toBeDefined()
      expect(result.current.toggle).toBeDefined()
      expect(result.current.turnOn).toBeDefined()
      expect(result.current.turnOff).toBeDefined()
    })

    it('should update when useEntity data changes', () => {
      // Start with switch off
      mockUseEntity.mockReturnValue(createMockEntityResponse('off'))

      const { result, rerender } = renderHook(() => useSwitch('switch.test'))

      expect(result.current.isOn).toBe(false)

      // Update to switch on
      mockUseEntity.mockReturnValue(createMockEntityResponse('on'))
      rerender()

      expect(result.current.isOn).toBe(true)
    })

    it('should handle callService dependency changes correctly', () => {
      const mockCallService1 = vi.fn()
      const mockCallService2 = vi.fn()
      
      // Initial render with first callService
      mockUseEntity.mockReturnValue({
        ...createMockEntityResponse(),
        callService: mockCallService1
      })

      const { result, rerender } = renderHook(() => useSwitch('switch.test'))
      const firstToggle = result.current.toggle

      // Update with new callService reference
      mockUseEntity.mockReturnValue({
        ...createMockEntityResponse(),
        callService: mockCallService2
      })
      rerender()

      // Toggle function should have new reference due to callService dependency
      expect(result.current.toggle).not.toBe(firstToggle)
    })
  })
})