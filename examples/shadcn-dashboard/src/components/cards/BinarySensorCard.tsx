import { useState } from 'react'
import { BinarySensor } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Eye,
  Users,
  AlertTriangle, 
  WifiOff,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface BinarySensorCardProps {
  entityId: string
  name: string
}

const getDeviceIcon = (deviceClass?: string, isOn?: boolean) => {
  const iconClass = "h-5 w-5"
  
  switch (deviceClass) {
    case 'door':
    case 'opening':
    case 'window':
      return <Home className={iconClass} />
    case 'motion':
      return <Eye className={iconClass} />
    case 'occupancy':
      return <Users className={iconClass} />
    default:
      return <Home className={iconClass} />
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

const getStateColor = (deviceClass?: string, isOn?: boolean) => {
  const isAlert = ['safety', 'smoke', 'gas'].includes(deviceClass || '')
  
  if (isOn) {
    return isAlert ? 'text-red-600' : 'text-green-600'
  }
  return 'text-gray-400'
}

const getBorderColor = (deviceClass?: string, isOn?: boolean) => {
  const isAlert = ['safety', 'smoke', 'gas'].includes(deviceClass || '')
  
  if (isOn) {
    return isAlert ? 'border-red-200' : 'border-green-200'
  }
  return 'border-gray-200'
}

export const BinarySensorCard = ({ entityId, name }: BinarySensorCardProps) => {
  const [actionError, setActionError] = useState<string | null>(null)

  return (
    <BinarySensor entityId={entityId}>
      {(binarySensor) => {
        // Check for entity availability errors
        if (binarySensor.error) {
          return (
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <div>
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <CardDescription>Entity Error</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                  <p className="text-sm text-destructive font-medium">Entity Not Available</p>
                  <p className="text-xs text-muted-foreground mt-1">{binarySensor.error.message}</p>
                </div>
              </CardContent>
            </Card>
          )
        }

        const stateText = getStateText(binarySensor.deviceClass, binarySensor.isOn)
        const deviceLabel = getDeviceLabel(binarySensor.deviceClass)
        const isAlert = ['safety', 'smoke', 'gas'].includes(binarySensor.deviceClass || '')

        return (
          <Card className={`h-full ${getBorderColor(binarySensor.deviceClass, binarySensor.isOn)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={getStateColor(binarySensor.deviceClass, binarySensor.isOn)}>
                    {getDeviceIcon(binarySensor.deviceClass, binarySensor.isOn)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      {binarySensor.isConnected ? stateText : 'Disconnected'}
                      {!binarySensor.isConnected && <WifiOff className="h-3 w-3" />}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center">
                  {binarySensor.isOn ? (
                    <CheckCircle 
                      className={`h-6 w-6 ${isAlert ? 'text-red-600' : 'text-green-600'}`}
                    />
                  ) : (
                    <XCircle className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </div>
            </CardHeader>

            {/* Display action errors */}
            {actionError && (
              <div className="mx-4 mb-2">
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-destructive">{actionError}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActionError(null)}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <CardContent className="space-y-4">
              {/* Status indicator */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status</span>
                  <span className={`text-sm font-bold ${getStateColor(binarySensor.deviceClass, binarySensor.isOn)}`}>
                    {stateText}
                  </span>
                </div>
              </div>

              {/* Additional context based on device type */}
              {binarySensor.deviceClass === 'motion' && (
                <p className="text-xs text-muted-foreground">
                  {binarySensor.isOn ? '🏃 Movement detected in the area' : '😴 Area is quiet'}
                </p>
              )}
              
              {(binarySensor.deviceClass === 'door' || binarySensor.deviceClass === 'opening') && (
                <p className="text-xs text-muted-foreground">
                  {binarySensor.isOn ? '🚪 Entry is open' : '🔒 Entry is secure'}
                </p>
              )}

              {binarySensor.deviceClass === 'occupancy' && (
                <p className="text-xs text-muted-foreground">
                  {binarySensor.isOn ? '👥 Someone is present' : '🏠 Room is empty'}
                </p>
              )}

              {isAlert && (
                <p className="text-xs text-muted-foreground">
                  {binarySensor.isOn ? '⚠️ Alert condition detected!' : '✅ All systems normal'}
                </p>
              )}
            </CardContent>

            <CardFooter className="pt-0">
              <div className="w-full space-y-2">
                <div className="flex flex-wrap gap-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {deviceLabel}
                  </span>
                  {binarySensor.deviceClass && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {binarySensor.deviceClass}
                    </span>
                  )}
                  {binarySensor.icon && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                      {binarySensor.icon}
                    </span>
                  )}
                </div>
                {!binarySensor.isConnected && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Not connected to Home Assistant
                  </p>
                )}
              </div>
            </CardFooter>
          </Card>
        )
      }}
    </BinarySensor>
  )
}