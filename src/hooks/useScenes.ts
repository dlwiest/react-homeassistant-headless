import { useState, useEffect } from 'react'
import { useStore } from '../services/entityStore'
import type { SceneAttributes } from '../types'
import type { EntityState } from '../types/core'
import type { StateChangedEvent } from '../types/websocket'

export interface SceneEntity extends EntityState {
  attributes: SceneAttributes
}

export function useScenes(): SceneEntity[] {
  const [scenes, setScenes] = useState<SceneEntity[]>([])
  const connection = useStore((state) => state.connection)

  useEffect(() => {
    if (!connection) return

    let isMounted = true

    const fetchScenes = async () => {
      try {
        // Fetch all states from Home Assistant
        const states = await connection.sendMessagePromise<EntityState[]>({
          type: 'get_states',
        })

        // Filter for scene entities
        const sceneEntities = states.filter(
          (entity) => entity.entity_id.startsWith('scene.')
        ) as SceneEntity[]

        if (isMounted) {
          setScenes(sceneEntities)
        }
      } catch (error) {
        console.error('Failed to fetch scenes:', error)
        if (isMounted) {
          setScenes([])
        }
      }
    }

    // Initial fetch
    fetchScenes()

    // Subscribe to state changes to keep the list updated
    const unsubscribe = connection.subscribeEvents((event: StateChangedEvent) => {
      // When a scene entity state changes, re-fetch the list
      if (event.data.entity_id.startsWith('scene.')) {
        fetchScenes()
      }
    }, 'state_changed')

    return () => {
      isMounted = false
      unsubscribe.then(unsub => unsub()).catch(() => {})
    }
  }, [connection])

  return scenes
}
