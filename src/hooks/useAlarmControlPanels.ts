import { useEntityList } from './useEntityList'
import type { AlarmControlPanelAttributes } from '../types'
import type { EntityState } from '../types/core'

export interface AlarmControlPanelEntity extends EntityState<AlarmControlPanelAttributes> {}

export function useAlarmControlPanels(): AlarmControlPanelEntity[] {
  return useEntityList<AlarmControlPanelEntity>('alarm_control_panel')
}
