import { Lock } from 'react-homeassistant-headless'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Chip
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import WarningIcon from '@mui/icons-material/Warning'

interface LockCardProps {
  entityId: string
  name: string
}

export const LockCard = ({ entityId, name }: LockCardProps) => {
  return (
    <Lock entityId={entityId}>
      {(lockEntity) => (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            title={
              <Typography variant="h6" component="h2">
                {name}
              </Typography>
            }
            subheader={
              <Chip
                label={
                  lockEntity.isLocked ? 'Locked' : 
                  lockEntity.isUnlocked ? 'Unlocked' : 
                  lockEntity.isLocking ? 'Locking...' : 
                  lockEntity.isUnlocking ? 'Unlocking...' : 
                  lockEntity.isJammed ? 'Jammed!' : 
                  lockEntity.state
                }
                color={
                  lockEntity.isLocked ? 'success' : 
                  lockEntity.isJammed ? 'error' : 
                  'default'
                }
                size="small"
              />
            }
          />
          
          <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Box
              sx={{
                fontSize: '4rem',
                my: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {lockEntity.isJammed ? (
                <WarningIcon sx={{ fontSize: '4rem', color: 'error.main' }} />
              ) : lockEntity.isLocked ? (
                <LockIcon sx={{ fontSize: '4rem', color: 'success.main' }} />
              ) : (
                <LockOpenIcon sx={{ fontSize: '4rem', color: 'text.secondary' }} />
              )}
            </Box>
            
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<LockIcon />}
                onClick={lockEntity.lock}
                disabled={lockEntity.isLocked || lockEntity.isLocking || lockEntity.isJammed}
                fullWidth
              >
                Lock
              </Button>
              <Button
                variant="outlined"
                startIcon={<LockOpenIcon />}
                onClick={lockEntity.unlock}
                disabled={lockEntity.isUnlocked || lockEntity.isUnlocking || lockEntity.isJammed}
                fullWidth
              >
                Unlock
              </Button>
            </Stack>
            
            <Typography variant="body2" color="text.secondary">
              {lockEntity.isJammed ? (
                <Box sx={{ color: 'error.main', fontWeight: 'bold' }}>
                  ⚠️ Lock is jammed!
                </Box>
              ) : (
                `Last changed: ${lockEntity.lastChanged.toLocaleTimeString()}`
              )}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Lock>
  )
}
