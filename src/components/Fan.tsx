import { ReactNode } from 'react'
import { useFan } from '../hooks/useFan'
import type { FanState } from '../types'

interface FanProps {
  entityId: string
  children: (fan: FanState) => ReactNode
}

export const Fan = ({ entityId, children }: FanProps) => {
  const fan = useFan(entityId)
  return <>{children(fan)}</>
}