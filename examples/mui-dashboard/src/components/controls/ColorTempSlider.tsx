import React from 'react'
import { Box, Typography, Slider, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'

interface ColorTempSliderProps {
  value: number | undefined
  onChange: (_value: number) => void
  min?: number
  max?: number
}

const TempPreview = styled(Box)({
  width: 32,
  height: 32,
  border: '1px solid rgba(255, 255, 255, 0.23)',
  borderRadius: 4,
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
      return `rgb(${204 + (255 - 204) * localRatio}, ${231 + (255 - 231) * localRatio}, ${255 - (255 - 181) * localRatio})`
    } else {
      const localRatio = (ratio - 0.5) * 2
      return `rgb(${255 - (255 - 255) * localRatio}, ${228 - (228 - 140) * localRatio}, ${181 - (181 - 66) * localRatio})`
    }
  }

  const kelvin = miredToKelvin(value)
  const validValue = value && isFinite(value) ? value : 250

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="body2" color="text.secondary">
          Temperature
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <TempPreview sx={{ backgroundColor: getCurrentColor() }} />
          <Typography variant="body2" color="text.secondary">
            {kelvin ? `${kelvin}K` : 'N/A'}
          </Typography>
        </Stack>
      </Stack>

      <Slider
        value={validValue}
        onChange={(_, value) => onChange(value as number)}
        min={min}
        max={max}
      />
    </Box>
  )
}

export default ColorTempSlider
