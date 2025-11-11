import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLock } from '../useLock'
import { useEntity } from '../useEntity'
import { LockFeatures } from '../../types'
import { createMockLockEntity } from '../../test/utils'

// Mock useEntity since useLock depends on it
vi.mock('../useEntity')

// Using mock utilities from test utils

describe('useLock', () => {
  const mockUseEntity = useEntity as any
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should handle locked state correctly', () => {
    const mockEntity = createMockLockEntity('test', 'locked', {
      friendly_name: 'Test Lock',
      changed_by: 'User',
      supported_features: 0,
    })
    
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useLock('test'))
    
    expect(result.current.isLocked).toBe(true)
    expect(result.current.isUnlocked).toBe(false)
    expect(result.current.isUnknown).toBe(false)
    expect(result.current.changedBy).toBe('User')
    expect(result.current.supportsOpen).toBe(false)
  })

  it('should handle unlocked state correctly', () => {
    const mockEntity = createMockLockEntity('test', 'unlocked', {
      friendly_name: 'Test Lock',
      changed_by: 'Key',
    })
    
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useLock('test'))
    
    expect(result.current.isLocked).toBe(false)
    expect(result.current.isUnlocked).toBe(true)
    expect(result.current.isUnknown).toBe(false)
    expect(result.current.changedBy).toBe('Key')
  })

  it('should handle unknown state correctly', () => {
    const mockEntity = createMockLockEntity('test', 'unknown', {
      friendly_name: 'Test Lock',
    })
    
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useLock('test'))
    
    expect(result.current.isLocked).toBe(false)
    expect(result.current.isUnlocked).toBe(false)
    expect(result.current.isUnknown).toBe(true)
  })

  it('should handle supported features correctly', () => {
    const mockEntity = createMockLockEntity('test', 'locked', {
      friendly_name: 'Smart Lock',
      supported_features: LockFeatures.SUPPORT_OPEN,
    })
    
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useLock('test'))
    
    expect(result.current.supportsOpen).toBe(true)
  })

  it('should call lock service', async () => {
    const mockEntity = createMockLockEntity('test')
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useLock('test'))
    
    await act(async () => {
      await result.current.lock()
    })
    
    expect(mockEntity.callService).toHaveBeenCalledWith('lock', 'lock')
  })

  it('should call unlock service without code', async () => {
    const mockEntity = createMockLockEntity('test')
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useLock('test'))
    
    await act(async () => {
      await result.current.unlock()
    })
    
    expect(mockEntity.callService).toHaveBeenCalledWith('lock', 'unlock', undefined)
  })

  it('should call unlock service with code', async () => {
    const mockEntity = createMockLockEntity('test')
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useLock('test'))
    
    await act(async () => {
      await result.current.unlock('1234')
    })
    
    expect(mockEntity.callService).toHaveBeenCalledWith('lock', 'unlock', { code: '1234' })
  })

  it('should call open service without code', async () => {
    const mockEntity = createMockLockEntity('test', 'locked', { supported_features: LockFeatures.SUPPORT_OPEN })
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useLock('test'))
    
    await act(async () => {
      await result.current.open()
    })
    
    expect(mockEntity.callService).toHaveBeenCalledWith('lock', 'open', undefined)
  })

  it('should call open service with code', async () => {
    const mockEntity = createMockLockEntity('test', 'locked', { supported_features: LockFeatures.SUPPORT_OPEN })
    mockUseEntity.mockReturnValue(mockEntity)
    
    const { result } = renderHook(() => useLock('test'))
    
    await act(async () => {
      await result.current.open('5678')
    })
    
    expect(mockEntity.callService).toHaveBeenCalledWith('lock', 'open', { code: '5678' })
  })

  it('should normalize entity ID', () => {
    const mockEntity = createMockLockEntity('test')
    mockUseEntity.mockReturnValue(mockEntity)
    
    renderHook(() => useLock('front_door'))
    
    expect(useEntity).toHaveBeenCalledWith('lock.front_door')
  })

  it('should not normalize full entity ID', () => {
    const mockEntity = createMockLockEntity('test')
    mockUseEntity.mockReturnValue(mockEntity)
    
    renderHook(() => useLock('lock.front_door'))
    
    expect(useEntity).toHaveBeenCalledWith('lock.front_door')
  })

  describe('Warning Behavior', () => {
    let consoleMock: any

    beforeEach(() => {
      consoleMock = vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleMock.mockRestore()
    })

    it('should throw error when trying to open unsupported lock', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLockEntity('test', 'locked', { supported_features: 0 }), // No features supported
        callService: mockCallService
      })

      const { result } = renderHook(() => useLock('lock.test'))

      await expect(
        act(async () => {
          await result.current.open()
        })
      ).rejects.toThrow('Lock "lock.test" does not support open operation. Check the lock\'s supported_features.')

      expect(mockCallService).not.toHaveBeenCalled()
    })

    it('should throw error when trying to open unsupported lock with code', async () => {
      const mockCallService = vi.fn()
      mockUseEntity.mockReturnValue({
        ...createMockLockEntity('test', 'locked', { supported_features: 0 }),
        callService: mockCallService
      })

      const { result } = renderHook(() => useLock('lock.test'))

      await expect(
        act(async () => {
          await result.current.open('1234')
        })
      ).rejects.toThrow('Lock "lock.test" does not support open operation. Check the lock\'s supported_features.')

      expect(mockCallService).not.toHaveBeenCalled()
    })

    it('should warn when using wrong domain', () => {
      mockUseEntity.mockReturnValue(createMockLockEntity('test', 'locked'))

      renderHook(() => useLock('switch.door_lock'))

      expect(consoleMock).toHaveBeenCalledWith(
        'useLock: Entity "switch.door_lock" has domain "switch" but expects "lock" domain. This may not work as expected. Use useEntity() or the appropriate domain-specific hook instead.'
      )
    })
  })
})