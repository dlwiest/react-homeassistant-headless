import { useEffect } from 'react'
import { useStore } from '../services/entityStore'

// Validates that an entity ID is in the correct format
export function validateEntityIdFormat(entityId: string, hookName?: string): boolean {
  if (!entityId) {
    const prefix = hookName ? `${hookName}: ` : ''
    console.warn(`${prefix}entityId is required`)
    return false
  }
  
  if (!entityId.includes('.')) {
    const prefix = hookName ? `${hookName}: ` : ''
    console.warn(
      `${prefix}Invalid entity ID format "${entityId}". ` +
      `Entity IDs should be in format "domain.entity_name" (e.g., "light.living_room")`
    )
    return false
  }
  
  return true
}

// Warns if an entity doesn't exist after connection is established
export function useEntityExistenceWarning(
  entityId: string,
  connected: boolean,
  entity: unknown,
  delay: number = 2000
) {
  useEffect(() => {
    if (connected && !entity && entityId) {
      const timer = setTimeout(() => {
        const stillMissing = !useStore.getState().entities.get(entityId)
        if (stillMissing) {
          console.warn(
            `Entity "${entityId}" not found in Home Assistant. ` +
            `Check that the entity exists and is available.`
          )
        }
      }, delay)

      return () => clearTimeout(timer)
    }
    // Return undefined for other code paths to satisfy useEffect
    return undefined
  }, [connected, entity, entityId, delay])
}

// Validates entity ID format using useEffect hook
export function useEntityIdValidation(entityId: string, hookName?: string) {
  useEffect(() => {
    validateEntityIdFormat(entityId, hookName)
  }, [entityId, hookName])
}

// Comprehensive entity validation that includes both format and existence checks
export function useEntityValidation(
  entityId: string,
  connected: boolean,
  entity: unknown,
  hookName?: string,
  existenceCheckDelay: number = 2000
) {
  useEntityIdValidation(entityId, hookName)
  useEntityExistenceWarning(entityId, connected, entity, existenceCheckDelay)
}