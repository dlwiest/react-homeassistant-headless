import { ReactNode } from 'react'
import { useTodo } from '../hooks/useTodo'
import type { TodoState } from '../types'

interface TodoProps {
  entityId: string
  children: (state: TodoState) => ReactNode
}

const Todo = ({ entityId, children }: TodoProps) => {
  const todo = useTodo(entityId)
  return <>{children(todo)}</>
}

export { Todo }