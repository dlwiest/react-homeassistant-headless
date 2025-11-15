import React from 'react'
import { Box, Typography, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'

interface ColorPickerProps {
  color: [number, number, number] | undefined
  onChange: (_color: [number, number, number]) => void
}

const ColorInput = styled('input')({
  width: 60,
  height: 36,
  border: '1px solid rgba(255, 255, 255, 0.23)',
  borderRadius: 4,
  cursor: 'pointer',
  backgroundColor: 'transparent',
  '&::-webkit-color-swatch-wrapper': {
    padding: 0,
  },
  '&::-webkit-color-swatch': {
    border: 'none',
    borderRadius: 4,
  },
})

const ColorPicker = ({ color = [255, 255, 255], onChange }: ColorPickerProps) => {
  const [r, g, b] = color

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [255, 255, 255]
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = hexToRgb(e.target.value)
    onChange(newColor)
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Color
      </Typography>
      <Stack direction="row" alignItems="center" spacing={2}>
        <ColorInput
          type="color"
          value={rgbToHex(r, g, b)}
          onChange={handleColorChange}
        />
        <Typography variant="body2" color="text.secondary">
          RGB({r}, {g}, {b})
        </Typography>
      </Stack>
    </Box>
  )
}

export default ColorPicker
