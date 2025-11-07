import { useState, useEffect } from 'react'
import { useStore } from '../services/entityStore'
import type { EntityState } from '../types'

export function useEntityGroup(pattern: string | string[]): EntityState[] {
  const patterns = Array.isArray(pattern) ? pattern : [pattern]
  const [entities, setEntities] = useState<EntityState[]>([])

  useEffect(() => {
    // Update entities when patterns change
    const updateEntities = () => {
      const allEntities = Array.from(useStore.getState().entities.values())
      const matchingEntities = allEntities.filter((entity) => 
        patterns.some((p) => entity.entity_id === p)
      )
      setEntities(matchingEntities)
    }

    // Initial update
    updateEntities()

    // Subscribe to changes for all matching patterns
    const unsubscribes: (() => void)[] = []
    patterns.forEach((p) => {
      useStore.getState().registerEntity(p, updateEntities)
      unsubscribes.push(() => useStore.getState().unregisterEntity(p, updateEntities))
    })

    return () => {
      unsubscribes.forEach((fn) => fn())
    }
  }, [patterns.join(',')]) // Use patterns.join(',') for dependency array

  return entities
}
