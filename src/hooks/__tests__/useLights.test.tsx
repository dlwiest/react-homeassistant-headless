import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useLights } from '../useLights'
import { useEntityList } from '../useEntityList'

// Mock useEntityList
vi.mock('../useEntityList')

const mockUseEntityList = useEntityList as ReturnType<typeof vi.fn>

describe('useLights', () => {
  it('should call useEntityList with "light" domain', () => {
    const mockLights = [
      { entity_id: 'light.living_room', state: 'on', attributes: { friendly_name: 'Living Room' } },
      { entity_id: 'light.bedroom', state: 'off', attributes: { friendly_name: 'Bedroom' } },
    ]

    mockUseEntityList.mockReturnValue(mockLights)

    const { result } = renderHook(() => useLights())

    expect(useEntityList).toHaveBeenCalledWith('light')
    expect(result.current).toEqual(mockLights)
    expect(result.current).toHaveLength(2)
  })

  it('should return empty array when no lights exist', () => {
    mockUseEntityList.mockReturnValue([])

    const { result } = renderHook(() => useLights())

    expect(result.current).toHaveLength(0)
  })
})
