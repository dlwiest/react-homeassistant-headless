import { useCallback } from 'react'
import { useEntity } from './useEntity'
import type { ClimateState, ClimateAttributes } from '../types'
import { ClimateFeatures } from '../types'

function ensureClimateEntityId(entityId: string): string {
  return entityId.includes('.') ? entityId : `climate.${entityId}`
}

export function useClimate(entityId: string): ClimateState {
  const normalizedEntityId = ensureClimateEntityId(entityId)
  const entity = useEntity<ClimateAttributes>(normalizedEntityId)
  const { attributes, state, callService } = entity

  // Extract feature support
  const supportedFeatures = attributes.supported_features || 0
  const supportsTargetTemperature = (supportedFeatures & ClimateFeatures.SUPPORT_TARGET_TEMPERATURE) !== 0
  const supportsTargetTemperatureRange = (supportedFeatures & ClimateFeatures.SUPPORT_TARGET_TEMPERATURE_RANGE) !== 0
  const supportsFanMode = (supportedFeatures & ClimateFeatures.SUPPORT_FAN_MODE) !== 0
  const supportsPresetMode = (supportedFeatures & ClimateFeatures.SUPPORT_PRESET_MODE) !== 0

  // Actions
  const setMode = useCallback(
    async (mode: string) => {
      await callService('climate', 'set_hvac_mode', { hvac_mode: mode })
    },
    [callService]
  )

  const setTemperature = useCallback(
    async (temp: number) => {
      await callService('climate', 'set_temperature', { temperature: temp })
    },
    [callService]
  )

  const setTemperatureRange = useCallback(
    async (low: number, high: number) => {
      await callService('climate', 'set_temperature', {
        target_temp_low: low,
        target_temp_high: high,
      })
    },
    [callService]
  )

  const setFanMode = useCallback(
    async (mode: string) => {
      await callService('climate', 'set_fan_mode', { fan_mode: mode })
    },
    [callService]
  )

  const setPresetMode = useCallback(
    async (preset: string) => {
      await callService('climate', 'set_preset_mode', { preset_mode: preset })
    },
    [callService]
  )

  return {
    ...entity,
    currentTemperature: attributes.current_temperature,
    targetTemperature: attributes.temperature,
    targetTempHigh: attributes.target_temp_high,
    targetTempLow: attributes.target_temp_low,
    humidity: attributes.current_humidity,
    mode: attributes.hvac_mode || state,
    fanMode: attributes.fan_mode,
    presetMode: attributes.preset_mode,
    supportedModes: attributes.hvac_modes || [],
    supportedFanModes: attributes.fan_modes || [],
    supportedPresetModes: attributes.preset_modes || [],
    minTemp: attributes.min_temp || 60,
    maxTemp: attributes.max_temp || 90,
    supportsTargetTemperature,
    supportsTargetTemperatureRange,
    supportsFanMode,
    supportsPresetMode,
    setMode,
    setTemperature,
    setTemperatureRange,
    setFanMode,
    setPresetMode,
  }
}
