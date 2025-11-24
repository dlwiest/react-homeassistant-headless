import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSensors } from '../useSensors'
import { useEntityList } from '../useEntityList'

vi.mock('../useEntityList')

const mockUseEntityList = useEntityList as ReturnType<typeof vi.fn>

describe('useSensors', () => {
  it('should call useEntityList with "sensor" domain', () => {
    const mockSensors = [
      { entity_id: 'sensor.temperature', state: '22.5', attributes: { friendly_name: 'Temperature' } },
      { entity_id: 'sensor.humidity', state: '45', attributes: { friendly_name: 'Humidity' } },
    ]

    mockUseEntityList.mockReturnValue(mockSensors)

    const { result } = renderHook(() => useSensors())

    expect(useEntityList).toHaveBeenCalledWith('sensor')
    expect(result.current).toEqual(mockSensors)
    expect(result.current).toHaveLength(2)
  })

  it('should return empty array when no sensors exist', () => {
    mockUseEntityList.mockReturnValue([])

    const { result } = renderHook(() => useSensors())

    expect(result.current).toHaveLength(0)
  })
})
