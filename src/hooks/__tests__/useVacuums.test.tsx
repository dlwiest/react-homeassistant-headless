import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useVacuums } from '../useVacuums'
import { useEntityList } from '../useEntityList'

vi.mock('../useEntityList')

const mockUseEntityList = useEntityList as ReturnType<typeof vi.fn>

describe('useVacuums', () => {
  it('should call useEntityList with "vacuum" domain', () => {
    const mockVacuums = [
      { entity_id: 'vacuum.roborock', state: 'cleaning', attributes: { friendly_name: 'Roborock' } },
      { entity_id: 'vacuum.roomba', state: 'docked', attributes: { friendly_name: 'Roomba' } },
    ]

    mockUseEntityList.mockReturnValue(mockVacuums)

    const { result } = renderHook(() => useVacuums())

    expect(useEntityList).toHaveBeenCalledWith('vacuum')
    expect(result.current).toEqual(mockVacuums)
    expect(result.current).toHaveLength(2)
  })

  it('should return empty array when no vacuums exist', () => {
    mockUseEntityList.mockReturnValue([])

    const { result } = renderHook(() => useVacuums())

    expect(result.current).toHaveLength(0)
  })
})
