import React from 'react'

interface ColorPickerProps {
  color: [number, number, number] | undefined
  onChange: (color: [number, number, number]) => void
}

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

  const handleColorChange = (e: { target: { value: string } }) => {
    const newColor = hexToRgb(e.target.value)
    onChange(newColor)
  }

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-slate-400">Color:</label>
      <input
        type="color"
        value={rgbToHex(r, g, b)}
        onChange={handleColorChange}
        className="h-8 w-16 cursor-pointer rounded border border-slate-600/50 bg-slate-800"
      />
      <span className="text-sm text-slate-400">RGB({r}, {g}, {b})</span>
    </div>
  )
}

export default ColorPicker