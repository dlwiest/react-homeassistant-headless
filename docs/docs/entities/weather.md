---
sidebar_position: 14
---

# Weather

Display weather conditions, temperature, humidity, wind, and forecast data from Home Assistant weather integrations.

## Quick Example

```tsx
// Component approach
<Weather entityId="weather.home">
  {({ condition, temperature, temperatureUnit, humidity, windSpeed }) => (
    <div>
      <p>Condition: {condition}</p>
      <p>Temperature: {temperature}{temperatureUnit}</p>
      <p>Humidity: {humidity}%</p>
      <p>Wind: {windSpeed} mph</p>
    </div>
  )}
</Weather>

// Hook approach
const weather = useWeather('weather.home')
<div>
  <p>{weather.condition}</p>
  <p>{weather.temperature}{weather.temperatureUnit}</p>
</div>
```

## Component API

### Basic Usage

```tsx
import { Weather } from 'hass-react'

<Weather entityId="weather.home">
  {(weatherProps) => (
    // Your UI here
  )}
</Weather>
```

### Render Props

The Weather component provides these props to your render function:

#### State Properties
- **`condition`** (`string`) - Current weather condition (sunny, cloudy, rainy, etc.)
- **`temperature`** (`number | null`) - Current temperature
- **`temperatureUnit`** (`string`) - Temperature unit (°F or °C, defaults to °F)
- **`humidity`** (`number | null`) - Current humidity percentage
- **`pressure`** (`number | null`) - Current atmospheric pressure
- **`pressureUnit`** (`string`) - Pressure unit (inHg or hPa, defaults to inHg)
- **`windSpeed`** (`number | null`) - Wind speed
- **`windSpeedUnit`** (`string`) - Wind speed unit (mph or km/h, defaults to mph)
- **`windBearing`** (`number | null`) - Wind direction in degrees (0-360)
- **`visibility`** (`number | null`) - Visibility distance
- **`visibilityUnit`** (`string`) - Visibility unit (mi or km, defaults to mi)
- **`cloudCoverage`** (`number | null`) - Cloud coverage percentage
- **`dewPoint`** (`number | null`) - Dew point temperature
- **`apparentTemperature`** (`number | null`) - "Feels like" temperature
- **`precipitationUnit`** (`string`) - Precipitation unit (in or mm, defaults to in)

#### Entity Properties
- **`entityId`** (`string`) - The entity ID
- **`state`** (`string`) - Raw state value from Home Assistant
- **`attributes`** (`object`) - All entity attributes
- **`lastChanged`** (`Date`) - When the entity last changed
- **`lastUpdated`** (`Date`) - When the entity was last updated

## Hook API

### Basic Usage

```tsx
import { useWeather } from 'hass-react'

function MyComponent() {
  const weather = useWeather('weather.home')

  // All the same properties as component render props
  return (
    <div>
      <p>Condition: {weather.condition}</p>
      <p>Temperature: {weather.temperature}{weather.temperatureUnit}</p>
    </div>
  )
}
```

The `useWeather` hook returns an object with all the same properties and methods as the component's render props.

## Examples

### Simple Weather Card

```tsx
<Weather entityId="weather.home">
  {({ condition, temperature, temperatureUnit, humidity, attributes }) => (
    <div style={{
      padding: '1rem',
      border: '1px solid #ccc',
      borderRadius: '8px'
    }}>
      <h3>{attributes.friendly_name}</h3>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <p style={{ fontSize: '2rem', margin: 0, textTransform: 'capitalize' }}>
          {condition.replace('-', ' ')}
        </p>
        {temperature !== null && (
          <p style={{ fontSize: '3rem', margin: 0, fontWeight: 'bold' }}>
            {temperature}{temperatureUnit}
          </p>
        )}
      </div>

      {humidity !== null && (
        <p>Humidity: {humidity}%</p>
      )}
    </div>
  )}
</Weather>
```

### Detailed Weather Display

