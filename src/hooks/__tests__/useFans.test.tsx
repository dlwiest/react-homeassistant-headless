import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFans } from '../useFans'
import { useEntityList } from '../useEntityList'

vi.mock('../useEntityList')

const mockUseEntityList = useEntityList as ReturnType<typeof vi.fn>

describe('useFans', () => {
  it('should call useEntityList with "fan" domain', () => {
    const mockFans = [
      { entity_id: 'fan.bedroom', state: 'on', attributes: { friendly_name: 'Bedroom Fan' } },
      { entity_id: 'fan.living_room', state: 'off', attributes: { friendly_name: 'Living Room Fan' } },
    ]

    mockUseEntityList.mockReturnValue(mockFans)

    const { result } = renderHook(() => useFans())

    expect(useEntityList).toHaveBeenCalledWith('fan')
    expect(result.current).toEqual(mockFans)
    expect(result.current).toHaveLength(2)
  })

  it('should return empty array when no fans exist', () => {
    mockUseEntityList.mockReturnValue([])

    const { result } = renderHook(() => useFans())

    expect(result.current).toHaveLength(0)
  })
})
