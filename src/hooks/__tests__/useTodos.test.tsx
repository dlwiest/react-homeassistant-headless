import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTodos } from '../useTodos'
import { useEntityList } from '../useEntityList'

vi.mock('../useEntityList')

const mockUseEntityList = useEntityList as ReturnType<typeof vi.fn>

describe('useTodos', () => {
  it('should call useEntityList with "todo" domain', () => {
    const mockTodos = [
      { entity_id: 'todo.shopping_list', state: '3', attributes: { friendly_name: 'Shopping List' } },
      { entity_id: 'todo.tasks', state: '5', attributes: { friendly_name: 'Tasks' } },
    ]

    mockUseEntityList.mockReturnValue(mockTodos)

    const { result } = renderHook(() => useTodos())

    expect(useEntityList).toHaveBeenCalledWith('todo')
    expect(result.current).toEqual(mockTodos)
    expect(result.current).toHaveLength(2)
  })

  it('should return empty array when no todo lists exist', () => {
    mockUseEntityList.mockReturnValue([])

    const { result } = renderHook(() => useTodos())

    expect(result.current).toHaveLength(0)
  })
})
