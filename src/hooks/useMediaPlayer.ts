import { useCallback } from 'react'
import { z } from 'zod'
import { useEntity } from './useEntity'
import type { MediaPlayerState, MediaPlayerAttributes } from '../types'
import { MediaPlayerFeatures } from '../types'
import { createDomainValidator } from '../utils/entityId'
import { checkFeatures } from '../utils/features'
import { FeatureNotSupportedError } from '../utils/errors'

const validateMediaPlayerEntityId = createDomainValidator('media_player', 'useMediaPlayer')

const volumeSchema = z.number().min(0).max(1)
const seekPositionSchema = z.number().min(0)
const sourceSchema = z.string().min(1)
const soundModeSchema = z.string().min(1)
const repeatModeSchema = z.enum(['off', 'all', 'one'])

export function useMediaPlayer(entityId: string): MediaPlayerState {
  const normalizedEntityId = validateMediaPlayerEntityId(entityId)
  const entity = useEntity<MediaPlayerAttributes>(normalizedEntityId)
  const { attributes, state, callService } = entity

  const features = checkFeatures(attributes.supported_features, {
    play: MediaPlayerFeatures.SUPPORT_PLAY,
    pause: MediaPlayerFeatures.SUPPORT_PAUSE,
    stop: MediaPlayerFeatures.SUPPORT_STOP,
    nextTrack: MediaPlayerFeatures.SUPPORT_NEXT_TRACK,
    previousTrack: MediaPlayerFeatures.SUPPORT_PREVIOUS_TRACK,
    volumeSet: MediaPlayerFeatures.SUPPORT_VOLUME_SET,
    volumeMute: MediaPlayerFeatures.SUPPORT_VOLUME_MUTE,
    seek: MediaPlayerFeatures.SUPPORT_SEEK,
    turnOn: MediaPlayerFeatures.SUPPORT_TURN_ON,
    turnOff: MediaPlayerFeatures.SUPPORT_TURN_OFF,
    selectSource: MediaPlayerFeatures.SUPPORT_SELECT_SOURCE,
    selectSoundMode: MediaPlayerFeatures.SUPPORT_SELECT_SOUND_MODE,
    shuffle: MediaPlayerFeatures.SUPPORT_SHUFFLE_SET,
    repeat: MediaPlayerFeatures.SUPPORT_REPEAT_SET,
  })

  const isPlaying = state === 'playing'
  const isPaused = state === 'paused'
  const isIdle = state === 'idle'
  const isOff = state === 'off'
  const isOn = !isOff && state !== 'unavailable' && state !== 'unknown'

  const mediaTitle = attributes.media_title ?? null
  const mediaArtist = attributes.media_artist ?? null
  const mediaAlbum = attributes.media_album_name ?? null
  const mediaContentType = attributes.media_content_type ?? null
  const mediaDuration = attributes.media_duration ?? null
  const mediaPosition = attributes.media_position ?? null

  const volumeLevel = attributes.volume_level ?? 0
  const isMuted = attributes.is_volume_muted ?? false

  const currentSource = attributes.source ?? null
  const sourceList = attributes.source_list ?? []
  const appName = attributes.app_name ?? null

  const currentSoundMode = attributes.sound_mode ?? null
  const soundModeList = attributes.sound_mode_list ?? []

  const shuffle = attributes.shuffle ?? null
  const repeat = attributes.repeat ?? null

  const play = useCallback(async () => {
    if (!features.play) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'play')
    }
    await callService('media_player', 'media_play')
  }, [callService, features.play, normalizedEntityId])

  const pause = useCallback(async () => {
    if (!features.pause) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'pause')
    }
    await callService('media_player', 'media_pause')
  }, [callService, features.pause, normalizedEntityId])

  const stop = useCallback(async () => {
    if (!features.stop) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'stop')
    }
    await callService('media_player', 'media_stop')
  }, [callService, features.stop, normalizedEntityId])

  const toggle = useCallback(async () => {
    if (isPlaying && features.pause) {
      await pause()
    } else if (!isPlaying && features.play) {
      await play()
    }
  }, [isPlaying, features.pause, features.play, pause, play])

  const nextTrack = useCallback(async () => {
    if (!features.nextTrack) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'next track')
    }
    await callService('media_player', 'media_next_track')
  }, [callService, features.nextTrack, normalizedEntityId])

  const previousTrack = useCallback(async () => {
    if (!features.previousTrack) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'previous track')
    }
    await callService('media_player', 'media_previous_track')
  }, [callService, features.previousTrack, normalizedEntityId])

  const turnOn = useCallback(async () => {
    if (!features.turnOn) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'turn on')
    }
    await callService('media_player', 'turn_on')
  }, [callService, features.turnOn, normalizedEntityId])

  const turnOff = useCallback(async () => {
    if (!features.turnOff) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'turn off')
    }
    await callService('media_player', 'turn_off')
  }, [callService, features.turnOff, normalizedEntityId])

  const setVolume = useCallback(async (volume: number) => {
    if (!features.volumeSet) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'volume control')
    }

    volumeSchema.parse(volume)
    await callService('media_player', 'volume_set', { volume_level: volume })
  }, [callService, features.volumeSet, normalizedEntityId])

  const toggleMute = useCallback(async () => {
    if (!features.volumeMute) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'mute control')
    }
    await callService('media_player', 'volume_mute', { is_volume_muted: !isMuted })
  }, [callService, features.volumeMute, normalizedEntityId, isMuted])

  const mute = useCallback(async () => {
    if (!features.volumeMute) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'mute control')
    }
    if (!isMuted) {
      await callService('media_player', 'volume_mute', { is_volume_muted: true })
    }
  }, [callService, features.volumeMute, normalizedEntityId, isMuted])

  const unmute = useCallback(async () => {
    if (!features.volumeMute) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'mute control')
    }
    if (isMuted) {
      await callService('media_player', 'volume_mute', { is_volume_muted: false })
    }
  }, [callService, features.volumeMute, normalizedEntityId, isMuted])

  const selectSource = useCallback(async (source: string) => {
    if (!features.selectSource) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'source selection')
    }

    sourceSchema.parse(source)
    await callService('media_player', 'select_source', { source })
  }, [callService, features.selectSource, normalizedEntityId])

  const selectSoundMode = useCallback(async (soundMode: string) => {
    if (!features.selectSoundMode) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'sound mode selection')
    }

    soundModeSchema.parse(soundMode)
    await callService('media_player', 'select_sound_mode', { sound_mode: soundMode })
  }, [callService, features.selectSoundMode, normalizedEntityId])

  const setShuffle = useCallback(async (shuffle: boolean) => {
    if (!features.shuffle) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'shuffle control')
    }
    await callService('media_player', 'shuffle_set', { shuffle })
  }, [callService, features.shuffle, normalizedEntityId])

  const setRepeat = useCallback(async (repeat: string) => {
    if (!features.repeat) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'repeat control')
    }

    repeatModeSchema.parse(repeat)
    await callService('media_player', 'repeat_set', { repeat })
  }, [callService, features.repeat, normalizedEntityId])

  const seek = useCallback(async (position: number) => {
    if (!features.seek) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'seek control')
    }

    seekPositionSchema.parse(position)
    await callService('media_player', 'media_seek', { seek_position: position })
  }, [callService, features.seek, normalizedEntityId])

  const playMedia = useCallback(async (mediaType: string, mediaId: string) => {
    await callService('media_player', 'play_media', {
      media_content_type: mediaType,
      media_content_id: mediaId
    })
  }, [callService])

  return {
    ...entity,

    // States
    isPlaying,
    isPaused,
    isIdle,
    isOff,
    isOn,

    // Media info
    mediaTitle,
    mediaArtist,
    mediaAlbum,
    mediaContentType,
    mediaDuration,
    mediaPosition,

    // Volume
    volumeLevel,
    isMuted,

    // Source and app
    currentSource,
    sourceList,
    appName,

    // Sound mode
    currentSoundMode,
    soundModeList,

    // Playback options
    shuffle,
    repeat,

    // Feature support
    supportsPlay: features.play,
    supportsPause: features.pause,
    supportsStop: features.stop,
    supportsNextTrack: features.nextTrack,
    supportsPreviousTrack: features.previousTrack,
    supportsVolumeSet: features.volumeSet,
    supportsVolumeMute: features.volumeMute,
    supportsSeek: features.seek,
    supportsTurnOn: features.turnOn,
    supportsTurnOff: features.turnOff,
    supportsSelectSource: features.selectSource,
    supportsSelectSoundMode: features.selectSoundMode,
    supportsShuffle: features.shuffle,
    supportsRepeat: features.repeat,

    // Actions
    play,
    pause,
    stop,
    toggle,
    nextTrack,
    previousTrack,
    turnOn,
    turnOff,
    setVolume,
    toggleMute,
    mute,
    unmute,
    selectSource,
    selectSoundMode,
    setShuffle,
    setRepeat,
    seek,
    playMedia,
  }
}