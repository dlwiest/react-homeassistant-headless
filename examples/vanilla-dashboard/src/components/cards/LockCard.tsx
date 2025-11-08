import React from 'react'
import { Lock } from 'hass-react'
import { Card } from '../layout/Card'

interface LockCardProps {
  entityId: string
  name: string
}

export const LockCard: React.FC<LockCardProps> = ({ entityId, name }) => {
  return (
    <Lock entityId={entityId}>
      {(lock) => (
        <Card>
          <div className="card-header">
            <h3 className="card-title">{name}</h3>
            <div className={`status-indicator ${lock.isLocked ? 'locked' : lock.isUnlocked ? 'unlocked' : 'unknown'}`}>
              {lock.isLocked ? '🔒 LOCKED' : lock.isUnlocked ? '🔓 UNLOCKED' : '❓ UNKNOWN'}
            </div>
          </div>
          
          <div className="card-content">
            <div className="button-group">
              <button 
                className="action-button lock-button"
                onClick={lock.lock}
                disabled={lock.isLocked}
              >
                🔒 Lock
              </button>
              <button 
                className="action-button unlock-button"
                onClick={() => lock.unlock()}
                disabled={lock.isUnlocked}
              >
                🔓 Unlock
              </button>
              {lock.supportsOpen && (
                <button 
                  className="action-button open-button"
                  onClick={() => lock.open()}
                >
                  🚪 Open
                </button>
              )}
            </div>
            
            {lock.changedBy && (
              <div className="lock-info">
                Changed by: {lock.changedBy}
              </div>
            )}
          </div>

          <div className="card-footer">
            <div className="feature-tags">
              {lock.supportsOpen ? (
                <span className="feature-tag">Lock, Unlock, Open</span>
              ) : (
                <span className="feature-tag">Lock, Unlock</span>
              )}
            </div>
            <div className="entity-info">
              Last updated: {lock.lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </Card>
      )}
    </Lock>
  )
}