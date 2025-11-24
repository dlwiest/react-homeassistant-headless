import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCovers } from '../useCovers'
import { useEntityList } from '../useEntityList'

vi.mock('../useEntityList')

const mockUseEntityList = useEntityList as ReturnType<typeof vi.fn>

describe('useCovers', () => {
  it('should call useEntityList with "cover" domain', () => {
    const mockCovers = [
      { entity_id: 'cover.garage_door', state: 'closed', attributes: { friendly_name: 'Garage Door' } },
      { entity_id: 'cover.blinds', state: 'open', attributes: { friendly_name: 'Blinds' } },
    ]

    mockUseEntityList.mockReturnValue(mockCovers)

    const { result } = renderHook(() => useCovers())

    expect(useEntityList).toHaveBeenCalledWith('cover')
    expect(result.current).toEqual(mockCovers)
    expect(result.current).toHaveLength(2)
  })

  it('should return empty array when no covers exist', () => {
    mockUseEntityList.mockReturnValue([])

    const { result } = renderHook(() => useCovers())

    expect(result.current).toHaveLength(0)
  })
})
