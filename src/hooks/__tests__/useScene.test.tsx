import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useScene } from '../useScene'
import { useEntity } from '../useEntity'

vi.mock('../useEntity')

const createMockSceneEntity = (
  state: string = 'scening',
  attributes: Record<string, any> = {}
) => ({
  entityId: 'scene.test',
  state,
  attributes,
  lastChanged: new Date(),
  lastUpdated: new Date(),
  isUnavailable: state === 'unavailable',
  isConnected: true,
  callService: vi.fn(),
  callServiceWithResponse: vi.fn(),
  refresh: vi.fn()
})

describe('useScene', () => {
  const mockUseEntity = useEntity as any

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseEntity.mockReturnValue(createMockSceneEntity())
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Entity ID Validation', () => {
    it('should warn when using wrong domain', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      renderHook(() => useScene('light.test'))

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('useScene: Entity "light.test" has domain "light" but expects "scene" domain')
      )

      consoleSpy.mockRestore()
    })

    it('should accept scene domain', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      renderHook(() => useScene('scene.test'))

      expect(consoleSpy).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('Basic Properties', () => {
    it('should return basic entity properties', () => {
      mockUseEntity.mockReturnValue(
        createMockSceneEntity('scening', {
          friendly_name: 'Movie Night',
          icon: 'mdi:movie'
        })
      )

      const { result } = renderHook(() => useScene('scene.test'))

      expect(result.current.entityId).toBe('scene.test')
      expect(result.current.state).toBe('scening')
      expect(result.current.isConnected).toBe(true)
      expect(result.current.attributes.friendly_name).toBe('Movie Night')
      expect(result.current.attributes.icon).toBe('mdi:movie')
    })
  })

  describe('Activate Scene', () => {
    it('should activate scene without transition', async () => {
      const mockCallService = vi.fn().mockResolvedValue(undefined)

      mockUseEntity.mockReturnValue({
        ...createMockSceneEntity(),
        callService: mockCallService
      })

      const { result } = renderHook(() => useScene('scene.test'))

      await act(async () => {
        await result.current.activate()
      })

      expect(mockCallService).toHaveBeenCalledWith('scene', 'turn_on', {})
    })

    it('should activate scene with transition', async () => {
      const mockCallService = vi.fn().mockResolvedValue(undefined)

      mockUseEntity.mockReturnValue({
        ...createMockSceneEntity(),
        callService: mockCallService
      })

      const { result } = renderHook(() => useScene('scene.test'))

      await act(async () => {
        await result.current.activate(5)
      })

      expect(mockCallService).toHaveBeenCalledWith('scene', 'turn_on', {
        transition: 5
      })
    })

    it('should handle transition of 0 seconds', async () => {
      const mockCallService = vi.fn().mockResolvedValue(undefined)

      mockUseEntity.mockReturnValue({
        ...createMockSceneEntity(),
        callService: mockCallService
      })

      const { result } = renderHook(() => useScene('scene.test'))

      await act(async () => {
        await result.current.activate(0)
      })

      expect(mockCallService).toHaveBeenCalledWith('scene', 'turn_on', {
        transition: 0
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle service call errors', async () => {
      const mockCallService = vi.fn().mockRejectedValue(new Error('Service call failed'))

      mockUseEntity.mockReturnValue({
        ...createMockSceneEntity(),
        callService: mockCallService
      })

      const { result } = renderHook(() => useScene('scene.test'))

      await expect(result.current.activate()).rejects.toThrow('Service call failed')
    })
  })

  describe('State Management', () => {
    it('should handle unavailable state', () => {
      mockUseEntity.mockReturnValue(
        createMockSceneEntity('unavailable', {
          friendly_name: 'Unavailable Scene'
        })
      )

      const { result } = renderHook(() => useScene('scene.unavailable'))

      expect(result.current.isUnavailable).toBe(true)
      expect(result.current.state).toBe('unavailable')
    })

    it('should handle different scene states', () => {
      mockUseEntity.mockReturnValue(
        createMockSceneEntity('scening', {
          friendly_name: 'Active Scene'
        })
      )

      const { result } = renderHook(() => useScene('scene.test'))

      expect(result.current.state).toBe('scening')
    })
  })
})
