# react-homeassistant-headless

[![npm version](https://badge.fury.io/js/@dlwiest%2Freact-homeassistant-headless.svg)](https://badge.fury.io/js/@dlwiest%2Freact-homeassistant-headless)
[![npm downloads](https://img.shields.io/npm/dm/@dlwiest/react-homeassistant-headless.svg)](https://www.npmjs.com/package/@dlwiest/react-homeassistant-headless)

> Headless React hooks and components for building custom Home Assistant dashboards

This library handles WebSocket connections, entity subscriptions, and state management for Home Assistant so you can focus on building the UI you want. Use any component library, styling approach, or UI framework - build your own custom design without the library getting in your way.

## Features

- **Full TypeScript support** - Complete type definitions for all entities and their properties
- **Automatic reconnection** - Handles connection drops and network issues transparently
- **Developer-friendly warnings** - Helpful console messages for common configuration issues
- **Entity ID shortcuts** - Automatically adds domain prefixes (e.g., `light.` for lights) when missing
- **Mock mode** - Develop and test without a real Home Assistant instance
- **No UI constraints** - Works with any React setup, styling, or component library

## Installation

```bash
npm install @dlwiest/react-homeassistant-headless
```

## Quick Example

```jsx
import { HAProvider, Light } from '@dlwiest/react-homeassistant-headless'

function App() {
  return (
    <HAProvider url="ws://homeassistant.local:8123" token="your-long-lived-access-token">
      <Light entityId="light.living_room">
        {({ isOn, brightness, toggle, setBrightness }) => (
          <div>
            <h3>Living Room Light</h3>
            <button onClick={toggle}>
              {isOn ? '💡 ON' : '⚫ OFF'}
            </button>
            {isOn && (
              <input
                type="range"
                min="0"
                max="255"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
              />
            )}
          </div>
        )}
      </Light>
    </HAProvider>
  )
}
```

## Examples

Three complete dashboard examples showing different UI approaches:
- **[Vanilla React](./examples/vanilla-dashboard)** - Custom CSS
- **[shadcn/ui](./examples/shadcn-dashboard)** - Tailwind + Radix UI components  
- **[Material-UI](./examples/mui-dashboard)** - Material Design


## Supported Entities

### Lights
```jsx
<Light entityId="light.living_room">
  {({ 
    isOn, brightness, rgbColor, effect,
    supportsBrightness, supportsColor, supportsEffects,
    toggle, setBrightness, setRgbColor, setEffect
  }) => (
    // Your light controls
  )}
</Light>
```

### Climate
```jsx
<Climate entityId="climate.thermostat">
  {({ 
    currentTemperature, targetTemperature, mode,
    setMode, setTemperature
  }) => (
    // Your thermostat interface
  )}
</Climate>
```

### Switches
```jsx
<Switch entityId="switch.coffee_maker">
  {({ isOn, toggle }) => (
    // Your switch controls
  )}
</Switch>
```

### Sensors
```jsx
<Sensor entityId="sensor.temperature">
  {({ value, numericValue, unitOfMeasurement, deviceClass }) => (
    // Your sensor display
  )}
</Sensor>
```

### Covers
```jsx
<Cover entityId="cover.garage_door">
  {({ 
    isOpen, isClosed, position,
    open, close, setPosition
  }) => (
    // Your cover controls
  )}
</Cover>
```

### Locks
```jsx
<Lock entityId="lock.front_door">
  {({ 
    isLocked, isUnlocked, isLocking, isUnlocking, isJammed,
    lock, unlock
  }) => (
    // Your lock controls
  )}
</Lock>
```

## Using Hooks Directly

If you prefer hooks over render props:

```jsx
import { useLight, useClimate } from '@dlwiest/react-homeassistant-headless'

function MyComponent() {
  const light = useLight('light.living_room')
  const thermostat = useClimate('climate.main_floor')
  
  return (
    <div>
      <button onClick={light.toggle}>
        Light: {light.isOn ? 'ON' : 'OFF'}
      </button>
      <div>
        Temperature: {thermostat.currentTemperature}°
      </div>
    </div>
  )
}
```

## Entity Groups

Work with multiple entities:

```jsx
import { useEntityGroup } from '@dlwiest/react-homeassistant-headless'

function AllLights() {
  const lights = useEntityGroup(['light.living_room', 'light.kitchen', 'light.bedroom'])
  
  return (
    <div>
      {lights.map(light => (
        <div key={light.entityId}>
          {light.entityId}: {light.state}
        </div>
      ))}
    </div>
  )
}
```

## Configuration

```jsx
<HAProvider url="ws://homeassistant.local:8123" token="your-token">
  <YourApp />
</HAProvider>
```

Connection options and status monitoring:
```jsx
<HAProvider
  url="ws://homeassistant.local:8123"
  token="your-token"
  options={{
    reconnectInterval: 5000,
    reconnectAttempts: 10,
    autoReconnect: true
  }}
/>

// Monitor connection status
const { connected, connecting, error, reconnect } = useHAConnection()
```


## API Reference

### Light Control (Detailed Example)

```jsx
<Light entityId="living_room_light">
  {({ 
    isOn, brightness, rgbColor, effect,
    supportsBrightness, supportsColor, supportsEffects,
    toggle, turnOn, turnOff, setBrightness, setRgbColor, setEffect
  }) => (
    <div>
      <button onClick={toggle}>
        {isOn ? 'Turn Off' : 'Turn On'}
      </button>
      
      {isOn && supportsBrightness && (
        <input
          type="range"
          min="0" max="255"
          value={brightness}
          onChange={(e) => setBrightness(parseInt(e.target.value))}
        />
      )}
      
      {isOn && supportsColor && (
        <input
          type="color"
          onChange={(e) => {
            const hex = e.target.value.slice(1)
            const rgb = [
              parseInt(hex.slice(0, 2), 16),
              parseInt(hex.slice(2, 4), 16),
              parseInt(hex.slice(4, 6), 16)
            ]
            setRgbColor(rgb)
          }}
        />
      )}
    </div>
  )}
</Light>
```

### All Components
- `<HAProvider>` - WebSocket connection provider
- `<Light>` - Light controls with brightness, color, effects
- `<Climate>` - Climate/thermostat controls  
- `<Switch>` - Switch controls
- `<Sensor>` - Sensor data
- `<Cover>` - Cover/blind controls
- `<Lock>` - Lock controls
- `<Entity>` - Generic entity component

### All Hooks
- `useLight(entityId)` - Light entity hook
- `useClimate(entityId)` - Climate entity hook
- `useSwitch(entityId)` - Switch entity hook
- `useSensor(entityId)` - Sensor entity hook
- `useCover(entityId)` - Cover entity hook
- `useLock(entityId)` - Lock entity hook
- `useEntity(entityId)` - Generic entity hook
- `useEntityGroup(entityIds)` - Multiple entities hook
- `useHAConnection()` - Connection status hook

## Development

Mock mode for development without Home Assistant:
```jsx
<HAProvider url="mock" mockMode={true} mockData={yourMockEntities} />
```

## License

MIT © [dlwiest](https://github.com/dlwiest)