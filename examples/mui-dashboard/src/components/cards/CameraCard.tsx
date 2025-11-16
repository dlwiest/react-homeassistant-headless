import React, { useState } from 'react'
import { Camera } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Stack,
  Chip
} from '@mui/material'

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

        return (
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title={
                <Typography variant="h6" component="h2">
                  {name}
                </Typography>
              }
              subheader={
                camera.attributes.brand
                  ? `${camera.attributes.brand}${camera.attributes.model ? ` - ${camera.attributes.model}` : ''}`
                  : 'Camera'
              }
            />

            <CardContent sx={{ flexGrow: 1 }}>
              <Stack spacing={3}>
                <Box
                  sx={{
                    aspectRatio: '16/9',
                    bgcolor: 'grey.900',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden'
                  }}
                >
                  {camera.streamState.isActive ? (
                    <Camera.StreamPlayer stream={camera.streamState} style={{ width: '100%', height: '100%' }} />
                  ) : camera.imageUrl ? (
                    <Camera.Image url={camera.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%'
                      }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            color:
                              camera.streamState.isActive
                                ? 'info.main'
                                : camera.state === 'recording'
                                ? 'error.main'
                                : camera.state === 'streaming'
                                ? 'info.main'
                                : 'text.secondary'
                          }}
                        >
                          {getStateText()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          No preview available
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {camera.supportsStream && camera.isConnected && (
                  <Box>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {!camera.streamState.isActive ? (
                        <>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleStartStream('hls')}
                          >
                            ▶ HLS Stream
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleStartStream('mjpeg')}
                          >
                            ▶ MJPEG Stream
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            camera.stopStream()
                            setStreamError(null)
                          }}
                        >
                          ⏹ Stop Stream
                        </Button>
                      )}
                    </Stack>
                    {streamError && (
                      <Typography variant="caption" color="error" display="block" textAlign="center" mt={1}>
                        {streamError}
                      </Typography>
                    )}
                  </Box>
                )}

                {camera.attributes.motion_detection !== undefined && (
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Motion Detection
                    </Typography>
                    <Typography variant="body2" color={camera.attributes.motion_detection ? 'success.main' : 'text.secondary'}>
                      {camera.attributes.motion_detection ? 'Enabled' : 'Disabled'}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                <Chip label="Image" size="small" />
                {camera.supportsStream && <Chip label="Stream" size="small" />}
                {camera.attributes.motion_detection && <Chip label="Motion Detection" size="small" />}
              </Stack>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: camera.isConnected ? 'success.main' : 'error.main'
                  }}
                />
                <Typography variant="caption">
                  {camera.isConnected ? 'Online' : 'Offline'}
                </Typography>
              </Box>
            </CardActions>
          </Card>
        )
      }}
    </Camera>
  )
}

