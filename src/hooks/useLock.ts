import { useCallback } from 'react'
import { useEntity } from './useEntity'
import type { BaseEntityHook } from '../types'

function ensureLockEntityId(entityId: string): string {
  return entityId.includes('.') ? entityId : `lock.${entityId}`
}

export interface LockState extends BaseEntityHook {
  isLocked: boolean
  isUnlocked: boolean
  isLocking: boolean
  isUnlocking: boolean
  isJammed: boolean
  lock: () => Promise<void>
  unlock: () => Promise<void>
}

export function useLock(entityId: string): LockState {
  const normalizedEntityId = ensureLockEntityId(entityId)
  const entity = useEntity(normalizedEntityId)
  const { state, callService } = entity

  const isLocked = state === 'locked'
  const isUnlocked = state === 'unlocked'
  const isLocking = state === 'locking'
  const isUnlocking = state === 'unlocking'
  const isJammed = state === 'jammed'

  const lock = useCallback(async () => {
    await callService('lock', 'lock')
  }, [callService])

  const unlock = useCallback(async () => {
    await callService('lock', 'unlock')
  }, [callService])

  return {
    ...entity,
    isLocked,
    isUnlocked,
    isLocking,
    isUnlocking,
    isJammed,
    lock,
    unlock,
  }
}
