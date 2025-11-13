import { useState, useCallback } from 'react'
import React from 'react'
import { Light } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Switch,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Stack,
  Chip,
  Alert,
  AlertTitle,
  Collapse
} from '@mui/material'
import { 
  Lightbulb, 
  Palette, 
  Warning,
  WifiOff,
  Close,
  Thermostat
} from '@mui/icons-material'
import { ColorPicker } from '../controls/ColorPicker'
import { ColorTempSlider } from '../controls/ColorTempSlider'

interface LightCardProps {
  entityId: string
  name: string
}

export const LightCard = ({ entityId, name }: LightCardProps) => {
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
    <Light entityId={entityId}>
      {(light) => {
        // Check for entity availability errors
        if (light.error) {
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
                  {light.error.message}
                </Alert>
              </CardContent>
            </Card>
          )
        }

        return (
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              avatar={
                <Lightbulb 
                  sx={{ 
                    color: light.isOn ? 'warning.main' : 'text.disabled',
                    fontSize: 32
                  }} 
                />
              }
              title={
                <Typography variant="h6" component="h2">
                  {name}
                </Typography>
              }
              subheader={
                <Box display="flex" alignItems="center" gap={1}>
                  <span>{light.isConnected ? (light.isOn ? 'On' : 'Off') : 'Disconnected'}</span>
                  {!light.isConnected && <WifiOff fontSize="small" />}
                </Box>
              }
              action={
                <Switch 
                  checked={light.isOn}
                  onChange={() => handleAction(light.toggle, 'Toggle')}
                  disabled={!light.isConnected}
                  color="primary"
                />
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
            
            {light.isOn && light.isConnected && (
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={3}>
                  {light.supportsBrightness && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Brightness: {light.brightnessPercent}%
                      </Typography>
                      <Slider
                        value={light.brightness}
                        onChange={(_, value) => handleAction(
                          () => light.setBrightness(value as number),
                          'Set brightness'
                        )}
                        min={0}
                        max={255}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${Math.round((value / 255) * 100)}%`}
                      />
                    </Box>
                  )}

                  {light.supportsRgb && (
                    <Box>
                      <ColorPicker
                        color={light.rgbColor}
                        onChange={(color) => handleAction(
                          () => light.setRgbColor(color),
                          'Set color'
                        )}
                      />
                      {light.effect && light.effect !== 'off' && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          fontStyle="italic"
                          display="block"
                          mt={1}
                        >
                          Color may be controlled by effect "{light.effect}"
                        </Typography>
                      )}
                    </Box>
                  )}

                  {light.supportsColorTemp && (
                    <Box>
                      <ColorTempSlider
                        value={light.colorTemp}
                        onChange={(temp) => handleAction(
                          () => light.setColorTemp(temp),
                          'Set temperature'
                        )}
                        min={light.attributes.min_mireds}
                        max={light.attributes.max_mireds}
                      />
                      {light.effect && light.effect !== 'off' && light.colorTemp === undefined && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          fontStyle="italic"
                          display="block"
                          mt={1}
                        >
                          Temperature not available during effect "{light.effect}"
                        </Typography>
                      )}
                    </Box>
                  )}

                  {light.supportsEffects && light.availableEffects.length > 0 && (
                    <FormControl fullWidth size="small">
                      <InputLabel>Effect</InputLabel>
                      <Select
                        value={(!light.effect || light.effect === 'off') ? '__none__' : light.effect}
                        renderValue={(selected) => {
                          if (selected === '__none__') return 'None'
                          return selected
                        }}
                        label="Effect"
                        displayEmpty
                        onChange={(e) => {
                          const effectValue = e.target.value === '__none__' ? null : e.target.value
                          handleAction(
                            () => light.setEffect(effectValue),
                            'Set effect'
                          )
                        }}
                      >
                        <MenuItem value="__none__">None</MenuItem>
                        {light.availableEffects
                          .filter(effect => effect.toLowerCase() !== 'none')
                          .map(effect => (
                            <MenuItem key={effect} value={effect}>{effect}</MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                </Stack>
              </CardContent>
            )}

            <CardActions sx={{ p: 2, pt: 0 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {light.supportsBrightness && <Chip label="Brightness" size="small" />}
                  {light.supportsRgb && <Chip label="RGB" size="small" />}
                  {light.supportsColorTemp && <Chip label="Color Temp" size="small" />}
                  {light.supportsEffects && <Chip label="Effects" size="small" />}
                  {!light.supportsBrightness && !light.supportsRgb && !light.supportsColorTemp && !light.supportsEffects && (
                    <Chip label="Basic On/Off" size="small" />
                  )}
                </Stack>
                {!light.isConnected && (
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
    </Light>
  )
}