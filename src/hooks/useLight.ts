import { useCallback } from 'react'
import { z } from 'zod'
import { useEntity } from './useEntity'
import type { LightState, LightAttributes, LightTurnOnParams } from '../types'
import { LightFeatures } from '../types'
import { createDomainValidator } from '../utils/entityId'
import { checkFeatures } from '../utils/features'
import { FeatureNotSupportedError } from '../utils/errors'

const validateLightEntityId = createDomainValidator('light', 'useLight')

const brightnessSchema = z.number().int().min(0).max(255)
const colorTempSchema = z.number().int().min(153).max(500)
const rgbColorSchema = z.array(z.number().int().min(0).max(255)).length(3)
const effectSchema = z.string().min(1)
const transitionSchema = z.number().min(0)
const turnOnParamsSchema = z.object({
  brightness: brightnessSchema.optional(),
  color_temp: colorTempSchema.optional(),
  rgb_color: rgbColorSchema.optional(),
  effect: effectSchema.optional(),
  transition: transitionSchema.optional()
}).strict()

export function useLight(entityId: string): LightState {
  const normalizedEntityId = validateLightEntityId(entityId)
  const entity = useEntity<LightAttributes>(normalizedEntityId)
  const { attributes, state, callService } = entity

  // Check both legacy supported_features and new supported_color_modes
  const legacyFeatures = checkFeatures(attributes.supported_features, {
    brightness: LightFeatures.SUPPORT_BRIGHTNESS,
    colorTemp: LightFeatures.SUPPORT_COLOR_TEMP,
    rgb: LightFeatures.SUPPORT_COLOR,
    effects: LightFeatures.SUPPORT_EFFECT
  })
  
  // Modern color mode detection
  const colorModes = attributes.supported_color_modes || []
  const supportsBrightness = legacyFeatures.brightness || attributes.brightness !== undefined
  const supportsColorTemp = legacyFeatures.colorTemp || colorModes.includes('color_temp')
  const supportsRgb = legacyFeatures.rgb || colorModes.includes('rgb') || colorModes.includes('xy') || colorModes.includes('hs')
  const supportsEffects = legacyFeatures.effects


  const isOn = state === 'on'
  const brightness = attributes.brightness || 0
  const brightnessPercent = Math.round((brightness / 255) * 100)
  const toggle = useCallback(async () => {
    await callService('light', 'toggle')
  }, [callService])
  
  const turnOff = useCallback(async () => {
    await callService('light', 'turn_off')
  }, [callService])

  const turnOn = useCallback(
    async (params?: LightTurnOnParams) => {
      if (params) {
        turnOnParamsSchema.parse(params)
      }
      await callService('light', 'turn_on', params)
    },
    [callService]
  )

  const setBrightness = useCallback(
    async (brightness: number) => {
      if (!supportsBrightness) {
        throw new FeatureNotSupportedError(normalizedEntityId, 'brightness control')
      }
      
      brightnessSchema.parse(brightness)
      await callService('light', 'turn_on', { brightness })
    },
    [callService, normalizedEntityId, supportsBrightness]
  )

  const setColorTemp = useCallback(
    async (temp: number) => {
      if (!supportsColorTemp) {
        throw new FeatureNotSupportedError(normalizedEntityId, 'color temperature control')
      }
      
      colorTempSchema.parse(temp)
      await callService('light', 'turn_on', { color_temp: temp })
    },
    [callService, normalizedEntityId, supportsColorTemp]
  )

  const setRgbColor = useCallback(
    async (rgb: [number, number, number]) => {
      if (!supportsRgb) {
        throw new FeatureNotSupportedError(normalizedEntityId, 'RGB color control')
      }
      
      rgbColorSchema.parse(rgb)
      await callService('light', 'turn_on', { rgb_color: rgb })
    },
    [callService, normalizedEntityId, supportsRgb]
  )

  const setEffect = useCallback(
    async (effect: string | null) => {
      if (!supportsEffects) {
        throw new FeatureNotSupportedError(normalizedEntityId, 'effects')
      }
      
      if (effect === null || effect === '') {
        // Clear effect using "off"
        await callService('light', 'turn_on', { effect: 'off' })
        return
      }
      
      effectSchema.parse(effect)
      const availableEffects = attributes.effect_list || []
      if (availableEffects.length > 0 && !availableEffects.includes(effect)) {
        console.warn(`Effect "${effect}" is not available for light "${normalizedEntityId}". Available effects: ${availableEffects.join(', ')}`)
      }
      
      await callService('light', 'turn_on', { effect })
    },
    [callService, normalizedEntityId, supportsEffects, attributes.effect_list]
  )

  // Validate color temperature to avoid infinity/invalid values
  const colorTemp = attributes.color_temp && 
    Number.isFinite(attributes.color_temp) && 
    attributes.color_temp > 0 
    ? attributes.color_temp 
    : undefined

  return {
    ...entity,
    isOn,
    brightness,
    brightnessPercent,
    colorTemp,
    rgbColor: attributes.rgb_color,
    effect: attributes.effect,
    supportsBrightness,
    supportsColorTemp,
    supportsRgb,
    supportsEffects,
    availableEffects: attributes.effect_list || [],
    toggle,
    turnOn,
    turnOff,
    setBrightness,
    setColorTemp,
    setRgbColor,
    setEffect,
  }
}
