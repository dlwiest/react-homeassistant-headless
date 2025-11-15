import React from 'react'
import { Sensor } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ConnectionIndicator } from '@/components/ui/connection-indicator'

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
        <Card className="h-full">
          <CardHeader>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription>
                {sensor.deviceClass || 'Sensor'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-semibold text-white">
              {formatValue(sensor.numericValue, sensor.unitOfMeasurement)}
            </div>
          </CardContent>

          <CardFooter className="flex-col items-start gap-2">
            {sensor.stateClass && (
              <div className="flex flex-wrap gap-1.5">
                <Badge>{sensor.stateClass}</Badge>
              </div>
            )}
            <ConnectionIndicator isConnected={sensor.isConnected} className="pt-2" />
          </CardFooter>
        </Card>
      )}
    </Sensor>
  )
}

export default SensorCard
