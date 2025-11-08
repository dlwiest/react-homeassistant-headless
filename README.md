# hass-react

[![npm version](https://badge.fury.io/js/@dlwiest%2Fhass-react.svg)](https://badge.fury.io/js/@dlwiest%2Fhass-react)
[![npm downloads](https://img.shields.io/npm/dm/@dlwiest/hass-react.svg)](https://www.npmjs.com/package/@dlwiest/hass-react)

react-hass is a React library built for people seeking full creative control over the look and feel of their Home Assistant experience. A complete suite of headless components abstracts all the headaches of WebSocket implementation and state management, allowing you to focus on creating your perfect custom dashboards.

## Features

- **Full TypeScript support** - Complete type definitions for all entities and their properties
- **Automatic reconnection** - Handles connection drops and network issues transparently
- **Developer-friendly warnings** - Helpful console messages for common configuration issues
- **Mock mode** - Develop and test without a real Home Assistant instance
- **No UI constraints** - Works with any React setup, styling, or component library

## Installation

```bash
npm install @dlwiest/hass-react
```

## Quick Example

```jsx
import { HAProvider, Light } from '@dlwiest/hass-react'

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

### Fans
```jsx
<Fan entityId="fan.bedroom_ceiling">
  {({ 
    isOn, percentage, presetMode, isOscillating, direction,
    supportsSetSpeed, supportsPresetMode, supportsOscillate, supportsDirection,
    availablePresetModes,
    toggle, setPercentage, setPresetMode, setOscillating, setDirection
  }) => (
    // Your fan controls
  )}
</Fan>
```

### Locks
```jsx
<Lock entityId="lock.front_door">
  {({ 
    isLocked, isUnlocked, isUnknown, changedBy,
    supportsOpen,
    lock, unlock, open
  }) => (
    // Your lock controls
  )}
</Lock>
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

## Using Hooks Directly

If you prefer hooks over render props:

```jsx
import { useLight, useClimate, useFan, useLock } from '@dlwiest/hass-react'

function MyComponent() {
  const light = useLight('light.living_room')
  const thermostat = useClimate('climate.main_floor')
  const fan = useFan('fan.bedroom_ceiling')
  const lock = useLock('lock.front_door')
  
  return (
    <div>
      <button onClick={light.toggle}>
        Light: {light.isOn ? 'ON' : 'OFF'}
      </button>
      <div>
        Temperature: {thermostat.currentTemperature}°
      </div>
      <div>
        <button onClick={fan.toggle}>
          Fan: {fan.isOn ? 'ON' : 'OFF'} ({fan.percentage}%)
        </button>
      </div>
      <div>
        <button onClick={lock.lock}>
          Door: {lock.isLocked ? 'LOCKED' : 'UNLOCKED'}
        </button>
      </div>
    </div>
  )
}
```

## Entity Groups

Work with multiple entities:

```jsx
import { useEntityGroup } from '@dlwiest/hass-react'

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
- `<Fan>` - Fan controls with speed, presets, oscillation, direction
- `<Lock>` - Lock controls with lock, unlock, open
- `<Cover>` - Cover/blind controls
- `<Entity>` - Generic entity component

### All Hooks
- `useLight(entityId)` - Light entity hook
- `useClimate(entityId)` - Climate entity hook
- `useSwitch(entityId)` - Switch entity hook
- `useSensor(entityId)` - Sensor entity hook
- `useFan(entityId)` - Fan entity hook
- `useLock(entityId)` - Lock entity hook
- `useCover(entityId)` - Cover entity hook
- `useEntity(entityId)` - Generic entity hook
- `useEntityGroup(entityIds)` - Multiple entities hook
- `useHAConnection()` - Connection status hook

## Development

Mock mode for development without Home Assistant:
```jsx
<HAProvider url="mock" mockMode={true} mockData={yourMockEntities} />
```

## 🚧 Early Development

This library is in active development and testing. While it's functional and being used in production (my house), the API may evolve as I add more entity types and refine the developer experience.

**I'd welcome your help!**
- 🐛 **Bug reports** - Found an issue? Let me know!
- 🧪 **Testing feedback** - Try it with your setup and share your experience
- 💡 **Feature requests** - Missing an entity type or feature you need?
- 🤝 **Contributions** - PRs welcome for new entities, improvements, or documentation

[Open an issue](https://github.com/dlwiest/hass-react/issues) or [start a discussion](https://github.com/dlwiest/hass-react/discussions) - I'd love to hear from you!

## License

MIT © [dlwiest](https://github.com/dlwiest)