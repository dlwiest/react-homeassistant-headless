import React from 'react'
import { render } from '@testing-library/react'
import { vi, beforeEach, describe, it, expect } from 'vitest'

// Mock the hook before importing the component
vi.mock('../../hooks/useMediaPlayer')

import { MediaPlayer } from '../MediaPlayer'
import { useMediaPlayer } from '../../hooks/useMediaPlayer'
import type { MediaPlayerState } from '../../types'
import { createMockEntityFactory } from '../../test/utils/mockHelpers'

const createMockMediaPlayerEntity = createMockEntityFactory('media_player')
const mockUseMediaPlayer = useMediaPlayer as any

// Create a comprehensive mock MediaPlayer state
const createMockMediaPlayerState = (overrides: Partial<MediaPlayerState> = {}): MediaPlayerState => {
  const baseState = createMockMediaPlayerEntity('test_speaker', 'playing', {
    media_title: 'Test Song',
    media_artist: 'Test Artist',
    volume_level: 0.5,
    source_list: ['Spotify', 'Bluetooth'],
    supported_features: 16384 | 1 | 4 | 8 // SUPPORT_PLAY | SUPPORT_PAUSE | SUPPORT_VOLUME_SET | SUPPORT_VOLUME_MUTE
  })

  return {
    ...baseState,
    
    // State properties
    isPlaying: overrides.state === 'playing' || (overrides.isPlaying ?? true),
    isPaused: overrides.state === 'paused' || (overrides.isPaused ?? false),
    isIdle: overrides.state === 'idle' || (overrides.isIdle ?? false),
    isOff: overrides.state === 'off' || (overrides.isOff ?? false),
    isOn: overrides.isOn ?? true,

    // Media information
    mediaTitle: overrides.mediaTitle ?? 'Test Song',
    mediaArtist: overrides.mediaArtist ?? 'Test Artist',
    mediaAlbum: overrides.mediaAlbum ?? null,
    mediaContentType: overrides.mediaContentType ?? 'music',
    mediaDuration: overrides.mediaDuration ?? null,
    mediaPosition: overrides.mediaPosition ?? null,

    // Volume
    volumeLevel: overrides.volumeLevel ?? 0.5,
    isMuted: overrides.isMuted ?? false,

    // Source and app
    currentSource: overrides.currentSource ?? 'Spotify',
    sourceList: overrides.sourceList ?? ['Spotify', 'Bluetooth'],
    appName: overrides.appName ?? null,

    // Sound mode
    currentSoundMode: overrides.currentSoundMode ?? null,
    soundModeList: overrides.soundModeList ?? [],

    // Playback options
    shuffle: overrides.shuffle ?? false,
    repeat: overrides.repeat ?? 'off',

    // Feature support
    supportsPlay: overrides.supportsPlay ?? true,
    supportsPause: overrides.supportsPause ?? true,
    supportsStop: overrides.supportsStop ?? false,
    supportsNextTrack: overrides.supportsNextTrack ?? false,
    supportsPreviousTrack: overrides.supportsPreviousTrack ?? false,
    supportsVolumeSet: overrides.supportsVolumeSet ?? true,
    supportsVolumeMute: overrides.supportsVolumeMute ?? true,
    supportsSeek: overrides.supportsSeek ?? false,
    supportsTurnOn: overrides.supportsTurnOn ?? false,
    supportsTurnOff: overrides.supportsTurnOff ?? false,
    supportsSelectSource: overrides.supportsSelectSource ?? false,
    supportsSelectSoundMode: overrides.supportsSelectSoundMode ?? false,
    supportsShuffle: overrides.supportsShuffle ?? false,
    supportsRepeat: overrides.supportsRepeat ?? false,

    // Actions (mock functions)
    play: overrides.play ?? vi.fn(),
    pause: overrides.pause ?? vi.fn(),
    stop: overrides.stop ?? vi.fn(),
    toggle: overrides.toggle ?? vi.fn(),
    nextTrack: overrides.nextTrack ?? vi.fn(),
    previousTrack: overrides.previousTrack ?? vi.fn(),
    turnOn: overrides.turnOn ?? vi.fn(),
    turnOff: overrides.turnOff ?? vi.fn(),
    setVolume: overrides.setVolume ?? vi.fn(),
    toggleMute: overrides.toggleMute ?? vi.fn(),
    mute: overrides.mute ?? vi.fn(),
    unmute: overrides.unmute ?? vi.fn(),
    selectSource: overrides.selectSource ?? vi.fn(),
    selectSoundMode: overrides.selectSoundMode ?? vi.fn(),
    setShuffle: overrides.setShuffle ?? vi.fn(),
    setRepeat: overrides.setRepeat ?? vi.fn(),
    seek: overrides.seek ?? vi.fn(),
    playMedia: overrides.playMedia ?? vi.fn(),

    ...overrides
  }
}

