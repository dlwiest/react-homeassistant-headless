import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCalendars } from '../useCalendars'
import { useEntityList } from '../useEntityList'

vi.mock('../useEntityList')

const mockUseEntityList = useEntityList as ReturnType<typeof vi.fn>

describe('useCalendars', () => {
  it('should call useEntityList with "calendar" domain', () => {
    const mockCalendars = [
      { entity_id: 'calendar.personal', state: 'off', attributes: { friendly_name: 'Personal Calendar' } },
      { entity_id: 'calendar.work', state: 'on', attributes: { friendly_name: 'Work Calendar' } },
    ]

    mockUseEntityList.mockReturnValue(mockCalendars)

    const { result } = renderHook(() => useCalendars())

    expect(useEntityList).toHaveBeenCalledWith('calendar')
    expect(result.current).toEqual(mockCalendars)
    expect(result.current).toHaveLength(2)
  })

  it('should return empty array when no calendars exist', () => {
    mockUseEntityList.mockReturnValue([])

    const { result } = renderHook(() => useCalendars())

    expect(result.current).toHaveLength(0)
  })
})
