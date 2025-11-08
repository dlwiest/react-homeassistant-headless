import { Lock } from 'react-homeassistant-headless'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

interface LockCardProps {
  entityId: string
  name: string
}

export const LockCard = ({ entityId, name }: LockCardProps) => {
  return (
    <Lock entityId={entityId}>
      {(lockEntity) => (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{name}</span>
              <span className="text-3xl">
                {lockEntity.isJammed ? '⚠️' : lockEntity.isLocked ? '🔒' : '🔓'}
              </span>
            </CardTitle>
            <CardDescription>
              Status: {
                lockEntity.isLocked ? 'Locked' : 
                lockEntity.isUnlocked ? 'Unlocked' : 
                lockEntity.isLocking ? 'Locking...' : 
                lockEntity.isUnlocking ? 'Unlocking...' : 
                lockEntity.isJammed ? 'Jammed!' : 
                lockEntity.state
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex gap-2">
              <Button 
                onClick={lockEntity.lock}
                disabled={lockEntity.isLocked || lockEntity.isLocking || lockEntity.isJammed}
                className="flex-1"
              >
                🔒 Lock
              </Button>
              <Button 
                onClick={lockEntity.unlock}
                disabled={lockEntity.isUnlocked || lockEntity.isUnlocking || lockEntity.isJammed}
                variant="outline"
                className="flex-1"
              >
                🔓 Unlock
              </Button>
            </div>
          </CardContent>

          <CardFooter className="text-xs text-muted-foreground">
            {lockEntity.isJammed ? (
              <span className="text-destructive font-semibold">⚠️ Lock is jammed!</span>
            ) : (
              `Last changed: ${lockEntity.lastChanged.toLocaleTimeString()}`
            )}
          </CardFooter>
        </Card>
      )}
    </Lock>
  )
}
