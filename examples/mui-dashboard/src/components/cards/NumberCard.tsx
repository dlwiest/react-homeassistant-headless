import React from 'react'
import { Number } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Box,
  Slider,
  IconButton,
  Chip
} from '@mui/material'
import { Add, Remove } from '@mui/icons-material'

interface NumberCardProps {
  entityId: string
  name: string
}

export const NumberCard = ({ entityId, name }: NumberCardProps) => {
  return (
    <Number entityId={entityId}>
      {(numberEntity) => (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            title={
              <Typography variant="h6" component="h2">
                {name}
              </Typography>
            }
            subheader={numberEntity.deviceClass || 'Number'}
          />

          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              variant="h3"
              component="div"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: 'text.primary'
              }}
            >
              {numberEntity.value}{numberEntity.unit ? ` ${numberEntity.unit}` : ''}
            </Typography>

            <Box sx={{ px: 1, mb: 2 }}>
              <Slider
                value={numberEntity.value}
                min={numberEntity.min}
                max={numberEntity.max}
                step={numberEntity.step}
                onChange={(_, value) => numberEntity.setValue(value as number)}
                valueLabelDisplay="auto"
                marks={[
                  { value: numberEntity.min, label: String(numberEntity.min) },
                  { value: numberEntity.max, label: String(numberEntity.max) }
                ]}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <IconButton
                onClick={numberEntity.decrement}
                disabled={numberEntity.value <= numberEntity.min}
                color="primary"
                size="large"
              >
                <Remove />
              </IconButton>
              <IconButton
                onClick={numberEntity.increment}
                disabled={numberEntity.value >= numberEntity.max}
                color="primary"
                size="large"
              >
                <Add />
              </IconButton>
            </Box>
          </CardContent>

          <CardActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={`Range: ${numberEntity.min}-${numberEntity.max}`}
              size="small"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: numberEntity.isConnected ? 'success.main' : 'error.main'
                }}
              />
              <Typography variant="caption">
                {numberEntity.isConnected ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </CardActions>
        </Card>
      )}
    </Number>
  )
}
