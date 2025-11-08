import { ReactNode } from 'react'
import { useLock } from '../hooks/useLock'
import type { LockState } from '../hooks/useLock'

interface LockProps {
  entityId: string
  children: (lockEntity: LockState) => ReactNode
}

const Lock = ({ entityId, children }: LockProps) => {
  const lockEntity = useLock(entityId)
  return <>{children(lockEntity)}</>
}

export default Lock
