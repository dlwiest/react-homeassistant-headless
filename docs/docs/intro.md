---
sidebar_position: 1
---

# Getting Started

**hass-react** is a headless React library that provides hooks and components for building Home Assistant user interfaces without the hassle.

## Quick Start

```bash
npm install hass-react
```

## Basic Usage

```tsx
import { HAProvider, useLight } from 'hass-react'

function LightControl() {
  const light = useLight('light.living_room')
  
  return (
    <div>
      <h3>{light.attributes.friendly_name}</h3>
      <button onClick={light.toggle}>
        {light.isOn ? 'Turn Off' : 'Turn On'}
      </button>
    </div>
  )
}

function App() {
  return (
    <HAProvider url="http://homeassistant.local:8123">
      <LightControl />
    </HAProvider>
  )
}
```

## What's Included

- **Entity Hooks**: `useLight`, `useMediaPlayer`, `useSensor`, and more
- **Headless Components**: Full control over your UI
- **TypeScript Support**: Complete type safety
- **Authentication**: OAuth and token support
- **Mock Mode**: Perfect for development and testing

## Next Steps

- Browse the examples in the repository
- Check out the different UI framework examples (Material-UI, shadcn/ui, vanilla CSS)