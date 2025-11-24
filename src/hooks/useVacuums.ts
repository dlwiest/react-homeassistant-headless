import { useEntityList } from './useEntityList'
import type { VacuumAttributes } from '../types'
import type { EntityState } from '../types/core'

export interface VacuumEntity extends EntityState<VacuumAttributes> {}

export function useVacuums(): VacuumEntity[] {
  return useEntityList<VacuumEntity>('vacuum')
}
