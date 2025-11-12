import React from 'react'
import { Box, Typography, Slider, Button, Stack, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

interface ColorTempSliderProps {
  value: number | undefined
  onChange: (value: number) => void
  min?: number
  max?: number
}

const TempPreview = styled(Box)({
  width: 32,
  height: 32,
  border: '1px solid #ccc',
  borderRadius: 4,
})

const PresetButton = styled(Button)(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.spacing(1),
  minWidth: 0,
  '& .preset-kelvin': {
    fontSize: '0.7rem',
    opacity: 0.7,
    marginTop: 2,
  },
}))

const GradientSlider = styled(Slider)({
  '& .MuiSlider-rail': {
    background: 'linear-gradient(to right, #cce7ff, #ffe4b5, #ff8c42)',
    opacity: 1,
  },
})

const ColorTempSlider = ({ 
  value = 250, 
  onChange,
  min = 153,
  max = 500
}: ColorTempSliderProps) => {
  const miredToKelvin = (mired: number) => {
    if (!mired || mired === 0 || !isFinite(mired)) return null
    return Math.round(1000000 / mired)
  }
  
  const getCurrentColor = () => {
    if (!value || !isFinite(value)) return '#ccc'
    const ratio = (value - min) / (max - min)
    if (ratio < 0.5) {
      const localRatio = ratio * 2
      return `rgb(${204 + (255 - 204) * localRatio}, ${231 + (228 - 231) * localRatio}, ${255 - (255 - 181) * localRatio})`
    } else {
      const localRatio = (ratio - 0.5) * 2
      return `rgb(${255 - (255 - 255) * localRatio}, ${228 - (228 - 140) * localRatio}, ${181 - (181 - 66) * localRatio})`
    }
  }
  
  const kelvin = miredToKelvin(value)
  const validValue = value && isFinite(value) ? value : 250
  
  const presets = [
    { name: 'Cool', mired: 153, kelvin: 6500 },
    { name: 'Daylight', mired: 182, kelvin: 5500 },
    { name: 'White', mired: 250, kelvin: 4000 },
    { name: 'Warm', mired: 370, kelvin: 2700 },
  ].filter(preset => preset.mired >= min && preset.mired <= max)
  
  return (
    <Box sx={{ my: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight="medium">
          Temperature:
        </Typography>
        <TempPreview sx={{ backgroundColor: getCurrentColor() }} />
        <Typography variant="body2" color="text.secondary">
          {kelvin ? `${kelvin}K` : 'N/A'}
        </Typography>
      </Stack>
      
      <GradientSlider
        value={validValue}
        onChange={(_, value) => onChange(value as number)}
        min={min}
        max={max}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => {
          const k = miredToKelvin(value)
          return k ? `${k}K` : 'N/A'
        }}
      />
      
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        {presets.map(preset => (
          <PresetButton
            key={preset.name}
            onClick={() => onChange(preset.mired)}
            variant={value === preset.mired ? "contained" : "outlined"}
            size="small"
          >
            <span>{preset.name}</span>
            <span className="preset-kelvin">{preset.kelvin}K</span>
          </PresetButton>
        ))}
      </Stack>
    </Box>
  )
}

export { ColorTempSlider }