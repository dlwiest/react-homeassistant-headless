import { useEntityList } from './useEntityList'
import type { SensorAttributes } from '../types'
import type { EntityState } from '../types/core'

export type SensorEntity = EntityState<SensorAttributes>

export function useSensors(): SensorEntity[] {
  return useEntityList<SensorEntity>('sensor')
}
