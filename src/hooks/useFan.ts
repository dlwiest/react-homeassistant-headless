import { useCallback } from 'react'
import { z } from 'zod'
import { useEntity } from './useEntity'
import type { FanState, FanAttributes } from '../types'
import { FanFeatures } from '../types'
import { createDomainValidator } from '../utils/entityId'
import { checkFeatures } from '../utils/features'

const validateFanEntityId = createDomainValidator('fan', 'useFan')

// Service validations
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

  // Actions with validation
  const toggle = useCallback(async () => {
    await callService('fan', 'toggle')
  }, [callService])
  
  const turnOff = useCallback(async () => {
    await callService('fan', 'turn_off')
  }, [callService])

  const turnOn = useCallback(
    async (params?: { percentage?: number; preset_mode?: string }) => {
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
        throw new Error(`Fan "${normalizedEntityId}" does not support speed control. Check the fan's supported_features.`)
      }
      
      percentageSchema.parse(percentage)
      await callService('fan', 'set_percentage', { percentage })
    },
    [callService, normalizedEntityId, supportsSetSpeed]
  )

  const setPresetMode = useCallback(
    async (preset: string) => {
      if (!supportsPresetMode) {
        throw new Error(`Fan "${normalizedEntityId}" does not support preset modes. Check the fan's supported_features.`)
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
        throw new Error(`Fan "${normalizedEntityId}" does not support oscillation control. Check the fan's supported_features.`)
      }
      
      oscillatingSchema.parse(oscillating)
      await callService('fan', 'oscillate', { oscillating })
    },
    [callService, normalizedEntityId, supportsOscillate]
  )

  const setDirection = useCallback(
    async (direction: 'forward' | 'reverse') => {
      if (!supportsDirection) {
        throw new Error(`Fan "${normalizedEntityId}" does not support direction control. Check the fan's supported_features.`)
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