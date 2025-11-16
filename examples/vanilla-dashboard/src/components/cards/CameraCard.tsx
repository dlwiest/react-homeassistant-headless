import React, { useState } from 'react'
import { Camera } from 'hass-react'
import { Card, CardContent, CardHeader, CardFooter } from '../layout/Card'

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
          if (camera.streamState.isActive) return 'text-blue'
          if (camera.state === 'recording') return 'text-red'
          if (camera.state === 'streaming') return 'text-blue'
          return 'text-slate'
        }

        return (
          <Card>
            <CardHeader
              title={name}
              subtitle={
                <>
                  {camera.attributes.brand || 'Camera'}
                  {camera.attributes.model && ` - ${camera.attributes.model}`}
                </>
              }
            />

            <CardContent>
              {/* Camera Image/Stream Preview */}
              <div className="camera-preview">
                {camera.streamState.isActive ? (
                  <Camera.StreamPlayer stream={camera.streamState} className="camera-stream" />
                ) : camera.imageUrl ? (
                  <Camera.Image url={camera.imageUrl} className="camera-image" />
                ) : (
                  <div className="camera-placeholder">
                    <div className="camera-placeholder-content">
                      <div className={`camera-state ${getStateColor()}`}>
                        {getStateText()}
                      </div>
                      <div className="camera-no-preview">
                        No preview available
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stream Controls */}
              {camera.supportsStream && camera.isConnected && (
                <div className="camera-controls">
                  <div className="camera-button-group">
                    {!camera.streamState.isActive ? (
                      <>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleStartStream('hls')}
                        >
                          HLS Stream
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleStartStream('mjpeg')}
                        >
                          MJPEG Stream
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          camera.stopStream()
                          setStreamError(null)
                        }}
                      >
                        Stop Stream
                      </button>
                    )}
                  </div>
                  {streamError && (
                    <div className="camera-error">
                      {streamError}
                    </div>
                  )}
                </div>
              )}

              {camera.attributes.motion_detection !== undefined && (
                <div className="camera-feature">
                  <span className="camera-feature-label">Motion Detection</span>
                  <span className={camera.attributes.motion_detection ? 'camera-feature-enabled' : 'camera-feature-disabled'}>
                    {camera.attributes.motion_detection ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              )}
            </CardContent>

            <CardFooter>
              <div className="feature-tags">
                <span className="feature-tag">Image</span>
                {camera.supportsStream && <span className="feature-tag">Stream</span>}
                {camera.attributes.motion_detection && <span className="feature-tag">Motion Detection</span>}
              </div>
              {!camera.isConnected && (
                <div className="connection-warning">
                  Not connected to Home Assistant
                </div>
              )}
            </CardFooter>
          </Card>
        )
      }}
    </Camera>
  )
}

