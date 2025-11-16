import React, { useState } from 'react'
import { Camera } from 'hass-react'
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConnectionIndicator } from '@/components/ui/connection-indicator'
import { Play, Square } from 'lucide-react'

interface CameraCardProps {
  entityId: string
  name: string
}

export const CameraCard = ({ entityId, name }: CameraCardProps) => {
  const [streamError, setStreamError] = useState<string | null>(null)

  return (
    <Camera entityId={entityId}>
      {(camera) => {
        const handleStartStream = async (type: 'hls' | 'mjpeg') => {
          try {
            setStreamError(null)
            await camera.startStream({ type })
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to start stream'
            setStreamError(message)
          }
        }

        const getStateText = () => {
          if (camera.streamState.isActive) {
            return camera.streamState.type === 'hls' ? 'HLS Stream' : 'MJPEG Stream'
          }
          if (camera.state === 'recording') return 'Recording'
          if (camera.state === 'streaming') return 'Streaming'
          return 'Idle'
        }

        const getStateColor = () => {
          if (camera.streamState.isActive) return 'text-blue-400'
          if (camera.state === 'recording') return 'text-red-400'
          if (camera.state === 'streaming') return 'text-blue-400'
          return 'text-slate-400'
        }

        return (
          <Card className="h-full">
            <CardHeader>
              <div>
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription>
                  {camera.attributes.brand || 'Camera'} {camera.attributes.model ? `- ${camera.attributes.model}` : ''}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Camera Image/Stream Preview */}
              <div className="aspect-video bg-slate-900 rounded-md border border-slate-600/50 overflow-hidden">
                {camera.streamState.isActive ? (
                  <Camera.StreamPlayer stream={camera.streamState} className="w-full h-full" />
                ) : camera.imageUrl ? (
                  <Camera.Image url={camera.imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className={`text-2xl font-semibold mb-2 ${getStateColor()}`}>
                        {getStateText()}
                      </div>
                      <div className="text-sm text-slate-500">
                        No preview available
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stream Controls */}
              {camera.supportsStream && camera.isConnected && (
                <div className="space-y-2">
                  <div className="flex justify-center gap-2 pt-2">
                    {!camera.streamState.isActive ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartStream('hls')}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          HLS Stream
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartStream('mjpeg')}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          MJPEG Stream
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          camera.stopStream()
                          setStreamError(null)
                        }}
                      >
                        <Square className="h-4 w-4 mr-1" />
                        Stop Stream
                      </Button>
                    )}
                  </div>
                  {streamError && (
                    <div className="text-xs text-red-400 text-center">
                      {streamError}
                    </div>
                  )}
                </div>
              )}

              {camera.attributes.motion_detection !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Motion Detection</span>
                  <span className={camera.attributes.motion_detection ? 'text-emerald-400' : 'text-slate-400'}>
                    {camera.attributes.motion_detection ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex-col items-start gap-2">
              <div className="flex flex-wrap gap-1.5">
                <Badge>Image</Badge>
                {camera.supportsStream && <Badge>Stream</Badge>}
                {camera.attributes.motion_detection && <Badge>Motion Detection</Badge>}
              </div>
              <ConnectionIndicator isConnected={camera.isConnected} className="pt-2" />
            </CardFooter>
          </Card>
        )
      }}
    </Camera>
  )
}

