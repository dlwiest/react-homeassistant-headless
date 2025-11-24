import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useBinarySensors } from '../useBinarySensors'
import { useEntityList } from '../useEntityList'

vi.mock('../useEntityList')

const mockUseEntityList = useEntityList as ReturnType<typeof vi.fn>

describe('useBinarySensors', () => {
  it('should call useEntityList with "binary_sensor" domain', () => {
    const mockBinarySensors = [
      { entity_id: 'binary_sensor.front_door', state: 'on', attributes: { friendly_name: 'Front Door' } },
      { entity_id: 'binary_sensor.motion', state: 'off', attributes: { friendly_name: 'Motion' } },
    ]

    mockUseEntityList.mockReturnValue(mockBinarySensors)

    const { result } = renderHook(() => useBinarySensors())

    expect(useEntityList).toHaveBeenCalledWith('binary_sensor')
    expect(result.current).toEqual(mockBinarySensors)
    expect(result.current).toHaveLength(2)
  })

  it('should return empty array when no binary sensors exist', () => {
    mockUseEntityList.mockReturnValue([])

    const { result } = renderHook(() => useBinarySensors())

    expect(result.current).toHaveLength(0)
  })
})
