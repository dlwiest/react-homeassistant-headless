# react-homeassistant-headless

> Headless React hooks and components for Home Assistant integration

Build custom Home Assistant dashboards and interfaces with complete design freedom. No UI components, no design opinions—just powerful, type-safe hooks and headless components that handle the data and logic while you bring your own UI.

## ✨ Why Choose This?

**🎯 Truly Headless**  
Zero UI components or styling. Works with any design system—Material-UI, Chakra UI, Tailwind, or custom CSS.

**🏗️ Sophisticated Architecture**  
Unique render props pattern gives you maximum flexibility while maintaining clean, predictable APIs.

**📦 Lightweight**  
Minimal dependencies (just zustand + home-assistant-js-websocket). No bloated component libraries.

**🔷 Full TypeScript Support**  
Complete type safety with comprehensive interfaces for all Home Assistant entity types.

**🏠 Comprehensive Entity Support**  
Climate, Light, Sensor, Switch, Cover, Entity Groups—everything you need for complex dashboards.

**⚡ Real-time Updates**  
Automatic WebSocket subscriptions keep your UI in sync with Home Assistant state changes.

## 🚀 Quick Start

```bash
# Coming soon to npm!
# For now, clone the repository
git clone https://github.com/dlwiest/react-homeassistant-headless.git
cd react-homeassistant-headless
npm install
npm run build
```

```jsx
import { HAProvider, Light } from 'react-homeassistant-headless'

function App() {
  return (
    <HAProvider url="ws://homeassistant.local:8123" token="your-long-lived-access-token">
      <Light entityId="light.living_room">
        {({ isOn, brightness, turnOn, turnOff, setBrightness }) => (
          <div className="light-control">
            <h3>Living Room Light</h3>
            <button 
              onClick={isOn ? turnOff : turnOn}
              className={isOn ? 'light-on' : 'light-off'}
            >
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

## 🎨 Works with Any UI Library

### Material-UI Example
```jsx
import { Switch, Slider, Card, CardContent, Typography } from '@mui/material'

<Light entityId="light.bedroom">
  {({ isOn, brightness, turnOn, turnOff, setBrightness }) => (
    <Card>
      <CardContent>
        <Typography variant="h6">Bedroom Light</Typography>
        <Switch checked={isOn} onChange={isOn ? turnOff : turnOn} />
        <Slider value={brightness} max={255} onChange={(_, val) => setBrightness(val)} />
      </CardContent>
    </Card>
  )}
</Light>
```

### Tailwind + Headless UI Example
```jsx
import { Switch } from '@headlessui/react'

