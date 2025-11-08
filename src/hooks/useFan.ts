import { useCallback } from 'react'
import { useEntity } from './useEntity'
import type { FanState, FanAttributes } from '../types'
import { FanFeatures } from '../types'

function ensureFanEntityId(entityId: string): string {
  return entityId.includes('.') ? entityId : `fan.${entityId}`
}

export function useFan(entityId: string): FanState {
  const normalizedEntityId = ensureFanEntityId(entityId)
  const entity = useEntity<FanAttributes>(normalizedEntityId)
  const { attributes, state, callService } = entity

  // Extract feature support
  const supportedFeatures = attributes.supported_features || 0
  const supportsSetSpeed = (supportedFeatures & FanFeatures.SUPPORT_SET_SPEED) !== 0
  const supportsOscillate = (supportedFeatures & FanFeatures.SUPPORT_OSCILLATE) !== 0
  const supportsDirection = (supportedFeatures & FanFeatures.SUPPORT_DIRECTION) !== 0
  const supportsPresetMode = (supportedFeatures & FanFeatures.SUPPORT_PRESET_MODE) !== 0

  // State helpers
  const isOn = state === 'on'
  const percentage = attributes.percentage || 0
  const presetMode = attributes.preset_mode
  const isOscillating = attributes.oscillating
  const direction = attributes.direction

  // Actions
  const toggle = useCallback(async () => {
    await callService('fan', 'toggle')
  }, [callService])

  const turnOn = useCallback(
    async (params?: { percentage?: number; preset_mode?: string }) => {
      await callService('fan', 'turn_on', params)
    },
    [callService]
  )

  const turnOff = useCallback(async () => {
    await callService('fan', 'turn_off')
  }, [callService])

  const setPercentage = useCallback(
    async (newPercentage: number) => {
      const clampedPercentage = Math.max(0, Math.min(100, newPercentage))
      await callService('fan', 'set_percentage', { percentage: clampedPercentage })
    },
    [callService]
  )

  const setPresetMode = useCallback(
    async (preset: string) => {
      // Only set preset mode if a valid preset is provided
      if (preset && preset !== '') {
        await callService('fan', 'set_preset_mode', { preset_mode: preset })
      }
    },
    [callService]
  )

  const setOscillating = useCallback(
    async (oscillating: boolean) => {
      await callService('fan', 'oscillate', { oscillating })
    },
    [callService]
  )

  const setDirection = useCallback(
    async (newDirection: 'forward' | 'reverse') => {
      await callService('fan', 'set_direction', { direction: newDirection })
    },
    [callService]
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