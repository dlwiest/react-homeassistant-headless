import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useLocks } from '../useLocks'
import { useEntityList } from '../useEntityList'

vi.mock('../useEntityList')

const mockUseEntityList = useEntityList as ReturnType<typeof vi.fn>

describe('useLocks', () => {
  it('should call useEntityList with "lock" domain', () => {
    const mockLocks = [
      { entity_id: 'lock.front_door', state: 'locked', attributes: { friendly_name: 'Front Door' } },
      { entity_id: 'lock.back_door', state: 'unlocked', attributes: { friendly_name: 'Back Door' } },
    ]

    mockUseEntityList.mockReturnValue(mockLocks)

    const { result } = renderHook(() => useLocks())

    expect(useEntityList).toHaveBeenCalledWith('lock')
    expect(result.current).toEqual(mockLocks)
    expect(result.current).toHaveLength(2)
  })

  it('should return empty array when no locks exist', () => {
    mockUseEntityList.mockReturnValue([])

    const { result } = renderHook(() => useLocks())

    expect(result.current).toHaveLength(0)
  })
})
