import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAlarmControlPanels } from '../useAlarmControlPanels'
import { useEntityList } from '../useEntityList'

vi.mock('../useEntityList')

const mockUseEntityList = useEntityList as ReturnType<typeof vi.fn>

describe('useAlarmControlPanels', () => {
  it('should call useEntityList with "alarm_control_panel" domain', () => {
    const mockAlarmPanels = [
      { entity_id: 'alarm_control_panel.home', state: 'disarmed', attributes: { friendly_name: 'Home Security' } },
      { entity_id: 'alarm_control_panel.garage', state: 'armed_away', attributes: { friendly_name: 'Garage Security' } },
    ]

    mockUseEntityList.mockReturnValue(mockAlarmPanels)

    const { result } = renderHook(() => useAlarmControlPanels())

    expect(useEntityList).toHaveBeenCalledWith('alarm_control_panel')
    expect(result.current).toEqual(mockAlarmPanels)
    expect(result.current).toHaveLength(2)
  })

  it('should return empty array when no alarm control panels exist', () => {
    mockUseEntityList.mockReturnValue([])

    const { result } = renderHook(() => useAlarmControlPanels())

    expect(result.current).toHaveLength(0)
  })
})
