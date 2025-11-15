import React from 'react'
import { Lock } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
  Chip,
  Box
} from '@mui/material'

interface LockCardProps {
  entityId: string
  name: string
}

const LockCard = ({ entityId, name }: LockCardProps) => {
  return (
    <Lock entityId={entityId}>
      {(lock) => (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            title={
              <Typography variant="h6" component="h2">
                {name}
              </Typography>
            }
            subheader={lock.isLocked ? 'Locked' : lock.isUnlocked ? 'Unlocked' : 'Unknown'}
          />

          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              variant="h3"
              component="div"
              sx={{
                fontWeight: 700,
                color: lock.isLocked ? 'success.main' : 'error.main',
                mb: 2
              }}
            >
              {lock.isLocked ? 'Locked' : lock.isUnlocked ? 'Unlocked' : 'Unknown'}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Button
                variant={lock.isLocked ? 'contained' : 'outlined'}
                onClick={lock.lock}
                disabled={lock.isLocked}
                fullWidth
              >
                Lock
              </Button>
              <Button
                variant={lock.isUnlocked ? 'contained' : 'outlined'}
                onClick={() => lock.unlock()}
                disabled={lock.isUnlocked}
                fullWidth
              >
                Unlock
              </Button>
              {lock.supportsOpen && (
                <Button
                  variant="outlined"
                  onClick={() => lock.open()}
                  fullWidth
                >
                  Open
                </Button>
              )}
            </Stack>

            {lock.changedBy && (
              <Typography variant="body2" color="text.secondary">
                Changed by: {lock.changedBy}
              </Typography>
            )}
          </CardContent>

          <CardActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              <Chip label="Lock" size="small" />
              <Chip label="Unlock" size="small" />
              {lock.supportsOpen && <Chip label="Open" size="small" />}
            </Stack>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: lock.isConnected ? 'success.main' : 'error.main'
                }}
              />
              <Typography variant="caption">
                {lock.isConnected ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </CardActions>
        </Card>
      )}
    </Lock>
  )
}

export default LockCard
