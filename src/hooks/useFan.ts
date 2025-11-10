import { useCallback } from 'react'
import { useEntity } from './useEntity'
import type { FanState, FanAttributes } from '../types'
import { FanFeatures } from '../types'
import { createDomainValidator } from '../utils/entityId'
import { checkFeatures } from '../utils/features'
import { createBasicControlDefs, createFeatureBasedControlDef } from '../utils/serviceHelpers'

const validateFanEntityId = createDomainValidator('fan', 'useFan')

export function useFan(entityId: string): FanState {
  const normalizedEntityId = validateFanEntityId(entityId)
  const entity = useEntity<FanAttributes>(normalizedEntityId)
  const { attributes, state, callService } = entity

  // Extract feature support
  const features = checkFeatures(attributes.supported_features, {
    setSpeed: FanFeatures.SUPPORT_SET_SPEED,
    oscillate: FanFeatures.SUPPORT_OSCILLATE,
    direction: FanFeatures.SUPPORT_DIRECTION,
    presetMode: FanFeatures.SUPPORT_PRESET_MODE
  })
  
  const { setSpeed: supportsSetSpeed, oscillate: supportsOscillate, direction: supportsDirection, presetMode: supportsPresetMode } = features

  // Available options
  const availablePresetModes = attributes.preset_modes || []

  // State helpers
  const isOn = state === 'on'
  const percentage = attributes.percentage || 0
  const presetMode = attributes.preset_mode
  const isOscillating = attributes.oscillating
  const direction = attributes.direction

  // Actions using service helpers
  const basicControls = createBasicControlDefs(callService, 'fan')
  
  const toggle = useCallback(basicControls.toggle, [callService])
  const turnOff = useCallback(basicControls.turnOff, [callService])

  const turnOn = useCallback(
    async (params?: { percentage?: number; preset_mode?: string }) => {
      await callService('fan', 'turn_on', params)
    },
    [callService]
  )

  const setPercentage = useCallback(
    createFeatureBasedControlDef(
      callService,
      'fan',
      {
        entityId: normalizedEntityId,
        isSupported: supportsSetSpeed,
        featureName: 'speed control',
        serviceName: 'set_percentage'
      },
      (percentage: number) => ({ percentage: Math.max(0, Math.min(100, percentage)) })
    ),
    [callService, normalizedEntityId, supportsSetSpeed]
  )

  const setPresetMode = useCallback(
    async (preset: string) => {
      if (!supportsPresetMode) {
        console.warn(`Fan "${normalizedEntityId}" does not support preset modes. Check the fan's supported_features.`)
        return
      }
      if (preset && preset !== '' && !availablePresetModes.includes(preset)) {
        console.warn(`Preset "${preset}" is not available for fan "${normalizedEntityId}". Available presets: ${availablePresetModes.join(', ')}`)
      }
      // Only set preset mode if a valid preset is provided
      if (preset && preset !== '') {
        await callService('fan', 'set_preset_mode', { preset_mode: preset })
      }
    },
    [callService, supportsPresetMode, normalizedEntityId, availablePresetModes]
  )

  const setOscillating = useCallback(
    createFeatureBasedControlDef(
      callService,
      'fan',
      {
        entityId: normalizedEntityId,
        isSupported: supportsOscillate,
        featureName: 'oscillation control',
        serviceName: 'oscillate'
      },
      (oscillating: boolean) => ({ oscillating })
    ),
    [callService, normalizedEntityId, supportsOscillate]
  )

  const setDirection = useCallback(
    createFeatureBasedControlDef(
      callService,
      'fan',
      {
        entityId: normalizedEntityId,
        isSupported: supportsDirection,
        featureName: 'direction control',
        serviceName: 'set_direction'
      },
      (direction: 'forward' | 'reverse') => ({ direction })
    ),
    [callService, normalizedEntityId, supportsDirection]
  )

  return {
    ...entity,
    isOn,
    percentage,
    presetMode,
    isOscillating,
    direction,
    supportsSetSpeed,
    supportsOscillate,
    supportsDirection,
    supportsPresetMode,
    availablePresetModes: attributes.preset_modes || [],
    toggle,
    turnOn,
    turnOff,
    setPercentage,
    setPresetMode,
    setOscillating,
    setDirection,
  }
}