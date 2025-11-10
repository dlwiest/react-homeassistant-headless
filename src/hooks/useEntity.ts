import { useEffect, useCallback } from 'react'
import { useStore } from '../services/entityStore'
import { useHAConnection } from '../providers/HAProvider'
import type { BaseEntityHook, EntityState } from '../types'
import { useEntityIdValidation, useEntityExistenceWarning } from '../utils/entityValidation'

export function useEntity<T = Record<string, unknown>>(entityId: string): BaseEntityHook<T> {
  const { connection, connected } = useHAConnection()
  const registerEntity = useStore((state) => state.registerEntity)
  const unregisterEntity = useStore((state) => state.unregisterEntity)

  // Validate entity ID format using utility
  useEntityIdValidation(entityId)

  // Register entity and subscribe to updates
  useEffect(() => {
    const handleUpdate = () => {
      // Trigger re-render when entity updates
    }

    registerEntity(entityId, handleUpdate)
    return () => unregisterEntity(entityId, handleUpdate)
  }, [entityId, registerEntity, unregisterEntity])

  // Get current entity state
  const entity = useStore((state) => state.entities.get(entityId))

  // Warn if entity doesn't exist using utility
  useEntityExistenceWarning(entityId, connected, !!entity)

  const callService = useCallback(
    async (domain: string, service: string, data?: object) => {
      if (!connection) {
        throw new Error('Not connected to Home Assistant')
      }

      await connection.sendMessagePromise({
        type: 'call_service',
        domain,
        service,
        service_data: {
          entity_id: entityId,
          ...data,
        },
      })
    },
    [connection, entityId]
  )

  const refresh = useCallback(async () => {
    if (!connection) return

    // Force fetch latest state
    const states = await connection.sendMessagePromise<EntityState[]>({
      type: 'get_states',
    })
    const latestEntity = states.find((s) => s.entity_id === entityId)

    if (latestEntity) {
      useStore.getState().updateEntity(entityId, latestEntity)
    }
  }, [connection, entityId])

  // Default values if entity doesn't exist yet
  const defaultEntity: EntityState<T> = {
    entity_id: entityId,
    state: 'unknown',
    attributes: {} as T,
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
    context: { id: '', parent_id: null, user_id: null },
  }

  const currentEntity = entity || defaultEntity

  return {
    entityId,
    state: currentEntity.state,
    attributes: currentEntity.attributes as T,
    lastChanged: new Date(currentEntity.last_changed),
    lastUpdated: new Date(currentEntity.last_updated),
    isUnavailable: currentEntity.state === 'unavailable',
    isConnected: connected,
    callService,
    refresh,
  }
}
