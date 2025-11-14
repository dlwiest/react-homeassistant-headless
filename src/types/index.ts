export interface HAConfig {
  url: string
  token?: string
  authMode?: 'token' | 'oauth' | 'auto'
  redirectUri?: string
  mockMode?: boolean
  mockData?: Record<string, EntityState>
  options?: {
    reconnectInterval?: number
    reconnectAttempts?: number
    cacheTimeout?: number
    autoReconnect?: boolean
    serviceRetry?: {
      maxAttempts?: number
      baseDelay?: number
      exponentialBackoff?: boolean
      maxDelay?: number
    }
  }
}

export interface ConnectionStatus {
  connected: boolean
  connecting: boolean
  error: Error | null
  reconnect: () => void
  connectionState: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'
  retryCount: number
  nextRetryIn?: number
  isAutoRetrying: boolean
  lastConnectedAt?: Date
}

export interface EntityState<T = Record<string, unknown>> {
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

export interface BaseEntityHook<T = Record<string, unknown>> {
  entityId: string
  state: string
  attributes: T
  lastChanged: Date
  lastUpdated: Date
  isUnavailable: boolean
  isConnected: boolean
  error?: Error
  callService: (domain: string, service: string, data?: object) => Promise<void>
  callServiceWithResponse: <R = unknown>(domain: string, service: string, data?: object) => Promise<R>
  refresh: () => Promise<void>
}

// Light types
export type LightColorMode = 'onoff' | 'brightness' | 'color_temp' | 'hs' | 'xy' | 'rgb' | 'rgbw' | 'rgbww'

export interface LightAttributes {
  friendly_name?: string
  brightness?: number
  rgb_color?: [number, number, number]
  xy_color?: [number, number]
  hs_color?: [number, number]
  color_temp?: number
  color_temp_kelvin?: number
  min_mireds?: number
  max_mireds?: number
  min_color_temp_kelvin?: number
  max_color_temp_kelvin?: number
  effect?: string
  effect_list?: string[]
  supported_features?: number
  supported_color_modes?: LightColorMode[]
  color_mode?: LightColorMode
}

export interface LightTurnOnParams {
  brightness?: number
  color_temp?: number
  rgb_color?: [number, number, number]
  effect?: string
  transition?: number
}

export interface LightCapabilities {
  supportsBrightness: boolean
  supportsColorTemp: boolean
  supportsRgb: boolean
  supportsEffects: boolean
}

export interface LightState extends BaseEntityHook<LightAttributes>, LightCapabilities {
  isOn: boolean
  brightness: number
  brightnessPercent: number
  colorTemp?: number
  rgbColor?: [number, number, number]
  effect?: string
  availableEffects: string[]
  toggle: () => Promise<void>
  turnOn: (params?: LightTurnOnParams) => Promise<void>
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

// Binary Sensor types
export interface BinarySensorAttributes {
  friendly_name?: string
  device_class?: string
  icon?: string
}

export interface BinarySensorState extends BaseEntityHook<BinarySensorAttributes> {
  isOn: boolean
  isOff: boolean
  deviceClass?: string
  icon?: string
}

export interface TodoItem {
  uid: string
  summary: string
  status: 'needs_action' | 'completed'
  due?: string
  description?: string
}

export interface TodoAttributes {
  friendly_name?: string
  items?: TodoItem[]
  supported_features?: number
}

export interface TodoState extends BaseEntityHook<TodoAttributes> {
  itemCount: number
  items: TodoItem[]
  isLoadingItems?: boolean
  supportsAddItem: boolean
  supportsRemoveItem: boolean
  supportsUpdateItem: boolean
  supportsClearCompleted: boolean
  addItem: (summary: string) => Promise<void>
  removeItem: (uid: string) => Promise<void>
  updateItem: (uid: string, status: 'needs_action' | 'completed') => Promise<void>
  toggleItem: (uid: string) => Promise<void>
  clearCompleted: () => Promise<void>
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

export const TodoFeatures = {
  SUPPORT_ADD_ITEM: 1,
  SUPPORT_REMOVE_ITEM: 2,
  SUPPORT_UPDATE_ITEM: 4,
  SUPPORT_CLEAR_COMPLETED: 8,
} as const

// Media Player types
export interface MediaPlayerAttributes {
  friendly_name?: string
  volume_level?: number
  is_volume_muted?: boolean
  media_content_type?: string
  media_duration?: number
  media_position?: number
  media_position_updated_at?: string
  media_title?: string
  media_artist?: string
  media_album_name?: string
  media_album_artist?: string
  media_track?: number
  media_series_title?: string
  media_season?: string
  media_episode?: string
  media_channel?: string
  media_playlist?: string
  app_id?: string
  app_name?: string
  source?: string
  source_list?: string[]
  sound_mode?: string
  sound_mode_list?: string[]
  shuffle?: boolean
  repeat?: string
  supported_features?: number
  device_class?: string
}

export interface MediaPlayerCapabilities {
  supportsPlay: boolean
  supportsPause: boolean
  supportsStop: boolean
  supportsNextTrack: boolean
  supportsPreviousTrack: boolean
  supportsVolumeSet: boolean
  supportsVolumeMute: boolean
  supportsSeek: boolean
  supportsTurnOn: boolean
  supportsTurnOff: boolean
  supportsSelectSource: boolean
  supportsSelectSoundMode: boolean
  supportsShuffle: boolean
  supportsRepeat: boolean
}

export interface MediaPlayerState extends BaseEntityHook<MediaPlayerAttributes>, MediaPlayerCapabilities {
  isPlaying: boolean
  isPaused: boolean
  isIdle: boolean
  isOff: boolean
  isOn: boolean
  mediaTitle: string | null
  mediaArtist: string | null
  mediaAlbum: string | null
  mediaContentType: string | null
  mediaDuration: number | null
  mediaPosition: number | null
  volumeLevel: number
  isMuted: boolean
  currentSource: string | null
  sourceList: string[]
  appName: string | null
  currentSoundMode: string | null
  soundModeList: string[]
  shuffle: boolean | null
  repeat: string | null
  play: () => Promise<void>
  pause: () => Promise<void>
  stop: () => Promise<void>
  toggle: () => Promise<void>
  nextTrack: () => Promise<void>
  previousTrack: () => Promise<void>
  turnOn: () => Promise<void>
  turnOff: () => Promise<void>
  setVolume: (volume: number) => Promise<void>
  toggleMute: () => Promise<void>
  mute: () => Promise<void>
  unmute: () => Promise<void>
  selectSource: (source: string) => Promise<void>
  selectSoundMode: (soundMode: string) => Promise<void>
  setShuffle: (shuffle: boolean) => Promise<void>
  setRepeat: (repeat: string) => Promise<void>
  seek: (position: number) => Promise<void>
  playMedia: (mediaType: string, mediaId: string) => Promise<void>
}

export const MediaPlayerFeatures = {
  SUPPORT_PAUSE: 1,
  SUPPORT_SEEK: 2,
  SUPPORT_VOLUME_SET: 4,
  SUPPORT_VOLUME_MUTE: 8,
  SUPPORT_PREVIOUS_TRACK: 16,
  SUPPORT_NEXT_TRACK: 32,
  SUPPORT_TURN_ON: 128,
  SUPPORT_TURN_OFF: 256,
  SUPPORT_PLAY_MEDIA: 512,
  SUPPORT_VOLUME_STEP: 1024,
  SUPPORT_SELECT_SOURCE: 2048,
  SUPPORT_STOP: 4096,
  SUPPORT_CLEAR_PLAYLIST: 8192,
  SUPPORT_PLAY: 16384,
  SUPPORT_SHUFFLE_SET: 32768,
  SUPPORT_SELECT_SOUND_MODE: 65536,
  SUPPORT_BROWSE_MEDIA: 131072,
  SUPPORT_REPEAT_SET: 262144,
  SUPPORT_GROUPING: 524288,
} as const

// Camera types
export interface CameraAttributes {
  friendly_name?: string
  access_token?: string
  brand?: string
  model?: string
  motion_detection?: boolean
  entity_picture?: string
  supported_features?: number
}

export interface CameraCapabilities {
  supportsOnOff: boolean
  supportsStream: boolean
}

export interface CameraState extends BaseEntityHook<CameraAttributes>, CameraCapabilities {
  isOn: boolean
  isRecording: boolean
  isStreaming: boolean
  isIdle: boolean
  motionDetectionEnabled: boolean
  imageUrl: string | null
  accessToken?: string
  brand?: string
  model?: string
  turnOn: () => Promise<void>
  turnOff: () => Promise<void>
  enableMotionDetection: () => Promise<void>
  disableMotionDetection: () => Promise<void>
  snapshot: () => Promise<void>
  playStream: (mediaPlayer?: string) => Promise<void>
  record: (filename?: string, duration?: number) => Promise<void>
  refreshImage: () => Promise<void>
}

export const CameraFeatures = {
  SUPPORT_ON_OFF: 1,
  SUPPORT_STREAM: 2,
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
