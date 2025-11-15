import React from 'react'
import { Fan } from 'hass-react'
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
  Stack,
  Box,
  FormControlLabel
} from '@mui/material'
import FeatureChip from '../ui/FeatureChip'

interface FanCardProps {
  entityId: string
  name: string
}

const FanCard = ({ entityId, name }: FanCardProps) => {
  return (
    <Fan entityId={entityId}>
      {(fan) => (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            title={
              <Typography variant="h6" component="h2">
                {name}
              </Typography>
            }
            subheader={fan.isOn ? 'On' : 'Off'}
            action={
              <Switch
                checked={fan.isOn}
                onChange={fan.toggle}
              />
            }
          />

          {fan.isOn && (
            <CardContent sx={{ flexGrow: 1 }}>
              <Stack spacing={3}>
                {fan.supportsSetSpeed && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Speed: {fan.percentage}%
                    </Typography>
                    <Slider
                      value={fan.percentage}
                      onChange={(_, value) => fan.setPercentage(value as number)}
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                )}

                {fan.supportsPresetMode && fan.availablePresetModes.length > 0 && (
                  <FormControl fullWidth size="small">
                    <InputLabel>Preset Mode</InputLabel>
                    <Select
                      value={fan.presetMode || (fan.availablePresetModes[0] || '')}
                      onChange={(e) => fan.setPresetMode(e.target.value)}
                      label="Preset Mode"
                    >
                      {fan.availablePresetModes.map(preset => (
                        <MenuItem key={preset} value={preset}>{preset}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {fan.supportsOscillate && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={fan.isOscillating || false}
                        onChange={(e) => fan.setOscillating(e.target.checked)}
                      />
                    }
                    label="Oscillating"
                  />
                )}

                {fan.supportsDirection && (
                  <FormControl fullWidth size="small">
                    <InputLabel>Direction</InputLabel>
                    <Select
                      value={fan.direction || 'forward'}
                      onChange={(e) => fan.setDirection(e.target.value as 'forward' | 'reverse')}
                      label="Direction"
                    >
                      <MenuItem value="forward">Forward</MenuItem>
                      <MenuItem value="reverse">Reverse</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Stack>
            </CardContent>
          )}

          <CardActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {fan.supportsSetSpeed && <FeatureChip label="Speed" />}
              {fan.supportsOscillate && <FeatureChip label="Oscillate" />}
              {fan.supportsDirection && <FeatureChip label="Direction" />}
              {fan.supportsPresetMode && <FeatureChip label="Presets" />}
              {!fan.supportsSetSpeed && !fan.supportsOscillate && !fan.supportsDirection && !fan.supportsPresetMode && (
                <FeatureChip label="Basic On/Off" />
              )}
            </Stack>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: fan.isConnected ? 'success.main' : 'error.main'
                }}
              />
              <Typography variant="caption">
                {fan.isConnected ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </CardActions>
        </Card>
      )}
    </Fan>
  )
}

export default FanCard