<Light entityId="light.kitchen">
  {({ isOn, turnOn, turnOff }) => (
    <Switch
      checked={isOn}
      onChange={isOn ? turnOff : turnOn}
      className={`${isOn ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
    >
      <span className={`${isOn ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
    </Switch>
  )}
</Light>
```

## 🧱 Entity Components

All components use the render props pattern, giving you complete control over the UI:

### Light
```jsx
<Light entityId="light.living_room">
  {({ 
    isOn, brightness, brightnessPercent, 
    supportsBrightness, supportsColor, supportsEffects,
    availableEffects, rgbColor, colorTemp,
    turnOn, turnOff, toggle, setBrightness, setRgbColor, setEffect 
  }) => (
    // Your custom UI here
  )}
</Light>
```

### Climate
```jsx
<Climate entityId="climate.thermostat">
  {({ 
    currentTemperature, targetTemperature, mode,
    supportedModes, supportsTargetTemperature,
    setMode, setTemperature 
  }) => (
    // Your custom thermostat UI here
  )}
</Climate>
```

### Switch
```jsx
<Switch entityId="switch.coffee_maker">
  {({ isOn, turnOn, turnOff, toggle }) => (
    // Your custom switch UI here
  )}
</Switch>
```

### Sensor
```jsx
<Sensor entityId="sensor.temperature">
  {({ value, numericValue, unitOfMeasurement, deviceClass }) => (
    // Your custom sensor display here
  )}
</Sensor>
```

### Cover
```jsx
<Cover entityId="cover.garage_door">
  {({ 
    isOpen, isClosed, isOpening, isClosing, 
    position, supportsPosition,
    openCover, closeCover, setPosition 
  }) => (
    // Your custom cover control here
  )}
</Cover>
```

## 🪝 Direct Hooks

Prefer hooks over render props? Use the underlying hooks directly:

```jsx
import { useLight, useClimate } from 'react-homeassistant-headless'

function MyComponent() {
  const light = useLight('light.living_room')
  const climate = useClimate('climate.thermostat')
  
  return (
    <div>
      <button onClick={light.toggle}>
        Light: {light.isOn ? 'ON' : 'OFF'}
      </button>
      <div>
        Temperature: {climate.currentTemperature}°
      </div>
    </div>
  )
}
```

## 🔗 Entity Groups

Work with multiple entities efficiently:

```jsx
import { useEntityGroup } from 'react-homeassistant-headless'

function AllLights() {
  const lights = useEntityGroup(['light.living_room', 'light.kitchen', 'light.bedroom'])
  
  return (
    <div>
      <button onClick={() => lights.forEach(light => light.turnOn())}>
        Turn All On
      </button>
      {lights.map(light => (
        <div key={light.entityId}>
          {light.entityId}: {light.isOn ? 'ON' : 'OFF'}
        </div>
      ))}
    </div>
  )
}
```

## ⚙️ Configuration

### HAProvider Props

```jsx
<HAProvider
  url="ws://homeassistant.local:8123"  // WebSocket URL
  token="your-token"                    // Long-lived access token
  options={{
    reconnectInterval: 5000,            // Auto-reconnect interval (ms)
    reconnectAttempts: 10,              // Max reconnect attempts
    autoReconnect: true                 // Enable auto-reconnect
  }}
>
  {/* Your app */}
</HAProvider>
```

### Connection Status

```jsx
import { useConnectionStatus } from 'react-homeassistant-headless'

function ConnectionStatus() {
  const { connected, connecting, error, reconnect } = useConnectionStatus()
  
  if (connecting) return <div>Connecting...</div>
  if (error) return <div>Error: {error.message} <button onClick={reconnect}>Retry</button></div>
  if (connected) return <div>✅ Connected</div>
  
  return <div>❌ Disconnected</div>
}
```

## 🔧 TypeScript

Full TypeScript support with comprehensive interfaces:

```typescript
import type { LightState, ClimateState } from 'react-homeassistant-headless'

// All entity states are fully typed
const MyLightControl: React.FC<{ light: LightState }> = ({ light }) => {
  // TypeScript knows about all properties and methods
  light.setBrightness(128)  // ✅ Fully typed
  light.invalidMethod()     // ❌ TypeScript error
}
```

## 📚 API Reference

### Core Components
- `<HAProvider>` - Connection provider
- `<Light>` - Light entity component  
- `<Climate>` - Climate entity component
- `<Switch>` - Switch entity component
- `<Sensor>` - Sensor entity component
- `<Cover>` - Cover entity component
- `<Entity>` - Generic entity component

### Hooks
- `useLight(entityId)` - Light entity hook
- `useClimate(entityId)` - Climate entity hook
- `useSwitch(entityId)` - Switch entity hook
- `useSensor(entityId)` - Sensor entity hook
- `useCover(entityId)` - Cover entity hook  
- `useEntity(entityId)` - Generic entity hook
- `useEntityGroup(entityIds)` - Multiple entities hook
- `useConnectionStatus()` - Connection status hook

### Types
- `LightState` - Light entity interface
- `ClimateState` - Climate entity interface  
- `SwitchState` - Switch entity interface
- `SensorState` - Sensor entity interface
- `CoverState` - Cover entity interface
- `HAConfig` - Provider configuration
- `ConnectionStatus` - Connection state

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [dlwiest](https://github.com/dlwiest)

---

**Build any Home Assistant interface you can imagine.** 🏠✨