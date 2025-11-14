---
sidebar_position: 1
---

# Climate

Control thermostats, AC units, and HVAC systems with temperature, mode, and fan control.

## Quick Example

```tsx
// Component approach
<Climate entityId="climate.living_room">
  {({ currentTemperature, targetTemperature, mode, setMode, setTemperature }) => (
    <div>
      <p>Current: {currentTemperature}°F</p>
      <p>Target: {targetTemperature}°F</p>
      <button onClick={() => setMode(mode === 'heat' ? 'off' : 'heat')}>
        Mode: {mode}
      </button>
    </div>
  )}
</Climate>

// Hook approach
const thermostat = useClimate('climate.living_room')
<div>
  <p>Current: {thermostat.currentTemperature}°F</p>
  <button onClick={() => thermostat.setTemperature(72)}>
    Set to 72°F
  </button>
</div>
```

## Component API

### Basic Usage

```tsx
import { Climate } from 'hass-react'

<Climate entityId="climate.living_room">
  {(climateProps) => (
    // Your UI here
  )}
</Climate>
```

### Render Props

The Climate component provides these props to your render function:

#### State Properties
- **`currentTemperature`** (`number | undefined`) - Current temperature reading
- **`targetTemperature`** (`number | undefined`) - Target temperature setting
- **`targetTempHigh`** (`number | undefined`) - High target for heat/cool mode
- **`targetTempLow`** (`number | undefined`) - Low target for heat/cool mode
- **`humidity`** (`number | undefined`) - Current humidity percentage
- **`mode`** (`string`) - Current HVAC mode (heat, cool, auto, off, etc.)
- **`fanMode`** (`string | undefined`) - Current fan mode (auto, on, low, etc.)
- **`presetMode`** (`string | undefined`) - Current preset mode (away, home, sleep, etc.)

#### Support Properties
- **`supportsTargetTemperature`** (`boolean`) - Device supports setting target temperature
- **`supportsTargetTemperatureRange`** (`boolean`) - Device supports temperature range
- **`supportsFanMode`** (`boolean`) - Device supports fan mode control
- **`supportsPresetMode`** (`boolean`) - Device supports preset modes
- **`supportedModes`** (`string[]`) - List of available HVAC modes
- **`supportedFanModes`** (`string[]`) - List of available fan modes
- **`supportedPresetModes`** (`string[]`) - List of available preset modes
- **`minTemp`** (`number`) - Minimum supported temperature
- **`maxTemp`** (`number`) - Maximum supported temperature

#### Control Methods
- **`setMode(mode: string)`** - Set HVAC mode (heat, cool, auto, off, etc.)
- **`setTemperature(temp: number)`** - Set target temperature
- **`setTemperatureRange(low: number, high: number)`** - Set temperature range
- **`setFanMode(mode: string)`** - Set fan mode
- **`setPresetMode(preset: string)`** - Set preset mode

#### Entity Properties
- **`entityId`** (`string`) - The entity ID
- **`state`** (`string`) - Raw state value from Home Assistant
- **`attributes`** (`object`) - All entity attributes
- **`lastChanged`** (`Date`) - When the entity last changed
- **`lastUpdated`** (`Date`) - When the entity was last updated

## Hook API

### Basic Usage

```tsx
import { useClimate } from 'hass-react'

function MyComponent() {
  const climate = useClimate('climate.living_room')
  
  // All the same properties as component render props
  return <div>Mode: {climate.mode} - {climate.currentTemperature}°F</div>
}
```

The `useClimate` hook returns an object with all the same properties and methods as the component's render props.

## Examples

### Simple Thermostat

```tsx
<Climate entityId="climate.main_floor">
  {({ 
    currentTemperature, targetTemperature, mode,
    setMode, setTemperature, supportsTargetTemperature,
    supportedModes, minTemp, maxTemp, attributes
  }) => (
    <div>
      <h3>{attributes.friendly_name}</h3>
      
      <div>
        <strong>Current: {currentTemperature}°F</strong>
        {supportsTargetTemperature && (
          <p>Target: {targetTemperature}°F</p>
        )}
      </div>
      
      <div>
        <label>Mode:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          {supportedModes.map(modeOption => (
            <option key={modeOption} value={modeOption}>
              {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      {supportsTargetTemperature && mode !== 'off' && (
        <div>
          <label>Temperature: {targetTemperature}°F</label>
          <input
            type="range"
            min={minTemp}
            max={maxTemp}
            value={targetTemperature || minTemp}
            onChange={(e) => setTemperature(parseInt(e.target.value))}
          />
        </div>
      )}
    </div>
  )}
</Climate>
```

### Temperature Range Control

```tsx
<Climate entityId="climate.bedroom">
  {({ 
    currentTemperature, targetTempLow, targetTempHigh, mode,
    setMode, setTemperatureRange, supportsTargetTemperatureRange,
    supportedModes, minTemp, maxTemp, attributes
  }) => (
    <div>
      <h3>{attributes.friendly_name}</h3>
      
      <p>Current: {currentTemperature}°F</p>
      
      <div>
        <label>Mode:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          {supportedModes.map(modeOption => (
            <option key={modeOption} value={modeOption}>
              {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      {supportsTargetTemperatureRange && mode === 'heat_cool' && (
        <div>
          <div>
            <label>Low: {targetTempLow}°F</label>
            <input
              type="range"
              min={minTemp}
              max={maxTemp}
              value={targetTempLow || minTemp}
              onChange={(e) => setTemperatureRange(
                parseInt(e.target.value), 
                targetTempHigh || maxTemp
              )}
            />
          </div>
          
          <div>
            <label>High: {targetTempHigh}°F</label>
            <input
              type="range"
              min={minTemp}
              max={maxTemp}
              value={targetTempHigh || maxTemp}
              onChange={(e) => setTemperatureRange(
                targetTempLow || minTemp,
                parseInt(e.target.value)
              )}
            />
          </div>
        </div>
      )}
    </div>
  )}
</Climate>
```

