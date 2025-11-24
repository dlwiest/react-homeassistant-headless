import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useClimates } from '../useClimates'
import { useEntityList } from '../useEntityList'

vi.mock('../useEntityList')

const mockUseEntityList = useEntityList as ReturnType<typeof vi.fn>

describe('useClimates', () => {
  it('should call useEntityList with "climate" domain', () => {
    const mockClimates = [
      { entity_id: 'climate.living_room', state: 'heat', attributes: { friendly_name: 'Living Room' } },
      { entity_id: 'climate.bedroom', state: 'cool', attributes: { friendly_name: 'Bedroom' } },
    ]

    mockUseEntityList.mockReturnValue(mockClimates)

    const { result } = renderHook(() => useClimates())

    expect(useEntityList).toHaveBeenCalledWith('climate')
    expect(result.current).toEqual(mockClimates)
    expect(result.current).toHaveLength(2)
  })

  it('should return empty array when no climate devices exist', () => {
    mockUseEntityList.mockReturnValue([])

    const { result } = renderHook(() => useClimates())

    expect(result.current).toHaveLength(0)
  })
})
