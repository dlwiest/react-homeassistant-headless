import React from 'react'
import { MediaPlayer } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Stack,
  Chip
} from '@mui/material'

interface MediaPlayerCardProps {
  entityId: string
  name: string
}

const MediaPlayerCard = ({ entityId, name }: MediaPlayerCardProps) => {
  return (
    <MediaPlayer entityId={entityId}>
      {(player) => {
        const getStateText = () => {
          if (player.isPlaying) return 'Playing'
          if (player.isPaused) return 'Paused'
          if (player.isOn) return 'On'
          return 'Off'
        }

        const formatTime = (seconds: number) => {
          const mins = Math.floor(seconds / 60)
          const secs = seconds % 60
          return `${mins}:${String(secs).padStart(2, '0')}`
        }

        return (
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title={
                <Typography variant="h6" component="h2">
                  {name}
                </Typography>
              }
              subheader={getStateText()}
            />

            <CardContent sx={{ flexGrow: 1 }}>
              <Stack spacing={3}>
                <Box sx={{ minHeight: 60 }}>
                  {player.mediaTitle ? (
                    <>
                      <Typography variant="h6" noWrap>
                        {player.mediaTitle}
                      </Typography>
                      {player.mediaArtist && (
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {player.mediaArtist}
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No media
                    </Typography>
                  )}
                </Box>

                {player.supportsSeek && player.mediaDuration && (
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(player.mediaPosition || 0)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(player.mediaDuration)}
                      </Typography>
                    </Box>
                    <Slider
                      value={player.mediaPosition || 0}
                      max={player.mediaDuration}
                      onChange={(_, value) => player.seek(value as number)}
                      size="small"
                    />
                  </Box>
                )}

                <Stack direction="row" spacing={1} justifyContent="center">
                  {player.supportsPreviousTrack && (
                    <Button onClick={player.previousTrack} size="medium" sx={{ minWidth: 48, fontSize: '1.25rem' }}>
                      ⏮
                    </Button>
                  )}

                  {player.supportsPlay && (
                    <Button
                      onClick={player.play}
                      disabled={player.isPlaying}
                      variant={player.isPlaying ? 'contained' : 'outlined'}
                      size="medium"
                      sx={{ minWidth: 48, fontSize: '1.25rem' }}
                    >
                      ▶
                    </Button>
                  )}

                  {player.supportsPause && (
                    <Button
                      onClick={player.pause}
                      disabled={!player.isPlaying}
                      variant={player.isPaused ? 'contained' : 'outlined'}
                      size="medium"
                      sx={{ minWidth: 48, fontSize: '1.25rem' }}
                    >
                      ⏸
                    </Button>
                  )}

                  {player.supportsStop && (
                    <Button onClick={player.stop} size="medium" sx={{ minWidth: 48, fontSize: '1.25rem' }}>
                      ⏹
                    </Button>
                  )}

                  {player.supportsNextTrack && (
                    <Button onClick={player.nextTrack} size="medium" sx={{ minWidth: 48, fontSize: '1.25rem' }}>
                      ⏭
                    </Button>
                  )}
                </Stack>

                {player.supportsVolumeSet && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Volume: {Math.round(player.volumeLevel * 100)}%
                    </Typography>
                    <Slider
                      value={player.volumeLevel}
                      max={1}
                      step={0.01}
                      onChange={(_, value) => player.setVolume(value as number)}
                      size="small"
                    />
                  </Box>
                )}

                {player.supportsSelectSource && player.sourceList.length > 0 && (
                  <FormControl fullWidth size="small">
                    <InputLabel>Source</InputLabel>
                    <Select
                      value={player.currentSource || ''}
                      label="Source"
                      onChange={(e) => player.selectSource(e.target.value)}
                    >
                      {player.sourceList.map(source => (
                        <MenuItem key={source} value={source}>
                          {source}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Stack>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {player.supportsPlay && <Chip label="Play" size="small" />}
                {player.supportsVolumeSet && <Chip label="Volume" size="small" />}
                {player.supportsSelectSource && <Chip label="Source" size="small" />}
              </Stack>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: player.isConnected ? 'success.main' : 'error.main'
                  }}
                />
                <Typography variant="caption">
                  {player.isConnected ? 'Online' : 'Offline'}
                </Typography>
              </Box>
            </CardActions>
          </Card>
        )
      }}
    </MediaPlayer>
  )
}

export default MediaPlayerCard
