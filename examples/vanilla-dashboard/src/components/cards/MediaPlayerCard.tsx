import React from 'react'
import { MediaPlayer } from 'hass-react'
import { Card } from '../layout/Card'

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
          <div className="card-header">
            <h3 className="card-title">
              {name}
              <span className={`status ${isOn ? 'online' : 'offline'}`}>
                {isOn ? 'Online' : 'Offline'}
              </span>
            </h3>
          </div>
          
          <div className="card-content">
            {/* Media Info */}
            <div className="media-info">
              {mediaTitle ? (
                <div>
                  <div className="media-title">{mediaTitle}</div>
                  {mediaArtist && (
                    <div className="media-artist">by {mediaArtist}</div>
                  )}
                  {mediaAlbum && (
                    <div className="media-album">{mediaAlbum}</div>
                  )}
                </div>
              ) : (
                <div className="no-media">No media playing</div>
              )}
            </div>
            
            {/* Progress Bar */}
            {supportsSeek && mediaDuration && (
              <div className="progress-container">
                <input
                  type="range"
                  min="0"
                  max={mediaDuration}
                  value={mediaPosition || 0}
                  onChange={(e) => seek(parseInt(e.target.value))}
                  className="progress-slider"
                />
                <div className="progress-time">
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
            <div className="playback-controls">
              {supportsPreviousTrack && (
                <button onClick={previousTrack} className="control-btn secondary">
                  ⏮
                </button>
              )}
              
              {supportsPlay && (
                <button 
                  onClick={play} 
                  disabled={isPlaying}
                  className="control-btn primary"
                >
                  ▶
                </button>
              )}
              
              {supportsPause && (
                <button 
                  onClick={pause} 
                  disabled={!isPlaying}
                  className="control-btn primary"
                >
                  ⏸
                </button>
              )}
              
              {supportsStop && (
                <button onClick={stop} className="control-btn secondary">
                  ⏹
                </button>
              )}
              
              {supportsNextTrack && (
                <button onClick={nextTrack} className="control-btn secondary">
                  ⏭
                </button>
              )}
            </div>
            
            {/* Volume Control */}
            {supportsVolumeSet && (
              <div className="volume-control">
                <div className="volume-row">
                  {supportsVolumeMute && (
                    <button onClick={toggleMute} className="volume-btn">
                      {isMuted ? '🔇' : '🔊'}
                    </button>
                  )}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volumeLevel}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="volume-slider"
                  />
                  <span className="volume-percent">
                    {Math.round(volumeLevel * 100)}%
                  </span>
                </div>
              </div>
            )}
            
            {/* Source Selection */}
            {supportsSelectSource && sourceList.length > 0 && (
              <div className="source-control">
                <label htmlFor={`source-${entityId}`}>Source:</label>
                <select
                  id={`source-${entityId}`}
                  value={currentSource || ''}
                  onChange={(e) => selectSource(e.target.value)}
                  className="source-select"
                >
                  {sourceList.map(source => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </Card>
      )}
    </MediaPlayer>
  )
}