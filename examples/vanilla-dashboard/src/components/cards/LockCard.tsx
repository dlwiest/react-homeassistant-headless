import React from 'react'
import { Lock } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface LockCardProps {
  entityId: string
  name: string
}

export const LockCard = ({ entityId, name }: LockCardProps) => {
  return (
    <Lock entityId={entityId}>
      {(lock) => (
        <Card>
          <CardHeader title={name} />

          <CardContent>
            <div className={`lock-status ${lock.isLocked ? 'locked' : 'unlocked'}`}>
              {lock.isLocked ? 'Locked' : lock.isUnlocked ? 'Unlocked' : 'Unknown'}
            </div>

            <div className="lock-controls">
              <button
                className={`lock-button ${lock.isLocked ? 'active' : 'inactive'}`}
                onClick={lock.lock}
                disabled={lock.isLocked}
              >
                Lock
              </button>
              <button
                className={`lock-button ${lock.isUnlocked ? 'active' : 'inactive'}`}
                onClick={() => lock.unlock()}
                disabled={lock.isUnlocked}
              >
                Unlock
              </button>
              {lock.supportsOpen && (
                <button
                  className="lock-button inactive"
                  onClick={() => lock.open()}
                >
                  Open
                </button>
              )}
            </div>

            {lock.changedBy && (
              <div className="lock-info">
                Changed by: {lock.changedBy}
              </div>
            )}
          </CardContent>

          <CardFooter>
            <div className="badge-container">
              <span className="badge">Lock</span>
              <span className="badge">Unlock</span>
              {lock.supportsOpen && <span className="badge">Open</span>}
            </div>
            <div className={`connection-indicator ${lock.isConnected ? 'connected' : 'disconnected'}`}>
              <div className="connection-dot"></div>
              <span>{lock.isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </Lock>
  )
}

