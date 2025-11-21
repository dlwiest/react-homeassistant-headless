import React, { useState } from 'react'
import { Scene } from 'hass-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ConnectionIndicator } from '@/components/ui/connection-indicator'

interface SceneCardProps {
  entityId: string
  name: string
}

export const SceneCard = ({ entityId, name }: SceneCardProps) => {
  const [transition, setTransition] = useState(0)

  return (
    <Scene entityId={entityId}>
      {(scene) => (
        <Card className="h-full">
          <CardHeader>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription>
                {scene.attributes.friendly_name || 'Scene'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="text-sm text-slate-400">
              Last changed: {scene.lastChanged.toLocaleTimeString()}
            </div>

            <div className="space-y-2">
              <label htmlFor="transition" className="text-sm text-slate-400">
                Transition (seconds)
              </label>
              <input
                id="transition"
                type="number"
                min="0"
                max="60"
                value={transition}
                onChange={(e) => setTransition(parseInt(e.target.value) || 0)}
                className="flex h-10 w-full rounded-md border border-slate-600/50 bg-slate-800 px-3 py-2 text-sm text-slate-300 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => scene.activate(transition > 0 ? transition : undefined)}
              disabled={!scene.isConnected}
            >
              Activate Scene
            </Button>
          </CardContent>

          <CardFooter className="flex-col items-start gap-2">
            <ConnectionIndicator isConnected={scene.isConnected} className="pt-2" />
          </CardFooter>
        </Card>
      )}
    </Scene>
  )
}
