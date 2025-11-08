import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLock } from '../useLock'
import { useEntity } from '../useEntity'

// Mock useEntity since useLock depends on it
vi.mock('../useEntity')

// Mock lock entity response
const createMockLockEntity = (
  state: string = 'locked',
  attributes: Record<string, any> = {}
) => ({
  entityId: 'lock.test',
  state,
  attributes,
  lastChanged: new Date(),
  lastUpdated: new Date(),
  isUnavailable: state === 'unavailable',
  isConnected: true,
  callService: vi.fn(),
  refresh: vi.fn()
})

describe('useLock', () => {
  const mockUseEntity = useEntity as any
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock for useEntity
    mockUseEntity.mockReturnValue(createMockLockEntity())
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('State Detection', () => {
    it('should detect locked state correctly', () => {
      mockUseEntity.mockReturnValue(createMockLockEntity('locked'))

      const { result } = renderHook(() => useLock('lock.test'))

      expect(result.current.isLocked).toBe(true)
      expect(result.current.isUnlocked).toBe(false)
      expect(result.current.isLocking).toBe(false)
      expect(result.current.isUnlocking).toBe(false)
      expect(result.current.isJammed).toBe(false)
      expect(result.current.state).toBe('locked')
    })

    it('should detect unlocked state correctly', () => {
      mockUseEntity.mockReturnValue(createMockLockEntity('unlocked'))

      const { result } = renderHook(() => useLock('lock.test'))

      expect(result.current.isLocked).toBe(false)
      expect(result.current.isUnlocked).toBe(true)
      expect(result.current.isLocking).toBe(false)
      expect(result.current.isUnlocking).toBe(false)
      expect(result.current.isJammed).toBe(false)
      expect(result.current.state).toBe('unlocked')
    })

    it('should detect locking state correctly', () => {
      mockUseEntity.mockReturnValue(createMockLockEntity('locking'))

      const { result } = renderHook(() => useLock('lock.test'))

      expect(result.current.isLocked).toBe(false)
      expect(result.current.isUnlocked).toBe(false)
      expect(result.current.isLocking).toBe(true)
      expect(result.current.isUnlocking).toBe(false)
      expect(result.current.isJammed).toBe(false)
      expect(result.current.state).toBe('locking')
    })

    it('should detect unlocking state correctly', () => {
      mockUseEntity.mockReturnValue(createMockLockEntity('unlocking'))

      const { result } = renderHook(() => useLock('lock.test'))

      expect(result.current.isLocked).toBe(false)
      expect(result.current.isUnlocked).toBe(false)
      expect(result.current.isLocking).toBe(false)
      expect(result.current.isUnlocking).toBe(true)
      expect(result.current.isJammed).toBe(false)
      expect(result.current.state).toBe('unlocking')
    })

    it('should detect jammed state correctly', () => {
      mockUseEntity.mockReturnValue(createMockLockEntity('jammed'))

      const { result } = renderHook(() => useLock('lock.test'))

      expect(result.current.isLocked).toBe(false)
      expect(result.current.isUnlocked).toBe(false)
      expect(result.current.isLocking).toBe(false)
      expect(result.current.isUnlocking).toBe(false)
      expect(result.current.isJammed).toBe(true)
      expect(result.current.state).toBe('jammed')
    })

    it('should handle unavailable state', () => {
      mockUseEntity.mockReturnValue(createMockLockEntity('unavailable'))

      const { result } = renderHook(() => useLock('lock.test'))

      expect(result.current.isLocked).toBe(false)
      expect(result.current.isUnlocked).toBe(false)
      expect(result.current.isLocking).toBe(false)
      expect(result.current.isUnlocking).toBe(false)
      expect(result.current.isJammed).toBe(false)
      expect(result.current.isUnavailable).toBe(true)
      expect(result.current.state).toBe('unavailable')
    })

    it('should handle unknown state', () => {
      mockUseEntity.mockReturnValue(createMockLockEntity('unknown'))

      const { result } = renderHook(() => useLock('lock.test'))

      expect(result.current.isLocked).toBe(false)
      expect(result.current.isUnlocked).toBe(false)
      expect(result.current.isLocking).toBe(false)
      expect(result.current.isUnlocking).toBe(false)
      expect(result.current.isJammed).toBe(false)
      expect(result.current.state).toBe('unknown')
    })

    it('should handle custom lock attributes', () => {
      const customAttributes = { 
        friendly_name: 'Front Door Lock',
        code_format: '^\\d{4}$',
        changed_by: 'user123'
      }
      mockUseEntity.mockReturnValue(createMockLockEntity('locked', customAttributes))

      const { result } = renderHook(() => useLock('lock.test'))

      expect(result.current.attributes).toEqual(customAttributes)
    })
  })

  describe('Service Calls', () => {
    it('should call lock.lock service on lock()', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLockEntity('unlocked'),
        callService: mockCallService
      })

      const { result } = renderHook(() => useLock('lock.test'))

      await act(async () => {
        await result.current.lock()
      })

      expect(mockCallService).toHaveBeenCalledWith('lock', 'lock')
    })

    it('should call lock.unlock service on unlock()', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLockEntity('locked'),
        callService: mockCallService
      })

      const { result } = renderHook(() => useLock('lock.test'))

      await act(async () => {
        await result.current.unlock()
      })

      expect(mockCallService).toHaveBeenCalledWith('lock', 'unlock')
    })

    it('should handle service call errors', async () => {
      const mockCallService = vi.fn().mockRejectedValue(new Error('Service call failed'))
      mockUseEntity.mockReturnValue({
        ...createMockLockEntity(),
        callService: mockCallService
      })

      const { result } = renderHook(() => useLock('lock.test'))

      await expect(result.current.lock()).rejects.toThrow('Service call failed')
    })

    it('should maintain callback references for performance', () => {
      mockUseEntity.mockReturnValue(createMockLockEntity())

      const { result, rerender } = renderHook(() => useLock('lock.test'))

      const firstLock = result.current.lock
      const firstUnlock = result.current.unlock

      rerender()

      // Callbacks should be the same reference (useCallback working)
      expect(result.current.lock).toBe(firstLock)
      expect(result.current.unlock).toBe(firstUnlock)
    })
  })

  describe('Integration with useEntity', () => {
    it('should pass entityId to useEntity', () => {
      const entityId = 'lock.front_door'
      
      renderHook(() => useLock(entityId))

      expect(mockUseEntity).toHaveBeenCalledWith(entityId)
    })

    it('should add lock prefix if missing', () => {
      const shortEntityId = 'front_door'
      
      renderHook(() => useLock(shortEntityId))

      expect(mockUseEntity).toHaveBeenCalledWith('lock.front_door')
    })

    it('should not add lock prefix if already present', () => {
      const fullEntityId = 'lock.front_door'
      
      renderHook(() => useLock(fullEntityId))

      expect(mockUseEntity).toHaveBeenCalledWith('lock.front_door')
    })

    it('should inherit all base entity properties', () => {
      const mockEntity = createMockLockEntity('locked', { test: 'value' })
      mockUseEntity.mockReturnValue(mockEntity)

      const { result } = renderHook(() => useLock('lock.test'))

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
      
      // Plus lock-specific properties
      expect(result.current.isLocked).toBeDefined()
      expect(result.current.isUnlocked).toBeDefined()
      expect(result.current.isLocking).toBeDefined()
      expect(result.current.isUnlocking).toBeDefined()
      expect(result.current.isJammed).toBeDefined()
      expect(result.current.lock).toBeDefined()
      expect(result.current.unlock).toBeDefined()
    })

    it('should update when useEntity data changes', () => {
      // Start with lock locked
      mockUseEntity.mockReturnValue(createMockLockEntity('locked'))

      const { result, rerender } = renderHook(() => useLock('lock.test'))

      expect(result.current.isLocked).toBe(true)
      expect(result.current.isUnlocked).toBe(false)

      // Update to lock unlocked
      mockUseEntity.mockReturnValue(createMockLockEntity('unlocked'))
      rerender()

      expect(result.current.isLocked).toBe(false)
      expect(result.current.isUnlocked).toBe(true)
    })

    it('should handle callService dependency changes correctly', () => {
      const mockCallService1 = vi.fn()
      const mockCallService2 = vi.fn()
      
      // Initial render with first callService
      mockUseEntity.mockReturnValue({
        ...createMockLockEntity(),
        callService: mockCallService1
      })

      const { result, rerender } = renderHook(() => useLock('lock.test'))
      const firstLock = result.current.lock

      // Update with new callService reference
      mockUseEntity.mockReturnValue({
        ...createMockLockEntity(),
        callService: mockCallService2
      })
      rerender()

      // Lock function should have new reference due to callService dependency
      expect(result.current.lock).not.toBe(firstLock)
    })
  })

  describe('Edge Cases', () => {
    it('should handle transition from locking to locked', () => {
      mockUseEntity.mockReturnValue(createMockLockEntity('locking'))

      const { result, rerender } = renderHook(() => useLock('lock.test'))

      expect(result.current.isLocking).toBe(true)
      expect(result.current.isLocked).toBe(false)

      mockUseEntity.mockReturnValue(createMockLockEntity('locked'))
      rerender()

      expect(result.current.isLocking).toBe(false)
      expect(result.current.isLocked).toBe(true)
    })

    it('should handle transition from unlocking to unlocked', () => {
      mockUseEntity.mockReturnValue(createMockLockEntity('unlocking'))

      const { result, rerender } = renderHook(() => useLock('lock.test'))

      expect(result.current.isUnlocking).toBe(true)
      expect(result.current.isUnlocked).toBe(false)

      mockUseEntity.mockReturnValue(createMockLockEntity('unlocked'))
      rerender()

      expect(result.current.isUnlocking).toBe(false)
      expect(result.current.isUnlocked).toBe(true)
    })

    it('should handle jammed to unlocked recovery', () => {
      mockUseEntity.mockReturnValue(createMockLockEntity('jammed'))

      const { result, rerender } = renderHook(() => useLock('lock.test'))

      expect(result.current.isJammed).toBe(true)

      mockUseEntity.mockReturnValue(createMockLockEntity('unlocked'))
      rerender()

      expect(result.current.isJammed).toBe(false)
      expect(result.current.isUnlocked).toBe(true)
    })
  })
})
