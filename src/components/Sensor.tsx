import { ReactNode } from 'react'
import { useSensor } from '../hooks/useSensor'
import type { SensorState } from '../types'

interface SensorProps {
  entityId: string
  children: (sensor: SensorState) => ReactNode
}

const Sensor = ({ entityId, children }: SensorProps) => {
  const sensor = useSensor(entityId)
  return <>{children(sensor)}</>
}

export default Sensor
