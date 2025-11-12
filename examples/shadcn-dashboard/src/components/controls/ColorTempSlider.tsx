import React from 'react'
import { Slider } from '../ui/slider'
import { Button } from '../ui/button'

interface ColorTempSliderProps {
  value: number | undefined
  onChange: (value: number) => void
  min?: number
  max?: number
}

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
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Temperature:</label>
        <div 
          className="h-8 w-8 rounded border"
          style={{ backgroundColor: getCurrentColor() }}
        />
        <span className="text-sm text-muted-foreground">
          {kelvin ? `${kelvin}K` : 'N/A'}
        </span>
      </div>
      
      <Slider
        value={[validValue]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={1}
        className="[&_.slider-track]:bg-gradient-to-r [&_.slider-track]:from-blue-200 [&_.slider-track]:via-yellow-100 [&_.slider-track]:to-orange-300"
      />
      
      <div className="grid grid-cols-4 gap-2">
        {presets.map(preset => (
          <Button
            key={preset.name}
            onClick={() => onChange(preset.mired)}
            variant={value === preset.mired ? "default" : "outline"}
            size="sm"
            className="h-auto flex-col py-2"
          >
            <span>{preset.name}</span>
            <span className="text-xs opacity-70">{preset.kelvin}K</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

export { ColorTempSlider }