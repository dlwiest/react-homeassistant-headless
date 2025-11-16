import React from 'react'
import { Cover } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface CoverCardProps {
  entityId: string
  name: string
}

export const CoverCard = ({ entityId, name }: CoverCardProps) => {
  return (
    <Cover entityId={entityId}>
      {(cover) => {
        const getStateDisplay = () => {
          if (cover.isOpening) return 'Opening'
          if (cover.isClosing) return 'Closing'
          if (cover.isOpen) return 'Open'
          if (cover.isClosed) return 'Closed'
          return cover.state
        }

        const getDeviceClass = () => {
          const deviceClass = cover.attributes.device_class
          if (typeof deviceClass === 'string') {
            return deviceClass.charAt(0).toUpperCase() + deviceClass.slice(1)
          }
          return 'Cover'
        }

        return (
          <Card>
            <CardHeader
              title={name}
              subtitle={getDeviceClass()}
            />

            <CardContent>
              <div className="cover-status">
                {getStateDisplay()}
                {cover.position !== undefined && ` (${cover.position}%)`}
              </div>

              {cover.position !== undefined && (
                <div className="control-group">
                  <div className="control-header">
                    <span className="control-label">Position</span>
                    <span className="control-value">{cover.position}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={cover.position}
                    onChange={(e) => cover.setPosition(parseInt(e.target.value))}
                    disabled={cover.isOpening || cover.isClosing}
                    className="slider"
                  />
                </div>
              )}

              <div className="cover-controls">
                <button
                  onClick={cover.open}
                  disabled={cover.isOpening || cover.isOpen}
                  className={`cover-button ${cover.isOpen ? 'active' : 'inactive'}`}
                >
                  Open
                </button>

                {(cover.isOpening || cover.isClosing) && (
                  <button
                    onClick={cover.stop}
                    className="cover-button inactive"
                  >
                    Stop
                  </button>
                )}

                <button
                  onClick={cover.close}
                  disabled={cover.isClosing || cover.isClosed}
                  className={`cover-button ${cover.isClosed ? 'active' : 'inactive'}`}
                >
                  Close
                </button>
              </div>
            </CardContent>

            <CardFooter>
              <div className="badge-container">
                {cover.position !== undefined && <span className="badge">Position</span>}
              </div>
              <div className={`connection-indicator ${cover.isConnected ? 'connected' : 'disconnected'}`}>
                <div className="connection-dot"></div>
                <span>{cover.isConnected ? 'Online' : 'Offline'}</span>
              </div>
            </CardFooter>
          </Card>
        )
      }}
    </Cover>
  )
}

