import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMediaPlayers } from '../useMediaPlayers'
import { useEntityList } from '../useEntityList'

vi.mock('../useEntityList')

const mockUseEntityList = useEntityList as ReturnType<typeof vi.fn>

describe('useMediaPlayers', () => {
  it('should call useEntityList with "media_player" domain', () => {
    const mockMediaPlayers = [
      { entity_id: 'media_player.living_room_tv', state: 'playing', attributes: { friendly_name: 'Living Room TV' } },
      { entity_id: 'media_player.bedroom_speaker', state: 'idle', attributes: { friendly_name: 'Bedroom Speaker' } },
    ]

    mockUseEntityList.mockReturnValue(mockMediaPlayers)

    const { result } = renderHook(() => useMediaPlayers())

    expect(useEntityList).toHaveBeenCalledWith('media_player')
    expect(result.current).toEqual(mockMediaPlayers)
    expect(result.current).toHaveLength(2)
  })

  it('should return empty array when no media players exist', () => {
    mockUseEntityList.mockReturnValue([])

    const { result } = renderHook(() => useMediaPlayers())

    expect(result.current).toHaveLength(0)
  })
})
