import React, { useState } from 'react'
import { AlarmControlPanel } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
  Chip,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'

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

  const handleConfirmCode = async () => {
    if (pendingAction) {
      await pendingAction()
      setCodeDialogOpen(false)
      setCode('')
      setPendingAction(null)
    }
  }

  const handleCancelCode = () => {
    setCodeDialogOpen(false)
    setCode('')
    setPendingAction(null)
  }

  const getStateColor = (alarm: any) => {
    if (alarm.isDisarmed) return 'success.main'
    if (alarm.isTriggered) return 'error.main'
    if (alarm.isPending || alarm.isArming || alarm.isDisarming) return 'warning.main'
    return 'primary.main'
  }

  const getStateText = (alarm: any) => {
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

  return (
    <AlarmControlPanel entityId={entityId}>
      {(alarm) => (
        <>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title={
                <Typography variant="h6" component="h2">
                  {name}
                </Typography>
              }
            />

            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h3"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: getStateColor(alarm),
                  mb: 3
                }}
              >
                {getStateText(alarm)}
              </Typography>

              {alarm.changedBy && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Changed by: {alarm.changedBy}
                </Typography>
              )}

              <Stack spacing={2}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant={alarm.isDisarmed ? 'contained' : 'outlined'}
                    onClick={() => handleActionWithCode(alarm.disarm)}
                    disabled={alarm.isDisarmed}
                    fullWidth
                    color="success"
                  >
                    Disarm
                  </Button>
                  {alarm.supportsTrigger && (
                    <Button
                      variant="outlined"
                      onClick={() => alarm.trigger()}
                      fullWidth
                      color="error"
                    >
                      Trigger
                    </Button>
                  )}
                </Stack>

                <Stack direction="row" spacing={1}>
                  {alarm.supportsArmHome && (
                    <Button
                      variant={alarm.isArmedHome ? 'contained' : 'outlined'}
                      onClick={() => handleActionWithCode(alarm.armHome)}
                      disabled={alarm.isArmedHome}
                      fullWidth
                    >
                      Home
                    </Button>
                  )}
                  {alarm.supportsArmAway && (
                    <Button
                      variant={alarm.isArmedAway ? 'contained' : 'outlined'}
                      onClick={() => handleActionWithCode(alarm.armAway)}
                      disabled={alarm.isArmedAway}
                      fullWidth
                    >
                      Away
                    </Button>
                  )}
                </Stack>

                <Stack direction="row" spacing={1}>
                  {alarm.supportsArmNight && (
                    <Button
                      variant={alarm.isArmedNight ? 'contained' : 'outlined'}
                      onClick={() => handleActionWithCode(alarm.armNight)}
                      disabled={alarm.isArmedNight}
                      fullWidth
                    >
                      Night
                    </Button>
                  )}
                  {alarm.supportsArmVacation && (
                    <Button
                      variant={alarm.isArmedVacation ? 'contained' : 'outlined'}
                      onClick={() => handleActionWithCode(alarm.armVacation)}
                      disabled={alarm.isArmedVacation}
                      fullWidth
                    >
                      Vacation
                    </Button>
                  )}
                </Stack>

                {alarm.supportsArmCustomBypass && (
                  <Button
                    variant={alarm.isArmedCustomBypass ? 'contained' : 'outlined'}
                    onClick={() => handleActionWithCode(alarm.armCustomBypass)}
                    disabled={alarm.isArmedCustomBypass}
                    fullWidth
                  >
                    Custom Bypass
                  </Button>
                )}
              </Stack>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                <Chip label="Disarm" size="small" />
                {alarm.supportsArmHome && <Chip label="Home" size="small" />}
                {alarm.supportsArmAway && <Chip label="Away" size="small" />}
                {alarm.supportsArmNight && <Chip label="Night" size="small" />}
                {alarm.supportsArmVacation && <Chip label="Vacation" size="small" />}
                {alarm.supportsArmCustomBypass && <Chip label="Custom" size="small" />}
                {alarm.supportsTrigger && <Chip label="Trigger" size="small" />}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: alarm.isConnected ? 'success.main' : 'error.main'
                  }}
                />
                <Typography variant="caption">
                  {alarm.isConnected ? 'Online' : 'Offline'}
                </Typography>
              </Box>
            </CardActions>
          </Card>

          <Dialog open={codeDialogOpen} onClose={handleCancelCode}>
            <DialogTitle>Enter Code</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Security Code"
                type="password"
                fullWidth
                variant="outlined"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleConfirmCode()
                  }
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelCode}>Cancel</Button>
              <Button onClick={handleConfirmCode} variant="contained">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </AlarmControlPanel>
  )
}
