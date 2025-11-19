import React from 'react'
import { Vacuum } from 'hass-react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { ConnectionIndicator } from '@/components/ui/connection-indicator'

interface VacuumCardProps {
  entityId: string
  name: string
}

const getStateText = (state: string, isCleaning: boolean, isDocked: boolean, isReturning: boolean, isError: boolean) => {
  if (isCleaning) return 'Cleaning'
  if (isDocked) return 'Docked'
  if (isReturning) return 'Returning'
  if (isError) return 'Error'
  return 'Idle'
}

export const VacuumCard = ({ entityId, name }: VacuumCardProps) => {
  return (
    <Vacuum entityId={entityId}>
      {(vacuum) => (
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>
              {getStateText(vacuum.state, vacuum.isCleaning, vacuum.isDocked, vacuum.isReturning, vacuum.isError)}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Battery Level */}
            {vacuum.batteryLevel !== null && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Battery</span>
                  <span className="text-slate-300">{vacuum.batteryLevel}%</span>
                </div>
                <Slider
                  value={[vacuum.batteryLevel]}
                  max={100}
                  disabled
                  className="w-full"
                />
              </div>
            )}

            {/* Fan Speed */}
            {vacuum.supportsFanSpeed && vacuum.availableFanSpeeds.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Fan Speed</label>
                <Select
                  value={vacuum.fanSpeed || ''}
                  onValueChange={(value) => vacuum.setFanSpeed(value)}
                  disabled={!vacuum.isCleaning}
                >
                  <SelectTrigger className={`bg-slate-800 border-slate-600/50 ${!vacuum.isCleaning ? 'opacity-50' : ''}`}>
                    <SelectValue placeholder="Select speed" />
                  </SelectTrigger>
                  <SelectContent>
                    {vacuum.availableFanSpeeds.map((speed) => (
                      <SelectItem key={speed} value={speed}>
                        {speed}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Control Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {vacuum.supportsStart && !vacuum.isCleaning && (
                <Button
                  onClick={() => vacuum.start()}
                  variant="outline"
                >
                  Start
                </Button>
              )}

              {vacuum.supportsPause && vacuum.isCleaning && (
                <Button
                  onClick={() => vacuum.pause()}
                  variant="outline"
                >
                  Pause
                </Button>
              )}

              {vacuum.supportsStop && vacuum.isCleaning && (
                <Button
                  onClick={() => vacuum.stop()}
                  variant="outline"
                >
                  Stop
                </Button>
              )}

              {vacuum.supportsReturnHome && !vacuum.isDocked && (
                <Button
                  onClick={() => vacuum.returnToBase()}
                  variant="outline"
                >
                  Dock
                </Button>
              )}

              {vacuum.supportsLocate && (
                <Button
                  onClick={() => vacuum.locate()}
                  variant="outline"
                >
                  Locate
                </Button>
              )}

              {vacuum.supportsCleanSpot && !vacuum.isCleaning && (
                <Button
                  onClick={() => vacuum.cleanSpot()}
                  variant="outline"
                >
                  Spot
                </Button>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex-col items-start gap-2">
            <div className="flex flex-wrap gap-1.5">
              {vacuum.supportsStart && <Badge>Start</Badge>}
              {vacuum.supportsPause && <Badge>Pause</Badge>}
              {vacuum.supportsReturnHome && <Badge>Dock</Badge>}
              {vacuum.supportsFanSpeed && <Badge>Fan Speed</Badge>}
              {vacuum.supportsCleanSpot && <Badge>Spot Clean</Badge>}
            </div>
            <ConnectionIndicator isConnected={vacuum.isConnected} className="pt-2" />
          </CardFooter>
        </Card>
      )}
    </Vacuum>
  )
}
