import React, { useState, useCallback } from 'react'
import { BinarySensor } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Box,
  Stack,
  Chip,
  Alert,
  AlertTitle,
  Collapse,
  Button
} from '@mui/material'
import { 
  Sensors,
  Home,
  VisibilityOff,
  Person,
  Warning,
  WifiOff,
  Close,
  CheckCircle,
  Cancel
} from '@mui/icons-material'

interface BinarySensorCardProps {
  entityId: string
  name: string
}

const getDeviceIcon = (deviceClass?: string, isOn?: boolean) => {
  switch (deviceClass) {
    case 'door':
    case 'opening':
    case 'window':
      return <Home sx={{ fontSize: 32 }} />
    case 'motion':
      return <VisibilityOff sx={{ fontSize: 32 }} />
    case 'occupancy':
      return <Person sx={{ fontSize: 32 }} />
    default:
      return <Sensors sx={{ fontSize: 32 }} />
  }
}

const getDeviceLabel = (deviceClass?: string) => {
  switch (deviceClass) {
    case 'door': return 'Door Sensor'
    case 'opening': return 'Door/Window Sensor'
    case 'window': return 'Window Sensor'
    case 'motion': return 'Motion Sensor'
    case 'occupancy': return 'Occupancy Sensor'
    case 'safety': return 'Safety Sensor'
    case 'smoke': return 'Smoke Detector'
    case 'gas': return 'Gas Detector'
    default: return 'Binary Sensor'
  }
}

const getStateText = (deviceClass?: string, isOn?: boolean) => {
  switch (deviceClass) {
    case 'door':
    case 'opening':
      return isOn ? 'Open' : 'Closed'
    case 'window':
      return isOn ? 'Open' : 'Closed'
    case 'motion':
      return isOn ? 'Motion Detected' : 'No Motion'
    case 'occupancy':
      return isOn ? 'Occupied' : 'Not Occupied'
    case 'safety':
    case 'smoke':
    case 'gas':
      return isOn ? 'Alert' : 'OK'
    default:
      return isOn ? 'On' : 'Off'
  }
}

export const BinarySensorCard = ({ entityId, name }: BinarySensorCardProps) => {
  const [actionError, setActionError] = useState<string | null>(null)

  return (
    <BinarySensor entityId={entityId}>
      {(binarySensor) => {
        // Check for entity availability errors
        if (binarySensor.error) {
          return (
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardHeader
                avatar={<Warning sx={{ color: 'error.main', fontSize: 32 }} />}
                title={
                  <Typography variant="h6" component="h2">
                    {name}
                  </Typography>
                }
                subheader="Entity Error"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Alert severity="error">
                  <AlertTitle>Entity Not Available</AlertTitle>
                  {binarySensor.error.message}
                </Alert>
              </CardContent>
            </Card>
          )
        }

        const stateText = getStateText(binarySensor.deviceClass, binarySensor.isOn)
        const deviceLabel = getDeviceLabel(binarySensor.deviceClass)
        const isAlert = ['safety', 'smoke', 'gas'].includes(binarySensor.deviceClass || '')

        return (
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              avatar={
                <Box sx={{ 
                  color: binarySensor.isOn 
                    ? isAlert ? 'error.main' : 'success.main'
                    : 'text.disabled'
                }}>
                  {getDeviceIcon(binarySensor.deviceClass, binarySensor.isOn)}
                </Box>
              }
              title={
                <Typography variant="h6" component="h2">
                  {name}
                </Typography>
              }
              subheader={
                <Box display="flex" alignItems="center" gap={1}>
                  <span>{binarySensor.isConnected ? stateText : 'Disconnected'}</span>
                  {!binarySensor.isConnected && <WifiOff fontSize="small" />}
                </Box>
              }
              action={
                <Box display="flex" alignItems="center" gap={1}>
                  {binarySensor.isOn ? (
                    <CheckCircle 
                      sx={{ 
                        color: isAlert ? 'error.main' : 'success.main',
                        fontSize: 28 
                      }} 
                    />
                  ) : (
                    <Cancel 
                      sx={{ 
                        color: 'text.disabled',
                        fontSize: 28 
                      }} 
                    />
                  )}
                </Box>
              }
            />

            {/* Display action errors */}
            <Collapse in={!!actionError}>
              {actionError && (
                <Box sx={{ px: 2, pb: 1 }}>
                  <Alert 
                    severity="error" 
                    action={
                      <Button 
                        color="inherit" 
                        size="small"
                        onClick={() => setActionError(null)}
                      >
                        <Close fontSize="small" />
                      </Button>
                    }
                  >
                    {actionError}
                  </Alert>
                </Box>
              )}
            </Collapse>

            <CardContent sx={{ flexGrow: 1 }}>
              <Stack spacing={2}>
                {/* Status indicator */}
                <Box>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    Status
                  </Typography>
                  <Chip 
                    label={stateText}
                    color={
                      binarySensor.isOn 
                        ? isAlert ? 'error' : 'success'
                        : 'default'
                    }
                    variant={binarySensor.isOn ? 'filled' : 'outlined'}
                    size="large"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>

                {/* Additional info for specific device classes */}
                {binarySensor.deviceClass === 'motion' && (
                  <Typography variant="body2" color="text.secondary">
                    {binarySensor.isOn ? '🏃 Movement detected in the area' : '😴 Area is quiet'}
                  </Typography>
                )}
                
                {(binarySensor.deviceClass === 'door' || binarySensor.deviceClass === 'opening') && (
                  <Typography variant="body2" color="text.secondary">
                    {binarySensor.isOn ? '🚪 Entry is open' : '🔒 Entry is secure'}
                  </Typography>
                )}

                {binarySensor.deviceClass === 'occupancy' && (
                  <Typography variant="body2" color="text.secondary">
                    {binarySensor.isOn ? '👥 Someone is present' : '🏠 Room is empty'}
                  </Typography>
                )}
              </Stack>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label={deviceLabel} size="small" />
                  {binarySensor.deviceClass && (
                    <Chip 
                      label={binarySensor.deviceClass} 
                      size="small" 
                      variant="outlined" 
                    />
                  )}
                  {binarySensor.icon && (
                    <Chip 
                      label={binarySensor.icon} 
                      size="small" 
                      variant="outlined" 
                    />
                  )}
                </Stack>
                {!binarySensor.isConnected && (
                  <Typography variant="caption" color="error" display="flex" alignItems="center" gap={0.5}>
                    <Warning fontSize="inherit" />
                    Not connected to Home Assistant
                  </Typography>
                )}
              </Stack>
            </CardActions>
          </Card>
        )
      }}
    </BinarySensor>
  )
}