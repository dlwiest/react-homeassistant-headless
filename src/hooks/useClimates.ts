import { useEntityList } from './useEntityList'
import type { ClimateAttributes } from '../types'
import type { EntityState } from '../types/core'

export type ClimateEntity = EntityState<ClimateAttributes>

export function useClimates(): ClimateEntity[] {
  return useEntityList<ClimateEntity>('climate')
}
