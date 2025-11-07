import { useCallback } from 'react'
import { useEntity } from './useEntity'
import type { LightState, LightAttributes } from '../types'
import { LightFeatures } from '../types'

function ensureLightEntityId(entityId: string): string {
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
      await turnOn({ brightness: Math.max(0, Math.min(255, newBrightness)) })
    },
    [turnOn]
  )

  const setColorTemp = useCallback(
    async (temp: number) => {
      await turnOn({ color_temp: temp })
    },
    [turnOn]
  )

  const setRgbColor = useCallback(
    async (rgb: [number, number, number]) => {
      await turnOn({ rgb_color: rgb })
    },
    [turnOn]
  )

  const setEffect = useCallback(
    async (effect: string | null) => {
      if (effect === null || effect === '') {
        // To clear effect, use "off" (standard for Hue lights in newer HA versions)
        await turnOn({ effect: 'off' })
      } else {
        await turnOn({ effect })
      }
    },
    [turnOn]
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
