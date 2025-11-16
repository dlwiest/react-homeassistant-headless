import React, { useState, useCallback } from 'react'
import { Light } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ConnectionIndicator } from '@/components/ui/connection-indicator'
import { AlertTriangle, WifiOff } from 'lucide-react'
import { ColorPicker } from '../controls/ColorPicker'
import { ColorTempSlider } from '../controls/ColorTempSlider'

interface LightCardProps {
  entityId: string
  name: string
}

export const LightCard = ({ entityId, name }: LightCardProps) => {
  const [actionError, setActionError] = useState<string | null>(null)

  // Helper to handle errors from actions
  const handleAction = useCallback(async (action: () => Promise<void>, actionName: string) => {
    try {
      setActionError(null)
      await action()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred'
      setActionError(`${actionName}: ${message}`)
      
      // Auto-clear error after 5 seconds
      setTimeout(() => setActionError(null), 5000)
    }
  }, [])

  return (
    <Light entityId={entityId}>
      {(light) => {
        // Check for entity availability errors
        if (light.error) {
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
                <div className="flex items-center space-x-2 p-3 border border-red-200 bg-red-50 rounded-lg text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">{light.error.message}</span>
                </div>
              </CardContent>
            </Card>
          )
        }

        return (
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>
                    {light.isConnected ? (light.isOn ? 'On' : 'Off') : 'Disconnected'}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {!light.isConnected && <WifiOff className="h-4 w-4 text-muted-foreground" />}
                  <Switch
                    checked={light.isOn}
                    onCheckedChange={() => handleAction(light.toggle, 'Toggle')}
                    disabled={!light.isConnected}
                  />
                </div>
              </div>
            </CardHeader>

            {/* Display action errors */}
            {actionError && (
              <div className="px-6 pb-2">
                <div className="flex items-center space-x-2 p-3 border border-red-200 bg-red-50 rounded-lg text-red-700 mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">{actionError}</span>
                </div>
              </div>
            )}
            
            {light.isOn && light.isConnected && (
              <CardContent className="space-y-3">
                {light.supportsBrightness && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Brightness</span>
                      <span className="text-slate-300">{light.brightnessPercent}%</span>
                    </div>
                    <Slider
                      value={[light.brightness]}
                      onValueChange={(values) => handleAction(
                        () => light.setBrightness(values[0]),
                        'Set brightness'
                      )}
                      max={255}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}

                {light.supportsRgb && (
                  <ColorPicker
                    color={light.rgbColor}
                    onChange={(color) => handleAction(
                      () => light.setRgbColor(color),
                      'Set color'
                    )}
                  />
                )}

                {light.supportsColorTemp && (
                  <ColorTempSlider
                    value={light.colorTemp}
                    onChange={(temp) => handleAction(
                      () => light.setColorTemp(temp),
                      'Set temperature'
                    )}
                    min={light.attributes.min_mireds}
                    max={light.attributes.max_mireds}
                  />
                )}

                {light.supportsEffects && light.availableEffects.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Effect</label>
                    <Select
                      value={(!light.effect || light.effect === 'off') ? 'none' : light.effect}
                      onValueChange={(value) => {
                        const effectValue = value === 'none' ? null : value
                        handleAction(
                          () => light.setEffect(effectValue),
                          'Set effect'
                        )
                      }}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600/50">
                        <SelectValue placeholder="Select an effect" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {light.availableEffects
                          .filter(effect => effect.toLowerCase() !== 'none')
                          .map(effect => (
                            <SelectItem key={effect} value={effect}>{effect}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            )}

            <CardFooter className="flex-col items-start gap-2">
              <div className="flex flex-wrap gap-1.5">
                {light.supportsBrightness && <Badge>Brightness</Badge>}
                {light.supportsRgb && <Badge>RGB Color</Badge>}
                {light.supportsColorTemp && <Badge>Color Temperature</Badge>}
                {light.supportsEffects && <Badge>Effects</Badge>}
                {!light.supportsBrightness && !light.supportsRgb && !light.supportsColorTemp && !light.supportsEffects && (
                  <Badge>Basic On/Off</Badge>
                )}
              </div>
              <ConnectionIndicator isConnected={light.isConnected} className="pt-2" />
            </CardFooter>
          </Card>
        )
      }}
    </Light>
  )
}

