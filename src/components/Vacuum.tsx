import { ReactNode } from 'react'
import { useVacuum } from '../hooks/useVacuum'
import type { VacuumState } from '../types'

interface VacuumProps {
  entityId: string
  children: (vacuum: VacuumState) => ReactNode
}

export const Vacuum = ({ entityId, children }: VacuumProps) => {
  const vacuum = useVacuum(entityId)
  return <>{children(vacuum)}</>
}
