import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCameras } from '../useCameras'
import { useEntityList } from '../useEntityList'

vi.mock('../useEntityList')

const mockUseEntityList = useEntityList as ReturnType<typeof vi.fn>

describe('useCameras', () => {
  it('should call useEntityList with "camera" domain', () => {
    const mockCameras = [
      { entity_id: 'camera.front_door', state: 'idle', attributes: { friendly_name: 'Front Door Camera' } },
      { entity_id: 'camera.backyard', state: 'recording', attributes: { friendly_name: 'Backyard Camera' } },
    ]

    mockUseEntityList.mockReturnValue(mockCameras)

    const { result } = renderHook(() => useCameras())

    expect(useEntityList).toHaveBeenCalledWith('camera')
    expect(result.current).toEqual(mockCameras)
    expect(result.current).toHaveLength(2)
  })

  it('should return empty array when no cameras exist', () => {
    mockUseEntityList.mockReturnValue([])

    const { result } = renderHook(() => useCameras())

    expect(result.current).toHaveLength(0)
  })
})
