import { ReactNode } from 'react'
import { useEntity } from '../hooks/useEntity'
import type { BaseEntityHook } from '../types'

interface EntityProps {
  entityId: string
  children: (entity: BaseEntityHook) => ReactNode
}

export const Entity = ({ entityId, children }: EntityProps) => {
  const entity = useEntity(entityId)
  return <>{children(entity)}</>
}
