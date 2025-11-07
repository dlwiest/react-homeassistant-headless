import { Light } from 'react-homeassistant-headless'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Lightbulb, Palette } from 'lucide-react'

interface LightCardProps {
  entityId: string
  name: string
}

export const LightCard = ({ entityId, name }: LightCardProps) => {
  return (
    <Light entityId={entityId}>
      {(light) => (
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lightbulb className={`h-5 w-5 ${light.isOn ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                <div>
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>{light.isOn ? 'On' : 'Off'}</CardDescription>
                </div>
              </div>
              <Switch 
                checked={light.isOn}
                onCheckedChange={light.toggle}
              />
            </div>
          </CardHeader>
          
          {light.isOn && (
            <CardContent className="space-y-4">
              {light.supportsBrightness && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Brightness</span>
                    <span>{light.brightnessPercent}%</span>
                  </div>
                  <Slider
                    value={[light.brightness]}
                    onValueChange={(values) => light.setBrightness(values[0])}
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
                      onClick={() => light.setRgbColor([255, 0, 0])}
                    />
                    <Button 
                      size="sm" 
                      className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600"
                      onClick={() => light.setRgbColor([0, 255, 0])}
                    />
                    <Button 
                      size="sm" 
                      className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600"
                      onClick={() => light.setRgbColor([0, 0, 255])}
                    />
                    <Button 
                      size="sm" 
                      className="h-8 w-8 p-0 bg-orange-500 hover:bg-orange-600"
                      onClick={() => light.setRgbColor([255, 165, 0])}
                    />
                    <Button 
                      size="sm" 
                      className="h-8 w-8 p-0 bg-purple-500 hover:bg-purple-600"
                      onClick={() => light.setRgbColor([139, 92, 246])}
                    />
                    <Button 
                      size="sm" 
                      className="h-8 w-8 p-0 bg-white border border-gray-300 hover:bg-gray-50"
                      onClick={() => light.setRgbColor([255, 255, 255])}
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
                      if (value === 'none') {
                        light.setEffect(null)
                      } else {
                        light.setEffect(value)
                      }
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
            Features: {[
              light.supportsBrightness && 'Brightness',
              light.supportsRgb && 'RGB Color',
              light.supportsColorTemp && 'Color Temperature',
              light.supportsEffects && 'Effects'
            ].filter(Boolean).join(', ') || 'Basic On/Off'}
          </CardFooter>
        </Card>
      )}
    </Light>
  )
}