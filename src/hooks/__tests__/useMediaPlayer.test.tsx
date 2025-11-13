import { renderHook, act } from '@testing-library/react'
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest'

// Mock the useEntity hook before imports
vi.mock('../useEntity', () => ({
  useEntity: vi.fn()
}))

import { useMediaPlayer } from '../useMediaPlayer'
import { useEntity } from '../useEntity'
import { MediaPlayerFeatures } from '../../types'
import { createMockEntityFactory } from '../../test/utils'
import { FeatureNotSupportedError } from '../../utils/errors'

describe('useMediaPlayer', () => {
  const createMockMediaPlayerEntity = createMockEntityFactory('media_player')
  const mockUseEntity = useEntity as any
  
  beforeEach(() => {
    vi.resetAllMocks()
    
    // Default mock for useEntity - ensure it's always set
    mockUseEntity.mockReturnValue(createMockMediaPlayerEntity('test'))
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('basic functionality', () => {
    it('should return media player state with basic properties', () => {
      const attributes = {
        supported_features: MediaPlayerFeatures.SUPPORT_PLAY | MediaPlayerFeatures.SUPPORT_PAUSE,
        media_title: 'Test Song',
        media_artist: 'Test Artist',
        volume_level: 0.5
      }
      mockUseEntity.mockReturnValue(createMockMediaPlayerEntity('test', 'playing', attributes))

      const { result } = renderHook(() => useMediaPlayer('media_player.test'))

      expect(result.current).not.toBe(null)
      expect(result.current.entityId).toBe('media_player.test')
      expect(result.current.state).toBe('playing')
      expect(result.current.isPlaying).toBe(true)
      expect(result.current.isPaused).toBe(false)
      expect(result.current.isOn).toBe(true)
      expect(result.current.isOff).toBe(false)
      expect(result.current.mediaTitle).toBe('Test Song')
      expect(result.current.mediaArtist).toBe('Test Artist')
      expect(result.current.volumeLevel).toBe(0.5)
    })

    it('should handle playing state correctly', () => {
      mockUseEntity.mockReturnValue(createMockMediaPlayerEntity('test', 'playing'))
      const { result } = renderHook(() => useMediaPlayer('media_player.test'))
      
      expect(result.current.isPlaying).toBe(true)
      expect(result.current.isPaused).toBe(false)
      expect(result.current.isIdle).toBe(false)
      expect(result.current.isOff).toBe(false)
      expect(result.current.isOn).toBe(true)
    })
    
    it('should handle paused state correctly', () => {
      mockUseEntity.mockReturnValue(createMockMediaPlayerEntity('test', 'paused'))
      const { result } = renderHook(() => useMediaPlayer('media_player.test'))
      
      expect(result.current.isPlaying).toBe(false)
      expect(result.current.isPaused).toBe(true)
      expect(result.current.isIdle).toBe(false)
      expect(result.current.isOff).toBe(false)
      expect(result.current.isOn).toBe(true)
    })
    
    it('should handle idle state correctly', () => {
      mockUseEntity.mockReturnValue(createMockMediaPlayerEntity('test', 'idle'))
      const { result } = renderHook(() => useMediaPlayer('media_player.test'))
      
      expect(result.current.isPlaying).toBe(false)
      expect(result.current.isPaused).toBe(false)
      expect(result.current.isIdle).toBe(true)
      expect(result.current.isOff).toBe(false)
      expect(result.current.isOn).toBe(true)
    })
    
    it('should handle off state correctly', () => {
      mockUseEntity.mockReturnValue(createMockMediaPlayerEntity('test', 'off'))
      const { result } = renderHook(() => useMediaPlayer('media_player.test'))
      
      expect(result.current.isPlaying).toBe(false)
      expect(result.current.isPaused).toBe(false)
      expect(result.current.isIdle).toBe(false)
      expect(result.current.isOff).toBe(true)
      expect(result.current.isOn).toBe(false)
    })
  })

  describe('feature detection', () => {
    it('should detect supported features correctly', () => {
      const supportedFeatures = 
        MediaPlayerFeatures.SUPPORT_PLAY |
        MediaPlayerFeatures.SUPPORT_PAUSE |
        MediaPlayerFeatures.SUPPORT_VOLUME_SET |
        MediaPlayerFeatures.SUPPORT_NEXT_TRACK |
        MediaPlayerFeatures.SUPPORT_SEEK

      const attributes = { supported_features: supportedFeatures }
      mockUseEntity.mockReturnValue(createMockMediaPlayerEntity('test', 'playing', attributes))

      const { result } = renderHook(() => useMediaPlayer('media_player.test'))

      expect(result.current.supportsPlay).toBe(true)
      expect(result.current.supportsPause).toBe(true)
      expect(result.current.supportsVolumeSet).toBe(true)
      expect(result.current.supportsNextTrack).toBe(true)
      expect(result.current.supportsSeek).toBe(true)
      
      // Features not included should be false
      expect(result.current.supportsStop).toBe(false)
      expect(result.current.supportsPreviousTrack).toBe(false)
    })

    it('should handle no supported features', () => {
      const attributes = { supported_features: 0 }
      mockUseEntity.mockReturnValue(createMockMediaPlayerEntity('test', 'playing', attributes))

      const { result } = renderHook(() => useMediaPlayer('media_player.test'))

      expect(result.current.supportsPlay).toBe(false)
      expect(result.current.supportsPause).toBe(false)
      expect(result.current.supportsVolumeSet).toBe(false)
      expect(result.current.supportsSeek).toBe(false)
    })
  })

  describe('service calls', () => {
    describe('playback controls', () => {
      it('should call play service', async () => {
        const mockCallService = vi.fn()
        const attributes = { supported_features: MediaPlayerFeatures.SUPPORT_PLAY }
        mockUseEntity.mockReturnValue({
          ...createMockMediaPlayerEntity('test', 'playing', attributes),
          callService: mockCallService
        })

        const { result } = renderHook(() => useMediaPlayer('media_player.test'))

        await act(async () => {
          await result.current.play()
        })

        expect(mockCallService).toHaveBeenCalledWith('media_player', 'media_play')
      })

      it('should call pause service', async () => {
        const mockCallService = vi.fn()
        const attributes = { supported_features: MediaPlayerFeatures.SUPPORT_PAUSE }
        mockUseEntity.mockReturnValue({
          ...createMockMediaPlayerEntity('test', 'playing', attributes),
          callService: mockCallService
        })

        const { result } = renderHook(() => useMediaPlayer('media_player.test'))

        await act(async () => {
          await result.current.pause()
        })

        expect(mockCallService).toHaveBeenCalledWith('media_player', 'media_pause')
      })

      it('should set volume', async () => {
        const mockCallService = vi.fn()
        const attributes = { supported_features: MediaPlayerFeatures.SUPPORT_VOLUME_SET }
        mockUseEntity.mockReturnValue({
          ...createMockMediaPlayerEntity('test', 'playing', attributes),
          callService: mockCallService
        })

        const { result } = renderHook(() => useMediaPlayer('media_player.test'))

        await act(async () => {
          await result.current.setVolume(0.8)
        })

        expect(mockCallService).toHaveBeenCalledWith('media_player', 'volume_set', { volume_level: 0.8 })
      })

      it('should toggle mute', async () => {
        const mockCallService = vi.fn()
        const attributes = { 
          supported_features: MediaPlayerFeatures.SUPPORT_VOLUME_MUTE,
          is_volume_muted: false
        }
        mockUseEntity.mockReturnValue({
          ...createMockMediaPlayerEntity('test', 'playing', attributes),
          callService: mockCallService
        })

        const { result } = renderHook(() => useMediaPlayer('media_player.test'))

        await act(async () => {
          await result.current.toggleMute()
        })

        expect(mockCallService).toHaveBeenCalledWith('media_player', 'volume_mute', { is_volume_muted: true })
      })
    })
  })

  describe('volume validation', () => {
    it('should validate minimum volume range', async () => {
      const mockCallService = vi.fn()
      const attributes = { supported_features: MediaPlayerFeatures.SUPPORT_VOLUME_SET }
      mockUseEntity.mockReturnValue({
        ...createMockMediaPlayerEntity('test', 'playing', attributes),
        callService: mockCallService
      })

      const { result } = renderHook(() => useMediaPlayer('media_player.test'))

      await expect(act(async () => {
        await result.current.setVolume(-0.1)
      })).rejects.toThrow('Number must be greater than or equal to 0')
    })
    
    it('should validate maximum volume range', async () => {
      const mockCallService = vi.fn()
      const attributes = { supported_features: MediaPlayerFeatures.SUPPORT_VOLUME_SET }
      mockUseEntity.mockReturnValue({
        ...createMockMediaPlayerEntity('test', 'playing', attributes),
        callService: mockCallService
      })

      const { result } = renderHook(() => useMediaPlayer('media_player.test'))

      await expect(act(async () => {
        await result.current.setVolume(1.5)
      })).rejects.toThrow('Number must be less than or equal to 1')
    })
  })

  describe('media information', () => {
    it('should handle media attributes correctly', () => {
      const attributes = {
        media_title: 'Test Song',
        media_artist: 'Test Artist',
        media_album_name: 'Test Album',
        media_content_type: 'music',
        media_duration: 300,
        media_position: 120,
        app_name: 'Spotify'
      }
      mockUseEntity.mockReturnValue(createMockMediaPlayerEntity('test', 'playing', attributes))

      const { result } = renderHook(() => useMediaPlayer('media_player.test'))

      expect(result.current.mediaTitle).toBe('Test Song')
      expect(result.current.mediaArtist).toBe('Test Artist')
      expect(result.current.mediaAlbum).toBe('Test Album')
      expect(result.current.mediaContentType).toBe('music')
      expect(result.current.mediaDuration).toBe(300)
      expect(result.current.mediaPosition).toBe(120)
      expect(result.current.appName).toBe('Spotify')
    })

    it('should handle missing media attributes', () => {
      const attributes = {}
      mockUseEntity.mockReturnValue(createMockMediaPlayerEntity('test', 'idle', attributes))

      const { result } = renderHook(() => useMediaPlayer('media_player.test'))

      expect(result.current.mediaTitle).toBe(null)
      expect(result.current.mediaArtist).toBe(null)
      expect(result.current.mediaAlbum).toBe(null)
      expect(result.current.mediaContentType).toBe(null)
      expect(result.current.mediaDuration).toBe(null)
      expect(result.current.mediaPosition).toBe(null)
      expect(result.current.appName).toBe(null)
    })
  })

  describe('error handling', () => {
    it('should throw FeatureNotSupportedError for unsupported play', async () => {
      const mockCallService = vi.fn()
      const attributes = { supported_features: 0 } // No features supported
      mockUseEntity.mockReturnValue({
        ...createMockMediaPlayerEntity('test', 'playing', attributes),
        callService: mockCallService
      })

      const { result } = renderHook(() => useMediaPlayer('media_player.test'))

      await expect(act(async () => {
        await result.current.play()
      })).rejects.toThrow(FeatureNotSupportedError)
    })
    
    it('should throw FeatureNotSupportedError for unsupported volume', async () => {
      const mockCallService = vi.fn()
      const attributes = { supported_features: 0 }
      mockUseEntity.mockReturnValue({
        ...createMockMediaPlayerEntity('test', 'playing', attributes),
        callService: mockCallService
      })

      const { result } = renderHook(() => useMediaPlayer('media_player.test'))

      await expect(act(async () => {
        await result.current.setVolume(0.5)
      })).rejects.toThrow(FeatureNotSupportedError)
    })
  })

  describe('callback stability', () => {
    it('should maintain callback references between renders', () => {
      const attributes = { supported_features: MediaPlayerFeatures.SUPPORT_PLAY | MediaPlayerFeatures.SUPPORT_PAUSE }
      const mockEntity = createMockMediaPlayerEntity('test', 'playing', attributes)
      mockUseEntity.mockReturnValue(mockEntity)

      const { result, rerender } = renderHook(() => useMediaPlayer('media_player.test'))

      const firstPlay = result.current.play
      const firstPause = result.current.pause
      
      // Re-render with same mock to ensure callbacks remain stable
      mockUseEntity.mockReturnValue(mockEntity)
      rerender()

      expect(result.current.play).toBe(firstPlay)
      expect(result.current.pause).toBe(firstPause)
    })
  })
})