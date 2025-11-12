import { useState, useCallback } from 'react'
import { Cover } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Slider,
  Box,
  Stack,
  Chip,
  Alert,
  AlertTitle,
  Collapse,
  LinearProgress
} from '@mui/material'
import { 
  Window, 
  ExpandLess,
  ExpandMore,
  Stop,
  Warning,
  WifiOff,
  Close
} from '@mui/icons-material'

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
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardHeader
                avatar={<Warning sx={{ color: 'error.main', fontSize: 32 }} />}
                title={
                  <Typography variant="h6" component="h2">
                    {name}
                  </Typography>
                }
                subheader="Entity Error"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Alert severity="error">
                  <AlertTitle>Entity Not Available</AlertTitle>
                  {cover.error.message}
                </Alert>
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
          if (cover.isOpening) return <ExpandLess sx={{ color: 'info.main', fontSize: 32 }} />
          if (cover.isClosing) return <ExpandMore sx={{ color: 'info.main', fontSize: 32 }} />
          return <Window sx={{ 
            color: cover.isOpen ? 'success.main' : 'text.disabled', 
            fontSize: 32 
          }} />
        }

        return (
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              avatar={getIcon()}
              title={
                <Typography variant="h6" component="h2">
                  {name}
                </Typography>
              }
              subheader={
                <Box display="flex" alignItems="center" gap={1}>
                  <span>{getStateDisplay()}</span>
                  {!cover.isConnected && <WifiOff fontSize="small" />}
                  {cover.position !== undefined && (
                    <span>({cover.position}%)</span>
                  )}
                </Box>
              }
            />

            {/* Display action errors */}
            <Collapse in={!!actionError}>
              {actionError && (
                <Box sx={{ px: 2, pb: 1 }}>
                  <Alert 
                    severity="error" 
                    action={
                      <Button 
                        color="inherit" 
                        size="small"
                        onClick={() => setActionError(null)}
                      >
                        <Close fontSize="small" />
                      </Button>
                    }
                  >
                    {actionError}
                  </Alert>
                </Box>
              )}
            </Collapse>

            <CardContent sx={{ flexGrow: 1 }}>
              <Stack spacing={3}>
                {/* Position indicator */}
                {cover.position !== undefined && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Position: {cover.position}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={cover.position} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                )}

                {/* Position slider */}
                {cover.position !== undefined && cover.isConnected && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Set Position
                    </Typography>
                    <Slider
                      value={cover.position}
                      onChange={(_, value) => handleAction(
                        () => cover.setPosition(value as number),
                        'Set position'
                      )}
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}%`}
                      disabled={cover.isOpening || cover.isClosing}
                    />
                  </Box>
                )}

                {/* Control buttons */}
                {cover.isConnected && (
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ExpandLess />}
                      onClick={() => handleAction(cover.open, 'Open')}
                      disabled={cover.isOpening || cover.isOpen}
                    >
                      Open
                    </Button>
                    
                    {(cover.isOpening || cover.isClosing) && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Stop />}
                        onClick={() => handleAction(cover.stop, 'Stop')}
                        color="warning"
                      >
                        Stop
                      </Button>
                    )}
                    
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ExpandMore />}
                      onClick={() => handleAction(cover.close, 'Close')}
                      disabled={cover.isClosing || cover.isClosed}
                    >
                      Close
                    </Button>
                  </Stack>
                )}
              </Stack>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label="Cover" size="small" />
                  {cover.position !== undefined && <Chip label="Position Control" size="small" />}
                  {cover.attributes.device_class && (
                    <Chip 
                      label={cover.attributes.device_class as string} 
                      size="small" 
                      variant="outlined" 
                    />
                  )}
                </Stack>
                {!cover.isConnected && (
                  <Typography variant="caption" color="error" display="flex" alignItems="center" gap={0.5}>
                    <Warning fontSize="inherit" />
                    Not connected to Home Assistant
                  </Typography>
                )}
              </Stack>
            </CardActions>
          </Card>
        )
      }}
    </Cover>
  )
}