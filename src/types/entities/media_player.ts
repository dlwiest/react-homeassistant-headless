import type { BaseEntityHook } from '../core'

// Media Player types
export interface MediaPlayerAttributes {
  friendly_name?: string
  volume_level?: number
  is_volume_muted?: boolean
  media_content_type?: string
  media_duration?: number
  media_position?: number
  media_position_updated_at?: string
  media_title?: string
  media_artist?: string
  media_album_name?: string
  media_album_artist?: string
  media_track?: number
  media_series_title?: string
  media_season?: string
  media_episode?: string
  media_channel?: string
  media_playlist?: string
  app_id?: string
  app_name?: string
  source?: string
  source_list?: string[]
  sound_mode?: string
  sound_mode_list?: string[]
  shuffle?: boolean
  repeat?: string
  supported_features?: number
  device_class?: string
}

export interface MediaPlayerCapabilities {
  supportsPlay: boolean
  supportsPause: boolean
  supportsStop: boolean
  supportsNextTrack: boolean
  supportsPreviousTrack: boolean
  supportsVolumeSet: boolean
  supportsVolumeMute: boolean
  supportsSeek: boolean
  supportsTurnOn: boolean
  supportsTurnOff: boolean
  supportsSelectSource: boolean
  supportsSelectSoundMode: boolean
  supportsShuffle: boolean
  supportsRepeat: boolean
}

export interface MediaPlayerState extends BaseEntityHook<MediaPlayerAttributes>, MediaPlayerCapabilities {
  isPlaying: boolean
  isPaused: boolean
  isIdle: boolean
  isOff: boolean
  isOn: boolean
  mediaTitle: string | null
  mediaArtist: string | null
  mediaAlbum: string | null
  mediaContentType: string | null
  mediaDuration: number | null
  mediaPosition: number | null
  volumeLevel: number
  isMuted: boolean
  currentSource: string | null
  sourceList: string[]
  appName: string | null
  currentSoundMode: string | null
  soundModeList: string[]
  shuffle: boolean | null
  repeat: string | null
  play: () => Promise<void>
  pause: () => Promise<void>
  stop: () => Promise<void>
  toggle: () => Promise<void>
  nextTrack: () => Promise<void>
  previousTrack: () => Promise<void>
  turnOn: () => Promise<void>
  turnOff: () => Promise<void>
  setVolume: (volume: number) => Promise<void>
  toggleMute: () => Promise<void>
  mute: () => Promise<void>
  unmute: () => Promise<void>
  selectSource: (source: string) => Promise<void>
  selectSoundMode: (soundMode: string) => Promise<void>
  setShuffle: (shuffle: boolean) => Promise<void>
  setRepeat: (repeat: string) => Promise<void>
  seek: (position: number) => Promise<void>
  playMedia: (mediaType: string, mediaId: string) => Promise<void>
}

export const MediaPlayerFeatures = {
  SUPPORT_PAUSE: 1,
  SUPPORT_SEEK: 2,
  SUPPORT_VOLUME_SET: 4,
  SUPPORT_VOLUME_MUTE: 8,
  SUPPORT_PREVIOUS_TRACK: 16,
  SUPPORT_NEXT_TRACK: 32,
  SUPPORT_TURN_ON: 128,
  SUPPORT_TURN_OFF: 256,
  SUPPORT_PLAY_MEDIA: 512,
  SUPPORT_VOLUME_STEP: 1024,
  SUPPORT_SELECT_SOURCE: 2048,
  SUPPORT_STOP: 4096,
  SUPPORT_CLEAR_PLAYLIST: 8192,
  SUPPORT_PLAY: 16384,
  SUPPORT_SHUFFLE_SET: 32768,
  SUPPORT_SELECT_SOUND_MODE: 65536,
  SUPPORT_BROWSE_MEDIA: 131072,
  SUPPORT_REPEAT_SET: 262144,
  SUPPORT_GROUPING: 524288,
} as const
