import { useEntity } from './useEntity'
import type { BinarySensorState, BinarySensorAttributes } from '../types'
import { createDomainValidator } from '../utils/entityId'

const validateBinarySensorEntityId = createDomainValidator('binary_sensor', 'useBinarySensor')

export function useBinarySensor(entityId: string): BinarySensorState {
  const normalizedEntityId = validateBinarySensorEntityId(entityId)
  const entity = useEntity<BinarySensorAttributes>(normalizedEntityId)
  const { attributes, state } = entity

  const isOn = state === 'on'
  const isOff = state === 'off'

  return {
    ...entity,
    isOn,
    isOff,
    deviceClass: attributes.device_class,
    icon: attributes.icon,
  }
}