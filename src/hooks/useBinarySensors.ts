import { useEntityList } from './useEntityList'
import type { BinarySensorAttributes } from '../types'
import type { EntityState } from '../types/core'

export type BinarySensorEntity = EntityState<BinarySensorAttributes>

export function useBinarySensors(): BinarySensorEntity[] {
  return useEntityList<BinarySensorEntity>('binary_sensor')
}
