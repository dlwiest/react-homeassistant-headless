import React, { useState } from 'react'
import { AlarmControlPanel } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

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

        const getStateClass = () => {
          if (alarm.isDisarmed) return 'alarm-disarmed'
          if (alarm.isTriggered) return 'alarm-triggered'
          if (alarm.isPending || alarm.isArming || alarm.isDisarming) return 'alarm-pending'
          return 'alarm-armed'
        }

        return (
          <>
            <Card>
              <CardHeader title={name} />

              <CardContent>
                <div className={`alarm-status ${getStateClass()}`}>
                  {getStateText()}
                </div>

                {alarm.changedBy && (
                  <div className="alarm-info">
                    Changed by: {alarm.changedBy}
                  </div>
                )}

                <div className="alarm-controls">
                  <div className="alarm-controls-row">
                    <button
                      className={`alarm-button ${alarm.isDisarmed ? 'active' : 'inactive'}`}
                      onClick={() => handleActionWithCode((code) => alarm.disarm(code))}
                      disabled={alarm.isDisarmed}
                    >
                      Disarm
                    </button>
                    {alarm.supportsTrigger && (
                      <button
                        className="alarm-button danger"
                        onClick={() => alarm.trigger()}
                      >
                        Trigger
                      </button>
                    )}
                  </div>

                  <div className="alarm-controls-row">
                    {alarm.supportsArmHome && (
                      <button
                        className={`alarm-button ${alarm.isArmedHome ? 'active' : 'inactive'}`}
                        onClick={() => handleActionWithCode((code) => alarm.armHome(code))}
                        disabled={alarm.isArmedHome}
                      >
                        Home
                      </button>
                    )}
                    {alarm.supportsArmAway && (
                      <button
                        className={`alarm-button ${alarm.isArmedAway ? 'active' : 'inactive'}`}
                        onClick={() => handleActionWithCode((code) => alarm.armAway(code))}
                        disabled={alarm.isArmedAway}
                      >
                        Away
                      </button>
                    )}
                  </div>

                  <div className="alarm-controls-row">
                    {alarm.supportsArmNight && (
                      <button
                        className={`alarm-button ${alarm.isArmedNight ? 'active' : 'inactive'}`}
                        onClick={() => handleActionWithCode((code) => alarm.armNight(code))}
                        disabled={alarm.isArmedNight}
                      >
                        Night
                      </button>
                    )}
                    {alarm.supportsArmVacation && (
                      <button
                        className={`alarm-button ${alarm.isArmedVacation ? 'active' : 'inactive'}`}
                        onClick={() => handleActionWithCode((code) => alarm.armVacation(code))}
                        disabled={alarm.isArmedVacation}
                      >
                        Vacation
                      </button>
                    )}
                  </div>

                  {alarm.supportsArmCustomBypass && (
                    <div className="alarm-controls-row">
                      <button
                        className={`alarm-button full-width ${alarm.isArmedCustomBypass ? 'active' : 'inactive'}`}
                        onClick={() => handleActionWithCode((code) => alarm.armCustomBypass(code))}
                        disabled={alarm.isArmedCustomBypass}
                      >
                        Custom Bypass
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter>
                <div className="badge-container">
                  <span className="badge">Disarm</span>
                  {alarm.supportsArmHome && <span className="badge">Home</span>}
                  {alarm.supportsArmAway && <span className="badge">Away</span>}
                  {alarm.supportsArmNight && <span className="badge">Night</span>}
                  {alarm.supportsArmVacation && <span className="badge">Vacation</span>}
                  {alarm.supportsArmCustomBypass && <span className="badge">Custom</span>}
                  {alarm.supportsTrigger && <span className="badge">Trigger</span>}
                </div>
                <div className={`connection-indicator ${alarm.isConnected ? 'connected' : 'disconnected'}`}>
                  <div className="connection-dot"></div>
                  <span>{alarm.isConnected ? 'Online' : 'Offline'}</span>
                </div>
              </CardFooter>
            </Card>

            {codeDialogOpen && (
              <div className="dialog-overlay" onClick={handleCodeCancel}>
                <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                  <div className="dialog-header">
                    <h2>Enter Security Code</h2>
                  </div>
                  <div className="dialog-body">
                    <input
                      type="password"
                      className="dialog-input"
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
                  </div>
                  <div className="dialog-footer">
                    <button className="dialog-button secondary" onClick={handleCodeCancel}>
                      Cancel
                    </button>
                    <button className="dialog-button primary" onClick={handleCodeSubmit}>
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )
      }}
    </AlarmControlPanel>
  )
}
