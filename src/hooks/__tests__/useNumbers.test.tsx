import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useNumbers } from '../useNumbers'
import { useEntityList } from '../useEntityList'

vi.mock('../useEntityList')

const mockUseEntityList = useEntityList as ReturnType<typeof vi.fn>

describe('useNumbers', () => {
  it('should call useEntityList with "number" domain', () => {
    const mockNumbers = [
      { entity_id: 'number.volume', state: '50', attributes: { friendly_name: 'Volume' } },
      { entity_id: 'number.brightness', state: '75', attributes: { friendly_name: 'Brightness' } },
    ]

    mockUseEntityList.mockReturnValue(mockNumbers)

    const { result } = renderHook(() => useNumbers())

    expect(useEntityList).toHaveBeenCalledWith('number')
    expect(result.current).toEqual(mockNumbers)
    expect(result.current).toHaveLength(2)
  })

  it('should return empty array when no numbers exist', () => {
    mockUseEntityList.mockReturnValue([])

    const { result } = renderHook(() => useNumbers())

    expect(result.current).toHaveLength(0)
  })
})
