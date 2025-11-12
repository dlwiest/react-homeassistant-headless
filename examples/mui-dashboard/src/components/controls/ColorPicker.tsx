import React from 'react'
import { Box, Typography, IconButton, Stack, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

interface ColorPickerProps {
  color: [number, number, number] | undefined
  onChange: (color: [number, number, number]) => void
}

const ColorInput = styled('input')({
  width: 60,
  height: 36,
  border: '1px solid #ccc',
  borderRadius: 4,
  cursor: 'pointer',
  '&::-webkit-color-swatch-wrapper': {
    padding: 0,
  },
  '&::-webkit-color-swatch': {
    border: 'none',
    borderRadius: 4,
  },
})

const ColorButton = styled(IconButton)(({ theme }) => ({
  width: 40,
  height: 40,
  border: '2px solid',
  borderColor: theme.palette.divider,
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: theme.shadows[4],
  },
}))

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
  
  const presets = [
    { name: 'Red', color: [255, 0, 0] as [number, number, number] },
    { name: 'Green', color: [0, 255, 0] as [number, number, number] },
    { name: 'Blue', color: [0, 0, 255] as [number, number, number] },
    { name: 'Yellow', color: [255, 255, 0] as [number, number, number] },
    { name: 'Cyan', color: [0, 255, 255] as [number, number, number] },
    { name: 'Magenta', color: [255, 0, 255] as [number, number, number] },
    { name: 'Orange', color: [255, 165, 0] as [number, number, number] },
    { name: 'Purple', color: [128, 0, 128] as [number, number, number] },
  ]
  
  return (
    <Box sx={{ my: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight="medium">
          Color:
        </Typography>
        <ColorInput
          type="color"
          value={rgbToHex(r, g, b)}
          onChange={handleColorChange}
        />
        <Typography variant="body2" color="text.secondary">
          RGB({r}, {g}, {b})
        </Typography>
      </Stack>
      
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {presets.map(preset => (
          <ColorButton
            key={preset.name}
            onClick={() => onChange(preset.color)}
            title={preset.name}
            sx={{ 
              backgroundColor: rgbToHex(...preset.color),
              '&:hover': {
                backgroundColor: rgbToHex(...preset.color),
              }
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export { ColorPicker }