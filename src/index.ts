// Providers
export { default as HAProvider } from './providers/HAProvider'
export { useHAConnection } from './providers/HAProvider'

// Auth
export { useAuth } from './hooks/useAuth'

// Base hooks
export { useEntity } from './hooks/useEntity'
export { useEntityGroup } from './hooks/useEntityGroup'

// Entity-specific hooks
export { useLight } from './hooks/useLight'
export { useClimate } from './hooks/useClimate'
export { useSensor } from './hooks/useSensor'
export { useBinarySensor } from './hooks/useBinarySensor'
export { useTodo } from './hooks/useTodo'
export { useSwitch } from './hooks/useSwitch'
export { useCover } from './hooks/useCover'
export { useFan } from './hooks/useFan'
export { useLock } from './hooks/useLock'
export { useMediaPlayer } from './hooks/useMediaPlayer'
export { useCamera } from './hooks/useCamera'

// Headless components
export { default as Light } from './components/Light'
export { default as Climate } from './components/Climate'
export { default as Sensor } from './components/Sensor'
export { default as BinarySensor } from './components/BinarySensor'
export { Todo } from './components/Todo'
export { default as Switch } from './components/Switch'
export { default as Cover } from './components/Cover'
export { default as Entity } from './components/Entity'
export { default as Fan } from './components/Fan'
export { default as Lock } from './components/Lock'
export { MediaPlayer } from './components/MediaPlayer'
export { default as Camera } from './components/Camera'

// Types
export type { 
  EntityState, 
  LightState, 
  LightAttributes,
  LightColorMode,
  LightCapabilities,
  LightTurnOnParams,
  ClimateState, 
  ClimateAttributes,
  SensorState, 
  SensorAttributes,
  BinarySensorState, 
  BinarySensorAttributes,
  TodoState,
  TodoAttributes,
  TodoItem,
  FanState, 
  FanAttributes,
  FanTurnOnParams,
  FanDirection,
  LockState, 
  LockAttributes,
  HAConfig, 
  ConnectionStatus, 
  BaseEntityHook
} from './types'
export type {
  AuthState,
  AuthError,
  AuthConfig,
  StoredAuthData
} from './types/auth'
export type { SwitchState } from './hooks/useSwitch'
export type { CoverState } from './hooks/useCover'
export type { MediaPlayerState, MediaPlayerAttributes, MediaPlayerCapabilities, CameraState, CameraAttributes, CameraCapabilities } from './types'

// Constants
export { LightFeatures, FanFeatures, ClimateFeatures, LockFeatures, TodoFeatures, MediaPlayerFeatures, CameraFeatures } from './types'


// Store (for advanced usage)
export { useStore, selectEntity } from './services/entityStore'
