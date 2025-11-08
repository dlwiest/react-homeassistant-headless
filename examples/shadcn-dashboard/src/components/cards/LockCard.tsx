import React from 'react'
import { Lock } from 'hass-react'
import { Card, CardContent, CardHeader, CardFooter } from '../layout/Card'
import { Button } from '../ui/button'

interface LockCardProps {
  entityId: string
  name: string
}

export const LockCard: React.FC<LockCardProps> = ({ entityId, name }) => {
  return (
    <Lock entityId={entityId}>
      {(lock) => (
        <Card>
          <CardHeader 
            title={name}
            subtitle={lock.isLocked ? '🔒 LOCKED' : lock.isUnlocked ? '🔓 UNLOCKED' : '❓ UNKNOWN'}
          />
          
          <CardContent>
            <div className="button-group">
              <Button
                onClick={lock.lock}
                disabled={lock.isLocked}
                className="action-button lock-button"
              >
                🔒 Lock
              </Button>
              <Button
                onClick={() => lock.unlock()}
                disabled={lock.isUnlocked}
                className="action-button unlock-button"
              >
                🔓 Unlock
              </Button>
              {lock.supportsOpen && (
                <Button
                  onClick={() => lock.open()}
                  className="action-button open-button"
                >
                  🚪 Open
                </Button>
              )}
            </div>
            
            {lock.changedBy && (
              <div className="lock-info">
                Changed by: {lock.changedBy}
              </div>
            )}

            <div className="feature-tags">
              <span className="feature-tag">
                {lock.supportsOpen ? 'Lock, Unlock, Open' : 'Lock, Unlock'}
              </span>
            </div>
          </CardContent>

          <CardFooter>
            Last updated: {lock.lastUpdated.toLocaleTimeString()}
          </CardFooter>
        </Card>
      )}
    </Lock>
  )
}