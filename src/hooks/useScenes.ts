import { useEntityList } from './useEntityList'
import type { SceneAttributes } from '../types'
import type { EntityState } from '../types/core'

export type SceneEntity = EntityState<SceneAttributes>

export function useScenes(): SceneEntity[] {
  return useEntityList<SceneEntity>('scene')
}
