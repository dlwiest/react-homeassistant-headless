import React from 'react'
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
  Chip
} from '@mui/material'

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

        const getDeviceClass = () => {
          const deviceClass = cover.attributes.device_class
          if (typeof deviceClass === 'string') {
            return deviceClass.charAt(0).toUpperCase() + deviceClass.slice(1)
          }
          return 'Cover'
        }

        return (
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title={
                <Typography variant="h6" component="h2">
                  {name}
                </Typography>
              }
              subheader={getDeviceClass()}
            />

            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h3"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 3
                }}
              >
                {getStateDisplay()}
                {cover.position !== undefined && ` (${cover.position}%)`}
              </Typography>

              <Stack spacing={3}>
                {cover.position !== undefined && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Position: {cover.position}%
                    </Typography>
                    <Slider
                      value={cover.position}
                      onChange={(_, value) => cover.setPosition(value as number)}
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                      disabled={cover.isOpening || cover.isClosing}
                    />
                  </Box>
                )}

                <Stack direction="row" spacing={1} justifyContent="center">
                  <Button
                    variant={cover.isOpen ? 'contained' : 'outlined'}
                    onClick={cover.open}
                    disabled={cover.isOpening || cover.isOpen}
                    size="small"
                  >
                    Open
                  </Button>

                  {(cover.isOpening || cover.isClosing) && (
                    <Button
                      variant="outlined"
                      onClick={cover.stop}
                      size="small"
                    >
                      Stop
                    </Button>
                  )}

                  <Button
                    variant={cover.isClosed ? 'contained' : 'outlined'}
                    onClick={cover.close}
                    disabled={cover.isClosing || cover.isClosed}
                    size="small"
                  >
                    Close
                  </Button>
                </Stack>
              </Stack>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {cover.position !== undefined && <Chip label="Position" size="small" />}
              </Stack>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: cover.isConnected ? 'success.main' : 'error.main'
                  }}
                />
                <Typography variant="caption">
                  {cover.isConnected ? 'Online' : 'Offline'}
                </Typography>
              </Box>
            </CardActions>
          </Card>
        )
      }}
    </Cover>
  )
}

export default CoverCard
