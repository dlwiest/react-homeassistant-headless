import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Lock from '../Lock'
import { useLock } from '../../hooks/useLock'

// Mock the useLock hook
vi.mock('../../hooks/useLock')

const mockLockState = {
  entityId: 'lock.test',
  state: 'locked',
  attributes: {},
  lastChanged: new Date(),
  lastUpdated: new Date(),
  isUnavailable: false,
  isConnected: true,
  isLocked: true,
  isUnlocked: false,
  isUnknown: false,
  changedBy: 'User',
  supportsOpen: true,
  lock: vi.fn(),
  unlock: vi.fn(),
  open: vi.fn(),
  callService: vi.fn(),
  refresh: vi.fn(),
  error: undefined
}

describe('Lock Component', () => {
  const mockUseLock = useLock as any
  
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLock.mockReturnValue(mockLockState)
  })

  it('should render children with lock state', () => {
    render(
      <Lock entityId="lock.test">
        {(lock) => (
          <div>
            <span data-testid="lock-state">{lock.isLocked ? 'Locked' : 'Unlocked'}</span>
            <span data-testid="lock-changed-by">{lock.changedBy}</span>
            <span data-testid="lock-supports-open">{lock.supportsOpen ? 'Yes' : 'No'}</span>
          </div>
        )}
      </Lock>
    )

    expect(screen.getByTestId('lock-state')).toHaveTextContent('Locked')
    expect(screen.getByTestId('lock-changed-by')).toHaveTextContent('User')
    expect(screen.getByTestId('lock-supports-open')).toHaveTextContent('Yes')
  })

  it('should call useLock with correct entity ID', () => {
    render(
      <Lock entityId="lock.test">
        {() => <div>Test</div>}
      </Lock>
    )

    expect(useLock).toHaveBeenCalledWith('lock.test')
  })

  it('should render with different lock states', () => {
    const unlockedLockState = {
      ...mockLockState,
      state: 'unlocked',
      isLocked: false,
      isUnlocked: true,
      changedBy: 'Key'
    }

    mockUseLock.mockReturnValue(unlockedLockState)

    render(
      <Lock entityId="lock.test">
        {(lock) => (
          <div>
            <span data-testid="lock-state">{lock.isLocked ? 'Locked' : 'Unlocked'}</span>
            <span data-testid="lock-changed-by">{lock.changedBy}</span>
          </div>
        )}
      </Lock>
    )

    expect(screen.getByTestId('lock-state')).toHaveTextContent('Unlocked')
    expect(screen.getByTestId('lock-changed-by')).toHaveTextContent('Key')
  })

  it('should render unknown state', () => {
    const unknownLockState = {
      ...mockLockState,
      state: 'unknown',
      isLocked: false,
      isUnlocked: false,
      isUnknown: true,
      changedBy: undefined
    }

    mockUseLock.mockReturnValue(unknownLockState)

    render(
      <Lock entityId="lock.test">
        {(lock) => (
          <div>
            <span data-testid="lock-is-unknown">{lock.isUnknown ? 'Unknown' : 'Known'}</span>
          </div>
        )}
      </Lock>
    )

    expect(screen.getByTestId('lock-is-unknown')).toHaveTextContent('Unknown')
  })

  it('should render feature support flags', () => {
    render(
      <Lock entityId="lock.test">
        {(lock) => (
          <div>
            <span data-testid="supports-open">{lock.supportsOpen ? 'Yes' : 'No'}</span>
          </div>
        )}
      </Lock>
    )

    expect(screen.getByTestId('supports-open')).toHaveTextContent('Yes')
  })
})