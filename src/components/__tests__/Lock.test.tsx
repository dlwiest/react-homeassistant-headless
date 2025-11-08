import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Lock from '../Lock'
import { useLock } from '../../hooks/useLock'
import type { LockState } from '../../hooks/useLock'

// Mock useLock hook
vi.mock('../../hooks/useLock')

const mockUseLock = useLock as any

// Mock lock entity response
const createMockLockEntity = (
  entityId: string = 'lock.test',
  state: string = 'locked',
  attributes: Record<string, any> = {}
): LockState => ({
  entityId,
  state,
  attributes,
  lastChanged: new Date(),
  lastUpdated: new Date(),
  isUnavailable: state === 'unavailable',
  isConnected: true,
  callService: vi.fn(),
  refresh: vi.fn(),
  isLocked: state === 'locked',
  isUnlocked: state === 'unlocked',
  isLocking: state === 'locking',
  isUnlocking: state === 'unlocking',
  isJammed: state === 'jammed',
  lock: vi.fn(),
  unlock: vi.fn()
})

describe('Lock', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLock.mockReturnValue(createMockLockEntity())
  })

  describe('Basic Functionality', () => {
    it('should render children with lock entity data', () => {
      const mockLockEntity = createMockLockEntity('lock.front_door', 'locked')
      mockUseLock.mockReturnValue(mockLockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Lock Content</div>)

      render(
        <Lock entityId="lock.front_door">
          {mockChildren}
        </Lock>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockLockEntity)
    })

    it('should pass correct entityId to useLock hook', () => {
      const entityId = 'lock.back_door'
      
      render(
        <Lock entityId={entityId}>
          {() => <div>Content</div>}
        </Lock>
      )

      expect(mockUseLock).toHaveBeenCalledWith(entityId)
    })

    it('should render children function result', () => {
      const { container } = render(
        <Lock entityId="lock.test">
          {() => <div data-testid="lock-content">Lock Control</div>}
        </Lock>
      )

      expect(container.querySelector('[data-testid="lock-content"]')).toBeInTheDocument()
      expect(container.textContent).toBe('Lock Control')
    })
  })

  describe('Lock State Handling', () => {
    it('should handle lock in locked state', () => {
      const mockLockEntity = createMockLockEntity('lock.test', 'locked')
      mockUseLock.mockReturnValue(mockLockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Lock Locked</div>)

      render(
        <Lock entityId="lock.test">
          {mockChildren}
        </Lock>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockLockEntity)
      expect(mockLockEntity.state).toBe('locked')
      expect(mockLockEntity.isLocked).toBe(true)
    })

    it('should handle lock in unlocked state', () => {
      const mockLockEntity = createMockLockEntity('lock.test', 'unlocked')
      mockUseLock.mockReturnValue(mockLockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Lock Unlocked</div>)

      render(
        <Lock entityId="lock.test">
          {mockChildren}
        </Lock>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockLockEntity)
      expect(mockLockEntity.state).toBe('unlocked')
      expect(mockLockEntity.isUnlocked).toBe(true)
    })

    it('should handle lock in locking state', () => {
      const mockLockEntity = createMockLockEntity('lock.test', 'locking')
      mockUseLock.mockReturnValue(mockLockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Lock Locking</div>)

      render(
        <Lock entityId="lock.test">
          {mockChildren}
        </Lock>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockLockEntity)
      expect(mockLockEntity.state).toBe('locking')
      expect(mockLockEntity.isLocking).toBe(true)
    })

    it('should handle lock in unlocking state', () => {
      const mockLockEntity = createMockLockEntity('lock.test', 'unlocking')
      mockUseLock.mockReturnValue(mockLockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Lock Unlocking</div>)

      render(
        <Lock entityId="lock.test">
          {mockChildren}
        </Lock>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockLockEntity)
      expect(mockLockEntity.state).toBe('unlocking')
      expect(mockLockEntity.isUnlocking).toBe(true)
    })

    it('should handle lock in jammed state', () => {
      const mockLockEntity = createMockLockEntity('lock.test', 'jammed')
      mockUseLock.mockReturnValue(mockLockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Lock Jammed</div>)

      render(
        <Lock entityId="lock.test">
          {mockChildren}
        </Lock>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockLockEntity)
      expect(mockLockEntity.state).toBe('jammed')
      expect(mockLockEntity.isJammed).toBe(true)
    })

    it('should handle unavailable lock', () => {
      const mockLockEntity = createMockLockEntity('lock.test', 'unavailable')
      mockUseLock.mockReturnValue(mockLockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Lock Unavailable</div>)

      render(
        <Lock entityId="lock.test">
          {mockChildren}
        </Lock>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockLockEntity)
      expect(mockLockEntity.state).toBe('unavailable')
      expect(mockLockEntity.isUnavailable).toBe(true)
    })
  })

  describe('Lock Control Actions', () => {
    it('should support locking the lock', () => {
      const mockLock = vi.fn()
      const mockLockEntity = createMockLockEntity('lock.test', 'unlocked')
      mockLockEntity.lock = mockLock
      mockUseLock.mockReturnValue(mockLockEntity)

      const { getByTestId } = render(
        <Lock entityId="lock.test">
          {(lockEntity) => (
            <button data-testid="lock-btn" onClick={() => lockEntity.lock()}>
              Lock
            </button>
          )}
        </Lock>
      )

      fireEvent.click(getByTestId('lock-btn'))

      expect(mockLock).toHaveBeenCalled()
    })

    it('should support unlocking the lock', () => {
      const mockUnlock = vi.fn()
      const mockLockEntity = createMockLockEntity('lock.test', 'locked')
      mockLockEntity.unlock = mockUnlock
      mockUseLock.mockReturnValue(mockLockEntity)

      const { getByTestId } = render(
        <Lock entityId="lock.test">
          {(lockEntity) => (
            <button data-testid="unlock-btn" onClick={() => lockEntity.unlock()}>
              Unlock
            </button>
          )}
        </Lock>
      )

      fireEvent.click(getByTestId('unlock-btn'))

      expect(mockUnlock).toHaveBeenCalled()
    })

    it('should support calling generic service', () => {
      const mockCallService = vi.fn()
      const mockLockEntity = createMockLockEntity('lock.test', 'unlocked')
      mockLockEntity.callService = mockCallService
      mockUseLock.mockReturnValue(mockLockEntity)

      const { getByTestId } = render(
        <Lock entityId="lock.test">
          {(lockEntity) => (
            <button 
              data-testid="service-call" 
              onClick={() => lockEntity.callService('lock', 'lock')}
            >
              Service Call
            </button>
          )}
        </Lock>
      )

      fireEvent.click(getByTestId('service-call'))

      expect(mockCallService).toHaveBeenCalledWith('lock', 'lock')
    })
  })

  describe('Children Function Patterns', () => {
    it('should support conditional rendering based on lock state', () => {
      const mockLockEntity = createMockLockEntity('lock.test', 'locked')
      mockUseLock.mockReturnValue(mockLockEntity)

      const { container } = render(
        <Lock entityId="lock.test">
          {(lockEntity) => (
            lockEntity.isLocked 
              ? <div data-testid="lock-locked">Lock is LOCKED</div>
              : <div data-testid="lock-unlocked">Lock is UNLOCKED</div>
          )}
        </Lock>
      )

      expect(container.querySelector('[data-testid="lock-locked"]')).toBeInTheDocument()
      expect(container.querySelector('[data-testid="lock-unlocked"]')).not.toBeInTheDocument()
    })

    it('should support rendering lock attributes', () => {
      const mockLockEntity = createMockLockEntity(
        'lock.smart_lock', 
        'locked', 
        { 
          friendly_name: 'Smart Lock',
          code_format: '^\\d{4}$',
          changed_by: 'user123'
        }
      )
      mockUseLock.mockReturnValue(mockLockEntity)

      const { container } = render(
        <Lock entityId="lock.smart_lock">
          {(lockEntity) => (
            <div data-testid="lock-info">
              {lockEntity.attributes.friendly_name} - Changed by: {lockEntity.attributes.changed_by}
            </div>
          )}
        </Lock>
      )

      expect(container.textContent).toBe('Smart Lock - Changed by: user123')
    })

    it('should support complex lock controls', () => {
      const mockLock = vi.fn()
      const mockUnlock = vi.fn()
      const mockLockEntity = createMockLockEntity('lock.test', 'unlocked')
      mockLockEntity.lock = mockLock
      mockLockEntity.unlock = mockUnlock
      mockUseLock.mockReturnValue(mockLockEntity)

      const { getByTestId } = render(
        <Lock entityId="lock.test">
          {(lockEntity) => (
            <div>
              <div data-testid="status">
                Status: {lockEntity.isLocked ? 'LOCKED' : 'UNLOCKED'}
              </div>
              <div>
                <button onClick={() => lockEntity.lock()}>Lock</button>
                <button onClick={() => lockEntity.unlock()}>Unlock</button>
              </div>
            </div>
          )}
        </Lock>
      )

      expect(getByTestId('status').textContent).toBe('Status: UNLOCKED')
    })

    it('should support checking connection status', () => {
      const mockLockEntity = createMockLockEntity('lock.test', 'locked')
      mockLockEntity.isConnected = false
      mockUseLock.mockReturnValue(mockLockEntity)

      const { container } = render(
        <Lock entityId="lock.test">
          {(lockEntity) => (
            <div data-testid="connection-status">
              {lockEntity.isConnected ? 'Connected' : 'Disconnected'}
            </div>
          )}
        </Lock>
      )

      expect(container.textContent).toBe('Disconnected')
    })

    it('should handle jammed state display', () => {
      const mockLockEntity = createMockLockEntity('lock.test', 'jammed')
      mockUseLock.mockReturnValue(mockLockEntity)

      const { container } = render(
        <Lock entityId="lock.test">
          {(lockEntity) => (
            <div data-testid="jammed-warning">
              {lockEntity.isJammed && 'LOCK IS JAMMED!'}
            </div>
          )}
        </Lock>
      )

      expect(container.textContent).toBe('LOCK IS JAMMED!')
    })

    it('should handle transition states display', () => {
      const mockLockEntity = createMockLockEntity('lock.test', 'locking')
      mockUseLock.mockReturnValue(mockLockEntity)

      const { container } = render(
        <Lock entityId="lock.test">
          {(lockEntity) => (
            <div data-testid="transition-status">
              {lockEntity.isLocking && 'Locking...'}
              {lockEntity.isUnlocking && 'Unlocking...'}
            </div>
          )}
        </Lock>
      )

      expect(container.textContent).toBe('Locking...')
    })
  })

  describe('Edge Cases', () => {
    it('should handle lock with no attributes', () => {
      const mockLockEntity = createMockLockEntity('lock.test', 'locked', {})
      mockUseLock.mockReturnValue(mockLockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>No Attributes</div>)

      render(
        <Lock entityId="lock.test">
          {mockChildren}
        </Lock>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockLockEntity)
      expect(mockLockEntity.attributes).toEqual({})
    })

    it('should handle lock with special entityId characters', () => {
      const specialEntityId = 'lock.test_lock-2'
      
      render(
        <Lock entityId={specialEntityId}>
          {() => <div>Special ID</div>}
        </Lock>
      )

      expect(mockUseLock).toHaveBeenCalledWith(specialEntityId)
    })

    it('should re-render when entityId prop changes', () => {
      const mockChildren = vi.fn().mockReturnValue(<div>Content</div>)
      
      const { rerender } = render(
        <Lock entityId="lock.test1">
          {mockChildren}
        </Lock>
      )

      expect(mockUseLock).toHaveBeenLastCalledWith('lock.test1')

      rerender(
        <Lock entityId="lock.test2">
          {mockChildren}
        </Lock>
      )

      expect(mockUseLock).toHaveBeenLastCalledWith('lock.test2')
    })

    it('should handle lock state changes during interaction', () => {
      // Start with lock unlocked
      let mockLockEntity = createMockLockEntity('lock.test', 'unlocked')
      mockUseLock.mockReturnValue(mockLockEntity)

      const { container, rerender } = render(
        <Lock entityId="lock.test">
          {(lockEntity) => (
            <div data-testid="lock-state">
              {lockEntity.isLocked ? 'LOCKED' : 'UNLOCKED'}
            </div>
          )}
        </Lock>
      )

      expect(container.querySelector('[data-testid="lock-state"]')?.textContent).toBe('UNLOCKED')

      // Lock becomes locked
      mockLockEntity = createMockLockEntity('lock.test', 'locked')
      mockUseLock.mockReturnValue(mockLockEntity)
      rerender(
        <Lock entityId="lock.test">
          {(lockEntity) => (
            <div data-testid="lock-state">
              {lockEntity.isLocked ? 'LOCKED' : 'UNLOCKED'}
            </div>
          )}
        </Lock>
      )

      expect(container.querySelector('[data-testid="lock-state"]')?.textContent).toBe('LOCKED')
    })
  })

  describe('Integration', () => {
    it('should inherit all base entity properties', () => {
      const mockLockEntity = createMockLockEntity('lock.test', 'locked', {
        friendly_name: 'Test Lock'
      })
      mockUseLock.mockReturnValue(mockLockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Lock</div>)

      render(
        <Lock entityId="lock.test">
          {mockChildren}
        </Lock>
      )

      const passedEntity = mockChildren.mock.calls[0][0]
      
      // Should have all base entity properties
      expect(passedEntity.entityId).toBe('lock.test')
      expect(passedEntity.state).toBe('locked')
      expect(passedEntity.attributes).toBeDefined()
      expect(passedEntity.lastChanged).toBeDefined()
      expect(passedEntity.lastUpdated).toBeDefined()
      expect(passedEntity.isUnavailable).toBeDefined()
      expect(passedEntity.isConnected).toBeDefined()
      expect(passedEntity.callService).toBeDefined()
      expect(passedEntity.refresh).toBeDefined()
      
      // Plus lock-specific properties
      expect(passedEntity.isLocked).toBeDefined()
      expect(passedEntity.isUnlocked).toBeDefined()
      expect(passedEntity.isLocking).toBeDefined()
      expect(passedEntity.isUnlocking).toBeDefined()
      expect(passedEntity.isJammed).toBeDefined()
      expect(passedEntity.lock).toBeDefined()
      expect(passedEntity.unlock).toBeDefined()
    })
  })
})
