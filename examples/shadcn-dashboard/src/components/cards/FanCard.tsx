import React from 'react'
import { Fan } from 'hass-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ConnectionIndicator } from '@/components/ui/connection-indicator'

interface FanCardProps {
  entityId: string
  name: string
}

const FanCard = ({ entityId, name }: FanCardProps) => {
  return (
    <Fan entityId={entityId}>
      {(fan) => (
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription>
                  {fan.isOn ? 'On' : 'Off'}
                </CardDescription>
              </div>
              <Switch
                checked={fan.isOn}
                onCheckedChange={fan.toggle}
              />
            </div>
          </CardHeader>

          {fan.isOn && (
            <CardContent className="space-y-3">
              {fan.supportsSetSpeed && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Speed</span>
                    <span className="text-slate-300">{fan.percentage}%</span>
                  </div>
                  <Slider
                    value={[fan.percentage]}
                    onValueChange={([value]) => fan.setPercentage(value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}

              {fan.supportsPresetMode && fan.availablePresetModes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Preset Mode</label>
                  <Select
                    value={fan.presetMode || (fan.availablePresetModes[0] || '')}
                    onValueChange={fan.setPresetMode}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-600/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fan.availablePresetModes.map(preset => (
                        <SelectItem key={preset} value={preset}>
                          {preset}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {fan.supportsOscillate && (
                <div className="flex items-center justify-between">
                  <label htmlFor={`${entityId}-oscillate`} className="text-sm text-slate-400">
                    Oscillating
                  </label>
                  <Switch
                    id={`${entityId}-oscillate`}
                    checked={fan.isOscillating || false}
                    onCheckedChange={fan.setOscillating}
                  />
                </div>
              )}

              {fan.supportsDirection && (
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Direction</label>
                  <Select
                    value={fan.direction || 'forward'}
                    onValueChange={(value) => fan.setDirection(value as 'forward' | 'reverse')}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-600/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forward">Forward</SelectItem>
                      <SelectItem value="reverse">Reverse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          )}

          <CardFooter className="flex-col items-start gap-2">
            <div className="flex flex-wrap gap-1.5">
              {fan.supportsSetSpeed && <Badge>Speed</Badge>}
              {fan.supportsOscillate && <Badge>Oscillate</Badge>}
              {fan.supportsDirection && <Badge>Direction</Badge>}
              {fan.supportsPresetMode && <Badge>Presets</Badge>}
              {!fan.supportsSetSpeed && !fan.supportsOscillate && !fan.supportsDirection && !fan.supportsPresetMode && (
                <Badge>Basic On/Off</Badge>
              )}
            </div>
            <ConnectionIndicator isConnected={fan.isConnected} className="pt-2" />
          </CardFooter>
        </Card>
      )}
    </Fan>
  )
}

export default FanCard
