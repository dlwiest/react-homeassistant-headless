import { useCallback } from 'react'
import { useEntity } from './useEntity'
import { createDomainValidator } from '../utils/entityId'
import type { SceneState, SceneAttributes } from '../types'

const validateSceneEntityId = createDomainValidator('scene', 'useScene')

export function useScene(entityId: string): SceneState {
  const normalizedEntityId = validateSceneEntityId(entityId)
  const entity = useEntity<SceneAttributes>(normalizedEntityId)
  const { callService } = entity

  const activate = useCallback(async (transition?: number) => {
    const serviceData: Record<string, unknown> = {}

    if (transition !== undefined) {
      serviceData.transition = transition
    }

    await callService('scene', 'turn_on', serviceData)
  }, [callService])

  return {
    ...entity,
    activate,
  }
}
