import { useCallback } from 'react'
import { useEntity } from './useEntity'
import type { LockState, LockAttributes } from '../types'
import { LockFeatures } from '../types'

function ensureLockEntityId(entityId: string): string {
  return entityId.includes('.') ? entityId : `lock.${entityId}`
}

export function useLock(entityId: string): LockState {
  const normalizedEntityId = ensureLockEntityId(entityId)
  const entity = useEntity<LockAttributes>(normalizedEntityId)
  const { attributes, state, callService } = entity

  // Extract feature support
  const supportedFeatures = attributes.supported_features || 0
  const supportsOpen = (supportedFeatures & LockFeatures.SUPPORT_OPEN) !== 0

  // State helpers
  const isLocked = state === 'locked'
  const isUnlocked = state === 'unlocked'
  const isUnknown = !isLocked && !isUnlocked
  const changedBy = attributes.changed_by

  // Actions
  const lock = useCallback(async () => {
    await callService('lock', 'lock')
  }, [callService])

  const unlock = useCallback(async (code?: string) => {
    const params = code ? { code } : undefined
    await callService('lock', 'unlock', params)
  }, [callService])

  const open = useCallback(async (code?: string) => {
    const params = code ? { code } : undefined
    await callService('lock', 'open', params)
  }, [callService])

  return {
    ...entity,
    isLocked,
    isUnlocked,
    isUnknown,
    changedBy,
    supportsOpen,
    lock,
    unlock,
    open,
  }
}