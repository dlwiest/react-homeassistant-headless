import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'

// Mock useEntity before any imports
vi.mock('../useEntity', () => ({
  useEntity: vi.fn()
}))

// Import after mocking
import { useTodo } from '../useTodo'
import { useEntity } from '../useEntity'

describe('useTodo', () => {
  const mockUseEntity = useEntity as any
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return todo state with parsed item count', async () => {
    const mockCallServiceWithResponse = vi.fn().mockResolvedValue({
      response: {
        'todo.shopping_list': {
          items: [
            { uid: '1', summary: 'Buy milk', status: 'needs_action' },
            { uid: '2', summary: 'Buy bread', status: 'completed' }
          ]
        }
      }
    })

    const mockEntityData = {
      entityId: 'todo.shopping_list',
      state: '5',
      attributes: { 
        friendly_name: 'Shopping List',
        supported_features: 15
      },
      isConnected: true,
      lastChanged: new Date(),
      lastUpdated: new Date(),
      context: { id: '123', parent_id: null, user_id: null },
      error: null,
      callService: vi.fn(),
      callServiceWithResponse: mockCallServiceWithResponse,
      refresh: vi.fn(),
      isUnavailable: false
    }
    
    mockUseEntity.mockReturnValue(mockEntityData)
    
    const { result } = renderHook(() => useTodo('todo.shopping_list'))
    
    // Wait for the useEffect to fetch items
    await waitFor(() => expect(result.current.items).toHaveLength(2))
    
    expect(result.current.itemCount).toBe(5)
    expect(result.current.items[0].summary).toBe('Buy milk')
    expect(result.current.items[0].status).toBe('needs_action')
    expect(result.current.supportsAddItem).toBe(true)
    expect(result.current.supportsRemoveItem).toBe(true)
    expect(result.current.supportsUpdateItem).toBe(true)
    expect(result.current.supportsClearCompleted).toBe(true)
  })

  it('should handle empty todo list', async () => {
    const mockCallServiceWithResponse = vi.fn().mockResolvedValue({
      response: {
        'todo.empty_list': {
          items: []
        }
      }
    })

    const mockEntityData = {
      entityId: 'todo.empty_list',
      state: '0',
      attributes: { 
        friendly_name: 'Empty List',
        supported_features: 15
      },
      isConnected: true,
      lastChanged: new Date(),
      lastUpdated: new Date(),
      context: { id: '123', parent_id: null, user_id: null },
      error: null,
      callService: vi.fn(),
      callServiceWithResponse: mockCallServiceWithResponse,
      refresh: vi.fn(),
      isUnavailable: false
    }
    
    mockUseEntity.mockReturnValue(mockEntityData)
    
    const { result } = renderHook(() => useTodo('todo.empty_list'))
    
    // Wait for the useEffect to complete
    await waitFor(() => expect(mockCallServiceWithResponse).toHaveBeenCalled())
    
    expect(result.current.itemCount).toBe(0)
    expect(result.current.items).toEqual([])
  })

  it('should handle unknown state', () => {
    const mockCallServiceWithResponse = vi.fn()

    const mockEntityData = {
      entityId: 'todo.unknown_list',
      state: 'unknown',
      attributes: {
        supported_features: 0
      },
      isConnected: false,
      lastChanged: new Date(),
      lastUpdated: new Date(),
      context: { id: '123', parent_id: null, user_id: null },
      error: null,
      callService: vi.fn(),
      callServiceWithResponse: mockCallServiceWithResponse,
      refresh: vi.fn(),
      isUnavailable: true
    }
    
    mockUseEntity.mockReturnValue(mockEntityData)
    
    const { result } = renderHook(() => useTodo('todo.unknown_list'))
    
    expect(result.current.itemCount).toBe(0)
    expect(result.current.items).toEqual([])
  })

  it('should handle missing items attribute', async () => {
    const mockCallServiceWithResponse = vi.fn().mockResolvedValue({
      response: {
        'todo.no_items': {
          items: []
        }
      }
    })

    const mockEntityData = {
      entityId: 'todo.no_items',
      state: '3',
      attributes: { 
        friendly_name: 'No Items List',
        supported_features: 15
      },
      isConnected: true,
      lastChanged: new Date(),
      lastUpdated: new Date(),
      context: { id: '123', parent_id: null, user_id: null },
      error: null,
      callService: vi.fn(),
      callServiceWithResponse: mockCallServiceWithResponse,
      refresh: vi.fn(),
      isUnavailable: false
    }
    
    mockUseEntity.mockReturnValue(mockEntityData)
    
    const { result } = renderHook(() => useTodo('todo.no_items'))
    
    // Wait for the useEffect to complete
    await waitFor(() => expect(mockCallServiceWithResponse).toHaveBeenCalled())
    
    expect(result.current.itemCount).toBe(3)
    expect(result.current.items).toEqual([])
  })

  it('should handle non-numeric state', async () => {
    const mockCallServiceWithResponse = vi.fn().mockResolvedValue({
      response: {
        'todo.invalid_state': {
          items: []
        }
      }
    })

    const mockEntityData = {
      entityId: 'todo.invalid_state',
      state: 'invalid',
      attributes: { 
        friendly_name: 'Invalid State List',
        supported_features: 15
      },
      isConnected: true,
      lastChanged: new Date(),
      lastUpdated: new Date(),
      context: { id: '123', parent_id: null, user_id: null },
      error: null,
      callService: vi.fn(),
      callServiceWithResponse: mockCallServiceWithResponse,
      refresh: vi.fn(),
      isUnavailable: false
    }
    
    mockUseEntity.mockReturnValue(mockEntityData)
    
    const { result } = renderHook(() => useTodo('todo.invalid_state'))
    
    // Wait for the useEffect to complete
    await waitFor(() => expect(mockCallServiceWithResponse).toHaveBeenCalled())
    
    expect(result.current.itemCount).toBe(0)
  })

  it('should include all entity properties', async () => {
    const mockCallServiceWithResponse = vi.fn().mockResolvedValue({
      response: {
        'todo.test_list': {
          items: [
            { uid: '1', summary: 'Test item', status: 'needs_action' }
          ]
        }
      }
    })

    const mockEntityData = {
      entityId: 'todo.test_list',
      state: '2',
      attributes: { 
        friendly_name: 'Test List',
        supported_features: 15
      },
      isConnected: true,
      lastChanged: new Date('2024-01-01T12:00:00Z'),
      lastUpdated: new Date('2024-01-01T12:30:00Z'),
      context: { id: '123', parent_id: null, user_id: null },
      error: null,
      callService: vi.fn(),
      callServiceWithResponse: mockCallServiceWithResponse,
      refresh: vi.fn(),
      isUnavailable: false
    }
    
    mockUseEntity.mockReturnValue(mockEntityData)
    
    const { result } = renderHook(() => useTodo('todo.test_list'))
    
    // Wait for the useEffect to complete
    await waitFor(() => expect(mockCallServiceWithResponse).toHaveBeenCalled())
    
    expect(result.current.entityId).toBe('todo.test_list')
    expect(result.current.state).toBe('2')
    expect(result.current.attributes).toEqual(mockEntityData.attributes)
    expect(result.current.isConnected).toBe(true)
    expect(result.current.lastChanged).toEqual(mockEntityData.lastChanged)
    expect(result.current.lastUpdated).toEqual(mockEntityData.lastUpdated)
    expect(result.current.context).toEqual(mockEntityData.context)
    expect(result.current.error).toBeNull()
  })

  it('should handle todo items with different statuses', async () => {
    const mockCallServiceWithResponse = vi.fn().mockResolvedValue({
      response: {
        'todo.mixed_list': {
          items: [
            { 
              uid: '2', 
              summary: 'Pending task', 
              status: 'needs_action',
              due: '2024-01-02T15:00:00Z'
            },
            { 
              uid: '1', 
              summary: 'Completed task', 
              status: 'completed',
              due: '2024-01-01T10:00:00Z',
              description: 'This task is done'
            }
          ]
        }
      }
    })

    const mockEntityData = {
      entityId: 'todo.mixed_list',
      state: '4',
      attributes: { 
        friendly_name: 'Mixed List',
        supported_features: 15
      },
      isConnected: true,
      lastChanged: new Date(),
      lastUpdated: new Date(),
      context: { id: '123', parent_id: null, user_id: null },
      error: null,
      callService: vi.fn(),
      callServiceWithResponse: mockCallServiceWithResponse,
      refresh: vi.fn(),
      isUnavailable: false
    }
    
    mockUseEntity.mockReturnValue(mockEntityData)
    
    const { result } = renderHook(() => useTodo('todo.mixed_list'))
    
    // Wait for the useEffect to fetch items
    await waitFor(() => expect(result.current.items).toHaveLength(2))
    
    // Items should be sorted with needs_action first
    expect(result.current.items[0].status).toBe('needs_action')
    expect(result.current.items[0].due).toBe('2024-01-02T15:00:00Z')
    expect(result.current.items[1].status).toBe('completed')
    expect(result.current.items[1].due).toBe('2024-01-01T10:00:00Z')
    expect(result.current.items[1].description).toBe('This task is done')
  })
})