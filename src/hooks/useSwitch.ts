import { useCallback } from 'react'
import { useEntity } from './useEntity'
import type { BaseEntityHook } from '../types'
import { createDomainValidator } from '../utils/entityId'
import { createBasicControlDefs } from '../utils/serviceHelpers'

const validateSwitchEntityId = createDomainValidator('switch', 'useSwitch')

export interface SwitchState extends BaseEntityHook {
  isOn: boolean
  toggle: () => Promise<void>
  turnOn: () => Promise<void>
  turnOff: () => Promise<void>
}

export function useSwitch(entityId: string): SwitchState {
  const normalizedEntityId = validateSwitchEntityId(entityId)
  const entity = useEntity(normalizedEntityId)
  const { state, callService } = entity

  const isOn = state === 'on'

  // Actions using service helpers
  const basicControls = createBasicControlDefs(callService, 'switch')
  
  const toggle = useCallback(basicControls.toggle, [callService])
  const turnOn = useCallback(basicControls.turnOnSimple, [callService])
  const turnOff = useCallback(basicControls.turnOff, [callService])

  return {
    ...entity,
    isOn,
    toggle,
    turnOn,
    turnOff,
  }
}
