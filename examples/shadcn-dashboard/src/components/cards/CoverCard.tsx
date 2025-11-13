import { useState, useCallback } from 'react'
import { Cover } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { 
  Home, 
  ChevronUp,
  ChevronDown,
  Square,
  AlertTriangle, 
  WifiOff 
} from 'lucide-react'

interface CoverCardProps {
  entityId: string
  name: string
}

export const CoverCard = ({ entityId, name }: CoverCardProps) => {
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
    <Cover entityId={entityId}>
      {(cover) => {
        // Check for entity availability errors
        if (cover.error) {
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
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                  <p className="text-sm text-destructive font-medium">Entity Not Available</p>
                  <p className="text-xs text-muted-foreground mt-1">{cover.error.message}</p>
                </div>
              </CardContent>
            </Card>
          )
        }

        const getStateDisplay = () => {
          if (!cover.isConnected) return 'Disconnected'
          if (cover.isOpening) return 'Opening'
          if (cover.isClosing) return 'Closing'
          if (cover.isOpen) return 'Open'
          if (cover.isClosed) return 'Closed'
          return cover.state
        }

        const getIcon = () => {
          if (cover.isOpening) return <ChevronUp className="h-5 w-5 text-blue-500" />
          if (cover.isClosing) return <ChevronDown className="h-5 w-5 text-blue-500" />
          return <Home className={`h-5 w-5 ${cover.isOpen ? 'text-green-500' : 'text-muted-foreground'}`} />
        }

        return (
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getIcon()}
                  <div>
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      {getStateDisplay()}
                      {!cover.isConnected && <WifiOff className="h-3 w-3" />}
                      {cover.position !== undefined && (
                        <span className="text-xs">({cover.position}%)</span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* Display action errors */}
            {actionError && (
              <div className="mx-4 mb-2">
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-destructive">{actionError}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActionError(null)}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <CardContent className="space-y-4">
              {/* Position indicator */}
              {cover.position !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Position</span>
                    <span className="font-medium">{cover.position}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${cover.position}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Position slider */}
              {cover.position !== undefined && cover.isConnected && (
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Set Position</label>
                  <Slider
                    value={[cover.position]}
                    onValueChange={([value]) => handleAction(
                      () => cover.setPosition(value),
                      'Set position'
                    )}
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
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(cover.open, 'Open')}
                    disabled={cover.isOpening || cover.isOpen}
                    className="flex items-center space-x-1"
                  >
                    <ChevronUp className="h-4 w-4" />
                    <span>Open</span>
                  </Button>
                  
                  {(cover.isOpening || cover.isClosing) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(cover.stop, 'Stop')}
                      className="flex items-center space-x-1 border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      <Square className="h-4 w-4" />
                      <span>Stop</span>
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(cover.close, 'Close')}
                    disabled={cover.isClosing || cover.isClosed}
                    className="flex items-center space-x-1"
                  >
                    <ChevronDown className="h-4 w-4" />
                    <span>Close</span>
                  </Button>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-0">
              <div className="w-full space-y-2">
                <div className="flex flex-wrap gap-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Cover
                  </span>
                  {cover.position !== undefined && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      Position Control
                    </span>
                  )}
                  {(() => {
                    const deviceClass = cover.attributes.device_class
                    return deviceClass && typeof deviceClass === 'string' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                        {deviceClass}
                      </span>
                    ) : null
                  })()}
                </div>
                {!cover.isConnected && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Not connected to Home Assistant
                  </p>
                )}
              </div>
            </CardFooter>
          </Card>
        )
      }}
    </Cover>
  )
}