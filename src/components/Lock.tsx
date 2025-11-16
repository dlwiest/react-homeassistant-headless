import { ReactNode } from 'react'
import { useLock } from '../hooks/useLock'
import type { LockState } from '../types'

interface LockProps {
  entityId: string
  children: (lock: LockState) => ReactNode
}

export const Lock = ({ entityId, children }: LockProps) => {
  const lock = useLock(entityId)
  return <>{children(lock)}</>
}