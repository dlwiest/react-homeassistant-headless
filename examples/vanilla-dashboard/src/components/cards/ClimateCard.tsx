import React from 'react'
import { Climate } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface ClimateCardProps {
  entityId: string
  name: string
}

export const ClimateCard = ({ entityId, name }: ClimateCardProps) => {
  return (
    <Climate entityId={entityId}>
      {(climate) => (
        <Card>
          <CardHeader
            title={name}
            subtitle={climate.mode}
          />

          <CardContent>
            <div className="control-group">
              <div className="control-header">
                <div>
                  <div className="control-label">Current</div>
                  <div className="control-value" style={{ fontSize: '2rem', fontWeight: 700 }}>
                    {climate.currentTemperature ?? '--'}°
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="control-label">Target</div>
                  <div className="control-value" style={{ fontSize: '2rem', fontWeight: 700 }}>
                    {climate.targetTemperature ?? '--'}°
                  </div>
                </div>
              </div>
            </div>

            {climate.supportsTargetTemperature && (
              <div className="button-group">
                <button
                  onClick={() => climate.setTemperature((climate.targetTemperature ?? climate.minTemp) - 1)}
                  disabled={climate.targetTemperature == null || climate.targetTemperature <= climate.minTemp}
                  className="btn btn-secondary"
                >
                  - Lower
                </button>
                <button
                  onClick={() => climate.setTemperature((climate.targetTemperature ?? climate.maxTemp) + 1)}
                  disabled={climate.targetTemperature == null || climate.targetTemperature >= climate.maxTemp}
                  className="btn btn-secondary"
                >
                  + Raise
                </button>
              </div>
            )}

            <div className="control-group">
              <label className="control-label">Mode</label>
              <select
                value={climate.mode}
                onChange={(e) => climate.setMode(e.target.value)}
                className="select-input"
              >
                {climate.supportedModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            {climate.supportsFanMode && climate.supportedFanModes.length > 0 && (
              <div className="control-group">
                <label className="control-label">Fan</label>
                <select
                  value={climate.fanMode || ''}
                  onChange={(e) => climate.setFanMode(e.target.value)}
                  className="select-input"
                >
                  {climate.supportedFanModes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </CardContent>

          <CardFooter>
            <div className="badge-container">
              <span className="badge">Range: {climate.minTemp}-{climate.maxTemp}°</span>
            </div>
            <div className={`connection-indicator ${climate.isConnected ? 'connected' : 'disconnected'}`}>
              <div className="connection-dot"></div>
              <span>{climate.isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </Climate>
  )
}
