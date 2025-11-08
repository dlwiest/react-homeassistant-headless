import React from 'react'
import { Fan } from 'hass-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Slider } from '../ui/slider'
import { Switch } from '../ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface FanCardProps {
  entityId: string
  name: string
}

export const FanCard: React.FC<FanCardProps> = ({ entityId, name }) => {
  return (
    <Fan entityId={entityId}>
      {(fan) => (
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{name}</CardTitle>
              <Button
                onClick={fan.toggle}
                variant={fan.isOn ? "default" : "outline"}
                size="sm"
                className="min-w-20"
              >
                {fan.isOn ? '🌪️ ON' : '⭕ OFF'}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {fan.isOn && (
              <>
                {fan.supportsSetSpeed && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Speed</label>
                      <span className="text-sm text-muted-foreground">{fan.percentage}%</span>
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
                    <label className="text-sm font-medium">Preset Mode</label>
                    <Select
                      value={fan.presetMode || (fan.availablePresetModes[0] || '')}
                      onValueChange={fan.setPresetMode}
                    >
                      <SelectTrigger>
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
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`${entityId}-oscillate`}
                      checked={fan.isOscillating || false}
                      onCheckedChange={fan.setOscillating}
                    />
                    <label htmlFor={`${entityId}-oscillate`} className="text-sm font-medium">
                      Oscillating
                    </label>
                  </div>
                )}

                {fan.supportsDirection && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Direction</label>
                    <Select
                      value={fan.direction || 'forward'}
                      onValueChange={(value) => fan.setDirection(value as 'forward' | 'reverse')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="forward">Forward</SelectItem>
                        <SelectItem value="reverse">Reverse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            <div className="pt-2 border-t">
              <div className="flex flex-wrap gap-1 mb-2">
                {fan.supportsSetSpeed && (
                  <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                    Speed
                  </span>
                )}
                {fan.supportsOscillate && (
                  <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                    Oscillate
                  </span>
                )}
                {fan.supportsDirection && (
                  <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                    Direction
                  </span>
                )}
                {fan.supportsPresetMode && (
                  <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                    Presets
                  </span>
                )}
                {!fan.supportsSetSpeed && !fan.supportsOscillate && !fan.supportsDirection && !fan.supportsPresetMode && (
                  <span className="inline-block px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                    Basic
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated: {fan.lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </Fan>
  )
}