```tsx
<Weather entityId="weather.forecast_home">
  {({
    condition, temperature, temperatureUnit,
    humidity, pressure, pressureUnit,
    windSpeed, windSpeedUnit, windBearing,
    apparentTemperature, attributes
  }) => {
    const getWindDirection = (degrees) => {
      if (degrees === null) return 'N/A'
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
      const index = Math.round(degrees / 45) % 8
      return directions[index]
    }

    return (
      <div style={{
        padding: '1.5rem',
        border: '1px solid #ddd',
        borderRadius: '12px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2>{attributes.friendly_name}</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div>
            <h4>Condition</h4>
            <p style={{ fontSize: '1.2rem', textTransform: 'capitalize' }}>
              {condition.replace('-', ' ')}
            </p>
          </div>

          {temperature !== null && (
            <div>
              <h4>Temperature</h4>
              <p style={{ fontSize: '1.2rem' }}>
                {temperature}{temperatureUnit}
              </p>
            </div>
          )}

          {apparentTemperature !== null && (
            <div>
              <h4>Feels Like</h4>
              <p>{apparentTemperature}{temperatureUnit}</p>
            </div>
          )}

          {humidity !== null && (
            <div>
              <h4>Humidity</h4>
              <p>{humidity}%</p>
            </div>
          )}

          {pressure !== null && (
            <div>
              <h4>Pressure</h4>
              <p>{pressure} {pressureUnit}</p>
            </div>
          )}

          {windSpeed !== null && (
            <div>
              <h4>Wind</h4>
              <p>
                {windSpeed} {windSpeedUnit} {getWindDirection(windBearing)}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }}
</Weather>
```

### Weather with Icon Mapping

```tsx
const getWeatherIcon = (condition) => {
  const iconMap = {
    'clear-night': '🌙',
    'cloudy': '☁️',
    'exceptional': '⚠️',
    'fog': '🌫️',
    'hail': '🧊',
    'lightning': '⚡',
    'lightning-rainy': '⛈️',
    'partlycloudy': '⛅',
    'pouring': '🌧️',
    'rainy': '🌦️',
    'snowy': '❄️',
    'snowy-rainy': '🌨️',
    'sunny': '☀️',
    'windy': '💨',
    'windy-variant': '🌬️'
  }
  return iconMap[condition] || '🌡️'
}

<Weather entityId="weather.home">
  {({
    condition, temperature, temperatureUnit,
    humidity, windSpeed, windSpeedUnit,
    attributes
  }) => (
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      border: '2px solid #e0e0e0',
      borderRadius: '16px'
    }}>
      <h3>{attributes.friendly_name}</h3>

      <div style={{ fontSize: '5rem', margin: '1rem 0' }}>
        {getWeatherIcon(condition)}
      </div>

      <p style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>
        {condition.replace('-', ' ')}
      </p>

      {temperature !== null && (
        <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
          {temperature}{temperatureUnit}
        </p>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '1.5rem',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        {humidity !== null && (
          <div>
            <div>Humidity</div>
            <strong>{humidity}%</strong>
          </div>
        )}

        {windSpeed !== null && (
          <div>
            <div>Wind</div>
            <strong>{windSpeed} {windSpeedUnit}</strong>
          </div>
        )}
      </div>
    </div>
  )}
</Weather>
```

### Compact Weather Display

```tsx
<Weather entityId="weather.home">
  {({ condition, temperature, temperatureUnit, humidity, windSpeed, windSpeedUnit }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.75rem',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    }}>
      <div style={{ fontSize: '2rem' }}>
        {getWeatherIcon(condition)}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold' }}>
          {temperature !== null && `${temperature}${temperatureUnit}`}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'capitalize' }}>
          {condition.replace('-', ' ')}
        </div>
      </div>

      <div style={{ fontSize: '0.85rem', textAlign: 'right' }}>
        {humidity !== null && <div>💧 {humidity}%</div>}
        {windSpeed !== null && <div>💨 {windSpeed} {windSpeedUnit}</div>}
      </div>
    </div>
  )}
</Weather>
```

### Using Hooks

