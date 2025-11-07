import { ReactNode } from 'react'
import { useSwitch } from '../hooks/useSwitch'
import type { SwitchState } from '../hooks/useSwitch'

interface SwitchProps {
  entityId: string
  children: (switchEntity: SwitchState) => ReactNode
}

const Switch = ({ entityId, children }: SwitchProps) => {
  const switchEntity = useSwitch(entityId)
  return <>{children(switchEntity)}</>
}

export default Switch
