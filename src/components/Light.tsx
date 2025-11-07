import { ReactNode } from 'react'
import { useLight } from '../hooks/useLight'
import type { LightState } from '../types'

interface LightProps {
  entityId: string
  children: (light: LightState) => ReactNode
}

const Light = ({ entityId, children }: LightProps) => {
  const light = useLight(entityId)
  return <>{children(light)}</>
}

export default Light
