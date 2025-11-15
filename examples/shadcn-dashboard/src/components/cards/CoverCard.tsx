import React from 'react'
import { Cover } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { ConnectionIndicator } from '@/components/ui/connection-indicator'
import { ChevronUp, ChevronDown, Square } from 'lucide-react'

interface CoverCardProps {
  entityId: string
  name: string
}

const CoverCard = ({ entityId, name }: CoverCardProps) => {
  return (
    <Cover entityId={entityId}>
      {(cover) => {
        const getStateDisplay = () => {
          if (cover.isOpening) return 'Opening'
          if (cover.isClosing) return 'Closing'
          if (cover.isOpen) return 'Open'
          if (cover.isClosed) return 'Closed'
          return cover.state
        }

        const getStateColor = () => {
          if (cover.isOpening || cover.isClosing) return 'text-blue-400'
          if (cover.isOpen) return 'text-emerald-400'
          if (cover.isClosed) return 'text-slate-400'
          return 'text-slate-400'
        }

        return (
          <Card className="h-full">
            <CardHeader>
              <div>
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription>
                  {(cover.attributes.device_class as string) || 'Cover'}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className={`text-3xl font-semibold ${getStateColor()}`}>
                {getStateDisplay()}
                {cover.position !== undefined && (
                  <span className="text-lg text-slate-400 ml-2">
                    {cover.position}%
                  </span>
                )}
              </div>

              {/* Position slider */}
              {cover.position !== undefined && cover.isConnected && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Position</span>
                    <span className="text-slate-300">{cover.position}%</span>
                  </div>
                  <Slider
                    value={[cover.position]}
                    onValueChange={([value]) => cover.setPosition(value)}
                    min={0}
                    max={100}
                    step={1}
                    disabled={cover.isOpening || cover.isClosing}
                    className="w-full"
                  />
                </div>
              )}

              {/* Control buttons */}
              {cover.isConnected && (
                <div className="flex justify-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cover.open}
                    disabled={cover.isOpening || cover.isOpen}
                  >
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Open
                  </Button>

                  {(cover.isOpening || cover.isClosing) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cover.stop}
                    >
                      <Square className="h-4 w-4 mr-1" />
                      Stop
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cover.close}
                    disabled={cover.isClosing || cover.isClosed}
                  >
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Close
                  </Button>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex-col items-start gap-2">
              <div className="flex flex-wrap gap-1.5">
                <Badge>Open</Badge>
                <Badge>Close</Badge>
                {cover.position !== undefined && <Badge>Position Control</Badge>}
              </div>
              <ConnectionIndicator isConnected={cover.isConnected} className="pt-2" />
            </CardFooter>
          </Card>
        )
      }}
    </Cover>
  )
}

export default CoverCard
