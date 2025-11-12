import { ReactNode } from 'react'
import { useBinarySensor } from '../hooks/useBinarySensor'
import type { BinarySensorState } from '../types'

interface BinarySensorProps {
  entityId: string
  children: (binarySensor: BinarySensorState) => ReactNode
}

const BinarySensor = ({ entityId, children }: BinarySensorProps) => {
  const binarySensor = useBinarySensor(entityId)
  return <>{children(binarySensor)}</>
}

export default BinarySensor