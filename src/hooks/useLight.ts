import { useCallback } from 'react'
import { useEntity } from './useEntity'
import type { LightState, LightAttributes } from '../types'
import { LightFeatures } from '../types'

function ensureLightEntityId(entityId: string): string {
  if (entityId.includes('.') && !entityId.startsWith('light.')) {
    const [domain] = entityId.split('.')
    console.warn(`useLight: Entity "${entityId}" has domain "${domain}" but useLight expects "light" domain. This may not work as expected. Use useEntity() or the appropriate domain-specific hook instead.`)
  }
  return entityId.includes('.') ? entityId : `light.${entityId}`
}

export function useLight(entityId: string): LightState {
  const normalizedEntityId = ensureLightEntityId(entityId)
  const entity = useEntity<LightAttributes>(normalizedEntityId)
  const { attributes, state, callService } = entity

  // Extract feature support
  const supportedFeatures = attributes.supported_features || 0
  const supportsBrightness = (supportedFeatures & LightFeatures.SUPPORT_BRIGHTNESS) !== 0
  const supportsColorTemp = (supportedFeatures & LightFeatures.SUPPORT_COLOR_TEMP) !== 0
  const supportsRgb = (supportedFeatures & LightFeatures.SUPPORT_COLOR) !== 0
  const supportsEffects = (supportedFeatures & LightFeatures.SUPPORT_EFFECT) !== 0

  // Available options
  const availableEffects = attributes.effect_list || []

  // State helpers
  const isOn = state === 'on'
  const brightness = attributes.brightness || 0
  const brightnessPercent = Math.round((brightness / 255) * 100)

  // Actions
  const toggle = useCallback(async () => {
    await callService('light', 'toggle')
  }, [callService])

  const turnOn = useCallback(
    async (params?: { brightness?: number; rgb_color?: [number, number, number]; color_temp?: number; effect?: string }) => {
      await callService('light', 'turn_on', params)
    },
    [callService]
  )

  const turnOff = useCallback(async () => {
    await callService('light', 'turn_off')
  }, [callService])

  const setBrightness = useCallback(
    async (newBrightness: number) => {
      if (!supportsBrightness) {
        console.warn(`Light "${normalizedEntityId}" does not support brightness control. Check the light's supported_features.`)
        return
      }
      await turnOn({ brightness: Math.max(0, Math.min(255, newBrightness)) })
    },
    [turnOn, supportsBrightness, normalizedEntityId]
  )

  const setColorTemp = useCallback(
    async (temp: number) => {
      if (!supportsColorTemp) {
        console.warn(`Light "${normalizedEntityId}" does not support color temperature control. Check the light's supported_features.`)
        return
      }
      await turnOn({ color_temp: temp })
    },
    [turnOn, supportsColorTemp, normalizedEntityId]
  )

  const setRgbColor = useCallback(
    async (rgb: [number, number, number]) => {
      if (!supportsRgb) {
        console.warn(`Light "${normalizedEntityId}" does not support RGB color control. Check the light's supported_features.`)
        return
      }
      await turnOn({ rgb_color: rgb })
    },
    [turnOn, supportsRgb, normalizedEntityId]
  )

  const setEffect = useCallback(
    async (effect: string | null) => {
      if (!supportsEffects) {
        console.warn(`Light "${normalizedEntityId}" does not support effects. Check the light's supported_features.`)
        return
      }
      if (effect && effect !== '' && !availableEffects.includes(effect)) {
        console.warn(`Effect "${effect}" is not available for light "${normalizedEntityId}". Available effects: ${availableEffects.join(', ')}`)
      }
      if (effect === null || effect === '') {
        // To clear effect, use "off" (standard for Hue lights in newer HA versions)
        await turnOn({ effect: 'off' })
      } else {
        await turnOn({ effect })
      }
    },
    [turnOn, supportsEffects, normalizedEntityId, availableEffects]
  )

  return {
    ...entity,
    isOn,
    brightness,
    brightnessPercent,
    colorTemp: attributes.color_temp,
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
