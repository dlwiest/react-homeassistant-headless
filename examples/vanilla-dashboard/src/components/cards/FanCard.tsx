import React, { useState, useCallback } from 'react'
import { Fan } from 'hass-react'
import { Card } from '../layout/Card'

interface FanCardProps {
  entityId: string
  name: string
}

export const FanCard: React.FC<FanCardProps> = ({ entityId, name }) => {
  const [actionError, setActionError] = useState<string | null>(null)

  // Helper to handle errors from actions
  const handleAction = useCallback(async (action: () => Promise<void>, actionName: string) => {
    try {
      setActionError(null)
      await action()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred'
      setActionError(`${actionName}: ${message}`)
      
      // Auto-clear error after 5 seconds
      setTimeout(() => setActionError(null), 5000)
    }
  }, [])

  return (
    <Fan entityId={entityId}>
      {(fan) => {
        // Check for entity availability errors
        if (fan.error) {
          return (
            <Card>
              <div className="card-header">
                <h3 className="card-title">{name}</h3>
                <div className="card-subtitle">Entity Error</div>
              </div>
              <div className="card-content">
                <div className="error-message">
                  ⚠️ {fan.error.message}
                </div>
              </div>
            </Card>
          )
        }

        return (
          <Card>
            <div className="card-header">
              <h3 className="card-title">{name}</h3>
              <button 
                className={`toggle-button ${fan.isOn ? 'on' : ''}`}
                onClick={() => handleAction(fan.toggle, 'Toggle fan')}
                disabled={!fan.isConnected}
              >
                {fan.isOn ? '🌪️ ON' : '⭕ OFF'}
              </button>
            </div>

            {/* Display action errors */}
            {actionError && (
              <div className="error-banner">
                ⚠️ {actionError}
              </div>
            )}
            
            {fan.isOn && fan.isConnected && (
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
                      onChange={(e) => handleAction(
                        () => fan.setPercentage(parseInt(e.target.value)),
                        'Set speed'
                      )}
                      className="range-input"
                    />
                  </div>
                )}

                {fan.supportsPresetMode && fan.availablePresetModes.length > 0 && (
                  <div className="control-group">
                    <label className="control-label">Preset Mode:</label>
                    <select
                      value={fan.presetMode || (fan.availablePresetModes[0] || '')}
                      onChange={(e) => handleAction(
                        () => fan.setPresetMode(e.target.value),
                        'Set preset mode'
                      )}
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
                        onChange={(e) => handleAction(
                          () => fan.setOscillating(e.target.checked),
                          'Set oscillation'
                        )}
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
                      onChange={(e) => handleAction(
                        () => fan.setDirection(e.target.value as 'forward' | 'reverse'),
                        'Set direction'
                      )}
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
                {fan.isConnected ? (
                  `Last updated: ${fan.lastUpdated.toLocaleTimeString()}`
                ) : (
                  <span style={{ color: '#ef4444' }}>⚠️ Not connected to Home Assistant</span>
                )}
              </div>
            </div>
          </Card>
        )
      }}
    </Fan>
  )
}