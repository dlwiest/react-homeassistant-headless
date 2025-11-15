import React from 'react'
import { Sensor } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface SensorCardProps {
  entityId: string
  name: string
  precision?: number
}

const SensorCard = ({ entityId, name, precision = 1 }: SensorCardProps) => {
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
        <Card>
          <CardHeader
            title={name}
            subtitle={sensor.deviceClass || 'Sensor'}
          />

          <CardContent>
            <div className="sensor-value">
              {formatValue(sensor.numericValue, sensor.unitOfMeasurement)}
            </div>
          </CardContent>

          <CardFooter>
            {sensor.stateClass && (
              <div className="badge-container">
                <span className="badge">{sensor.stateClass}</span>
              </div>
            )}
            <div className={`connection-indicator ${sensor.isConnected ? 'connected' : 'disconnected'}`}>
              <div className="connection-dot"></div>
              <span>{sensor.isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </Sensor>
  )
}

export default SensorCard
