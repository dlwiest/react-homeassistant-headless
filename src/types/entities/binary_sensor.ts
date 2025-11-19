import type { BaseEntityHook } from '../core'

// Binary Sensor types
export interface BinarySensorAttributes {
  friendly_name?: string
  device_class?: string
  icon?: string
}

export interface BinarySensorState extends BaseEntityHook<BinarySensorAttributes> {
  isOn: boolean
  isOff: boolean
  deviceClass?: string
  icon?: string
}
