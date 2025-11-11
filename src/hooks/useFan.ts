import { useCallback } from 'react'
import { z } from 'zod'
import { useEntity } from './useEntity'
import type { FanState, FanAttributes, FanTurnOnParams, FanDirection } from '../types'
import { FanFeatures } from '../types'
import { createDomainValidator } from '../utils/entityId'
import { checkFeatures } from '../utils/features'
import { FeatureNotSupportedError } from '../utils/errors'

const validateFanEntityId = createDomainValidator('fan', 'useFan')

const percentageSchema = z.number().int().min(0).max(100)
const presetModeSchema = z.string().min(1)
const directionSchema = z.enum(['forward', 'reverse'])
const oscillatingSchema = z.boolean()
const turnOnParamsSchema = z.object({
  percentage: percentageSchema.optional(),
  preset_mode: presetModeSchema.optional()
}).strict().optional()

export function useFan(entityId: string): FanState {
  const normalizedEntityId = validateFanEntityId(entityId)
  const entity = useEntity<FanAttributes>(normalizedEntityId)
  const { attributes, state, callService } = entity

  const features = checkFeatures(attributes.supported_features, {
    setSpeed: FanFeatures.SUPPORT_SET_SPEED,
    oscillate: FanFeatures.SUPPORT_OSCILLATE,
    direction: FanFeatures.SUPPORT_DIRECTION,
    presetMode: FanFeatures.SUPPORT_PRESET_MODE
  })
  
  const { setSpeed: supportsSetSpeed, oscillate: supportsOscillate, direction: supportsDirection, presetMode: supportsPresetMode } = features

  const availablePresetModes = attributes.preset_modes || []
  const isOn = state === 'on'
  const percentage = attributes.percentage || 0
  const presetMode = attributes.preset_mode
  const isOscillating = attributes.oscillating
  const direction = attributes.direction
  const toggle = useCallback(async () => {
    await callService('fan', 'toggle')
  }, [callService])
  
  const turnOff = useCallback(async () => {
    await callService('fan', 'turn_off')
  }, [callService])

  const turnOn = useCallback(
    async (params?: FanTurnOnParams) => {
      if (params) {
        turnOnParamsSchema.parse(params)
      }
      await callService('fan', 'turn_on', params)
    },
    [callService]
  )

  const setPercentage = useCallback(
    async (percentage: number) => {
      if (!supportsSetSpeed) {
        throw new FeatureNotSupportedError(normalizedEntityId, 'speed control')
      }
      
      percentageSchema.parse(percentage)
      await callService('fan', 'set_percentage', { percentage })
    },
    [callService, normalizedEntityId, supportsSetSpeed]
  )

  const setPresetMode = useCallback(
    async (preset: string) => {
      if (!supportsPresetMode) {
        throw new FeatureNotSupportedError(normalizedEntityId, 'preset modes')
      }
      
      presetModeSchema.parse(preset)
      
      if (!availablePresetModes.includes(preset)) {
        throw new Error(`Preset "${preset}" is not available for fan "${normalizedEntityId}". Available presets: ${availablePresetModes.join(', ')}`)
      }
      
      await callService('fan', 'set_preset_mode', { preset_mode: preset })
    },
    [callService, supportsPresetMode, normalizedEntityId, availablePresetModes]
  )

  const setOscillating = useCallback(
    async (oscillating: boolean) => {
      if (!supportsOscillate) {
        throw new FeatureNotSupportedError(normalizedEntityId, 'oscillation control')
      }
      
      oscillatingSchema.parse(oscillating)
      await callService('fan', 'oscillate', { oscillating })
    },
    [callService, normalizedEntityId, supportsOscillate]
  )

  const setDirection = useCallback(
    async (direction: FanDirection) => {
      if (!supportsDirection) {
        throw new FeatureNotSupportedError(normalizedEntityId, 'direction control')
      }
      
      directionSchema.parse(direction)
      await callService('fan', 'set_direction', { direction })
    },
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