### Full Featured Control

```tsx
<Climate entityId="climate.master_bedroom">
  {({ 
    currentTemperature, targetTemperature, humidity, mode, fanMode, presetMode,
    supportsTargetTemperature, supportsFanMode, supportsPresetMode,
    supportedModes, supportedFanModes, supportedPresetModes,
    setMode, setTemperature, setFanMode, setPresetMode,
    minTemp, maxTemp, attributes
  }) => (
    <div style={{ 
      padding: '1rem', 
      border: '1px solid #ccc', 
      borderRadius: '8px' 
    }}>
      <h3>{attributes.friendly_name}</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div>
          <strong>Current Temp</strong>
          <p>{currentTemperature}°F</p>
        </div>
        
        {supportsTargetTemperature && (
          <div>
            <strong>Target Temp</strong>
            <p>{targetTemperature}°F</p>
          </div>
        )}
        
        {humidity !== undefined && (
          <div>
            <strong>Humidity</strong>
            <p>{humidity}%</p>
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>HVAC Mode:</label>
        <select 
          value={mode} 
          onChange={(e) => setMode(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        >
          {supportedModes.map(modeOption => (
            <option key={modeOption} value={modeOption}>
              {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      {supportsTargetTemperature && mode !== 'off' && (
        <div style={{ marginBottom: '1rem' }}>
          <label>Temperature: {targetTemperature}°F</label>
          <input
            type="range"
            min={minTemp} max={maxTemp}
            value={targetTemperature || minTemp}
            onChange={(e) => setTemperature(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{minTemp}°F</span>
            <span>{maxTemp}°F</span>
          </div>
        </div>
      )}
      
      {supportsFanMode && supportedFanModes.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <label>Fan Mode:</label>
          <select 
            value={fanMode || ''} 
            onChange={(e) => setFanMode(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            {supportedFanModes.map(fan => (
              <option key={fan} value={fan}>
                {fan.charAt(0).toUpperCase() + fan.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {supportsPresetMode && supportedPresetModes.length > 0 && (
        <div>
          <label>Preset:</label>
          <select 
            value={presetMode || ''} 
            onChange={(e) => setPresetMode(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="">None</option>
            {supportedPresetModes.map(preset => (
              <option key={preset} value={preset}>
                {preset.charAt(0).toUpperCase() + preset.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )}
</Climate>
```

### Quick Temperature Controls

```tsx
<Climate entityId="climate.office">
  {({ 
    currentTemperature, targetTemperature, mode,
    setTemperature, setMode, supportsTargetTemperature,
    attributes
  }) => {
    const quickTemps = [68, 70, 72, 74, 76]
    
    return (
      <div>
        <h3>{attributes.friendly_name}</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <p>Current: {currentTemperature}°F</p>
          <p>Target: {targetTemperature}°F</p>
          <p>Mode: {mode}</p>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <button 
            onClick={() => setMode(mode === 'off' ? 'heat' : 'off')}
            style={{
              backgroundColor: mode === 'off' ? '#4CAF50' : '#f44336',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px'
            }}
          >
            {mode === 'off' ? 'Turn On' : 'Turn Off'}
          </button>
        </div>
        
        {supportsTargetTemperature && mode !== 'off' && (
          <div>
            <p>Quick Set:</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {quickTemps.map(temp => (
                <button
                  key={temp}
                  onClick={() => setTemperature(temp)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: targetTemperature === temp ? '#2196F3' : '#f0f0f0',
                    color: targetTemperature === temp ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  {temp}°F
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }}
</Climate>
```

### Using Hooks

```tsx
import { useClimate } from 'hass-react'

function ThermostatCard({ entityId }) {
  const climate = useClimate(entityId)
  
  return (
    <div>
      <h3>{climate.attributes.friendly_name}</h3>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <div>
          <strong>{climate.currentTemperature}°F</strong>
          <br />
          <small>Current</small>
        </div>
        
        {climate.supportsTargetTemperature && (
          <div>
            <strong>{climate.targetTemperature}°F</strong>
            <br />
            <small>Target</small>
          </div>
        )}
        
        <div>
          <strong>{climate.mode}</strong>
          <br />
          <small>Mode</small>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          onClick={() => climate.setMode('heat')}
          disabled={climate.mode === 'heat'}
        >
          Heat
        </button>
        <button 
          onClick={() => climate.setMode('cool')}
          disabled={climate.mode === 'cool'}
        >
          Cool
        </button>
        <button 
          onClick={() => climate.setMode('off')}
          disabled={climate.mode === 'off'}
        >
          Off
        </button>
      </div>
      
      {climate.supportsTargetTemperature && climate.mode !== 'off' && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <button onClick={() => climate.setTemperature((climate.targetTemperature || 70) - 1)}>
              -
            </button>
            <span style={{ minWidth: '60px', textAlign: 'center' }}>
              {climate.targetTemperature}°F
            </span>
            <button onClick={() => climate.setTemperature((climate.targetTemperature || 70) + 1)}>
              +
            </button>
          </div>
        </div>
      )}
    </div>
  )
}