import React, { useState, useCallback } from 'react'
import { Light } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'
import ColorPicker from '../controls/ColorPicker'
import ColorTempSlider from '../controls/ColorTempSlider'

interface LightCardProps {
  entityId: string
  name: string
}

const LightCard = ({ entityId, name }: LightCardProps) => {
  const [actionError, setActionError] = useState<string | null>(null)

  const handleAction = useCallback(async (action: () => Promise<void>, actionName: string) => {
    try {
      setActionError(null)
      await action()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred'
      setActionError(`${actionName}: ${message}`)

      setTimeout(() => setActionError(null), 5000)
    }
  }, [])

  return (
    <Light entityId={entityId}>
      {(light) => {
        if (light.error) {
          return (
            <Card>
              <CardHeader
                title={name}
                subtitle="Entity Error"
              />
              <CardContent>
                <div className="error-message">
                  {light.error.message}
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
                <label className="switch-toggle">
                  <input
                    type="checkbox"
                    checked={light.isOn}
                    onChange={() => handleAction(light.toggle, 'Toggle')}
                    disabled={!light.isConnected}
                  />
                  <span className="switch-toggle-slider"></span>
                </label>
              }
            />

            {actionError && (
              <div className="error-banner">
                {actionError}
              </div>
            )}

            {light.isOn && light.isConnected && (
              <CardContent>
                <div className="light-controls">
                  {light.supportsBrightness && (
                    <div className="control-group">
                      <div className="control-header">
                        <span className="control-label">Brightness</span>
                        <span className="control-value">{light.brightnessPercent}%</span>
                      </div>
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
                    <ColorPicker
                      color={light.rgbColor}
                      onChange={(color) => handleAction(
                        () => light.setRgbColor(color),
                        'Set color'
                      )}
                    />
                  )}

                  {light.supportsColorTemp && (
                    <ColorTempSlider
                      value={light.colorTemp}
                      onChange={(temp) => handleAction(
                        () => light.setColorTemp(temp),
                        'Set temperature'
                      )}
                      min={light.attributes.min_mireds}
                      max={light.attributes.max_mireds}
                    />
                  )}

                  {light.supportsEffects && light.availableEffects.length > 0 && (
                    <div className="control-group">
                      <label className="control-label">Effect</label>
                      <select
                        value={(!light.effect || light.effect === 'off') ? 'none' : light.effect}
                        onChange={(e) => {
                          const effectValue = e.target.value === 'none' ? null : e.target.value
                          handleAction(
                            () => light.setEffect(effectValue),
                            'Set effect'
                          )
                        }}
                        className="select-input"
                      >
                        <option value="none">None</option>
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
              <div className="badge-container">
                {light.supportsBrightness && <span className="badge">Brightness</span>}
                {light.supportsRgb && <span className="badge">RGB Color</span>}
                {light.supportsColorTemp && <span className="badge">Color Temperature</span>}
                {light.supportsEffects && <span className="badge">Effects</span>}
                {!light.supportsBrightness && !light.supportsRgb && !light.supportsColorTemp && !light.supportsEffects && (
                  <span className="badge">Basic On/Off</span>
                )}
              </div>
              <div className={`connection-indicator ${light.isConnected ? 'connected' : 'disconnected'}`}>
                <div className="connection-dot"></div>
                <span>{light.isConnected ? 'Online' : 'Offline'}</span>
              </div>
            </CardFooter>
          </Card>
        )
      }}
    </Light>
  )
}

export default LightCard
