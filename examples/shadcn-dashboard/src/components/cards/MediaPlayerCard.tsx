import React from 'react'
import { MediaPlayer } from 'hass-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Slider } from '../ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX 
} from 'lucide-react'

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
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {name}
              <div className={`px-2 py-1 text-xs rounded ${
                isOn ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isOn ? 'Online' : 'Offline'}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Media Info */}
            <div className="mb-4 min-h-[60px]">
              {mediaTitle ? (
                <div>
                  <div className="font-medium truncate">{mediaTitle}</div>
                  {mediaArtist && (
                    <div className="text-sm text-muted-foreground truncate">
                      by {mediaArtist}
                    </div>
                  )}
                  {mediaAlbum && (
                    <div className="text-xs text-muted-foreground truncate">
                      {mediaAlbum}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground">No media playing</div>
              )}
            </div>
            
            {/* Progress Bar */}
            {supportsSeek && mediaDuration && (
              <div className="mb-4">
                <Slider
                  value={[mediaPosition || 0]}
                  max={mediaDuration}
                  step={1}
                  onValueChange={([value]) => seek(value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>
                    {Math.floor((mediaPosition || 0) / 60)}:
                    {String((mediaPosition || 0) % 60).padStart(2, '0')}
                  </span>
                  <span>
                    {Math.floor(mediaDuration / 60)}:
                    {String(mediaDuration % 60).padStart(2, '0')}
                  </span>
                </div>
              </div>
            )}
            
            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {supportsPreviousTrack && (
                <Button variant="outline" size="sm" onClick={previousTrack}>
                  <SkipBack className="h-4 w-4" />
                </Button>
              )}
              
              {supportsPlay && (
                <Button 
                  onClick={play} 
                  disabled={isPlaying}
                  size="sm"
                >
                  <Play className="h-4 w-4" />
                </Button>
              )}
              
              {supportsPause && (
                <Button 
                  onClick={pause} 
                  disabled={!isPlaying}
                  size="sm"
                >
                  <Pause className="h-4 w-4" />
                </Button>
              )}
              
              {supportsStop && (
                <Button variant="outline" size="sm" onClick={stop}>
                  <Square className="h-4 w-4" />
                </Button>
              )}
              
              {supportsNextTrack && (
                <Button variant="outline" size="sm" onClick={nextTrack}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Volume Control */}
            {supportsVolumeSet && (
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  {supportsVolumeMute && (
                    <Button variant="outline" size="sm" onClick={toggleMute}>
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  )}
                  <Slider
                    value={[volumeLevel]}
                    max={1}
                    step={0.01}
                    onValueChange={([value]) => setVolume(value)}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground min-w-[35px]">
                    {Math.round(volumeLevel * 100)}%
                  </span>
                </div>
              </div>
            )}
            
            {/* Source Selection */}
            {supportsSelectSource && sourceList.length > 0 && (
              <Select value={currentSource || ''} onValueChange={selectSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {sourceList.map(source => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>
      )}
    </MediaPlayer>
  )
}