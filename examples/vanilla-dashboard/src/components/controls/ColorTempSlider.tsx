import React from 'react'

interface ColorTempSliderProps {
  value: number | undefined
  onChange: (value: number) => void
  min?: number
  max?: number
}

export const ColorTempSlider = ({
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
    <div className="color-temp-container">
      <div className="control-header">
        <span className="control-label">Temperature</span>
        <div className="color-temp-display">
          <div
            className="color-temp-preview"
            style={{ backgroundColor: getCurrentColor() }}
          />
          <span className="control-value">
            {kelvin ? `${kelvin}K` : 'N/A'}
          </span>
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={validValue}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="slider"
      />
    </div>
  )
}

