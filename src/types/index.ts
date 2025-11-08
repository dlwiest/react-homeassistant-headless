export interface HAConfig {
  url: string
  token?: string
  mockMode?: boolean
  mockData?: Record<string, EntityState>
  options?: {
    reconnectInterval?: number
    reconnectAttempts?: number
    cacheTimeout?: number
    autoReconnect?: boolean
  }
}

export interface ConnectionStatus {
  connected: boolean
  connecting: boolean
  error: Error | null
  reconnect: () => void
}

export interface EntityState<T = Record<string, any>> {
  entity_id: string
  state: string
  attributes: T
  last_changed: string
  last_updated: string
  context: {
    id: string
    parent_id: string | null
    user_id: string | null
  }
}

export interface BaseEntityHook<T = Record<string, any>> {
  entityId: string
  state: string
  attributes: T
  lastChanged: Date
  lastUpdated: Date
  isUnavailable: boolean
  isConnected: boolean
  error?: Error
  callService: (domain: string, service: string, data?: object) => Promise<void>
  refresh: () => Promise<void>
}

// Light types
export interface LightAttributes {
  friendly_name?: string
  brightness?: number
  rgb_color?: [number, number, number]
  color_temp?: number
  effect?: string
  effect_list?: string[]
  supported_features?: number
  supported_color_modes?: string[]
  color_mode?: string
}

export interface LightState extends BaseEntityHook<LightAttributes> {
  isOn: boolean
  brightness: number
  brightnessPercent: number
  colorTemp?: number
  rgbColor?: [number, number, number]
  effect?: string
  supportsBrightness: boolean
  supportsColorTemp: boolean
  supportsRgb: boolean
  supportsEffects: boolean
  availableEffects: string[]
  toggle: () => Promise<void>
  turnOn: (params?: { brightness?: number; rgb_color?: [number, number, number]; color_temp?: number; effect?: string }) => Promise<void>
  turnOff: () => Promise<void>
  setBrightness: (brightness: number) => Promise<void>
  setColorTemp: (temp: number) => Promise<void>
  setRgbColor: (rgb: [number, number, number]) => Promise<void>
  setEffect: (effect: string | null) => Promise<void>
}

// Climate types
export interface ClimateAttributes {
  friendly_name?: string
  temperature?: number
  current_temperature?: number
  target_temp_high?: number
  target_temp_low?: number
  humidity?: number
  current_humidity?: number
  hvac_modes?: string[]
  hvac_mode?: string
  fan_modes?: string[]
  fan_mode?: string
  preset_modes?: string[]
  preset_mode?: string
  min_temp?: number
  max_temp?: number
  supported_features?: number
}

export interface ClimateState extends BaseEntityHook<ClimateAttributes> {
  currentTemperature?: number
  targetTemperature?: number
  targetTempHigh?: number
  targetTempLow?: number
  humidity?: number
  mode: string
  fanMode?: string
  presetMode?: string
  supportedModes: string[]
  supportedFanModes: string[]
  supportedPresetModes: string[]
  minTemp: number
  maxTemp: number
  supportsTargetTemperature: boolean
  supportsTargetTemperatureRange: boolean
  supportsFanMode: boolean
  supportsPresetMode: boolean
  setMode: (mode: string) => Promise<void>
  setTemperature: (temp: number) => Promise<void>
  setTemperatureRange: (low: number, high: number) => Promise<void>
  setFanMode: (mode: string) => Promise<void>
  setPresetMode: (preset: string) => Promise<void>
}

// Sensor types
export interface SensorAttributes {
  friendly_name?: string
  unit_of_measurement?: string
  device_class?: string
  state_class?: string
  icon?: string
}

export interface SensorState extends BaseEntityHook<SensorAttributes> {
  value?: string | number | null
  numericValue?: number | null
  unitOfMeasurement?: string
  deviceClass?: string
  stateClass?: string
  icon?: string
}

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

export interface FanState extends BaseEntityHook<FanAttributes> {
  isOn: boolean
  percentage: number
  presetMode?: string
  isOscillating?: boolean
  direction?: 'forward' | 'reverse'
  supportsSetSpeed: boolean
  supportsOscillate: boolean
  supportsDirection: boolean
  supportsPresetMode: boolean
  availablePresetModes: string[]
  toggle: () => Promise<void>
  turnOn: (params?: { percentage?: number; preset_mode?: string }) => Promise<void>
  turnOff: () => Promise<void>
  setPercentage: (percentage: number) => Promise<void>
  setPresetMode: (preset: string) => Promise<void>
  setOscillating: (oscillating: boolean) => Promise<void>
  setDirection: (direction: 'forward' | 'reverse') => Promise<void>
}

// Lock types
export interface LockAttributes {
  friendly_name?: string
  supported_features?: number
  code_format?: string
  changed_by?: string
  code_arm_required?: boolean
}

export interface LockState extends BaseEntityHook<LockAttributes> {
  isLocked: boolean
  isUnlocked: boolean
  isUnknown: boolean
  changedBy?: string
  supportsOpen: boolean
  lock: () => Promise<void>
  unlock: (code?: string) => Promise<void>
  open: (code?: string) => Promise<void>
}

// Feature flags for supported features
export const LightFeatures = {
  SUPPORT_BRIGHTNESS: 1,
  SUPPORT_COLOR_TEMP: 2,
  SUPPORT_EFFECT: 4,
  SUPPORT_FLASH: 8,
  SUPPORT_COLOR: 16,
  SUPPORT_TRANSITION: 32,
  SUPPORT_WHITE_VALUE: 128,
} as const

export const ClimateFeatures = {
  SUPPORT_TARGET_TEMPERATURE: 1,
  SUPPORT_TARGET_TEMPERATURE_RANGE: 2,
  SUPPORT_TARGET_HUMIDITY: 4,
  SUPPORT_FAN_MODE: 8,
  SUPPORT_PRESET_MODE: 16,
  SUPPORT_SWING_MODE: 32,
  SUPPORT_AUX_HEAT: 64,
} as const

export const FanFeatures = {
  SUPPORT_SET_SPEED: 1,
  SUPPORT_OSCILLATE: 2,
  SUPPORT_DIRECTION: 4,
  SUPPORT_PRESET_MODE: 8,
} as const

export const LockFeatures = {
  SUPPORT_OPEN: 1,
} as const

// WebSocket event types
export interface StateChangedEvent {
  event_type: 'state_changed'
  data: {
    entity_id: string
    old_state: EntityState | null
    new_state: EntityState
  }
}
