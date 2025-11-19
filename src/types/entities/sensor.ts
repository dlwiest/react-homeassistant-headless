import type { BaseEntityHook } from '../core'

// Sensor types
export interface SensorAttributes {
  friendly_name?: string
  unit_of_measurement?: string
  device_class?: string
  state_class?: string
  icon?: string
}

export interface SensorState extends BaseEntityHook<SensorAttributes> {
  value?: string | number | null
  numericValue?: number | null
  unitOfMeasurement?: string
  deviceClass?: string
  stateClass?: string
  icon?: string
}
