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
  Chip
} from '@mui/material'
import { Lightbulb, Palette } from '@mui/icons-material'

interface LightCardProps {
  entityId: string
  name: string
}

export const LightCard = ({ entityId, name }: LightCardProps) => {
  return (
    <Light entityId={entityId}>
      {(light) => (
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
            subheader={light.isOn ? 'On' : 'Off'}
            action={
              <Switch 
                checked={light.isOn}
                onChange={light.toggle}
                color="primary"
              />
            }
          />
          
          {light.isOn && (
            <CardContent sx={{ flexGrow: 1 }}>
              <Stack spacing={3}>
                {light.supportsBrightness && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Brightness: {light.brightnessPercent}%
                    </Typography>
                    <Slider
                      value={light.brightness}
                      onChange={(_, value) => light.setBrightness(value as number)}
                      min={0}
                      max={255}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${Math.round((value / 255) * 100)}%`}
                    />
                  </Box>
                )}

                {light.supportsRgb && (
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Palette fontSize="small" />
                      <Typography variant="body2" fontWeight="medium">
                        Colors
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button 
                        size="small" 
                        variant="contained"
                        sx={{ 
                          minWidth: 32, 
                          height: 32, 
                          backgroundColor: '#f44336',
                          '&:hover': { backgroundColor: '#d32f2f' }
                        }}
                        onClick={() => light.setRgbColor([255, 0, 0])}
                      />
                      <Button 
                        size="small" 
                        variant="contained"
                        sx={{ 
                          minWidth: 32, 
                          height: 32, 
                          backgroundColor: '#4caf50',
                          '&:hover': { backgroundColor: '#388e3c' }
                        }}
                        onClick={() => light.setRgbColor([0, 255, 0])}
                      />
                      <Button 
                        size="small" 
                        variant="contained"
                        sx={{ 
                          minWidth: 32, 
                          height: 32, 
                          backgroundColor: '#2196f3',
                          '&:hover': { backgroundColor: '#1976d2' }
                        }}
                        onClick={() => light.setRgbColor([0, 0, 255])}
                      />
                      <Button 
                        size="small" 
                        variant="contained"
                        sx={{ 
                          minWidth: 32, 
                          height: 32, 
                          backgroundColor: '#ff9800',
                          '&:hover': { backgroundColor: '#f57c00' }
                        }}
                        onClick={() => light.setRgbColor([255, 165, 0])}
                      />
                      <Button 
                        size="small" 
                        variant="contained"
                        sx={{ 
                          minWidth: 32, 
                          height: 32, 
                          backgroundColor: '#9c27b0',
                          '&:hover': { backgroundColor: '#7b1fa2' }
                        }}
                        onClick={() => light.setRgbColor([139, 92, 246])}
                      />
                      <Button 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          minWidth: 32, 
                          height: 32, 
                          backgroundColor: '#ffffff',
                          borderColor: '#e0e0e0',
                          '&:hover': { backgroundColor: '#f5f5f5' }
                        }}
                        onClick={() => light.setRgbColor([255, 255, 255])}
                      />
                    </Stack>
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
                        if (e.target.value === '__none__') {
                          light.setEffect(null)
                        } else {
                          light.setEffect(e.target.value)
                        }
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
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {light.supportsBrightness && <Chip label="Brightness" size="small" />}
              {light.supportsRgb && <Chip label="RGB" size="small" />}
              {light.supportsColorTemp && <Chip label="Color Temp" size="small" />}
              {light.supportsEffects && <Chip label="Effects" size="small" />}
              {!light.supportsBrightness && !light.supportsRgb && !light.supportsColorTemp && !light.supportsEffects && (
                <Chip label="Basic On/Off" size="small" />
              )}
            </Stack>
          </CardActions>
        </Card>
      )}
    </Light>
  )
}