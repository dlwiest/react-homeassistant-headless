# hass-react

[![npm version](https://img.shields.io/npm/v/hass-react.svg)](https://www.npmjs.com/package/hass-react)
[![npm downloads](https://img.shields.io/npm/dm/hass-react.svg)](https://www.npmjs.com/package/hass-react)
[![Documentation](https://img.shields.io/badge/docs-hass--react.com-blue.svg)](https://hass-react.com)

A React library for building custom Home Assistant interfaces. Headless components and hooks provide real-time entity data and controls, letting you focus on creating the perfect UI for your smart home.

## Features

- **Headless & Unstyled** - Works with any UI library or custom CSS
- **Real-time Updates** - Fully managed WebSocket connection
- **Full TypeScript Support** - Complete type definitions for all supported entities
- **OAuth & Token Auth** - Flexible authentication with connection state tracking
- **Error Handling** - Informative, standardized error types and (optional) automatic retry for network errors
- **Mock Mode** - Develop and test without a real Home Assistant instance
- **Most HA Entities Supported** - Lights, climate, media players, sensors, and more

## Installation

```bash
npm install hass-react
```

## Quick Start

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
              {isOn ? 'ON' : 'OFF'}
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

## Documentation

📚 **[Full Documentation](https://hass-react.com)** - Complete guides, API reference, and examples

### Key Topics
- **[Getting Started](https://hass-react.com/docs/intro)** - Setup and basic usage
- **[Authentication](https://hass-react.com/docs/authentication)** - OAuth and token configuration  
- **[Entity Documentation](https://hass-react.com/docs/entities/light)** - All 10+ supported entity types
- **[Error Handling](https://hass-react.com/docs/error-handling)** - Connection status and error patterns
- **[Development & Testing](https://hass-react.com/docs/development-testing)** - Mock mode and testing utilities

## Supported Entity Types

- **Lights** - Brightness, color, effects, and more
- **Climate** - Thermostats and HVAC controls  
- **Media Players** - Playback, volume, source selection
- **Switches** - Simple on/off controls
- **Sensors** - Temperature, humidity, and other measurements
- **Binary Sensors** - Door/window sensors, motion detectors
- **Fans** - Speed, oscillation, direction controls
- **Locks** - Lock, unlock, and open functionality  
- **Covers** - Blinds, garage doors, curtains
- **Todo Lists** - Task management and shopping lists
- **More on the Way!**

[→ See all entity documentation](https://hass-react.com/docs/entities/light)

## Examples

Three complete dashboard examples showing different UI approaches:
- **[Vanilla React](./examples/vanilla-dashboard)** - Custom CSS
- **[shadcn/ui](./examples/shadcn-dashboard)** - Tailwind + Radix UI components  
- **[Material-UI](./examples/mui-dashboard)** - Material Design

## Contributing

This library is in active development and testing. While functional and production-ready, the API may evolve as new entity types and features are added.

**Help wanted:**
- 🐛 **Bug reports** - Found an issue? Let me know!
- 🧪 **Testing feedback** - Try it with your setup and share your experience  
- 💡 **Feature requests** - Missing an entity type or feature you need?
- 🤝 **Contributions** - PRs welcome for new entities, improvements, or documentation

[Open an issue](https://github.com/dlwiest/hass-react/issues) or [start a discussion](https://github.com/dlwiest/hass-react/discussions)

## License

MIT © [dlwiest](https://github.com/dlwiest)
