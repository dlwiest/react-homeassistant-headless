import { useEntityList } from './useEntityList'
import type { SensorAttributes } from '../types'
import type { EntityState } from '../types/core'

export interface SensorEntity extends EntityState<SensorAttributes> {}

export function useSensors(): SensorEntity[] {
  return useEntityList<SensorEntity>('sensor')
}
