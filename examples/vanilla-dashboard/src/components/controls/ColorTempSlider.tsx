import React from 'react'

interface ColorTempSliderProps {
  value: number | undefined
  onChange: (value: number) => void
  min?: number
  max?: number
}

const ColorTempSlider = ({ 
  value = 250, 
  onChange,
  min = 153,  // 6500K (cool)
  max = 500   // 2000K (warm)
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
    <div className="color-temp-slider">
      <div className="color-temp-header">
        <label className="control-label">Temperature:</label>
        <div 
          className="color-temp-preview"
          style={{ backgroundColor: getCurrentColor() }}
        />
        <span className="color-temp-value">
          {kelvin ? `${kelvin}K` : 'N/A'}
        </span>
      </div>
      
      <input
        type="range"
        min={min}
        max={max}
        value={validValue}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="slider color-temp-gradient"
      />
      
      <div className="color-temp-presets">
        {presets.map(preset => (
          <button
            key={preset.name}
            onClick={() => onChange(preset.mired)}
            className={`preset-btn ${value === preset.mired ? 'active' : ''}`}
          >
            {preset.name}
            <span className="preset-kelvin">{preset.kelvin}K</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export { ColorTempSlider }