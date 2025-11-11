import React, { useState, useCallback } from 'react'
import { Light } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface LightCardProps {
  entityId: string
  name: string
}

export const LightCard = ({ entityId, name }: LightCardProps) => {
  const [actionError, setActionError] = useState<string | null>(null)

  // Helper to handle errors from actions (like setting brightness, colors, etc.)
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
    <Light entityId={entityId}>
      {(light) => {
        // Check for entity availability errors
        if (light.error) {
          return (
            <Card>
              <CardHeader 
                title={name}
                subtitle="Entity Error"
              />
              <CardContent>
                <div className="error-message">
                  ⚠️ {light.error.message}
                </div>
              </CardContent>
            </Card>
          )
        }

        return (
          <Card>
            <CardHeader 
              title={name}
              subtitle={light.isConnected ? (light.isOn ? 'On' : 'Off') : 'Disconnected'}
              action={
                <button 
                  className={`toggle-switch ${light.isOn ? 'on' : ''}`}
                  onClick={() => handleAction(light.toggle, 'Toggle')}
                  disabled={!light.isConnected}
                  aria-label={`Toggle ${name}`}
                />
              }
            />

            {/* Display action errors */}
            {actionError && (
              <div className="error-banner">
                ⚠️ {actionError}
              </div>
            )}
            
            {light.isOn && light.isConnected && (
              <CardContent>
                <div className="light-controls">
                  {light.supportsBrightness && (
                    <div className="control-row">
                      <label className="control-label">
                        Brightness: {light.brightnessPercent}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="255"
                        value={light.brightness}
                        onChange={(e) => handleAction(
                          () => light.setBrightness(parseInt(e.target.value)),
                          'Set brightness'
                        )}
                        className="slider"
                      />
                    </div>
                  )}

                  {light.supportsRgb && (
                    <div className="control-row">
                      <label className="control-label">Colors:</label>
                      <div className="color-buttons">
                        <button 
                          className="color-btn" 
                          style={{ backgroundColor: '#ef4444' }}
                          onClick={() => handleAction(
                            () => light.setRgbColor([255, 0, 0]),
                            'Set color to red'
                          )}
                          aria-label="Set to red"
                        />
                        <button 
                          className="color-btn" 
                          style={{ backgroundColor: '#10b981' }}
                          onClick={() => handleAction(
                            () => light.setRgbColor([0, 255, 0]),
                            'Set color to green'
                          )}
                          aria-label="Set to green"
                        />
                        <button 
                          className="color-btn" 
                          style={{ backgroundColor: '#3b82f6' }}
                          onClick={() => handleAction(
                            () => light.setRgbColor([0, 0, 255]),
                            'Set color to blue'
                          )}
                          aria-label="Set to blue"
                        />
                        <button 
                          className="color-btn" 
                          style={{ backgroundColor: '#f59e0b' }}
                          onClick={() => handleAction(
                            () => light.setRgbColor([255, 165, 0]),
                            'Set color to orange'
                          )}
                          aria-label="Set to orange"
                        />
                        <button 
                          className="color-btn" 
                          style={{ backgroundColor: '#8b5cf6' }}
                          onClick={() => handleAction(
                            () => light.setRgbColor([139, 92, 246]),
                            'Set color to purple'
                          )}
                          aria-label="Set to purple"
                        />
                        <button 
                          className="color-btn" 
                          style={{ backgroundColor: '#ffffff', border: '2px solid #e5e7eb' }}
                          onClick={() => handleAction(
                            () => light.setRgbColor([255, 255, 255]),
                            'Set color to white'
                          )}
                          aria-label="Set to white"
                        />
                      </div>
                    </div>
                  )}

                  {light.supportsEffects && light.availableEffects.length > 0 && (
                    <div className="control-row">
                      <label className="control-label">Effect:</label>
                      <select
                        value={(!light.effect || light.effect === 'off') ? '' : light.effect}
                        onChange={(e) => {
                          const effectValue = e.target.value === '' ? null : e.target.value
                          handleAction(
                            () => light.setEffect(effectValue),
                            'Set effect'
                          )
                        }}
                        style={{ 
                          padding: '0.5rem', 
                          borderRadius: '6px', 
                          border: '1px solid #d1d5db',
                          flex: 1
                        }}
                      >
                        <option value="">None</option>
                        {light.availableEffects
                          .filter(effect => effect.toLowerCase() !== 'none')
                          .map(effect => (
                            <option key={effect} value={effect}>{effect}</option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
              </CardContent>
            )}

            <CardFooter>
              <div>
                Features: {[
                  light.supportsBrightness && 'Brightness',
                  light.supportsRgb && 'RGB Color',
                  light.supportsColorTemp && 'Color Temperature',
                  light.supportsEffects && 'Effects'
                ].filter(Boolean).join(', ') || 'Basic On/Off'}
              </div>
              {!light.isConnected && (
                <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  ⚠️ Not connected to Home Assistant
                </div>
              )}
            </CardFooter>
          </Card>
        )
      }}
    </Light>
  )
}