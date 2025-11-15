import React from 'react'
import { BinarySensor } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Box
} from '@mui/material'

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

const BinarySensorCard = ({ entityId, name }: BinarySensorCardProps) => {
  return (
    <BinarySensor entityId={entityId}>
      {(binarySensor) => (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            title={
              <Typography variant="h6" component="h2">
                {name}
              </Typography>
            }
            subheader={getDeviceLabel(binarySensor.deviceClass)}
          />

          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              variant="h3"
              component="div"
              sx={{
                fontWeight: 700,
                color: binarySensor.isOn ? 'success.main' : 'text.secondary'
              }}
            >
              {getStateText(binarySensor.deviceClass, binarySensor.isOn)}
            </Typography>
          </CardContent>

          <CardActions sx={{ p: 2, pt: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: binarySensor.isConnected ? 'success.main' : 'error.main'
                }}
              />
              <Typography variant="caption">
                {binarySensor.isConnected ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </CardActions>
        </Card>
      )}
    </BinarySensor>
  )
}

export default BinarySensorCard
