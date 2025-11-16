import React from 'react'
import { MediaPlayer } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface MediaPlayerCardProps {
  entityId: string
  name: string
}

export const MediaPlayerCard = ({ entityId, name }: MediaPlayerCardProps) => {
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
          <Card>
            <CardHeader
              title={name}
              subtitle={getStateText()}
            />

            <CardContent>
              <div className="media-info">
                {player.mediaTitle ? (
                  <>
                    <div className="media-title">{player.mediaTitle}</div>
                    {player.mediaArtist && (
                      <div className="media-artist">{player.mediaArtist}</div>
                    )}
                  </>
                ) : (
                  <div className="media-no-content">No media</div>
                )}
              </div>

              {player.supportsSeek && player.mediaDuration && (
                <div className="control-group">
                  <div className="media-progress">
                    <span className="media-time">{formatTime(player.mediaPosition || 0)}</span>
                    <span className="media-time">{formatTime(player.mediaDuration)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={player.mediaDuration}
                    value={player.mediaPosition || 0}
                    onChange={(e) => player.seek(parseInt(e.target.value))}
                    className="slider"
                  />
                </div>
              )}

              <div className="media-controls">
                {player.supportsPreviousTrack && (
                  <button onClick={player.previousTrack} className="media-button">
                    ⏮
                  </button>
                )}

                {player.supportsPlay && (
                  <button
                    onClick={player.play}
                    disabled={player.isPlaying}
                    className={`media-button ${player.isPlaying ? 'active' : 'inactive'}`}
                  >
                    ▶
                  </button>
                )}

                {player.supportsPause && (
                  <button
                    onClick={player.pause}
                    disabled={!player.isPlaying}
                    className={`media-button ${player.isPaused ? 'active' : 'inactive'}`}
                  >
                    ⏸
                  </button>
                )}

                {player.supportsStop && (
                  <button onClick={player.stop} className="media-button inactive">
                    ⏹
                  </button>
                )}

                {player.supportsNextTrack && (
                  <button onClick={player.nextTrack} className="media-button">
                    ⏭
                  </button>
                )}
              </div>

              {player.supportsVolumeSet && (
                <div className="control-group">
                  <div className="control-header">
                    <span className="control-label">Volume</span>
                    <span className="control-value">{Math.round(player.volumeLevel * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={player.volumeLevel}
                    onChange={(e) => player.setVolume(parseFloat(e.target.value))}
                    className="slider"
                  />
                </div>
              )}

              {player.supportsSelectSource && player.sourceList.length > 0 && (
                <div className="control-group">
                  <label className="control-label">Source</label>
                  <select
                    value={player.currentSource || ''}
                    onChange={(e) => player.selectSource(e.target.value)}
                    className="select-input"
                  >
                    {player.sourceList.map(source => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </CardContent>

            <CardFooter>
              <div className="badge-container">
                {player.supportsPlay && <span className="badge">Play</span>}
                {player.supportsVolumeSet && <span className="badge">Volume</span>}
                {player.supportsSelectSource && <span className="badge">Source</span>}
              </div>
              <div className={`connection-indicator ${player.isConnected ? 'connected' : 'disconnected'}`}>
                <div className="connection-dot"></div>
                <span>{player.isConnected ? 'Online' : 'Offline'}</span>
              </div>
            </CardFooter>
          </Card>
        )
      }}
    </MediaPlayer>
  )
}