```tsx
import { useWeather } from 'hass-react'

function WeatherCard({ entityId }) {
  const weather = useWeather(entityId)

  const getWeatherEmoji = (condition) => {
    const emojiMap = {
      'sunny': '☀️',
      'cloudy': '☁️',
      'rainy': '🌦️',
      'snowy': '❄️',
      'windy': '💨'
    }
    return emojiMap[condition] || '🌡️'
  }

  return (
    <div style={{
      padding: '1.5rem',
      border: '1px solid #ddd',
      borderRadius: '12px'
    }}>
      <h3>{weather.attributes.friendly_name}</h3>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '1rem'
      }}>
        <div style={{ fontSize: '3rem' }}>
          {getWeatherEmoji(weather.condition)}
        </div>

        <div>
          {weather.temperature !== null && (
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {weather.temperature}{weather.temperatureUnit}
            </div>
          )}
          <div style={{ textTransform: 'capitalize' }}>
            {weather.condition.replace('-', ' ')}
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '1rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.5rem',
        fontSize: '0.9rem'
      }}>
        {weather.humidity !== null && (
          <div>
            <span style={{ color: '#666' }}>Humidity: </span>
            <strong>{weather.humidity}%</strong>
          </div>
        )}

        {weather.pressure !== null && (
          <div>
            <span style={{ color: '#666' }}>Pressure: </span>
            <strong>{weather.pressure} {weather.pressureUnit}</strong>
          </div>
        )}

        {weather.windSpeed !== null && (
          <div>
            <span style={{ color: '#666' }}>Wind: </span>
            <strong>{weather.windSpeed} {weather.windSpeedUnit}</strong>
          </div>
        )}

        {weather.apparentTemperature !== null && (
          <div>
            <span style={{ color: '#666' }}>Feels Like: </span>
            <strong>{weather.apparentTemperature}{weather.temperatureUnit}</strong>
          </div>
        )}
      </div>
    </div>
  )
}
```

### Multiple Weather Locations

```tsx
import { useWeather } from 'hass-react'

function WeatherDashboard() {
  const locations = [
    { id: 'weather.home', name: 'Home' },
    { id: 'weather.office', name: 'Office' },
    { id: 'weather.beach_house', name: 'Beach House' }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem'
    }}>
      {locations.map(location => (
        <WeatherLocation key={location.id} entityId={location.id} />
      ))}
    </div>
  )
}

function WeatherLocation({ entityId }) {
  const weather = useWeather(entityId)

  return (
    <div style={{
      padding: '1rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: 'white'
    }}>
      <h4>{weather.attributes.friendly_name}</h4>

      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        {weather.temperature !== null && (
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            {weather.temperature}{weather.temperatureUnit}
          </div>
        )}
        <div style={{ textTransform: 'capitalize', color: '#666' }}>
          {weather.condition.replace('-', ' ')}
        </div>
      </div>

      {weather.humidity !== null && (
        <div style={{ fontSize: '0.9rem' }}>
          Humidity: {weather.humidity}%
        </div>
      )}
    </div>
  )
}
```

## Weather Conditions

The following standard weather conditions are supported:

- `clear-night` - Clear night sky
- `cloudy` - Cloudy
- `exceptional` - Exceptional weather
- `fog` - Foggy
- `hail` - Hailing
- `lightning` - Lightning
- `lightning-rainy` - Thunderstorm
- `partlycloudy` - Partly cloudy
- `pouring` - Heavy rain
- `rainy` - Rainy
- `snowy` - Snowing
- `snowy-rainy` - Mixed snow and rain
- `sunny` - Sunny
- `windy` - Windy
- `windy-variant` - Strong winds

## TypeScript

The library includes full TypeScript support with these types:

```typescript
import type { WeatherState, WeatherAttributes, WeatherCondition } from 'hass-react'

// WeatherCondition type includes all standard conditions:
type WeatherCondition =
  | 'clear-night'
  | 'cloudy'
  | 'exceptional'
  | 'fog'
  | 'hail'
  | 'lightning'
  | 'lightning-rainy'
  | 'partlycloudy'
  | 'pouring'
  | 'rainy'
  | 'snowy'
  | 'snowy-rainy'
  | 'sunny'
  | 'windy'
  | 'windy-variant'

// Use in your components
const weather: WeatherState = useWeather('weather.home')
```
