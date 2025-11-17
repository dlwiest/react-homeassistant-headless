import { ReactNode } from 'react'
import { useNumber } from '../hooks/useNumber'
import type { NumberState } from '../types'

interface NumberProps {
  entityId: string
  children: (numberEntity: NumberState) => ReactNode
}

export const Number = ({ entityId, children }: NumberProps) => {
  const numberEntity = useNumber(entityId)
  return <>{children(numberEntity)}</>
}
