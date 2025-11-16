// Providers
export { HAProvider, useHAConnection } from './providers/HAProvider'

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
export { Light } from './components/Light'
export { Climate } from './components/Climate'
export { Sensor } from './components/Sensor'
export { BinarySensor } from './components/BinarySensor'
export { Todo } from './components/Todo'
export { Switch } from './components/Switch'
export { Cover } from './components/Cover'
export { Entity } from './components/Entity'
export { Fan } from './components/Fan'
export { Lock } from './components/Lock'
export { MediaPlayer } from './components/MediaPlayer'
export { Camera } from './components/Camera'
export type { StreamPlayerProps } from './components/Camera/StreamPlayer'
export type { ImageProps as CameraImageProps } from './components/Camera/Image'

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
export type { MediaPlayerState, MediaPlayerAttributes, MediaPlayerCapabilities, CameraState, CameraAttributes, CameraCapabilities, StreamState, StreamOptions, StreamType } from './types'

// Constants
export { LightFeatures, FanFeatures, ClimateFeatures, LockFeatures, TodoFeatures, MediaPlayerFeatures, CameraFeatures } from './types'


// Store (for advanced usage)
export { useStore, selectEntity } from './services/entityStore'
