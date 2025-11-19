import React from 'react'
import { Weather } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Grid
} from '@mui/material'

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
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            title={
              <Typography variant="h6" component="h2">
                {name}
              </Typography>
            }
            subheader={weather.condition.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          />

          <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Box sx={{ fontSize: '4rem', mb: 2 }}>
              {getConditionEmoji(weather.condition)}
            </Box>

            {weather.temperature !== null && (
              <Typography
                variant="h2"
                component="div"
                sx={{
                  fontWeight: 700,
                  mb: 3
                }}
              >
                {weather.temperature}°{weather.temperatureUnit.replace('°', '')}
              </Typography>
            )}

            <Grid container spacing={2} sx={{ textAlign: 'left' }}>
              {weather.humidity !== null && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Humidity
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {weather.humidity}%
                  </Typography>
                </Grid>
              )}

              {weather.pressure !== null && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Pressure
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {weather.pressure} {weather.pressureUnit}
                  </Typography>
                </Grid>
              )}

              {weather.windSpeed !== null && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Wind
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {weather.windSpeed} {weather.windSpeedUnit}
                  </Typography>
                </Grid>
              )}

              {weather.apparentTemperature !== null && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Feels Like
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {weather.apparentTemperature}°{weather.temperatureUnit.replace('°', '')}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Weather>
  )
}
