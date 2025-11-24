import { useEntityList } from './useEntityList'
import type { FanAttributes } from '../types'
import type { EntityState } from '../types/core'

export interface FanEntity extends EntityState<FanAttributes> {}

export function useFans(): FanEntity[] {
  return useEntityList<FanEntity>('fan')
}
