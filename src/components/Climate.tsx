import { ReactNode } from 'react'
import { useClimate } from '../hooks/useClimate'
import type { ClimateState } from '../types'

interface ClimateProps {
  entityId: string
  children: (climate: ClimateState) => ReactNode
}

export const Climate = ({ entityId, children }: ClimateProps) => {
  const climate = useClimate(entityId)
  return <>{children(climate)}</>
}
