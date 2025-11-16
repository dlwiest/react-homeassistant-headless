import React from 'react'
import { Sensor } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip
} from '@mui/material'

interface SensorCardProps {
  entityId: string
  name: string
  precision?: number
}

export const SensorCard = ({ entityId, name, precision = 1 }: SensorCardProps) => {
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
            subheader={sensor.deviceClass || 'Sensor'}
          />

          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              variant="h3"
              component="div"
              sx={{
                fontWeight: 700,
                color: sensor.numericValue !== null ? 'text.primary' : 'text.secondary'
              }}
            >
              {formatValue(sensor.numericValue, sensor.unitOfMeasurement)}
            </Typography>
          </CardContent>

          <CardActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {sensor.stateClass && (
              <Chip label={sensor.stateClass} size="small" />
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: sensor.isConnected ? 'success.main' : 'error.main'
                }}
              />
              <Typography variant="caption">
                {sensor.isConnected ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </CardActions>
        </Card>
      )}
    </Sensor>
  )
}

