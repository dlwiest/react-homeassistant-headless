import { useEntityList } from './useEntityList'
import type { TodoAttributes } from '../types'
import type { EntityState } from '../types/core'

export interface TodoEntity extends EntityState<TodoAttributes> {}

export function useTodos(): TodoEntity[] {
  return useEntityList<TodoEntity>('todo')
}
