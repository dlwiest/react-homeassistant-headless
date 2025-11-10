import { useEffect } from 'react'
import { useStore } from '../services/entityStore'

/**
 * Validates that an entity ID is in the correct format.
 * 
 * @param entityId - The entity ID to validate
 * @param hookName - Optional hook name for better error messages
 * @returns true if valid, false otherwise
 */
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

/**
 * Custom hook that warns if an entity doesn't exist after connection is established.
 * This hook handles the timing of when to check for entity existence.
 * 
 * @param entityId - Entity ID to check for existence
 * @param connected - Whether we're connected to Home Assistant
 * @param entity - The entity object (undefined if not found)
 * @param delay - How long to wait before warning (default 2000ms)
 */
export function useEntityExistenceWarning(
  entityId: string,
  connected: boolean,
  entity: any,
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

/**
 * Validates entity ID format using useEffect hook.
 * This is a convenience hook that combines format validation with React lifecycle.
 * 
 * @param entityId - Entity ID to validate
 * @param hookName - Hook name for better error messages
 */
export function useEntityIdValidation(entityId: string, hookName?: string) {
  useEffect(() => {
    validateEntityIdFormat(entityId, hookName)
  }, [entityId, hookName])
}

/**
 * Comprehensive entity validation that includes both format and existence checks.
 * This is a convenience function that combines multiple validation types.
 * 
 * @param entityId - Entity ID to validate
 * @param connected - Whether we're connected to Home Assistant
 * @param entity - The entity object (undefined if not found)
 * @param hookName - Hook name for better error messages
 * @param existenceCheckDelay - How long to wait before checking existence
 */
export function useEntityValidation(
  entityId: string,
  connected: boolean,
  entity: any,
  hookName?: string,
  existenceCheckDelay: number = 2000
) {
  useEntityIdValidation(entityId, hookName)
  useEntityExistenceWarning(entityId, connected, entity, existenceCheckDelay)
}