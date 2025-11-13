# hass-react

[![npm version](https://img.shields.io/npm/v/hass-react.svg)](https://www.npmjs.com/package/hass-react)
[![npm downloads](https://img.shields.io/npm/dm/hass-react.svg)](https://www.npmjs.com/package/hass-react)

hass-react is a React library built for people seeking full creative control over the look and feel of their Home Assistant experience. A suite of headless components abstracts all the headaches of WebSocket implementation and state management, allowing you to focus on creating your perfect custom dashboards.

## Features

- **OAuth 2.0 & Long-lived Token authentication** - Flexible authentication with auto-detection
- **Full TypeScript support** - Complete type definitions for all entities and their properties
- **Automatic reconnection** - Handles connection drops and network issues transparently
- **Comprehensive error handling** - Standardized error types for entity availability and service call failures
- **Developer-friendly warnings** - Helpful console messages for common configuration issues
- **Mock mode** - Develop and test without a real Home Assistant instance
- **No UI constraints** - Works with any React setup, styling, or component library

## Installation

```bash
npm install hass-react
```

## Authentication

hass-react supports both OAuth 2.0 and long-lived token authentication with automatic detection:

### OAuth 2.0 (Recommended)
OAuth provides secure, user-friendly authentication without exposing tokens:

```jsx
<HAProvider url="http://homeassistant.local:8123" authMode="oauth">
  <YourApp />
</HAProvider>
```

### Long-lived Token
Traditional token-based authentication:

```jsx
<HAProvider url="http://homeassistant.local:8123" token="your-long-lived-access-token">
  <YourApp />
</HAProvider>
```

### Auto-detection (Default)
Automatically chooses OAuth when no token is provided, or token auth when a token is present:

```jsx
// Uses OAuth if no token provided
<HAProvider url="http://homeassistant.local:8123">
  <YourApp />
</HAProvider>

// Uses token auth if token provided  
<HAProvider url="http://homeassistant.local:8123" token="your-token">
  <YourApp />
</HAProvider>
```

### Logout Functionality

For OAuth authentication, you can programmatically log users out:

```jsx
import { useHAConnection } from 'hass-react'

function LogoutButton() {
  const { logout, connected } = useHAConnection()

  return (
    <button onClick={logout} disabled={!connected}>
      Logout
    </button>
  )
}
```

The logout function:
- Clears stored OAuth tokens from localStorage
- Immediately closes the WebSocket connection
- Stops all entity controls from working
- Triggers a new OAuth flow on the next connection attempt

## Quick Example

```jsx
import { HAProvider, Light } from 'hass-react'

function App() {
  return (
    <HAProvider url="http://homeassistant.local:8123">
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
    isOn, brightness, brightnessPercent, rgbColor, colorTemp, effect,
    supportsBrightness, supportsRgb, supportsColorTemp, supportsEffects,
    availableEffects,
    toggle, turnOn, turnOff, setBrightness, setRgbColor, setColorTemp, setEffect
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

### Binary Sensors
```jsx
<BinarySensor entityId="binary_sensor.front_door">
  {({ 
    isOn, isOff, deviceClass, icon
  }) => (
    // Your binary sensor display
  )}
</BinarySensor>
```

### Todo Lists
```jsx
<Todo entityId="todo.shopping_list">
  {({ 
    items, itemCount,
    supportsAddItem, supportsRemoveItem, supportsUpdateItem, supportsClearCompleted,
    addItem, removeItem, toggleItem, clearCompleted
  }) => (
    // Your todo list interface
  )}
</Todo>
```

## Using Hooks Directly

If you prefer hooks over render props:

```jsx
import { useLight, useClimate, useFan, useLock, useBinarySensor, useTodo } from 'hass-react'

function MyComponent() {
  const light = useLight('light.living_room')
  const thermostat = useClimate('climate.main_floor')
  const fan = useFan('fan.bedroom_ceiling')
  const lock = useLock('lock.front_door')
  const doorSensor = useBinarySensor('binary_sensor.front_door')
  const todoList = useTodo('todo.shopping_list')
  
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
      <div>
        Door Sensor: {doorSensor.isOn ? 'OPEN' : 'CLOSED'}
      </div>
      <div>
        Todo Items: {todoList.itemCount} ({todoList.items.filter(i => i.status === 'completed').length} completed)
      </div>
    </div>
  )
}
```

## Entity Groups

Work with multiple entities:

```jsx
import { useEntityGroup } from 'hass-react'

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
<HAProvider url="http://homeassistant.local:8123">
  <YourApp />
</HAProvider>
```

Connection options and status monitoring:
```jsx
<HAProvider
  url="http://homeassistant.local:8123"
  options={{
    reconnectInterval: 5000,
    reconnectAttempts: 10,
    autoReconnect: true
  }}
/>

// Monitor connection status and manage authentication
const { connected, connecting, error, reconnect, logout } = useHAConnection()
```

## Error Handling & Reliability

hass-react includes robust error handling, parameter validation, and automatic retry logic to ensure reliable smart home control even with network issues or temporary service interruptions.

### Automatic Service Call Retries

Service calls (like turning lights on/off, setting brightness) automatically retry on failure with smart error filtering:

**What gets retried:**
- Network timeouts and connection errors
- Temporary Home Assistant service unavailability
- WebSocket communication failures

**What doesn't get retried (immediate user feedback):**
- Entity not found or unavailable
- Unsupported features (e.g., setting brightness on a basic switch)
- Invalid parameters (e.g., bad color values)
- Authentication errors

### Default Retry Behavior

```jsx
// Default configuration (applied automatically)
{
  maxAttempts: 3,           // Retry up to 3 times
  baseDelay: 1000,         // Start with 1 second delay
  exponentialBackoff: true, // Delays: 1s, 2s, 4s
  maxDelay: 10000          // Cap delays at 10 seconds
}
```

### Customizing Retry Configuration

Configure retry behavior for your entire application:

```jsx
<HAProvider
  url="http://homeassistant.local:8123"
  options={{
    // Connection retry (for initial connection)
    reconnectInterval: 5000,
    reconnectAttempts: 10,
    autoReconnect: true,
    
    // Service call retry (for actions like toggle, setBrightness)
    serviceRetry: {
      maxAttempts: 5,           // More retries for critical systems
      baseDelay: 2000,          // Longer initial delay
      exponentialBackoff: true,
      maxDelay: 15000          // Higher cap for persistent issues
    }
  }}
/>
```

### Error Types and User Experience

The library provides standardized error types to help you build appropriate UI feedback:

```jsx
try {
  await light.toggle()
} catch (error) {
  if (error.name === 'EntityNotAvailableError') {
    // Show "Light is offline" message
  } else if (error.name === 'FeatureNotSupportedError') {
    // Show "This light doesn't support that feature"
  } else if (error.name === 'ServiceCallError') {
    // Show "Failed to control light, please try again"
    // (This has already been retried automatically)
  }
}
```

### Connection Status Monitoring

Monitor connection health and retry states:

```jsx
function ConnectionIndicator() {
  const { connected, connecting, error, reconnect } = useHAConnection()
  
  if (connecting) return <span>🔄 Connecting to Home Assistant...</span>
  if (!connected && error) return (
    <div>
      ⚠️ Connection failed: {error.message}
      <button onClick={reconnect}>Retry</button>
    </div>
  )
  if (!connected) return <span>🔴 Disconnected</span>
  return <span>🟢 Connected</span>
}
```

### Best Practices

1. **Let retries handle transient failures** - Don't show error messages immediately
2. **Provide clear feedback for non-retryable errors** - Entity unavailable, unsupported features
3. **Use connection status for overall app health** - Show connectivity indicators
4. **Configure retries based on your use case**:
   - **Critical systems** (security, safety): More retries, longer delays
   - **Ambient controls** (mood lighting): Fewer retries, faster feedback
   - **Development/testing**: Disable retries for immediate feedback


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
- `<BinarySensor>` - Binary sensor data (door/window sensors, motion detectors, etc.)
- `<Fan>` - Fan controls with speed, presets, oscillation, direction
- `<Lock>` - Lock controls with lock, unlock, open
- `<Cover>` - Cover/blind controls
- `<Todo>` - Todo list management with add, remove, toggle, and clear operations
- `<Entity>` - Generic entity component

### All Hooks
- `useAuth(hassUrl, authMode)` - Authentication state hook
- `useLight(entityId)` - Light entity hook
- `useClimate(entityId)` - Climate entity hook
- `useSwitch(entityId)` - Switch entity hook
- `useSensor(entityId)` - Sensor entity hook
- `useBinarySensor(entityId)` - Binary sensor entity hook
- `useFan(entityId)` - Fan entity hook
- `useLock(entityId)` - Lock entity hook
- `useCover(entityId)` - Cover entity hook
- `useTodo(entityId)` - Todo list hook
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
