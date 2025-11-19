import React from 'react'
import { Vacuum } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Stack,
  Chip
} from '@mui/material'

interface VacuumCardProps {
  entityId: string
  name: string
}

export const VacuumCard = ({ entityId, name }: VacuumCardProps) => {
  return (
    <Vacuum entityId={entityId}>
      {(vacuum) => {
        const getStateText = () => {
          if (vacuum.isCleaning) return 'Cleaning'
          if (vacuum.isDocked) return 'Docked'
          if (vacuum.isReturning) return 'Returning'
          if (vacuum.isError) return 'Error'
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
              subheader={getStateText()}
            />

            <CardContent sx={{ flexGrow: 1 }}>
              <Stack spacing={3}>
                {/* Battery Level */}
                {vacuum.batteryLevel !== null && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Battery
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {vacuum.batteryLevel}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={vacuum.batteryLevel}
                      sx={{
                        height: 8,
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                )}

                {/* Fan Speed */}
                {vacuum.supportsFanSpeed && vacuum.availableFanSpeeds.length > 0 && (
                  <FormControl fullWidth size="small">
                    <InputLabel>Fan Speed</InputLabel>
                    <Select
                      value={vacuum.fanSpeed || ''}
                      label="Fan Speed"
                      onChange={(e) => vacuum.setFanSpeed(e.target.value)}
                    >
                      {vacuum.availableFanSpeeds.map((speed) => (
                        <MenuItem key={speed} value={speed}>
                          {speed}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {/* Control Buttons */}
                <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                  {vacuum.supportsStart && !vacuum.isCleaning && (
                    <Button
                      variant="outlined"
                      onClick={() => vacuum.start()}
                      size="medium"
                    >
                      Start
                    </Button>
                  )}

                  {vacuum.supportsPause && vacuum.isCleaning && (
                    <Button
                      variant="outlined"
                      onClick={() => vacuum.pause()}
                      size="medium"
                    >
                      Pause
                    </Button>
                  )}

                  {vacuum.supportsStop && vacuum.isCleaning && (
                    <Button
                      variant="outlined"
                      onClick={() => vacuum.stop()}
                      size="medium"
                    >
                      Stop
                    </Button>
                  )}

                  {vacuum.supportsReturnHome && !vacuum.isDocked && (
                    <Button
                      variant="outlined"
                      onClick={() => vacuum.returnToBase()}
                      size="medium"
                    >
                      Dock
                    </Button>
                  )}

                  {vacuum.supportsLocate && (
                    <Button
                      variant="outlined"
                      onClick={() => vacuum.locate()}
                      size="medium"
                    >
                      Locate
                    </Button>
                  )}

                  {vacuum.supportsCleanSpot && !vacuum.isCleaning && (
                    <Button
                      variant="outlined"
                      onClick={() => vacuum.cleanSpot()}
                      size="medium"
                    >
                      Spot
                    </Button>
                  )}
                </Stack>
              </Stack>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {vacuum.supportsStart && <Chip label="Start" size="small" />}
                {vacuum.supportsPause && <Chip label="Pause" size="small" />}
                {vacuum.supportsReturnHome && <Chip label="Dock" size="small" />}
                {vacuum.supportsFanSpeed && <Chip label="Fan Speed" size="small" />}
                {vacuum.supportsCleanSpot && <Chip label="Spot Clean" size="small" />}
              </Stack>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: vacuum.isConnected ? 'success.main' : 'error.main'
                  }}
                />
                <Typography variant="caption">
                  {vacuum.isConnected ? 'Online' : 'Offline'}
                </Typography>
              </Box>
            </CardActions>
          </Card>
        )
      }}
    </Vacuum>
  )
}
