---
sidebar_position: 8
---

# Number

Numeric input controls with configurable min/max/step values.

## Quick Example

```tsx
// Component approach
<Number entityId="number.speaker_volume">
  {({ value, setValue, increment, decrement }) => (
    <div>
      <button onClick={decrement}>-</button>
      <span>{value}%</span>
      <button onClick={increment}>+</button>
    </div>
  )}
</Number>

// Hook approach
const volume = useNumber('number.speaker_volume')
<input
  type="range"
  min={volume.min}
  max={volume.max}
  step={volume.step}
  value={volume.value}
  onChange={(e) => volume.setValue(parseFloat(e.target.value))}
/>
```

## Component API

### Basic Usage

```tsx
import { Number } from 'hass-react'

<Number entityId="number.speaker_volume">
  {(numberProps) => (
    // Your UI here
  )}
</Number>
```

### Render Props

The Number component provides these props to your render function:

#### State Properties
- **`value`** (`number`) - Current numeric value
- **`min`** (`number`) - Minimum allowed value
- **`max`** (`number`) - Maximum allowed value
- **`step`** (`number`) - Step increment/decrement size
- **`unit`** (`string | undefined`) - Unit of measurement (e.g., "%", "°F")
- **`deviceClass`** (`string | undefined`) - Device class (e.g., "temperature", "humidity")
- **`mode`** (`'auto' | 'box' | 'slider'`) - UI mode hint from Home Assistant (defaults to `'auto'`)

#### Control Methods
- **`setValue(value: number)`** - Set the value (validates min/max/step)
- **`increment()`** - Increase value by step amount
- **`decrement()`** - Decrease value by step amount

#### Entity Properties
- **`entityId`** (`string`) - The entity ID
- **`state`** (`string`) - Raw state value from Home Assistant
- **`attributes`** (`object`) - All entity attributes
- **`lastChanged`** (`Date`) - When the entity last changed
- **`lastUpdated`** (`Date`) - When the entity was last updated

## Hook API

### Basic Usage

```tsx
import { useNumber } from 'hass-react'

function MyComponent() {
  const numberEntity = useNumber('number.speaker_volume')

  // All the same properties as component render props
  return <div>{numberEntity.value}{numberEntity.unit}</div>
}
```

The `useNumber` hook returns an object with all the same properties and methods as the component's render props.

## Examples

### Simple Slider

```tsx
<Number entityId="number.speaker_volume">
  {({ value, setValue, min, max, step, unit }) => (
    <div>
      <label>Volume: {value}{unit}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
      />
    </div>
  )}
</Number>
```

### Number Card with Buttons

```tsx
<Number entityId="number.thermostat_offset">
  {({ value, increment, decrement, min, max, unit, attributes }) => (
    <div style={{
      padding: '1rem',
      border: '1px solid #ccc',
      borderRadius: '8px'
    }}>
      <h3>{attributes.friendly_name}</h3>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '1.5rem'
      }}>
        <button
          onClick={decrement}
          disabled={value <= min}
        >
          -
        </button>
        <span>{value}{unit}</span>
        <button
          onClick={increment}
          disabled={value >= max}
        >
          +
        </button>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>
        Range: {min} - {max}{unit}
      </p>
    </div>
  )}
</Number>
```

### Combined Slider and Buttons

```tsx
<Number entityId="number.brightness_threshold">
  {({ value, setValue, increment, decrement, min, max, step, unit }) => (
    <div>
      <h4>Brightness Threshold</h4>

      {/* Slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        style={{ width: '100%' }}
      />

      {/* Value display and buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '0.5rem'
      }}>
        <span>{min}{unit}</span>
        <div>
          <button onClick={decrement}>-</button>
          <span style={{ margin: '0 1rem' }}>
            {value}{unit}
          </span>
          <button onClick={increment}>+</button>
        </div>
        <span>{max}{unit}</span>
      </div>
    </div>
  )}
</Number>
```

### Number Input Field

```tsx
<Number entityId="number.countdown_timer">
  {({ value, setValue, min, max, step, attributes }) => (
    <div>
      <label htmlFor="timer">{attributes.friendly_name}</label>
      <input
        id="timer"
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        style={{
          padding: '0.5rem',
          fontSize: '1rem',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
    </div>
  )}
</Number>
```

### Using Hooks

```tsx
import { useNumber } from 'hass-react'

function VolumeControl({ entityId }) {
  const volume = useNumber(entityId)

  return (
    <div>
      <h3>{volume.attributes.friendly_name}</h3>

      {/* Range slider */}
      <input
        type="range"
        min={volume.min}
        max={volume.max}
        step={volume.step}
        value={volume.value}
        onChange={(e) => volume.setValue(parseFloat(e.target.value))}
        style={{ width: '100%' }}
      />

      {/* Current value */}
      <p style={{ textAlign: 'center', fontSize: '1.5rem' }}>
        {volume.value}{volume.unit}
      </p>

      {/* Quick controls */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => volume.setValue(volume.min)}>
          Min
        </button>
        <button onClick={volume.decrement}>
          -
        </button>
        <button onClick={volume.increment}>
          +
        </button>
        <button onClick={() => volume.setValue(volume.max)}>
          Max
        </button>
      </div>
    </div>
  )
}
```

### Validation Display

```tsx
<Number entityId="number.pool_temperature">
  {({ value, setValue, min, max, step, unit }) => {
    const [inputValue, setInputValue] = React.useState(value.toString())
    const [error, setError] = React.useState('')

    const handleChange = (e) => {
      const newValue = e.target.value
      setInputValue(newValue)

      const num = parseFloat(newValue)
      if (isNaN(num)) {
        setError('Please enter a valid number')
      } else if (num < min) {
        setError(`Value must be at least ${min}${unit}`)
      } else if (num > max) {
        setError(`Value must be at most ${max}${unit}`)
      } else if (Math.abs((num - min) % step) > 1e-8) {
        setError(`Value must be in increments of ${step}${unit}`)
      } else {
        setError('')
        setValue(num)
      }
    }

    return (
      <div>
        <label>Pool Temperature</label>
        <input
          type="number"
          value={inputValue}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
        />
        {error && (
          <p style={{ color: 'red', fontSize: '0.875rem' }}>
            {error}
          </p>
        )}
      </div>
    )
  }}
</Number>
```

## Notes

- The `setValue` method automatically validates that the value is a valid number using Zod validation and clamps it to min/max bounds
- Invalid values (NaN, Infinity, etc.) will throw an error with a descriptive message
- The `increment` and `decrement` methods respect the `step` property and won't exceed min/max bounds
- Number entities are commonly used for volume controls, temperature settings, brightness thresholds, and other numeric configurations
