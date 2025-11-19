import React from 'react'
import { Weather } from 'hass-react'
import { Card, CardHeader, CardContent } from '../layout/Card'

interface WeatherCardProps {
  entityId: string
  name: string
}

const getConditionEmoji = (condition: string) => {
  const emojiMap: Record<string, string> = {
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
  return emojiMap[condition] || '🌡️'
}

export const WeatherCard = ({ entityId, name }: WeatherCardProps) => {
  return (
    <Weather entityId={entityId}>
      {(weather) => (
        <Card>
          <CardHeader
            title={name}
            subtitle={weather.condition}
          />

          <CardContent>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', margin: '1rem 0' }}>
                {getConditionEmoji(weather.condition)}
              </div>

              {weather.temperature !== null && (
                <div className="sensor-value" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                  {weather.temperature}°{weather.temperatureUnit.replace('°', '')}
                </div>
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1rem',
                marginTop: '1.5rem',
                textAlign: 'left'
              }}>
                {weather.humidity !== null && (
                  <div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Humidity</div>
                    <div style={{ fontWeight: 600 }}>{weather.humidity}%</div>
                  </div>
                )}

                {weather.pressure !== null && (
                  <div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Pressure</div>
                    <div style={{ fontWeight: 600 }}>{weather.pressure} {weather.pressureUnit}</div>
                  </div>
                )}

                {weather.windSpeed !== null && (
                  <div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Wind</div>
                    <div style={{ fontWeight: 600 }}>{weather.windSpeed} {weather.windSpeedUnit}</div>
                  </div>
                )}

                {weather.apparentTemperature !== null && (
                  <div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Feels Like</div>
                    <div style={{ fontWeight: 600 }}>{weather.apparentTemperature}°{weather.temperatureUnit.replace('°', '')}</div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Weather>
  )
}
