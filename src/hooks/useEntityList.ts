import { useState, useEffect } from 'react'
import { useStore } from '../services/entityStore'
import type { EntityState } from '../types/core'
import type { StateChangedEvent } from '../types/websocket'

/**
 * Generic hook for fetching all entities of a specific domain
 * @internal
 */
export function useEntityList<T extends { entity_id: string }>(domain: string): T[] {
  const [entities, setEntities] = useState<T[]>([])
  const connection = useStore((state) => state.connection)

  useEffect(() => {
    if (!connection) return

    let isMounted = true

    const fetchEntities = async () => {
      try {
        // Fetch all states from Home Assistant
        const states = await connection.sendMessagePromise<EntityState[]>({
          type: 'get_states',
        })

        // Filter for entities in this domain
        const domainEntities = states.filter(
          (entity) => entity.entity_id.startsWith(`${domain}.`)
        ) as unknown as T[]

        if (isMounted) {
          setEntities(domainEntities)
        }
      } catch (error) {
        console.error(`Failed to fetch ${domain} entities:`, error)
        if (isMounted) {
          setEntities([])
        }
      }
    }

    // Initial fetch
    fetchEntities()

    // Subscribe to state changes to keep the list updated
    const unsubscribe = connection.subscribeEvents((event: StateChangedEvent) => {
      if (event.data.entity_id.startsWith(`${domain}.`)) {
        setEntities(prev => {
          const index = prev.findIndex((e: T) => e.entity_id === event.data.entity_id)

          if (event.data.new_state) {
            // Entity exists or was added
            if (index >= 0) {
              // Update existing entity
              const updated = [...prev]
              updated[index] = event.data.new_state as unknown as T
              return updated
            } else {
              // Add new entity
              return [...prev, event.data.new_state as unknown as T]
            }
          } else if (index >= 0) {
            // Entity was removed
            return prev.filter((e: T) => e.entity_id !== event.data.entity_id)
          }

          return prev
        })
      }
    }, 'state_changed')

    return () => {
      isMounted = false
      unsubscribe.then(unsub => unsub()).catch(() => {})
    }
  }, [connection, domain])

  return entities
}
