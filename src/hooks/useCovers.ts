import { useEntityList } from './useEntityList'
import type { EntityState } from '../types/core'

export type CoverEntity = EntityState<{
  friendly_name?: string
  current_position?: number
  supported_features?: number
}>

export function useCovers(): CoverEntity[] {
  return useEntityList<CoverEntity>('cover')
}
