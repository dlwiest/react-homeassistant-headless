import { useCallback } from 'react'
import { useEntity } from './useEntity'
import type { LightState, LightAttributes } from '../types'
import { LightFeatures } from '../types'
import { createDomainValidator } from '../utils/entityId'
import { checkFeatures } from '../utils/features'
import { createBasicControlDefs, createFeatureBasedControlDef } from '../utils/serviceHelpers'
import { FeatureNotSupportedError } from '../utils/errors'

const validateLightEntityId = createDomainValidator('light', 'useLight')

export function useLight(entityId: string): LightState {
  const normalizedEntityId = validateLightEntityId(entityId)
  const entity = useEntity<LightAttributes>(normalizedEntityId)
  const { attributes, state, callService } = entity

  // Extract feature support
  const features = checkFeatures(attributes.supported_features, {
    brightness: LightFeatures.SUPPORT_BRIGHTNESS,
    colorTemp: LightFeatures.SUPPORT_COLOR_TEMP,
    rgb: LightFeatures.SUPPORT_COLOR,
    effects: LightFeatures.SUPPORT_EFFECT
  })
  
  const { brightness: supportsBrightness, colorTemp: supportsColorTemp, rgb: supportsRgb, effects: supportsEffects } = features


  // State helpers
  const isOn = state === 'on'
  const brightness = attributes.brightness || 0
  const brightnessPercent = Math.round((brightness / 255) * 100)

  // Actions using service helpers
  const basicControls = createBasicControlDefs(callService, 'light')
  
  const toggle = useCallback(basicControls.toggle, [callService])
  const turnOff = useCallback(basicControls.turnOff, [callService])

  const turnOn = useCallback(
    async (params?: { brightness?: number; rgb_color?: [number, number, number]; color_temp?: number; effect?: string }) => {
      await callService('light', 'turn_on', params)
    },
    [callService]
  )

  const setBrightness = useCallback(
    createFeatureBasedControlDef(
      callService,
      'light',
      {
        entityId: normalizedEntityId,
        isSupported: supportsBrightness,
        featureName: 'brightness control',
        serviceName: 'turn_on'
      },
      (brightness: number) => ({ brightness: Math.max(0, Math.min(255, brightness)) })
    ),
    [callService, normalizedEntityId, supportsBrightness]
  )

  const setColorTemp = useCallback(
    createFeatureBasedControlDef(
      callService,
      'light',
      {
        entityId: normalizedEntityId,
        isSupported: supportsColorTemp,
        featureName: 'color temperature control',
        serviceName: 'turn_on'
      },
      (temp: number) => ({ color_temp: temp })
    ),
    [callService, normalizedEntityId, supportsColorTemp]
  )

  const setRgbColor = useCallback(
    createFeatureBasedControlDef(
      callService,
      'light',
      {
        entityId: normalizedEntityId,
        isSupported: supportsRgb,
        featureName: 'RGB color control',
        serviceName: 'turn_on'
      },
      (rgb: [number, number, number]) => ({ rgb_color: rgb })
    ),
    [callService, normalizedEntityId, supportsRgb]
  )

  const setEffect = useCallback(
    async (effect: string | null) => {
      if (!supportsEffects) {
        throw new FeatureNotSupportedError(normalizedEntityId, 'effects')
      }
      
      if (effect === null || effect === '') {
        // To clear effect, use "off" (standard for Hue lights in newer HA versions)
        await callService('light', 'turn_on', { effect: 'off' })
        return
      }
      
      // Validate effect is in available list
      const availableEffects = attributes.effect_list || []
      if (availableEffects.length > 0 && !availableEffects.includes(effect)) {
        console.warn(`Effect "${effect}" is not available for light "${normalizedEntityId}". Available effects: ${availableEffects.join(', ')}`)
      }
      
      await callService('light', 'turn_on', { effect })
    },
    [callService, normalizedEntityId, supportsEffects, attributes.effect_list]
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
