import { ReactNode } from 'react'
import { useMediaPlayer } from '../hooks/useMediaPlayer'
import type { MediaPlayerState } from '../types'

export interface MediaPlayerProps {
  entityId: string
  children: (mediaPlayer: MediaPlayerState) => ReactNode
}

export function MediaPlayer({ entityId, children }: MediaPlayerProps) {
  const mediaPlayer = useMediaPlayer(entityId)
  return <>{children(mediaPlayer)}</>
}