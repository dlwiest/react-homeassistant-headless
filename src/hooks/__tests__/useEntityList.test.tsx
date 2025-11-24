import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useEntityList } from '../useEntityList'
import { useStore } from '../../services/entityStore'

// Mock the entity store
vi.mock('../../services/entityStore')

const mockUseStore = useStore as unknown as ReturnType<typeof vi.fn>

describe('useEntityList', () => {
  const mockConnection = {
    sendMessagePromise: vi.fn(),
    subscribeEvents: vi.fn(() => Promise.resolve(() => {})),
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockUseStore.mockReturnValue(mockConnection)
    mockUseStore.getState = vi.fn(() => ({
      connection: mockConnection,
      entities: new Map(),
      registerEntity: vi.fn(),
      unregisterEntity: vi.fn(),
    }))
  })

  it('should fetch entities for a given domain', async () => {
    const mockStates = [
      { entity_id: 'light.living_room', state: 'on', attributes: { friendly_name: 'Living Room' } },
      { entity_id: 'light.bedroom', state: 'off', attributes: { friendly_name: 'Bedroom' } },
      { entity_id: 'switch.kitchen', state: 'on', attributes: { friendly_name: 'Kitchen' } },
    ]

    mockConnection.sendMessagePromise.mockResolvedValue(mockStates)

    const { result } = renderHook(() => useEntityList('light'))

    // Wait for the async fetch to complete
    await vi.waitFor(() => {
      expect(result.current.length).toBe(2)
    })

    expect(result.current).toHaveLength(2)
    expect(result.current[0].entity_id).toBe('light.living_room')
    expect(result.current[1].entity_id).toBe('light.bedroom')
  })

  it('should filter entities by domain', async () => {
    const mockStates = [
      { entity_id: 'switch.coffee_maker', state: 'off', attributes: {} },
      { entity_id: 'switch.desk_fan', state: 'on', attributes: {} },
      { entity_id: 'light.living_room', state: 'on', attributes: {} },
    ]

    mockConnection.sendMessagePromise.mockResolvedValue(mockStates)

    const { result } = renderHook(() => useEntityList('switch'))

    await vi.waitFor(() => {
      expect(result.current.length).toBe(2)
    })

    expect(result.current).toHaveLength(2)
    expect(result.current[0].entity_id).toBe('switch.coffee_maker')
    expect(result.current[1].entity_id).toBe('switch.desk_fan')
  })

  it('should return empty array when no entities match domain', async () => {
    const mockStates = [
      { entity_id: 'light.living_room', state: 'on', attributes: {} },
      { entity_id: 'switch.kitchen', state: 'on', attributes: {} },
    ]

    mockConnection.sendMessagePromise.mockResolvedValue(mockStates)

    const { result } = renderHook(() => useEntityList('sensor'))

    await vi.waitFor(() => {
      expect(mockConnection.sendMessagePromise).toHaveBeenCalled()
    })

    expect(result.current).toHaveLength(0)
  })

  it('should handle fetch errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockConnection.sendMessagePromise.mockRejectedValue(new Error('Fetch failed'))

    const { result } = renderHook(() => useEntityList('light'))

    await vi.waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    expect(result.current).toHaveLength(0)

    consoleErrorSpy.mockRestore()
  })

  it('should subscribe to state changes for the domain', async () => {
    mockConnection.sendMessagePromise.mockResolvedValue([])

    renderHook(() => useEntityList('light'))

    await vi.waitFor(() => {
      expect(mockConnection.subscribeEvents).toHaveBeenCalledWith(
        expect.any(Function),
        'state_changed'
      )
    })
  })
})
