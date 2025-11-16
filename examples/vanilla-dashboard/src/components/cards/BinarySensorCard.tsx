import React from 'react'
import { BinarySensor } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface BinarySensorCardProps {
  entityId: string
  name: string
}

const getDeviceLabel = (deviceClass?: string) => {
  switch (deviceClass) {
    case 'door': return 'Door'
    case 'opening': return 'Opening'
    case 'window': return 'Window'
    case 'motion': return 'Motion'
    case 'occupancy': return 'Occupancy'
    case 'safety': return 'Safety'
    case 'smoke': return 'Smoke'
    case 'gas': return 'Gas'
    default: return 'Binary Sensor'
  }
}

const getStateText = (deviceClass?: string, isOn?: boolean) => {
  switch (deviceClass) {
    case 'door':
    case 'opening':
    case 'window':
      return isOn ? 'Open' : 'Closed'
    case 'motion':
      return isOn ? 'Detected' : 'Clear'
    case 'occupancy':
      return isOn ? 'Occupied' : 'Clear'
    case 'safety':
    case 'smoke':
    case 'gas':
      return isOn ? 'Alert' : 'OK'
    default:
      return isOn ? 'On' : 'Off'
  }
}

export const BinarySensorCard = ({ entityId, name }: BinarySensorCardProps) => {
  return (
    <BinarySensor entityId={entityId}>
      {(binarySensor) => (
        <Card>
          <CardHeader
            title={name}
            subtitle={getDeviceLabel(binarySensor.deviceClass)}
          />

          <CardContent>
            <div className={`binary-sensor-value ${binarySensor.isOn ? 'active' : 'inactive'}`}>
              {getStateText(binarySensor.deviceClass, binarySensor.isOn)}
            </div>
          </CardContent>

          <CardFooter>
            <div className={`connection-indicator ${binarySensor.isConnected ? 'connected' : 'disconnected'}`}>
              <div className="connection-dot"></div>
              <span>{binarySensor.isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </BinarySensor>
  )
}

