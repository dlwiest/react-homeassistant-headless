// Providers
export { default as HAProvider } from './providers/HAProvider'
export { useHAConnection } from './providers/HAProvider'

// Base hooks
export { useEntity } from './hooks/useEntity'
export { useEntityGroup } from './hooks/useEntityGroup'

// Entity-specific hooks
export { useLight } from './hooks/useLight'
export { useClimate } from './hooks/useClimate'
export { useSensor } from './hooks/useSensor'
export { useSwitch } from './hooks/useSwitch'
export { useCover } from './hooks/useCover'
export { useFan } from './hooks/useFan'

// Headless components
export { default as Light } from './components/Light'
export { default as Climate } from './components/Climate'
export { default as Sensor } from './components/Sensor'
export { default as Switch } from './components/Switch'
export { default as Entity } from './components/Entity'
export { default as Fan } from './components/Fan'

// Types
export type { EntityState, LightState, ClimateState, SensorState, FanState, HAConfig, ConnectionStatus, LightAttributes, ClimateAttributes, FanAttributes, BaseEntityHook } from './types'
export type { SwitchState } from './hooks/useSwitch'

// Utils
export { createMockProvider } from './utils/mock'

// Store (for advanced usage)
export { useStore, selectEntity } from './services/entityStore'
