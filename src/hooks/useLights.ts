import { useEntityList } from './useEntityList'
import type { LightAttributes } from '../types'
import type { EntityState } from '../types/core'

export interface LightEntity extends EntityState<LightAttributes> {}

export function useLights(): LightEntity[] {
  return useEntityList<LightEntity>('light')
}
