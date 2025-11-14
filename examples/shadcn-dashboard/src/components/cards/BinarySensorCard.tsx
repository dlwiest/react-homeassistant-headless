import { BinarySensor } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { ConnectionIndicator } from '@/components/ui/connection-indicator'

interface BinarySensorCardProps {
  entityId: string
  name: string
}

const getStateText = (deviceClass?: string, isOn?: boolean) => {
  switch (deviceClass) {
    case 'door':
    case 'opening':
      return isOn ? 'Open' : 'Closed'
    case 'window':
      return isOn ? 'Open' : 'Closed'
    case 'motion':
      return isOn ? 'Motion Detected' : 'Clear'
    case 'occupancy':
      return isOn ? 'Occupied' : 'Clear'
    case 'safety':
    case 'smoke':
    case 'gas':
      return isOn ? 'Alert' : 'OK'
    default:
      return isOn ? 'Detected' : 'Clear'
  }
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

export const BinarySensorCard = ({ entityId, name }: BinarySensorCardProps) => {
  return (
    <BinarySensor entityId={entityId}>
      {(binarySensor) => {
        const stateText = getStateText(binarySensor.deviceClass, binarySensor.isOn)
        const deviceLabel = getDeviceLabel(binarySensor.deviceClass)
        const isAlert = ['safety', 'smoke', 'gas'].includes(binarySensor.deviceClass || '')

        return (
          <Card className="h-full">
            <CardHeader>
              <div>
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription>
                  {deviceLabel}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <div className={`text-3xl font-semibold ${
                binarySensor.isOn
                  ? (isAlert ? 'text-red-400' : 'text-emerald-400')
                  : 'text-slate-400'
              }`}>
                {stateText}
              </div>
            </CardContent>

            <CardFooter className="flex-col items-start gap-2">
              <ConnectionIndicator isConnected={binarySensor.isConnected} className="pt-2" />
            </CardFooter>
          </Card>
        )
      }}
    </BinarySensor>
  )
}
