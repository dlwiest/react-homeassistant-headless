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
    <div className="color-picker">
      <div className="color-picker-header">
        <label className="control-label">Color:</label>
        <input
          type="color"
          value={rgbToHex(r, g, b)}
          onChange={handleColorChange}
          className="color-input"
        />
        <span className="color-value">RGB({r}, {g}, {b})</span>
      </div>
      
      <div className="color-presets">
        {presets.map(preset => (
          <button
            key={preset.name}
            onClick={() => onChange(preset.color)}
            className="color-preset-btn"
            style={{ backgroundColor: rgbToHex(...preset.color) }}
            title={preset.name}
          />
        ))}
      </div>
    </div>
  )
}

export { ColorPicker }