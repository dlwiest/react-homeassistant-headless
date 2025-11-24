import { useEntityList } from './useEntityList'
import type { TodoAttributes } from '../types'
import type { EntityState } from '../types/core'

export type TodoEntity = EntityState<TodoAttributes>

export function useTodos(): TodoEntity[] {
  return useEntityList<TodoEntity>('todo')
}
