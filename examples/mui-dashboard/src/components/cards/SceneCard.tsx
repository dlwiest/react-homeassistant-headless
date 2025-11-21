import React, { useState } from 'react'
import { Scene } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box
} from '@mui/material'

interface SceneCardProps {
  entityId: string
  name: string
}

export const SceneCard = ({ entityId, name }: SceneCardProps) => {
  const [transition, setTransition] = useState(0)

  return (
    <Scene entityId={entityId}>
      {(scene) => (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            title={
              <Typography variant="h6" component="h2">
                {name}
              </Typography>
            }
            subheader={scene.attributes.friendly_name || 'Scene'}
          />

          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Last changed: {scene.lastChanged.toLocaleTimeString()}
            </Typography>

            <TextField
              label="Transition (seconds)"
              type="number"
              size="small"
              fullWidth
              value={transition}
              onChange={(e) => setTransition(parseInt(e.target.value) || 0)}
              inputProps={{
                min: 0,
                max: 60
              }}
              sx={{
                mb: 2,
                '& input[type=number]': {
                  MozAppearance: 'textfield'
                },
                '& input[type=number]::-webkit-outer-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0
                },
                '& input[type=number]::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0
                }
              }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={() => scene.activate(transition > 0 ? transition : undefined)}
              disabled={!scene.isConnected}
            >
              Activate Scene
            </Button>
          </CardContent>

          <CardActions sx={{ p: 2, pt: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: scene.isConnected ? 'success.main' : 'error.main'
                }}
              />
              <Typography variant="caption">
                {scene.isConnected ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </CardActions>
        </Card>
      )}
    </Scene>
  )
}
