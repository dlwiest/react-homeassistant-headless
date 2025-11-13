import React from 'react'
import { MediaPlayer } from 'hass-react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Slider,
  Box,
  IconButton,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material'
import {
  PlayArrow,
  Pause,
  Stop,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  VolumeOff,
  VolumeMute
} from '@mui/icons-material'

interface MediaPlayerCardProps {
  entityId: string
  name: string
}

export function MediaPlayerCard({ entityId, name }: MediaPlayerCardProps) {
  return (
    <MediaPlayer entityId={entityId}>
      {({
        isPlaying,
        isPaused,
        isOn,
        volumeLevel,
        isMuted,
        mediaTitle,
        mediaArtist,
        mediaAlbum,
        mediaDuration,
        mediaPosition,
        currentSource,
        sourceList,
        supportsPlay,
        supportsPause,
        supportsStop,
        supportsNextTrack,
        supportsPreviousTrack,
        supportsVolumeSet,
        supportsVolumeMute,
        supportsSeek,
        supportsSelectSource,
        play,
        pause,
        stop,
        toggle,
        nextTrack,
        previousTrack,
        setVolume,
        toggleMute,
        seek,
        selectSource
      }) => (
        <Card>
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              {name}
            </Typography>
            
            {isOn ? (
              <Chip 
                label="Online" 
                color="success" 
                size="small" 
                sx={{ mb: 2 }}
              />
            ) : (
              <Chip 
                label="Offline" 
                color="error" 
                size="small" 
                sx={{ mb: 2 }}
              />
            )}
            
            {/* Media Info */}
            <Box sx={{ mb: 2, minHeight: 60 }}>
              {mediaTitle ? (
                <>
                  <Typography variant="subtitle1" noWrap>
                    {mediaTitle}
                  </Typography>
                  {mediaArtist && (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      by {mediaArtist}
                    </Typography>
                  )}
                  {mediaAlbum && (
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {mediaAlbum}
                    </Typography>
                  )}
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No media playing
                </Typography>
              )}
            </Box>
            
            {/* Progress Bar */}
            {supportsSeek && mediaDuration && (
              <Box sx={{ mb: 2 }}>
                <Slider
                  value={mediaPosition || 0}
                  max={mediaDuration}
                  onChange={(_, value) => seek(value as number)}
                  size="small"
                />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption">
                    {Math.floor((mediaPosition || 0) / 60)}:
                    {String((mediaPosition || 0) % 60).padStart(2, '0')}
                  </Typography>
                  <Typography variant="caption">
                    {Math.floor(mediaDuration / 60)}:
                    {String(mediaDuration % 60).padStart(2, '0')}
                  </Typography>
                </Box>
              </Box>
            )}
            
            {/* Playback Controls */}
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
              {supportsPreviousTrack && (
                <IconButton onClick={previousTrack} size="small">
                  <SkipPrevious />
                </IconButton>
              )}
              
              {supportsPlay && (
                <IconButton 
                  onClick={play} 
                  disabled={isPlaying}
                  size="large"
                  color="primary"
                >
                  <PlayArrow />
                </IconButton>
              )}
              
              {supportsPause && (
                <IconButton 
                  onClick={pause} 
                  disabled={!isPlaying}
                  size="large"
                  color="primary"
                >
                  <Pause />
                </IconButton>
              )}
              
              {supportsStop && (
                <IconButton onClick={stop} size="small">
                  <Stop />
                </IconButton>
              )}
              
              {supportsNextTrack && (
                <IconButton onClick={nextTrack} size="small">
                  <SkipNext />
                </IconButton>
              )}
            </Box>
            
            {/* Volume Control */}
            {supportsVolumeSet && (
              <Box sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  {supportsVolumeMute && (
                    <IconButton onClick={toggleMute} size="small">
                      {isMuted ? <VolumeOff /> : <VolumeUp />}
                    </IconButton>
                  )}
                  <Slider
                    value={volumeLevel}
                    max={1}
                    step={0.01}
                    onChange={(_, value) => setVolume(value as number)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <Typography variant="caption" sx={{ minWidth: 35 }}>
                    {Math.round(volumeLevel * 100)}%
                  </Typography>
                </Box>
              </Box>
            )}
            
            {/* Source Selection */}
            {supportsSelectSource && sourceList.length > 0 && (
              <FormControl fullWidth size="small">
                <InputLabel>Source</InputLabel>
                <Select
                  value={currentSource || ''}
                  label="Source"
                  onChange={(e) => selectSource(e.target.value)}
                >
                  {sourceList.map(source => (
                    <MenuItem key={source} value={source}>
                      {source}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </CardContent>
        </Card>
      )}
    </MediaPlayer>
  )
}