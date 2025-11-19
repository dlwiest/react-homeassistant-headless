import React from 'react'
import { Weather } from 'hass-react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'

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
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription className="capitalize">
              {weather.condition.replace('-', ' ')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-6xl">
                {getConditionEmoji(weather.condition)}
              </div>

              {weather.temperature !== null && (
                <div className="text-4xl font-semibold text-white">
                  {weather.temperature}°{weather.temperatureUnit.replace('°', '')}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
                {weather.humidity !== null && (
                  <div>
                    <div className="text-muted-foreground">Humidity</div>
                    <div className="font-semibold text-white">{weather.humidity}%</div>
                  </div>
                )}

                {weather.pressure !== null && (
                  <div>
                    <div className="text-muted-foreground">Pressure</div>
                    <div className="font-semibold text-white">{weather.pressure} {weather.pressureUnit}</div>
                  </div>
                )}

                {weather.windSpeed !== null && (
                  <div>
                    <div className="text-muted-foreground">Wind</div>
                    <div className="font-semibold text-white">{weather.windSpeed} {weather.windSpeedUnit}</div>
                  </div>
                )}

                {weather.apparentTemperature !== null && (
                  <div>
                    <div className="text-muted-foreground">Feels Like</div>
                    <div className="font-semibold text-white">{weather.apparentTemperature}°{weather.temperatureUnit.replace('°', '')}</div>
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
