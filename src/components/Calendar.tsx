import { useCalendar } from '../hooks/useCalendar'
import type { CalendarState } from '../types'

interface CalendarProps {
  entityId: string
  children: (calendar: CalendarState) => React.ReactNode
}

export function Calendar({ entityId, children }: CalendarProps) {
  const calendar = useCalendar(entityId)
  return <>{children(calendar)}</>
}
