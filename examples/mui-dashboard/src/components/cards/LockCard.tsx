import { Lock } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
  Alert
} from '@mui/material'
import { LockOutlined, LockOpenOutlined, QuestionMark } from '@mui/icons-material'

interface LockCardProps {
  entityId: string
  name: string
}

export const LockCard = ({ entityId, name }: LockCardProps) => {
  return (
    <Lock entityId={entityId}>
      {(lock) => (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            avatar={
              lock.isLocked ? (
                <LockOutlined sx={{ color: 'error.main', fontSize: 32 }} />
              ) : lock.isUnlocked ? (
                <LockOpenOutlined sx={{ color: 'success.main', fontSize: 32 }} />
              ) : (
                <QuestionMark sx={{ color: 'warning.main', fontSize: 32 }} />
              )
            }
            title={
              <Typography variant="h6" component="h2">
                {name}
              </Typography>
            }
            subheader={
              <Chip 
                label={lock.isLocked ? '🔒 LOCKED' : lock.isUnlocked ? '🔓 UNLOCKED' : '❓ UNKNOWN'}
                color={lock.isLocked ? 'error' : lock.isUnlocked ? 'success' : 'warning'}
                size="small"
                variant="outlined"
              />
            }
          />
          
          <CardContent sx={{ flexGrow: 1 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  onClick={lock.lock}
                  disabled={lock.isLocked}
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<LockOutlined />}
                  sx={{ flex: 1, minWidth: 'fit-content' }}
                >
                  Lock
                </Button>
                <Button
                  onClick={() => lock.unlock()}
                  disabled={lock.isUnlocked}
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<LockOpenOutlined />}
                  sx={{ flex: 1, minWidth: 'fit-content' }}
                >
                  Unlock
                </Button>
                {lock.supportsOpen && (
                  <Button
                    onClick={() => lock.open()}
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ flex: 1, minWidth: 'fit-content' }}
                  >
                    🚪 Open
                  </Button>
                )}
              </Box>
              
              {lock.changedBy && (
                <Alert severity="info" sx={{ py: 0 }}>
                  <Typography variant="body2">
                    Changed by: <strong>{lock.changedBy}</strong>
                  </Typography>
                </Alert>
              )}
            </Stack>
          </CardContent>

          <CardActions sx={{ p: 2, pt: 0, flexDirection: 'column', alignItems: 'stretch' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              <Chip 
                label={lock.supportsOpen ? 'Lock, Unlock, Open' : 'Lock, Unlock'} 
                size="small" 
                variant="outlined"
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Last updated: {lock.lastUpdated.toLocaleTimeString()}
            </Typography>
          </CardActions>
        </Card>
      )}
    </Lock>
  )
}