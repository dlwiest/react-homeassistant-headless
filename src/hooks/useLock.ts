import { useCallback } from 'react'
import { useEntity } from './useEntity'
import type { LockState, LockAttributes } from '../types'
import { LockFeatures } from '../types'
import { createDomainValidator } from '../utils/entityId'
import { hasFeature } from '../utils/features'
import { createFeatureBasedControlDef } from '../utils/serviceHelpers'

const validateLockEntityId = createDomainValidator('lock', 'useLock')

export function useLock(entityId: string): LockState {
  const normalizedEntityId = validateLockEntityId(entityId)
  const entity = useEntity<LockAttributes>(normalizedEntityId)
  const { attributes, state, callService } = entity

  // Extract feature support
  const supportsOpen = hasFeature(attributes.supported_features, LockFeatures.SUPPORT_OPEN)

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

  const open = useCallback(
    createFeatureBasedControlDef(
      callService,
      'lock',
      {
        entityId: normalizedEntityId,
        isSupported: supportsOpen,
        featureName: 'open operation',
        serviceName: 'open'
      },
      (code?: string) => code ? { code } : undefined
    ),
    [callService, normalizedEntityId, supportsOpen]
  )

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