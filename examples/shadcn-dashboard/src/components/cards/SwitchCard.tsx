import { Switch as SwitchEntity } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ConnectionIndicator } from '@/components/ui/connection-indicator'

interface SwitchCardProps {
  entityId: string
  name: string
}

export const SwitchCard = ({ entityId, name }: SwitchCardProps) => {
  return (
    <SwitchEntity entityId={entityId}>
      {(switchEntity) => (
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription>
                  {switchEntity.isOn ? 'On' : 'Off'}
                </CardDescription>
              </div>
              <Switch
                checked={switchEntity.isOn}
                onCheckedChange={switchEntity.toggle}
              />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-sm text-slate-400">
              Last changed: {switchEntity.lastChanged.toLocaleTimeString()}
            </div>
          </CardContent>

          <CardFooter className="flex-col items-start gap-2">
            <ConnectionIndicator isConnected={switchEntity.isConnected} className="pt-2" />
          </CardFooter>
        </Card>
      )}
    </SwitchEntity>
  )
}
