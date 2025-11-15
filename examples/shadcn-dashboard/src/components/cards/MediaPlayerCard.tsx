import React from 'react'
import { MediaPlayer } from 'hass-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ConnectionIndicator } from '@/components/ui/connection-indicator'
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

const MediaPlayerCard = ({ entityId, name }: MediaPlayerCardProps) => {
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
        nextTrack,
        previousTrack,
        setVolume,
        toggleMute,
        seek,
        selectSource,
        isConnected
      }) => (
        <Card className="h-full">
          <CardHeader>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription>
                {isPlaying ? 'Playing' : isPaused ? 'Paused' : isOn ? 'Idle' : 'Off'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Media Info */}
            {mediaTitle ? (
              <div>
                <div className="text-lg font-medium text-white truncate">{mediaTitle}</div>
                {mediaArtist && (
                  <div className="text-sm text-slate-400 truncate">
                    {mediaArtist}
                  </div>
                )}
                {mediaAlbum && (
                  <div className="text-xs text-slate-500 truncate">
                    {mediaAlbum}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-slate-400">No media playing</div>
            )}

            {/* Progress Bar */}
            {supportsSeek && mediaDuration && (
              <div className="space-y-1">
                <Slider
                  value={[mediaPosition || 0]}
                  max={mediaDuration}
                  step={1}
                  onValueChange={([value]) => seek(value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
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
            <div className="flex items-center justify-center gap-2">
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
                  variant={isPlaying ? "default" : "outline"}
                >
                  <Play className="h-4 w-4" />
                </Button>
              )}

              {supportsPause && (
                <Button
                  onClick={pause}
                  disabled={!isPlaying}
                  size="sm"
                  variant="outline"
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
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Volume</span>
                  <span className="text-slate-300">{Math.round(volumeLevel * 100)}%</span>
                </div>
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
                </div>
              </div>
            )}

            {/* Source Selection */}
            {supportsSelectSource && sourceList.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Source</label>
                <Select value={currentSource || ''} onValueChange={selectSource}>
                  <SelectTrigger className="bg-slate-800 border-slate-600/50">
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
              </div>
            )}
          </CardContent>

          <CardFooter className="flex-col items-start gap-2">
            <div className="flex flex-wrap gap-1.5">
              {supportsPlay && <Badge>Play</Badge>}
              {supportsPause && <Badge>Pause</Badge>}
              {supportsStop && <Badge>Stop</Badge>}
              {supportsVolumeSet && <Badge>Volume</Badge>}
              {supportsSelectSource && <Badge>Source</Badge>}
            </div>
            <ConnectionIndicator isConnected={isConnected} className="pt-2" />
          </CardFooter>
        </Card>
      )}
    </MediaPlayer>
  )
}

export default MediaPlayerCard
