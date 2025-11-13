import React from 'react'
import { Sensor } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Chip
} from '@mui/material'
import {
  Thermostat,
  WaterDrop,
  Speed,
  BatteryFull,
  Bolt,
  Power,
  Lightbulb,
  Analytics
} from '@mui/icons-material'

interface SensorCardProps {
  entityId: string
  name: string
  precision?: number
}

export const SensorCard = ({ entityId, name, precision = 1 }: SensorCardProps) => {
  const getIconForDeviceClass = (deviceClass?: string) => {
    switch (deviceClass) {
      case 'temperature': return <Thermostat sx={{ fontSize: 48 }} />
      case 'humidity': return <WaterDrop sx={{ fontSize: 48 }} />
      case 'pressure': return <Speed sx={{ fontSize: 48 }} />
      case 'battery': return <BatteryFull sx={{ fontSize: 48 }} />
      case 'power': return <Bolt sx={{ fontSize: 48 }} />
      case 'energy': return <Power sx={{ fontSize: 48 }} />
      case 'illuminance': return <Lightbulb sx={{ fontSize: 48 }} />
      default: return <Analytics sx={{ fontSize: 48 }} />
    }
  }

  const formatValue = (value: string | number | null | undefined, unit?: string) => {
    if (value === null || value === undefined) return 'Unknown'
    if (typeof value === 'number') {
      return `${value.toFixed(precision)}${unit ? ` ${unit}` : ''}`
    }
    return `${value}${unit ? ` ${unit}` : ''}`
  }

  return (
    <Sensor entityId={entityId}>
      {(sensor) => (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            title={
              <Typography variant="h6" component="h2">
                {name}
              </Typography>
            }
            subheader={
              <Chip 
                label={sensor.deviceClass || 'Sensor'} 
                size="small" 
                color="primary"
                variant="outlined"
              />
            }
          />
          
          <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Box sx={{ mb: 2 }}>
              {getIconForDeviceClass(sensor.deviceClass)}
            </Box>
            
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                mb: 1,
                color: sensor.numericValue !== null ? 'text.primary' : 'text.secondary'
              }}
            >
              {formatValue(sensor.numericValue, sensor.unitOfMeasurement)}
            </Typography>
            
            {sensor.numericValue === null && sensor.value && (
              <Typography variant="h6" color="text.secondary">
                {sensor.value}
              </Typography>
            )}
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Last updated: {sensor.lastUpdated.toLocaleTimeString()}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Sensor>
  )
}