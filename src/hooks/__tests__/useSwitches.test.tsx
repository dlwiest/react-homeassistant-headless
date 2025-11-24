import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSwitches } from '../useSwitches'
import { useEntityList } from '../useEntityList'

vi.mock('../useEntityList')

const mockUseEntityList = useEntityList as ReturnType<typeof vi.fn>

describe('useSwitches', () => {
  it('should call useEntityList with "switch" domain', () => {
    const mockSwitches = [
      { entity_id: 'switch.coffee_maker', state: 'off', attributes: { friendly_name: 'Coffee Maker' } },
      { entity_id: 'switch.desk_fan', state: 'on', attributes: { friendly_name: 'Desk Fan' } },
    ]

    mockUseEntityList.mockReturnValue(mockSwitches)

    const { result } = renderHook(() => useSwitches())

    expect(useEntityList).toHaveBeenCalledWith('switch')
    expect(result.current).toEqual(mockSwitches)
    expect(result.current).toHaveLength(2)
  })

  it('should return empty array when no switches exist', () => {
    mockUseEntityList.mockReturnValue([])

    const { result } = renderHook(() => useSwitches())

    expect(result.current).toHaveLength(0)
  })
})
