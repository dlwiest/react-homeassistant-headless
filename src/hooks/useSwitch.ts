import { useCallback } from 'react'
import { useEntity } from './useEntity'
import type { BaseEntityHook } from '../types'

function ensureSwitchEntityId(entityId: string): string {
  return entityId.includes('.') ? entityId : `switch.${entityId}`
}

export interface SwitchState extends BaseEntityHook {
  isOn: boolean
  toggle: () => Promise<void>
  turnOn: () => Promise<void>
  turnOff: () => Promise<void>
}

export function useSwitch(entityId: string): SwitchState {
  const normalizedEntityId = ensureSwitchEntityId(entityId)
  const entity = useEntity(normalizedEntityId)
  const { state, callService } = entity

  const isOn = state === 'on'

  const toggle = useCallback(async () => {
    await callService('switch', 'toggle')
  }, [callService])

  const turnOn = useCallback(async () => {
    await callService('switch', 'turn_on')
  }, [callService])

  const turnOff = useCallback(async () => {
    await callService('switch', 'turn_off')
  }, [callService])

  return {
    ...entity,
    isOn,
    toggle,
    turnOn,
    turnOff,
  }
}
