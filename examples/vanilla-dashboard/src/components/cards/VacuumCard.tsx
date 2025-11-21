import React from 'react'
import { Vacuum } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface VacuumCardProps {
  entityId: string
  name: string
}

const getStateText = (state: string, isCleaning: boolean, isDocked: boolean, isReturning: boolean, isError: boolean) => {
  if (isCleaning) return 'Cleaning'
  if (isDocked) return 'Docked'
  if (isReturning) return 'Returning'
  if (isError) return 'Error'
  return 'Idle'
}

export const VacuumCard = ({ entityId, name }: VacuumCardProps) => {
  return (
    <Vacuum entityId={entityId}>
      {(vacuum) => (
        <Card>
          <CardHeader
            title={name}
            subtitle={getStateText(vacuum.state, vacuum.isCleaning, vacuum.isDocked, vacuum.isReturning, vacuum.isError)}
          />

          <CardContent>
            {/* Battery Level */}
            {vacuum.batteryLevel !== null && (
              <div className="control-group">
                <div className="control-header">
                  <span className="control-label">Battery</span>
                  <span className="control-value">{vacuum.batteryLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={vacuum.batteryLevel}
                  disabled
                  className="slider"
                />
              </div>
            )}

            {/* Fan Speed */}
            {vacuum.supportsFanSpeed && vacuum.availableFanSpeeds.length > 0 && (
              <div className="control-group">
                <label className="control-label">Fan Speed</label>
                <select
                  value={vacuum.fanSpeed || ''}
                  onChange={(e) => vacuum.setFanSpeed(e.target.value)}
                  className="select-input"
                >
                  {vacuum.availableFanSpeeds.map((speed) => (
                    <option key={speed} value={speed}>
                      {speed}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Control Buttons */}
            <div className="media-controls">
              {vacuum.supportsStart && !vacuum.isCleaning && (
                <button
                  onClick={() => vacuum.start()}
                  className="media-button"
                >
                  ▶
                </button>
              )}

              {vacuum.supportsPause && vacuum.isCleaning && (
                <button
                  onClick={() => vacuum.pause()}
                  className="media-button active"
                >
                  ⏸
                </button>
              )}

              {vacuum.supportsStop && vacuum.isCleaning && (
                <button
                  onClick={() => vacuum.stop()}
                  className="media-button inactive"
                >
                  ⏹
                </button>
              )}

              {vacuum.supportsReturnHome && !vacuum.isDocked && (
                <button
                  onClick={() => vacuum.returnToBase()}
                  className="media-button"
                  title="Return to Dock"
                >
                  Dock
                </button>
              )}

              {vacuum.supportsLocate && (
                <button
                  onClick={() => vacuum.locate()}
                  className="media-button"
                  title="Locate Vacuum"
                >
                  Locate
                </button>
              )}

              {vacuum.supportsCleanSpot && !vacuum.isCleaning && (
                <button
                  onClick={() => vacuum.cleanSpot()}
                  className="media-button"
                  title="Spot Clean"
                >
                  Spot
                </button>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <div className="badge-container">
              {vacuum.supportsStart && <span className="badge">Start</span>}
              {vacuum.supportsPause && <span className="badge">Pause</span>}
              {vacuum.supportsReturnHome && <span className="badge">Dock</span>}
              {vacuum.supportsFanSpeed && <span className="badge">Fan Speed</span>}
              {vacuum.supportsCleanSpot && <span className="badge">Spot Clean</span>}
            </div>
            <div className={`connection-indicator ${vacuum.isConnected ? 'connected' : 'disconnected'}`}>
              <div className="connection-dot"></div>
              <span>{vacuum.isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </Vacuum>
  )
}
