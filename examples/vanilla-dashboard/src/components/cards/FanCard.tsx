import React from 'react'
import { Fan } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface FanCardProps {
  entityId: string
  name: string
}

const FanCard = ({ entityId, name }: FanCardProps) => {
  return (
    <Fan entityId={entityId}>
      {(fan) => (
        <Card>
          <CardHeader
            title={name}
            subtitle={fan.isOn ? 'On' : 'Off'}
            action={
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={fan.isOn}
                  onChange={fan.toggle}
                />
                <span className="switch-toggle-slider"></span>
              </label>
            }
          />

          {fan.isOn && (
            <CardContent>
              <div className="fan-controls">
                {fan.supportsSetSpeed && (
                  <div className="control-group">
                    <div className="control-header">
                      <span className="control-label">Speed</span>
                      <span className="control-value">{fan.percentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={fan.percentage}
                      onChange={(e) => fan.setPercentage(parseInt(e.target.value))}
                      className="slider"
                    />
                  </div>
                )}

                {fan.supportsPresetMode && fan.availablePresetModes.length > 0 && (
                  <div className="control-group">
                    <label className="control-label">Preset Mode</label>
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
                  <div className="control-row">
                    <label className="control-label">Oscillating</label>
                    <label className="switch-toggle">
                      <input
                        type="checkbox"
                        checked={fan.isOscillating || false}
                        onChange={(e) => fan.setOscillating(e.target.checked)}
                      />
                      <span className="switch-toggle-slider"></span>
                    </label>
                  </div>
                )}

                {fan.supportsDirection && (
                  <div className="control-group">
                    <label className="control-label">Direction</label>
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
            </CardContent>
          )}

          <CardFooter>
            <div className="badge-container">
              {fan.supportsSetSpeed && <span className="badge">Speed</span>}
              {fan.supportsOscillate && <span className="badge">Oscillate</span>}
              {fan.supportsDirection && <span className="badge">Direction</span>}
              {fan.supportsPresetMode && <span className="badge">Presets</span>}
              {!fan.supportsSetSpeed && !fan.supportsOscillate && !fan.supportsDirection && !fan.supportsPresetMode && (
                <span className="badge">Basic On/Off</span>
              )}
            </div>
            <div className={`connection-indicator ${fan.isConnected ? 'connected' : 'disconnected'}`}>
              <div className="connection-dot"></div>
              <span>{fan.isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </Fan>
  )
}

export default FanCard
