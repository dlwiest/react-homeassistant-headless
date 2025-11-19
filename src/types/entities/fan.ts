import type { BaseEntityHook } from '../core'

// Fan types
export interface FanAttributes {
  friendly_name?: string
  percentage?: number
  preset_modes?: string[]
  preset_mode?: string
  oscillating?: boolean
  direction?: 'forward' | 'reverse'
  supported_features?: number
  percentage_step?: number
}

export type FanDirection = 'forward' | 'reverse'

export interface FanTurnOnParams {
  percentage?: number
  preset_mode?: string
}

export interface FanState extends BaseEntityHook<FanAttributes> {
  isOn: boolean
  percentage: number
  presetMode?: string
  isOscillating?: boolean
  direction?: FanDirection
  supportsSetSpeed: boolean
  supportsOscillate: boolean
  supportsDirection: boolean
  supportsPresetMode: boolean
  availablePresetModes: string[]
  toggle: () => Promise<void>
  turnOn: (params?: FanTurnOnParams) => Promise<void>
  turnOff: () => Promise<void>
  setPercentage: (percentage: number) => Promise<void>
  setPresetMode: (preset: string) => Promise<void>
  setOscillating: (oscillating: boolean) => Promise<void>
  setDirection: (direction: FanDirection) => Promise<void>
}

export const FanFeatures = {
  SUPPORT_SET_SPEED: 1,
  SUPPORT_OSCILLATE: 2,
  SUPPORT_DIRECTION: 4,
  SUPPORT_PRESET_MODE: 8,
} as const
