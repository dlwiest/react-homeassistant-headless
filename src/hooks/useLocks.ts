import { useEntityList } from './useEntityList'
import type { LockAttributes } from '../types'
import type { EntityState } from '../types/core'

export type LockEntity = EntityState<LockAttributes>

export function useLocks(): LockEntity[] {
  return useEntityList<LockEntity>('lock')
}
