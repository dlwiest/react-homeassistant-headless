import { useEntityList } from './useEntityList'
import type { NumberAttributes } from '../types'
import type { EntityState } from '../types/core'

export type NumberEntity = EntityState<NumberAttributes>

export function useNumbers(): NumberEntity[] {
  return useEntityList<NumberEntity>('number')
}
