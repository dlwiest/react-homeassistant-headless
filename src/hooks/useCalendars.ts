import { useEntityList } from './useEntityList'
import type { CalendarAttributes } from '../types'
import type { EntityState } from '../types/core'

export interface CalendarEntity extends EntityState<CalendarAttributes> {}

export function useCalendars(): CalendarEntity[] {
  return useEntityList<CalendarEntity>('calendar')
}
