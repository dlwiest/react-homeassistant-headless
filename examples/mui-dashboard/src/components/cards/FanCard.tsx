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
  FormControlLabel,
  Button,
  Box,
  Stack,
  Chip
} from '@mui/material'
import { Air } from '@mui/icons-material'

interface FanCardProps {
  entityId: string
  name: string
}

export const FanCard = ({ entityId, name }: FanCardProps) => {
  return (
    <Fan entityId={entityId}>
      {(fan) => (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            avatar={
              <Air 
                sx={{ 
                  color: fan.isOn ? 'primary.main' : 'text.disabled',
                  fontSize: 32
                }} 
              />
            }
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
                color="primary"
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
                      valueLabelFormat={(value) => `${value}%`}
                    />
                  </Box>
                )}

                {fan.supportsPresetMode && fan.availablePresetModes.length > 0 && (
                  <FormControl fullWidth size="small">
                    <InputLabel>Preset Mode</InputLabel>
                    <Select
                      value={fan.presetMode || (fan.availablePresetModes[0] || '')}
                      label="Preset Mode"
                      onChange={(e) => fan.setPresetMode(e.target.value)}
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
                        color="primary"
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
                      label="Direction"
                      onChange={(e) => fan.setDirection(e.target.value as 'forward' | 'reverse')}
                    >
                      <MenuItem value="forward">Forward</MenuItem>
                      <MenuItem value="reverse">Reverse</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Stack>
            </CardContent>
          )}

          <CardActions sx={{ p: 2, pt: 0, flexDirection: 'column', alignItems: 'stretch' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {fan.supportsSetSpeed && <Chip label="Speed Control" size="small" />}
              {fan.supportsOscillate && <Chip label="Oscillation" size="small" />}
              {fan.supportsDirection && <Chip label="Direction" size="small" />}
              {fan.supportsPresetMode && <Chip label="Preset Modes" size="small" />}
              {!fan.supportsSetSpeed && !fan.supportsOscillate && !fan.supportsDirection && !fan.supportsPresetMode && (
                <Chip label="Basic On/Off" size="small" />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              Last updated: {fan.lastUpdated.toLocaleTimeString()}
            </Typography>
          </CardActions>
        </Card>
      )}
    </Fan>
  )
}