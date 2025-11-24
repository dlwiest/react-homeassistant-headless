import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useScenes } from '../useScenes'
import { useEntityList } from '../useEntityList'

vi.mock('../useEntityList')

const mockUseEntityList = useEntityList as ReturnType<typeof vi.fn>

describe('useScenes', () => {
  it('should call useEntityList with "scene" domain', () => {
    const mockScenes = [
      { entity_id: 'scene.movie_night', state: 'scening', attributes: { friendly_name: 'Movie Night' } },
      { entity_id: 'scene.good_morning', state: 'scening', attributes: { friendly_name: 'Good Morning' } },
    ]

    mockUseEntityList.mockReturnValue(mockScenes)

    const { result } = renderHook(() => useScenes())

    expect(useEntityList).toHaveBeenCalledWith('scene')
    expect(result.current).toEqual(mockScenes)
    expect(result.current).toHaveLength(2)
  })

  it('should return empty array when no scenes exist', () => {
    mockUseEntityList.mockReturnValue([])

    const { result } = renderHook(() => useScenes())

    expect(result.current).toHaveLength(0)
  })
})
