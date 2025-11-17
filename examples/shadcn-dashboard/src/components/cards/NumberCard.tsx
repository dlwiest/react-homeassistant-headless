import React from 'react'
import { Number } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ConnectionIndicator } from '@/components/ui/connection-indicator'
import { Plus, Minus } from 'lucide-react'

interface NumberCardProps {
  entityId: string
  name: string
}

export const NumberCard = ({ entityId, name }: NumberCardProps) => {
  return (
    <Number entityId={entityId}>
      {(numberEntity) => (
        <Card className="h-full">
          <CardHeader>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription>
                {numberEntity.deviceClass || 'Number'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-3xl font-semibold text-white">
              {numberEntity.value}{numberEntity.unit ? ` ${numberEntity.unit}` : ''}
            </div>

            <div className="px-2">
              <Slider
                value={[numberEntity.value]}
                min={numberEntity.min}
                max={numberEntity.max}
                step={numberEntity.step}
                onValueChange={(values) => numberEntity.setValue(values[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{numberEntity.min}</span>
                <span>{numberEntity.max}</span>
              </div>
            </div>

            <div className="flex justify-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={numberEntity.decrement}
                disabled={numberEntity.value <= numberEntity.min}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={numberEntity.increment}
                disabled={numberEntity.value >= numberEntity.max}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex-col items-start gap-2">
            <div className="flex flex-wrap gap-1.5">
              <Badge>Range: {numberEntity.min}-{numberEntity.max}</Badge>
            </div>
            <ConnectionIndicator isConnected={numberEntity.isConnected} className="pt-2" />
          </CardFooter>
        </Card>
      )}
    </Number>
  )
}
