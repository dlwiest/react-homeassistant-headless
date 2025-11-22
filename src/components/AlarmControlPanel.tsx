import { ReactNode } from 'react'
import { useAlarmControlPanel } from '../hooks/useAlarmControlPanel'
import type { AlarmControlPanelState } from '../types'

interface AlarmControlPanelProps {
  entityId: string
  children: (alarmControlPanel: AlarmControlPanelState) => ReactNode
}

export const AlarmControlPanel = ({ entityId, children }: AlarmControlPanelProps) => {
  const alarmControlPanel = useAlarmControlPanel(entityId)
  return <>{children(alarmControlPanel)}</>
}
