import { useEntityList } from './useEntityList'
import type { EntityState } from '../types/core'

export type SwitchEntity = EntityState<{
  friendly_name?: string
}>

export function useSwitches(): SwitchEntity[] {
  return useEntityList<SwitchEntity>('switch')
}
