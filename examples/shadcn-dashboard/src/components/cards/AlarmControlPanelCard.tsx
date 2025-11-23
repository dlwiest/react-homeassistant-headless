import { useState } from 'react'
import { AlarmControlPanel } from 'hass-react'
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConnectionIndicator } from '@/components/ui/connection-indicator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Shield, ShieldAlert, ShieldCheck, Home, Moon, Plane, Settings } from 'lucide-react'

interface AlarmControlPanelCardProps {
  entityId: string
  name: string
}

export const AlarmControlPanelCard = ({ entityId, name }: AlarmControlPanelCardProps) => {
  const [codeDialogOpen, setCodeDialogOpen] = useState(false)
  const [code, setCode] = useState('')
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null)

  const handleActionWithCode = (action: (code?: string) => Promise<void>) => {
    setPendingAction(() => action)
    setCodeDialogOpen(true)
  }

  const handleCodeSubmit = async () => {
    if (pendingAction) {
      await pendingAction()
      setCodeDialogOpen(false)
      setCode('')
      setPendingAction(null)
    }
  }

  const handleCodeCancel = () => {
    setCodeDialogOpen(false)
    setCode('')
    setPendingAction(null)
  }

  return (
    <AlarmControlPanel entityId={entityId}>
      {(alarm) => {
        const getStateText = () => {
          if (alarm.isDisarmed) return 'Disarmed'
          if (alarm.isArmedHome) return 'Armed Home'
          if (alarm.isArmedAway) return 'Armed Away'
          if (alarm.isArmedNight) return 'Armed Night'
          if (alarm.isArmedVacation) return 'Armed Vacation'
          if (alarm.isArmedCustomBypass) return 'Armed Custom Bypass'
          if (alarm.isTriggered) return 'Triggered'
          if (alarm.isPending) return 'Pending'
          if (alarm.isArming) return 'Arming'
          if (alarm.isDisarming) return 'Disarming'
          return 'Unknown'
        }

        const getStateColor = () => {
          if (alarm.isDisarmed) return 'text-emerald-400'
          if (alarm.isTriggered) return 'text-red-400'
          if (alarm.isPending || alarm.isArming || alarm.isDisarming) return 'text-yellow-400'
          return 'text-blue-400'
        }

        return (
          <>
            <Card className="h-full">
            <CardHeader>
              <div>
                <CardTitle className="text-lg">{name}</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className={`text-3xl font-semibold ${getStateColor()}`}>
                {getStateText()}
              </div>

              {alarm.changedBy && (
                <div className="text-sm text-slate-400">
                  Changed by: <span className="text-slate-300">{alarm.changedBy}</span>
                </div>
              )}

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleActionWithCode((code) => alarm.disarm(code))}
                    disabled={alarm.isDisarmed}
                    variant={alarm.isDisarmed ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Disarm
                  </Button>
                  {alarm.supportsTrigger && (
                    <Button
                      onClick={() => alarm.trigger()}
                      variant="outline"
                      size="sm"
                      className="w-full border-red-500 text-red-400 hover:bg-red-500/10"
                    >
                      <ShieldAlert className="h-4 w-4 mr-2" />
                      Trigger
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {alarm.supportsArmHome && (
                    <Button
                      onClick={() => handleActionWithCode((code) => alarm.armHome(code))}
                      disabled={alarm.isArmedHome}
                      variant={alarm.isArmedHome ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </Button>
                  )}
                  {alarm.supportsArmAway && (
                    <Button
                      onClick={() => handleActionWithCode((code) => alarm.armAway(code))}
                      disabled={alarm.isArmedAway}
                      variant={alarm.isArmedAway ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Away
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {alarm.supportsArmNight && (
                    <Button
                      onClick={() => handleActionWithCode((code) => alarm.armNight(code))}
                      disabled={alarm.isArmedNight}
                      variant={alarm.isArmedNight ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Night
                    </Button>
                  )}
                  {alarm.supportsArmVacation && (
                    <Button
                      onClick={() => handleActionWithCode((code) => alarm.armVacation(code))}
                      disabled={alarm.isArmedVacation}
                      variant={alarm.isArmedVacation ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      <Plane className="h-4 w-4 mr-2" />
                      Vacation
                    </Button>
                  )}
                </div>

                {alarm.supportsArmCustomBypass && (
                  <Button
                    onClick={() => handleActionWithCode((code) => alarm.armCustomBypass(code))}
                    disabled={alarm.isArmedCustomBypass}
                    variant={alarm.isArmedCustomBypass ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Custom Bypass
                  </Button>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex-col items-start gap-2">
              <div className="flex flex-wrap gap-1.5">
                <Badge>Disarm</Badge>
                {alarm.supportsArmHome && <Badge>Home</Badge>}
                {alarm.supportsArmAway && <Badge>Away</Badge>}
                {alarm.supportsArmNight && <Badge>Night</Badge>}
                {alarm.supportsArmVacation && <Badge>Vacation</Badge>}
                {alarm.supportsArmCustomBypass && <Badge>Custom</Badge>}
                {alarm.supportsTrigger && <Badge>Trigger</Badge>}
              </div>
              <ConnectionIndicator isConnected={alarm.isConnected} className="pt-2" />
            </CardFooter>
            </Card>

            <Dialog open={codeDialogOpen} onOpenChange={setCodeDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enter Security Code</DialogTitle>
                </DialogHeader>
                <Input
                  type="password"
                  placeholder="Enter code (optional)"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCodeSubmit()
                    } else if (e.key === 'Escape') {
                      handleCodeCancel()
                    }
                  }}
                  autoFocus
                />
                <DialogFooter>
                  <Button variant="outline" onClick={handleCodeCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleCodeSubmit}>
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )
      }}
    </AlarmControlPanel>
  )
}
