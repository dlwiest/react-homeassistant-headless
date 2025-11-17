import React from 'react'
import { Climate } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton
} from '@mui/material'
import { Add, Remove } from '@mui/icons-material'

interface ClimateCardProps {
  entityId: string
  name: string
}

export const ClimateCard = ({ entityId, name }: ClimateCardProps) => {
  return (
    <Climate entityId={entityId}>
      {(climate) => (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            title={
              <Typography variant="h6" component="h2">
                {name}
              </Typography>
            }
            subheader={climate.mode}
          />

          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Current
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                  {climate.currentTemperature ?? '--'}°
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary">
                  Target
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                  {climate.targetTemperature ?? '--'}°
                </Typography>
              </Box>
            </Box>

            {climate.supportsTargetTemperature && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                <IconButton
                  onClick={() => climate.setTemperature((climate.targetTemperature ?? climate.minTemp) - 1)}
                  disabled={climate.targetTemperature == null || climate.targetTemperature <= climate.minTemp}
                  color="primary"
                >
                  <Remove />
                </IconButton>
                <IconButton
                  onClick={() => climate.setTemperature((climate.targetTemperature ?? climate.maxTemp) + 1)}
                  disabled={climate.targetTemperature == null || climate.targetTemperature >= climate.maxTemp}
                  color="primary"
                >
                  <Add />
                </IconButton>
              </Box>
            )}

            <Box sx={{ display: 'grid', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Mode</InputLabel>
                <Select
                  value={climate.mode}
                  label="Mode"
                  onChange={(e) => climate.setMode(e.target.value)}
                >
                  {climate.supportedModes.map((mode) => (
                    <MenuItem key={mode} value={mode}>
                      {mode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {climate.supportsFanMode && climate.supportedFanModes.length > 0 && (
                <FormControl fullWidth size="small">
                  <InputLabel>Fan</InputLabel>
                  <Select
                    value={climate.fanMode || ''}
                    label="Fan"
                    onChange={(e) => climate.setFanMode(e.target.value)}
                  >
                    {climate.supportedFanModes.map((mode) => (
                      <MenuItem key={mode} value={mode}>
                        {mode}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </CardContent>

          <CardActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={`Range: ${climate.minTemp}-${climate.maxTemp}°`}
              size="small"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: climate.isConnected ? 'success.main' : 'error.main'
                }}
              />
              <Typography variant="caption">
                {climate.isConnected ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </CardActions>
        </Card>
      )}
    </Climate>
  )
}
