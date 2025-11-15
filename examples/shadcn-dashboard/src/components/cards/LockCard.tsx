import React from 'react'
import { Lock } from 'hass-react'
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConnectionIndicator } from '@/components/ui/connection-indicator'
import { Lock as LockIcon, Unlock, DoorOpen } from 'lucide-react'

interface LockCardProps {
  entityId: string
  name: string
}

const LockCard = ({ entityId, name }: LockCardProps) => {
  return (
    <Lock entityId={entityId}>
      {(lock) => {
        const getStateText = () => {
          if (lock.isLocked) return 'Locked'
          if (lock.isUnlocked) return 'Unlocked'
          return 'Unknown'
        }

        const getStateColor = () => {
          if (lock.isLocked) return 'text-emerald-400'
          if (lock.isUnlocked) return 'text-red-400'
          return 'text-slate-400'
        }

        return (
          <Card className="h-full">
            <CardHeader>
              <div>
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription>
                  {getStateText()}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className={`text-3xl font-semibold ${getStateColor()}`}>
                {getStateText()}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={lock.lock}
                  disabled={lock.isLocked}
                  variant={lock.isLocked ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                >
                  <LockIcon className="h-4 w-4 mr-2" />
                  Lock
                </Button>
                <Button
                  onClick={() => lock.unlock()}
                  disabled={lock.isUnlocked}
                  variant={lock.isUnlocked ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  Unlock
                </Button>
                {lock.supportsOpen && (
                  <Button
                    onClick={() => lock.open()}
                    variant="outline"
                    size="sm"
                    className="w-full col-span-2"
                  >
                    <DoorOpen className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                )}
              </div>

              {lock.changedBy && (
                <div className="text-sm text-slate-400">
                  Changed by: <span className="text-slate-300">{lock.changedBy}</span>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex-col items-start gap-2">
              <div className="flex flex-wrap gap-1.5">
                <Badge>Lock</Badge>
                <Badge>Unlock</Badge>
                {lock.supportsOpen && <Badge>Open</Badge>}
              </div>
              <ConnectionIndicator isConnected={lock.isConnected} className="pt-2" />
            </CardFooter>
          </Card>
        )
      }}
    </Lock>
  )
}

export default LockCard
