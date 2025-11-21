import { useState, useEffect } from 'react'
import { useStore } from '../services/entityStore'
import type { SceneAttributes } from '../types'
import type { EntityState } from '../types/core'

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

    fetchScenes()

    return () => {
      isMounted = false
    }
  }, [connection])

  return scenes
}