describe('MediaPlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('should render children with media player state', () => {
      const mockMediaPlayerState = createMockMediaPlayerState()
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      const mockChildren = vi.fn().mockReturnValue(<div>Media Player Content</div>)

      render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockMediaPlayerState)
      expect(mockChildren).toHaveBeenCalledTimes(1)
    })

    it('should pass correct entityId to hook', () => {
      const mockMediaPlayerState = createMockMediaPlayerState()
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      render(
        <MediaPlayer entityId="media_player.living_room_speaker">
          {() => <div>Content</div>}
        </MediaPlayer>
      )

      expect(mockUseMediaPlayer).toHaveBeenCalledWith('media_player.living_room_speaker')
    })

    it('should handle different entity IDs', () => {
      const testEntityIds = [
        'media_player.bedroom_speaker',
        'media_player.kitchen_display',
        'media_player.office_stereo'
      ]

      testEntityIds.forEach(entityId => {
        const mockMediaPlayerState = createMockMediaPlayerState({ entityId })
        mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

        render(
          <MediaPlayer entityId={entityId}>
            {() => <div>Content</div>}
          </MediaPlayer>
        )

        expect(mockUseMediaPlayer).toHaveBeenCalledWith(entityId)
      })
    })
  })

  describe('state handling', () => {
    it('should handle playing state', () => {
      const mockMediaPlayerState = createMockMediaPlayerState({
        state: 'playing',
        isPlaying: true,
        isPaused: false,
        isOff: false
      })
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      const mockChildren = vi.fn().mockReturnValue(<div>Playing</div>)

      render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          state: 'playing',
          isPlaying: true,
          isPaused: false,
          isOff: false,
          isOn: true
        })
      )
    })

    it('should handle paused state', () => {
      const mockMediaPlayerState = createMockMediaPlayerState({
        state: 'paused',
        isPlaying: false,
        isPaused: true,
        isOff: false
      })
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      const mockChildren = vi.fn().mockReturnValue(<div>Paused</div>)

      render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          state: 'paused',
          isPlaying: false,
          isPaused: true,
          isOff: false
        })
      )
    })

    it('should handle off state', () => {
      const mockMediaPlayerState = createMockMediaPlayerState({
        state: 'off',
        isPlaying: false,
        isPaused: false,
        isOff: true,
        isOn: false
      })
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      const mockChildren = vi.fn().mockReturnValue(<div>Off</div>)

      render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          state: 'off',
          isPlaying: false,
          isPaused: false,
          isOff: true,
          isOn: false
        })
      )
    })

    it('should handle unavailable state', () => {
      const mockMediaPlayerState = createMockMediaPlayerState({
        state: 'unavailable',
        isUnavailable: true
      })
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      const mockChildren = vi.fn().mockReturnValue(<div>Unavailable</div>)

      render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          state: 'unavailable',
          isUnavailable: true
        })
      )
    })
  })

  describe('media information', () => {
    it('should pass media information correctly', () => {
      const mockMediaPlayerState = createMockMediaPlayerState({
        mediaTitle: 'Bohemian Rhapsody',
        mediaArtist: 'Queen',
        mediaAlbum: 'A Night at the Opera',
        mediaContentType: 'music',
        mediaDuration: 354,
        mediaPosition: 120,
        appName: 'Spotify'
      })
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      const mockChildren = vi.fn().mockReturnValue(<div>Media Info</div>)

      render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          mediaTitle: 'Bohemian Rhapsody',
          mediaArtist: 'Queen',
          mediaAlbum: 'A Night at the Opera',
          mediaContentType: 'music',
          mediaDuration: 354,
          mediaPosition: 120,
          appName: 'Spotify'
        })
      )
    })

    it('should handle missing media information', () => {
      const mockMediaPlayerState = createMockMediaPlayerState({
        mediaTitle: null,
        mediaArtist: null,
        mediaAlbum: null,
        mediaContentType: null,
        mediaDuration: null,
        mediaPosition: null,
        appName: null
      })
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      const mockChildren = vi.fn().mockReturnValue(<div>No Media</div>)

      render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          mediaTitle: null,
          mediaArtist: null,
          mediaAlbum: null,
          mediaContentType: null,
          mediaDuration: null,
          mediaPosition: null,
          appName: null
        })
      )
    })
  })

  describe('volume information', () => {
    it('should pass volume state correctly', () => {
      const mockMediaPlayerState = createMockMediaPlayerState({
        volumeLevel: 0.75,
        isMuted: false
      })
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      const mockChildren = vi.fn().mockReturnValue(<div>Volume</div>)

      render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          volumeLevel: 0.75,
          isMuted: false
        })
      )
    })

    it('should handle muted state', () => {
      const mockMediaPlayerState = createMockMediaPlayerState({
        volumeLevel: 0.5,
        isMuted: true
      })
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      const mockChildren = vi.fn().mockReturnValue(<div>Muted</div>)

      render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          volumeLevel: 0.5,
          isMuted: true
        })
      )
    })
  })

  describe('source and sound mode', () => {
    it('should pass source information', () => {
      const mockMediaPlayerState = createMockMediaPlayerState({
        currentSource: 'Spotify',
        sourceList: ['Spotify', 'Bluetooth', 'AirPlay', 'USB']
      })
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      const mockChildren = vi.fn().mockReturnValue(<div>Sources</div>)

      render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          currentSource: 'Spotify',
          sourceList: ['Spotify', 'Bluetooth', 'AirPlay', 'USB']
        })
      )
    })

    it('should pass sound mode information', () => {
      const mockMediaPlayerState = createMockMediaPlayerState({
        currentSoundMode: 'Stereo',
        soundModeList: ['Stereo', 'Surround', 'Night Mode']
      })
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      const mockChildren = vi.fn().mockReturnValue(<div>Sound Modes</div>)

      render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          currentSoundMode: 'Stereo',
          soundModeList: ['Stereo', 'Surround', 'Night Mode']
        })
      )
    })
  })

  describe('playback options', () => {
    it('should pass shuffle and repeat information', () => {
      const mockMediaPlayerState = createMockMediaPlayerState({
        shuffle: true,
        repeat: 'all'
      })
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      const mockChildren = vi.fn().mockReturnValue(<div>Playback Options</div>)

      render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          shuffle: true,
          repeat: 'all'
        })
      )
    })
  })

  describe('feature support', () => {
    it('should pass all feature support flags', () => {
      const mockMediaPlayerState = createMockMediaPlayerState({
        supportsPlay: true,
        supportsPause: true,
        supportsStop: false,
        supportsNextTrack: true,
        supportsPreviousTrack: true,
        supportsVolumeSet: true,
        supportsVolumeMute: true,
        supportsSeek: false,
        supportsTurnOn: true,
        supportsTurnOff: true,
        supportsSelectSource: true,
        supportsSelectSoundMode: false,
        supportsShuffle: true,
        supportsRepeat: true
      })
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      const mockChildren = vi.fn().mockReturnValue(<div>Features</div>)

      render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          supportsPlay: true,
          supportsPause: true,
          supportsStop: false,
          supportsNextTrack: true,
          supportsPreviousTrack: true,
          supportsVolumeSet: true,
          supportsVolumeMute: true,
          supportsSeek: false,
          supportsTurnOn: true,
          supportsTurnOff: true,
          supportsSelectSource: true,
          supportsSelectSoundMode: false,
          supportsShuffle: true,
          supportsRepeat: true
        })
      )
    })
  })

  describe('action functions', () => {
    it('should pass all action functions', () => {
      const mockActions = {
        play: vi.fn(),
        pause: vi.fn(),
        stop: vi.fn(),
        toggle: vi.fn(),
        nextTrack: vi.fn(),
        previousTrack: vi.fn(),
        turnOn: vi.fn(),
        turnOff: vi.fn(),
        setVolume: vi.fn(),
        toggleMute: vi.fn(),
        mute: vi.fn(),
        unmute: vi.fn(),
        selectSource: vi.fn(),
        selectSoundMode: vi.fn(),
        setShuffle: vi.fn(),
        setRepeat: vi.fn(),
        seek: vi.fn(),
        playMedia: vi.fn()
      }

      const mockMediaPlayerState = createMockMediaPlayerState(mockActions)
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      const mockChildren = vi.fn().mockReturnValue(<div>Actions</div>)

      render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(
        expect.objectContaining(mockActions)
      )
    })

    it('should pass functions that can be called', () => {
      const mockActions = {
        play: vi.fn(),
        pause: vi.fn(),
        setVolume: vi.fn(),
        selectSource: vi.fn()
      }

      const mockMediaPlayerState = createMockMediaPlayerState(mockActions)
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      let capturedState: MediaPlayerState | null = null
      const mockChildren = vi.fn().mockImplementation((state: MediaPlayerState) => {
        capturedState = state
        return <div>Actions Test</div>
      })

      render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      // Verify functions are callable
      expect(capturedState).not.toBeNull()
      expect(typeof capturedState!.play).toBe('function')
      expect(typeof capturedState!.pause).toBe('function')
      expect(typeof capturedState!.setVolume).toBe('function')
      expect(typeof capturedState!.selectSource).toBe('function')
    })
  })

  describe('connection and error state', () => {
    it('should pass connection state', () => {
      const mockMediaPlayerState = createMockMediaPlayerState({
        isConnected: true,
        error: undefined
      })
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      const mockChildren = vi.fn().mockReturnValue(<div>Connected</div>)

      render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          isConnected: true,
          error: undefined
        })
      )
    })

    it('should handle error state', () => {
      const testError = new Error('Connection failed')
      const mockMediaPlayerState = createMockMediaPlayerState({
        isConnected: false,
        error: testError
      })
      mockUseMediaPlayer.mockReturnValue(mockMediaPlayerState)

      const mockChildren = vi.fn().mockReturnValue(<div>Error</div>)

      render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          isConnected: false,
          error: testError
        })
      )
    })
  })

  describe('component lifecycle', () => {
    it('should re-render when hook state changes', () => {
      const firstState = createMockMediaPlayerState({ state: 'paused', isPlaying: false })
      const secondState = createMockMediaPlayerState({ state: 'playing', isPlaying: true })

      mockUseMediaPlayer.mockReturnValueOnce(firstState)
      const mockChildren = vi.fn().mockReturnValue(<div>Content</div>)

      const { rerender } = render(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(firstState)

      // Change the hook return value
      mockUseMediaPlayer.mockReturnValue(secondState)
      rerender(
        <MediaPlayer entityId="media_player.test_speaker">
          {mockChildren}
        </MediaPlayer>
      )

      expect(mockChildren).toHaveBeenCalledWith(secondState)
      expect(mockChildren).toHaveBeenCalledTimes(2)
    })
  })
})