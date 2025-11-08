import React from 'react'
import { Fan } from 'hass-react'
import { Card } from '../layout/Card'

interface FanCardProps {
  entityId: string
  name: string
}

export const FanCard: React.FC<FanCardProps> = ({ entityId, name }) => {
  return (
    <Fan entityId={entityId}>
      {(fan) => (
        <Card>
          <div className="card-header">
            <h3 className="card-title">{name}</h3>
            <button 
              className={`toggle-button ${fan.isOn ? 'on' : ''}`}
              onClick={fan.toggle}
            >
              {fan.isOn ? '🌪️ ON' : '⭕ OFF'}
            </button>
          </div>
          
          {fan.isOn && (
            <div className="card-content">
              {fan.supportsSetSpeed && (
                <div className="control-group">
                  <label className="control-label">
                    Speed: {fan.percentage}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={fan.percentage}
                    onChange={(e) => fan.setPercentage(parseInt(e.target.value))}
                    className="range-input"
                  />
                </div>
              )}

              {fan.supportsPresetMode && fan.availablePresetModes.length > 0 && (
                <div className="control-group">
                  <label className="control-label">Preset Mode:</label>
                  <select
                    value={fan.presetMode || (fan.availablePresetModes[0] || '')}
                    onChange={(e) => fan.setPresetMode(e.target.value)}
                    className="select-input"
                  >
                    {fan.availablePresetModes.map(preset => (
                      <option key={preset} value={preset}>{preset}</option>
                    ))}
                  </select>
                </div>
              )}

              {fan.supportsOscillate && (
                <div className="control-group">
                  <label className="control-label">
                    <input
                      type="checkbox"
                      checked={fan.isOscillating || false}
                      onChange={(e) => fan.setOscillating(e.target.checked)}
                      className="checkbox-input"
                    />
                    Oscillating
                  </label>
                </div>
              )}

              {fan.supportsDirection && (
                <div className="control-group">
                  <label className="control-label">Direction:</label>
                  <select
                    value={fan.direction || 'forward'}
                    onChange={(e) => fan.setDirection(e.target.value as 'forward' | 'reverse')}
                    className="select-input"
                  >
                    <option value="forward">Forward</option>
                    <option value="reverse">Reverse</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="card-footer">
            <div className="feature-tags">
              {fan.supportsSetSpeed && <span className="feature-tag">Speed</span>}
              {fan.supportsOscillate && <span className="feature-tag">Oscillate</span>}
              {fan.supportsDirection && <span className="feature-tag">Direction</span>}
              {fan.supportsPresetMode && <span className="feature-tag">Presets</span>}
              {!fan.supportsSetSpeed && !fan.supportsOscillate && !fan.supportsDirection && !fan.supportsPresetMode && (
                <span className="feature-tag">Basic</span>
              )}
            </div>
            <div className="entity-info">
              Last updated: {fan.lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </Card>
      )}
    </Fan>
  )
}