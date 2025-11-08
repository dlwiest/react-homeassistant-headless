import { Lock } from 'react-homeassistant-headless'
import { Card, CardHeader, CardFooter } from '../layout/Card'

interface LockCardProps {
  entityId: string
  name: string
  icon?: string
}

export const LockCard = ({ entityId, name, icon = '🔒' }: LockCardProps) => {
  return (
    <Lock entityId={entityId}>
      {(lockEntity) => (
        <Card>
          <CardHeader 
            title={name}
            subtitle={
              lockEntity.isLocked ? 'Locked' : 
              lockEntity.isUnlocked ? 'Unlocked' : 
              lockEntity.isLocking ? 'Locking...' : 
              lockEntity.isUnlocking ? 'Unlocking...' : 
              lockEntity.isJammed ? 'Jammed!' : 
              lockEntity.state
            }
            action={
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-primary"
                  onClick={lockEntity.lock}
                  disabled={lockEntity.isLocked || lockEntity.isLocking || lockEntity.isJammed}
                  aria-label={`Lock ${name}`}
                >
                  🔒
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={lockEntity.unlock}
                  disabled={lockEntity.isUnlocked || lockEntity.isUnlocking || lockEntity.isJammed}
                  aria-label={`Unlock ${name}`}
                >
                  🔓
                </button>
              </div>
            }
          />
          
          <div style={{ 
            textAlign: 'center', 
            fontSize: '3rem', 
            margin: '1rem 0',
            opacity: lockEntity.isLocked ? 1 : 0.5,
            transition: 'opacity 0.3s ease'
          }}>
            {lockEntity.isJammed ? '⚠️' : lockEntity.isLocked ? '🔒' : '🔓'}
          </div>

          <CardFooter>
            {lockEntity.isJammed ? (
              <span style={{ color: 'red' }}>⚠️ Lock is jammed!</span>
            ) : (
              `Last changed: ${lockEntity.lastChanged.toLocaleTimeString()}`
            )}
          </CardFooter>
        </Card>
      )}
    </Lock>
  )
}
