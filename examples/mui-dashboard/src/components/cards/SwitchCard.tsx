import React from 'react'
import { Switch as HomeAssistantSwitch } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Switch,
  Box
} from '@mui/material'

interface SwitchCardProps {
  entityId: string
  name: string
  icon?: string
}

export const SwitchCard = ({ entityId, name, icon = '🔌' }: SwitchCardProps) => {
  return (
    <HomeAssistantSwitch entityId={entityId}>
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
                color="primary"
              />
            }
          />
          
          <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Box
              sx={{
                fontSize: '4rem',
                opacity: switchEntity.isOn ? 1 : 0.3,
                transition: 'opacity 0.3s ease',
                my: 2
              }}
            >
              {icon}
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              Last changed: {switchEntity.lastChanged.toLocaleTimeString()}
            </Typography>
          </CardContent>
        </Card>
      )}
    </HomeAssistantSwitch>
  )
}