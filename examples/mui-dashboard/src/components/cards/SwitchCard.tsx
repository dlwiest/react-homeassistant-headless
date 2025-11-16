import React from 'react'
import { Switch as SwitchEntity } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Switch,
  Box
} from '@mui/material'

interface SwitchCardProps {
  entityId: string
  name: string
}

export const SwitchCard = ({ entityId, name }: SwitchCardProps) => {
  return (
    <SwitchEntity entityId={entityId}>
      {(switchEntity) => (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            title={
              <Typography variant="h6" component="h2">
                {name}
              </Typography>
            }
            subheader={switchEntity.isOn ? 'On' : 'Off'}
            action={
              <Switch
                checked={switchEntity.isOn}
                onChange={switchEntity.toggle}
              />
            }
          />

          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Last changed: {switchEntity.lastChanged.toLocaleTimeString()}
            </Typography>
          </CardContent>

          <CardActions sx={{ p: 2, pt: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: switchEntity.isConnected ? 'success.main' : 'error.main'
                }}
              />
              <Typography variant="caption">
                {switchEntity.isConnected ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </CardActions>
        </Card>
      )}
    </SwitchEntity>
  )
}

