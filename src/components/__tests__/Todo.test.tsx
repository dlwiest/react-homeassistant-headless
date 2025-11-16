import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Todo } from '../Todo'
import { useTodo } from '../../hooks/useTodo'

// Mock the hook
vi.mock('../../hooks/useTodo')

const mockUseTodo = vi.mocked(useTodo)

describe('Todo Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with todo state', () => {
    const mockTodoState = {
      entityId: 'todo.shopping_list',
      state: '3',
      attributes: {
        friendly_name: 'Shopping List',
        items: [
          { uid: '1', summary: 'Buy milk', status: 'needs_action' as const },
          { uid: '2', summary: 'Buy bread', status: 'completed' as const }
        ]
      },
      itemCount: 3,
      items: [
        { uid: '1', summary: 'Buy milk', status: 'needs_action' as const },
        { uid: '2', summary: 'Buy bread', status: 'completed' as const }
      ],
      supportsAddItem: true,
      supportsRemoveItem: true,
      supportsUpdateItem: true,
      supportsClearCompleted: true,
      isConnected: true,
      lastChanged: new Date('2024-01-01T12:00:00Z'),
      lastUpdated: new Date('2024-01-01T12:30:00Z'),
      context: { id: '123', parent_id: null, user_id: null },
      error: null,
      callService: vi.fn(),
  callServiceWithResponse: vi.fn(),
      refresh: vi.fn(),
      isUnavailable: false
    }

    mockUseTodo.mockReturnValue(mockTodoState)

    const { getByTestId } = render(
      <Todo entityId="todo.shopping_list">
        {(todo) => (
          <div data-testid="todo-content">
            <h3>{todo.attributes.friendly_name}</h3>
            <div>Items: {todo.itemCount}</div>
            <ul>
              {todo.items.map((item) => (
                <li key={item.uid} data-testid={`item-${item.uid}`}>
                  {item.summary} - {item.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Todo>
    )

    expect(mockUseTodo).toHaveBeenCalledWith('todo.shopping_list')
    expect(getByTestId('todo-content')).toBeInTheDocument()
    expect(getByTestId('item-1')).toHaveTextContent('Buy milk - needs_action')
    expect(getByTestId('item-2')).toHaveTextContent('Buy bread - completed')
  })

  it('should handle empty todo list', () => {
    const mockTodoState = {
      entityId: 'todo.empty_list',
      state: '0',
      attributes: { items: [] },
      itemCount: 0,
      items: [],
      supportsAddItem: true,
      supportsRemoveItem: true,
      supportsUpdateItem: true,
      supportsClearCompleted: true,
      isConnected: true,
      lastChanged: new Date(),
      lastUpdated: new Date(),
      context: { id: '123', parent_id: null, user_id: null },
      error: null,
      callService: vi.fn(),
  callServiceWithResponse: vi.fn(),
      refresh: vi.fn(),
      isUnavailable: false
    }

    mockUseTodo.mockReturnValue(mockTodoState)

    const { getByTestId } = render(
      <Todo entityId="todo.empty_list">
        {(todo) => (
          <div data-testid="empty-todo">
            Items: {todo.itemCount}
            {todo.items.length === 0 && <span data-testid="no-items">No items</span>}
          </div>
        )}
      </Todo>
    )

    expect(getByTestId('empty-todo')).toHaveTextContent('Items: 0')
    expect(getByTestId('no-items')).toBeInTheDocument()
  })

  it('should handle error state', () => {
    const mockTodoState = {
      entityId: 'todo.error_list',
      state: 'unknown',
      attributes: {},
      itemCount: 0,
      items: [],
      supportsAddItem: true,
      supportsRemoveItem: true,
      supportsUpdateItem: true,
      supportsClearCompleted: true,
      isConnected: false,
      lastChanged: new Date(),
      lastUpdated: new Date(),
      context: { id: '123', parent_id: null, user_id: null },
      error: { name: 'EntityError', message: 'Entity not available' },
      callService: vi.fn(),
  callServiceWithResponse: vi.fn(),
      refresh: vi.fn(),
      isUnavailable: true
    }

    mockUseTodo.mockReturnValue(mockTodoState)

    const { getByTestId } = render(
      <Todo entityId="todo.error_list">
        {(todo) => (
          <div data-testid="error-todo">
            {todo.error && <span data-testid="error-message">{todo.error.message}</span>}
          </div>
        )}
      </Todo>
    )

    expect(getByTestId('error-message')).toHaveTextContent('Entity not available')
  })

  it('should pass through all todo properties', () => {
    const mockTodoState = {
      entityId: 'todo.test_list',
      state: '2',
      attributes: { 
        friendly_name: 'Test List',
        items: [{ uid: '1', summary: 'Test item', status: 'needs_action' as const }],
        supported_features: 15
      },
      itemCount: 2,
      items: [{ uid: '1', summary: 'Test item', status: 'needs_action' as const }],
      supportsAddItem: true,
      supportsRemoveItem: true,
      supportsUpdateItem: true,
      supportsClearCompleted: true,
      isConnected: true,
      lastChanged: new Date('2024-01-01T12:00:00Z'),
      lastUpdated: new Date('2024-01-01T12:30:00Z'),
      context: { id: '123', parent_id: null, user_id: null },
      error: null,
      callService: vi.fn(),
  callServiceWithResponse: vi.fn(),
      refresh: vi.fn(),
      isUnavailable: false
    }

    mockUseTodo.mockReturnValue(mockTodoState)

    const { getByTestId } = render(
      <Todo entityId="todo.test_list">
        {(todo) => (
          <div data-testid="full-todo">
            <div data-testid="entity-id">{todo.entityId}</div>
            <div data-testid="state">{todo.state}</div>
            <div data-testid="connected">{todo.isConnected.toString()}</div>
            <div data-testid="supports-add">{todo.supportsAddItem.toString()}</div>
            <div data-testid="supports-remove">{todo.supportsRemoveItem.toString()}</div>
            <div data-testid="supports-update">{todo.supportsUpdateItem.toString()}</div>
            <div data-testid="supports-clear">{todo.supportsClearCompleted.toString()}</div>
          </div>
        )}
      </Todo>
    )

    expect(getByTestId('entity-id')).toHaveTextContent('todo.test_list')
    expect(getByTestId('state')).toHaveTextContent('2')
    expect(getByTestId('connected')).toHaveTextContent('true')
    expect(getByTestId('supports-add')).toHaveTextContent('true')
    expect(getByTestId('supports-remove')).toHaveTextContent('true')
    expect(getByTestId('supports-update')).toHaveTextContent('true')
    expect(getByTestId('supports-clear')).toHaveTextContent('true')
  })
})