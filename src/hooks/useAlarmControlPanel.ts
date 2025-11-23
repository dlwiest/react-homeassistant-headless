import { useCallback } from 'react'
import { z } from 'zod'
import { useEntity } from './useEntity'
import type { AlarmControlPanelState, AlarmControlPanelAttributes } from '../types'
import { AlarmControlPanelFeatures } from '../types'
import { createDomainValidator } from '../utils/entityId'
import { hasFeature } from '../utils/features'
import { FeatureNotSupportedError } from '../utils/errors'

const validateAlarmControlPanelEntityId = createDomainValidator('alarm_control_panel', 'useAlarmControlPanel')

// Service validations
const codeSchema = z.string().optional()

export function useAlarmControlPanel(entityId: string): AlarmControlPanelState {
  const normalizedEntityId = validateAlarmControlPanelEntityId(entityId)
  const entity = useEntity<AlarmControlPanelAttributes>(normalizedEntityId)
  const { attributes, state, callService } = entity

  // Extract feature support
  const supportsArmHome = hasFeature(attributes.supported_features, AlarmControlPanelFeatures.SUPPORT_ARM_HOME)
  const supportsArmAway = hasFeature(attributes.supported_features, AlarmControlPanelFeatures.SUPPORT_ARM_AWAY)
  const supportsArmNight = hasFeature(attributes.supported_features, AlarmControlPanelFeatures.SUPPORT_ARM_NIGHT)
  const supportsArmVacation = hasFeature(attributes.supported_features, AlarmControlPanelFeatures.SUPPORT_ARM_VACATION)
  const supportsArmCustomBypass = hasFeature(attributes.supported_features, AlarmControlPanelFeatures.SUPPORT_ARM_CUSTOM_BYPASS)
  const supportsTrigger = hasFeature(attributes.supported_features, AlarmControlPanelFeatures.SUPPORT_TRIGGER)

  // State helpers
  const isDisarmed = state === 'disarmed'
  const isArmedHome = state === 'armed_home'
  const isArmedAway = state === 'armed_away'
  const isArmedNight = state === 'armed_night'
  const isArmedVacation = state === 'armed_vacation'
  const isArmedCustomBypass = state === 'armed_custom_bypass'
  const isPending = state === 'pending'
  const isArming = state === 'arming'
  const isDisarming = state === 'disarming'
  const isTriggered = state === 'triggered'
  const changedBy = attributes.changed_by
  const codeFormat = attributes.code_format

  // Actions
  const disarm = useCallback(async (code?: string) => {
    if (code !== undefined) {
      codeSchema.parse(code)
    }
    const params = code ? { code } : undefined
    await callService('alarm_control_panel', 'alarm_disarm', params)
  }, [callService])

  const armHome = useCallback(async (code?: string) => {
    if (!supportsArmHome) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'arm home')
    }

    if (code !== undefined) {
      codeSchema.parse(code)
    }
    const params = code ? { code } : undefined
    await callService('alarm_control_panel', 'alarm_arm_home', params)
  }, [callService, normalizedEntityId, supportsArmHome])

  const armAway = useCallback(async (code?: string) => {
    if (!supportsArmAway) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'arm away')
    }

    if (code !== undefined) {
      codeSchema.parse(code)
    }
    const params = code ? { code } : undefined
    await callService('alarm_control_panel', 'alarm_arm_away', params)
  }, [callService, normalizedEntityId, supportsArmAway])

  const armNight = useCallback(async (code?: string) => {
    if (!supportsArmNight) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'arm night')
    }

    if (code !== undefined) {
      codeSchema.parse(code)
    }
    const params = code ? { code } : undefined
    await callService('alarm_control_panel', 'alarm_arm_night', params)
  }, [callService, normalizedEntityId, supportsArmNight])

  const armVacation = useCallback(async (code?: string) => {
    if (!supportsArmVacation) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'arm vacation')
    }

    if (code !== undefined) {
      codeSchema.parse(code)
    }
    const params = code ? { code } : undefined
    await callService('alarm_control_panel', 'alarm_arm_vacation', params)
  }, [callService, normalizedEntityId, supportsArmVacation])

  const armCustomBypass = useCallback(async (code?: string) => {
    if (!supportsArmCustomBypass) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'arm custom bypass')
    }

    if (code !== undefined) {
      codeSchema.parse(code)
    }
    const params = code ? { code } : undefined
    await callService('alarm_control_panel', 'alarm_arm_custom_bypass', params)
  }, [callService, normalizedEntityId, supportsArmCustomBypass])

  const trigger = useCallback(async () => {
    if (!supportsTrigger) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'trigger')
    }

    await callService('alarm_control_panel', 'alarm_trigger')
  }, [callService, normalizedEntityId, supportsTrigger])

  return {
    ...entity,
    isDisarmed,
    isArmedHome,
    isArmedAway,
    isArmedNight,
    isArmedVacation,
    isArmedCustomBypass,
    isPending,
    isArming,
    isDisarming,
    isTriggered,
    changedBy,
    codeFormat,
    supportsArmHome,
    supportsArmAway,
    supportsArmNight,
    supportsArmVacation,
    supportsArmCustomBypass,
    supportsTrigger,
    disarm,
    armHome,
    armAway,
    armNight,
    armVacation,
    armCustomBypass,
    trigger,
  }
}
