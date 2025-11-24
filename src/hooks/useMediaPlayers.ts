import { useEntityList } from './useEntityList'
import type { MediaPlayerAttributes } from '../types'
import type { EntityState } from '../types/core'

export interface MediaPlayerEntity extends EntityState<MediaPlayerAttributes> {}

export function useMediaPlayers(): MediaPlayerEntity[] {
  return useEntityList<MediaPlayerEntity>('media_player')
}
