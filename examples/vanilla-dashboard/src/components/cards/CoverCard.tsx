import React, { useState, useCallback } from 'react'
import { Cover } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface CoverCardProps {
  entityId: string
  name: string
}

export const CoverCard = ({ entityId, name }: CoverCardProps) => {
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
    <Cover entityId={entityId}>
      {(cover) => {
        // Check for entity availability errors
        if (cover.error) {
          return (
            <Card>
              <CardHeader 
                title={name}
                subtitle="Entity Error"
              />
              <CardContent>
                <div className="error-message">
                  ⚠️ {cover.error.message}
                </div>
              </CardContent>
            </Card>
          )
        }

        const getStateDisplay = () => {
          if (!cover.isConnected) return 'Disconnected'
          if (cover.isOpening) return 'Opening ⬆️'
          if (cover.isClosing) return 'Closing ⬇️'
          if (cover.isOpen) return 'Open'
          if (cover.isClosed) return 'Closed'
          return cover.state
        }

        const getIcon = () => {
          if (cover.isOpening) return '⬆️'
          if (cover.isClosing) return '⬇️'
          return cover.isOpen ? '🪟' : '▣'
        }

        return (
          <Card>
            <CardHeader 
              title={name}
              subtitle={
                <div className="status-line">
                  <span>{getStateDisplay()}</span>
                  {!cover.isConnected && <span className="disconnected">📶</span>}
                  {cover.position !== undefined && (
                    <span className="position">({cover.position}%)</span>
                  )}
                </div>
              }
              icon={getIcon()}
            />

            {/* Display action errors */}
            {actionError && (
              <CardContent>
                <div className="error-message">
                  ❌ {actionError}
                  <button 
                    className="error-dismiss"
                    onClick={() => setActionError(null)}
                  >
                    ×
                  </button>
                </div>
              </CardContent>
            )}

            <CardContent>
              <div className="cover-content">
                {/* Position indicator */}
                {cover.position !== undefined && (
                  <div className="position-section">
                    <div className="position-header">
                      <span>Position: {cover.position}%</span>
                    </div>
                    <div className="position-bar">
                      <div 
                        className="position-fill"
                        style={{ width: `${cover.position}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Position slider */}
                {cover.position !== undefined && cover.isConnected && (
                  <div className="control-section">
                    <label>Set Position</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={cover.position}
                      onChange={(e) => handleAction(
                        () => cover.setPosition(parseInt(e.target.value)),
                        'Set position'
                      )}
                      disabled={cover.isOpening || cover.isClosing}
                      className="position-slider"
                    />
                  </div>
                )}

                {/* Control buttons */}
                {cover.isConnected && (
                  <div className="cover-controls">
                    <button
                      onClick={() => handleAction(cover.open, 'Open')}
                      disabled={cover.isOpening || cover.isOpen}
                      className="cover-button open-button"
                    >
                      ⬆️ Open
                    </button>
                    
                    {(cover.isOpening || cover.isClosing) && (
                      <button
                        onClick={() => handleAction(cover.stop, 'Stop')}
                        className="cover-button stop-button"
                      >
                        ⏹️ Stop
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleAction(cover.close, 'Close')}
                      disabled={cover.isClosing || cover.isClosed}
                      className="cover-button close-button"
                    >
                      ⬇️ Close
                    </button>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter>
              <div className="cover-info">
                <div className="tags">
                  <span className="tag">Cover</span>
                  {cover.position !== undefined && <span className="tag secondary">Position Control</span>}
                  {(() => {
                    const deviceClass = cover.attributes.device_class
                    return deviceClass && typeof deviceClass === 'string' ? (
                      <span className="tag secondary">{deviceClass}</span>
                    ) : null
                  })()}
                </div>
                {!cover.isConnected && (
                  <p className="connection-warning">
                    ⚠️ Not connected to Home Assistant
                  </p>
                )}
              </div>
            </CardFooter>
          </Card>
        )
      }}
    </Cover>
  )
}