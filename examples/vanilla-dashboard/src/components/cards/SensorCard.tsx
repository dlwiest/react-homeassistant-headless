import React from 'react'
import { Sensor } from 'react-homeassistant-headless'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface SensorCardProps {
  entityId: string
  name: string
  icon?: string
  precision?: number
}

export const SensorCard = ({ entityId, name, icon = '📊', precision = 1 }: SensorCardProps) => {
  const formatValue = (value: string | number | null | undefined, unit?: string) => {
    if (value === null || value === undefined) return 'Unknown'
    if (typeof value === 'number') {
      return `${value.toFixed(precision)}${unit ? ` ${unit}` : ''}`
    }
    return `${value}${unit ? ` ${unit}` : ''}`
  }

  const getIconForDeviceClass = (deviceClass?: string) => {
    switch (deviceClass) {
      case 'temperature': return '🌡️'
      case 'humidity': return '💧'
      case 'pressure': return '📊'
      case 'battery': return '🔋'
      case 'power': return '⚡'
      case 'energy': return '🔌'
      case 'illuminance': return '💡'
      default: return icon
    }
  }

  return (
    <Sensor entityId={entityId}>
      {(sensor) => (
        <Card>
          <CardHeader 
            title={name}
            subtitle={sensor.deviceClass || 'Sensor'}
          />
          
          <CardContent>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                {getIconForDeviceClass(sensor.deviceClass)}
              </div>
              <div className="sensor-value">
                {formatValue(sensor.numericValue, sensor.unitOfMeasurement)}
              </div>
            </div>
          </CardContent>

          <CardFooter>
            Last updated: {sensor.lastUpdated.toLocaleTimeString()}
          </CardFooter>
        </Card>
      )}
    </Sensor>
  )
}