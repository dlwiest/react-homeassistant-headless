import React, { useState, useCallback } from 'react'
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
  Box,
  Stack
} from '@mui/material'
import ColorPicker from '../controls/ColorPicker'
import ColorTempSlider from '../controls/ColorTempSlider'
import FeatureChip from '../ui/FeatureChip'

interface LightCardProps {
  entityId: string
  name: string
}

const LightCard = ({ entityId, name }: LightCardProps) => {
  const [actionError, setActionError] = useState<string | null>(null)

  const handleAction = useCallback(async (action: () => Promise<void>, actionName: string) => {
    try {
      setActionError(null)
      await action()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred'
      setActionError(`${actionName}: ${message}`)
      setTimeout(() => setActionError(null), 5000)
    }
  }, [])

  return (
    <Light entityId={entityId}>
      {(light) => {
        if (light.error) {
          return (
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardHeader
                title={
                  <Typography variant="h6" component="h2">
                    {name}
                  </Typography>
                }
                subheader="Entity Error"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="error">
                  {light.error.message}
                </Typography>
              </CardContent>
            </Card>
          )
        }

        return (
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title={
                <Typography variant="h6" component="h2">
                  {name}
                </Typography>
              }
              subheader={light.isConnected ? (light.isOn ? 'On' : 'Off') : 'Disconnected'}
              action={
                <Switch
                  checked={light.isOn}
                  onChange={() => handleAction(light.toggle, 'Toggle')}
                  disabled={!light.isConnected}
                />
              }
            />

            {actionError && (
              <Box sx={{ px: 2, pb: 1 }}>
                <Typography variant="caption" color="error">
                  {actionError}
                </Typography>
              </Box>
            )}

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
                    <ColorPicker
                      color={light.rgbColor}
                      onChange={(color) => handleAction(
                        () => light.setRgbColor(color),
                        'Set color'
                      )}
                    />
                  )}

                  {light.supportsColorTemp && (
                    <ColorTempSlider
                      value={light.colorTemp}
                      onChange={(temp) => handleAction(
                        () => light.setColorTemp(temp),
                        'Set temperature'
                      )}
                      min={light.attributes.min_mireds}
                      max={light.attributes.max_mireds}
                    />
                  )}

                  {light.supportsEffects && light.availableEffects.length > 0 && (
                    <FormControl fullWidth size="small">
                      <InputLabel>Effect</InputLabel>
                      <Select
                        value={(!light.effect || light.effect.toLowerCase() === 'off' || light.effect.toLowerCase() === 'none') ? 'none' : light.effect}
                        onChange={(e) => {
                          const effectValue = e.target.value === 'none' ? null : e.target.value
                          handleAction(
                            () => light.setEffect(effectValue),
                            'Set effect'
                          )
                        }}
                        label="Effect"
                      >
                        <MenuItem value="none">None</MenuItem>
                        {light.availableEffects
                          .filter(effect => effect.toLowerCase() !== 'none' && effect.toLowerCase() !== 'off')
                          .map(effect => (
                            <MenuItem key={effect} value={effect}>{effect}</MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                </Stack>
              </CardContent>
            )}

            <CardActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {light.supportsBrightness && <FeatureChip label="Brightness" />}
                {light.supportsRgb && <FeatureChip label="RGB Color" />}
                {light.supportsColorTemp && <FeatureChip label="Color Temp" />}
                {light.supportsEffects && <FeatureChip label="Effects" />}
                {!light.supportsBrightness && !light.supportsRgb && !light.supportsColorTemp && !light.supportsEffects && (
                  <FeatureChip label="Basic On/Off" />
                )}
              </Stack>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: light.isConnected ? 'success.main' : 'error.main'
                  }}
                />
                <Typography variant="caption">
                  {light.isConnected ? 'Online' : 'Offline'}
                </Typography>
              </Box>
            </CardActions>
          </Card>
        )
      }}
    </Light>
  )
}

export default LightCard
