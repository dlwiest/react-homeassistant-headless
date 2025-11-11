import { useState, useCallback } from 'react'
import { Light } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Lightbulb, Palette, AlertTriangle, WifiOff } from 'lucide-react'

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
                <div className="flex items-center space-x-2">
                  <Lightbulb className={`h-5 w-5 ${light.isOn ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                  <div>
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <CardDescription>
                      {light.isConnected ? (light.isOn ? 'On' : 'Off') : 'Disconnected'}
                    </CardDescription>
                  </div>
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
              <CardContent className="space-y-4">
                {light.supportsBrightness && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Brightness</span>
                      <span>{light.brightnessPercent}%</span>
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
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Palette className="h-4 w-4" />
                      <span className="text-sm font-medium">Colors</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600"
                        onClick={() => handleAction(
                          () => light.setRgbColor([255, 0, 0]),
                          'Set color to red'
                        )}
                      />
                      <Button 
                        size="sm" 
                        className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600"
                        onClick={() => handleAction(
                          () => light.setRgbColor([0, 255, 0]),
                          'Set color to green'
                        )}
                      />
                      <Button 
                        size="sm" 
                        className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600"
                        onClick={() => handleAction(
                          () => light.setRgbColor([0, 0, 255]),
                          'Set color to blue'
                        )}
                      />
                      <Button 
                        size="sm" 
                        className="h-8 w-8 p-0 bg-orange-500 hover:bg-orange-600"
                        onClick={() => handleAction(
                          () => light.setRgbColor([255, 165, 0]),
                          'Set color to orange'
                        )}
                      />
                      <Button 
                        size="sm" 
                        className="h-8 w-8 p-0 bg-purple-500 hover:bg-purple-600"
                        onClick={() => handleAction(
                          () => light.setRgbColor([139, 92, 246]),
                          'Set color to purple'
                        )}
                      />
                      <Button 
                        size="sm" 
                        className="h-8 w-8 p-0 bg-white border border-gray-300 hover:bg-gray-50"
                        onClick={() => handleAction(
                          () => light.setRgbColor([255, 255, 255]),
                          'Set color to white'
                        )}
                      />
                    </div>
                  </div>
                )}

                {light.supportsEffects && light.availableEffects.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Effect</label>
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
                      <SelectTrigger>
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

            <CardFooter className="text-xs text-muted-foreground">
              <div className="space-y-1">
                <div>
                  Features: {[
                    light.supportsBrightness && 'Brightness',
                    light.supportsRgb && 'RGB Color',
                    light.supportsColorTemp && 'Color Temperature',
                    light.supportsEffects && 'Effects'
                  ].filter(Boolean).join(', ') || 'Basic On/Off'}
                </div>
                {!light.isConnected && (
                  <div className="text-red-600">⚠️ Not connected to Home Assistant</div>
                )}
              </div>
            </CardFooter>
          </Card>
        )
      }}
    </Light>
  )
}