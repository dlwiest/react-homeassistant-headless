import React from 'react'
import { Climate } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ConnectionIndicator } from '@/components/ui/connection-indicator'
import { Plus, Minus } from 'lucide-react'

interface ClimateCardProps {
  entityId: string
  name: string
}

export const ClimateCard = ({ entityId, name }: ClimateCardProps) => {
  return (
    <Climate entityId={entityId}>
      {(climate) => (
        <Card className="h-full">
          <CardHeader>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription>{climate.mode}</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Current</div>
                <div className="text-3xl font-semibold text-white">
                  {climate.currentTemperature ?? '--'}°
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Target</div>
                <div className="text-3xl font-semibold text-white">
                  {climate.targetTemperature ?? '--'}°
                </div>
              </div>
            </div>

            {climate.supportsTargetTemperature && (
              <div className="flex justify-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => climate.setTemperature((climate.targetTemperature ?? climate.minTemp) - 1)}
                  disabled={!climate.targetTemperature || climate.targetTemperature <= climate.minTemp}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => climate.setTemperature((climate.targetTemperature ?? climate.maxTemp) + 1)}
                  disabled={!climate.targetTemperature || climate.targetTemperature >= climate.maxTemp}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Mode</label>
                <Select value={climate.mode} onValueChange={climate.setMode}>
                  <SelectTrigger className="bg-slate-800 border-slate-600/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {climate.supportedModes.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {climate.supportsFanMode && climate.supportedFanModes.length > 0 && (
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Fan</label>
                  <Select value={climate.fanMode || ''} onValueChange={climate.setFanMode}>
                    <SelectTrigger className="bg-slate-800 border-slate-600/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {climate.supportedFanModes.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex-col items-start gap-2">
            <div className="flex flex-wrap gap-1.5">
              <Badge>Range: {climate.minTemp}-{climate.maxTemp}°</Badge>
            </div>
            <ConnectionIndicator isConnected={climate.isConnected} className="pt-2" />
          </CardFooter>
        </Card>
      )}
    </Climate>
  )
}
