import type { BaseEntityHook } from '../core'

// Calendar types
export const CalendarFeatures = {
  CREATE_EVENT: 1,
  DELETE_EVENT: 2,
  UPDATE_EVENT: 4
} as const

export interface CalendarEvent {
  start: string // ISO 8601 datetime or date
  end: string // ISO 8601 datetime or date
  summary: string // Event title
  description?: string
  location?: string
  uid?: string // Unique identifier for mutations
  recurrence_id?: string // For recurring events
  rrule?: string // Recurrence rule (e.g., "FREQ=DAILY")
}

export interface CalendarAttributes {
  friendly_name?: string
  message?: string // Current/next event title
  all_day?: boolean // True if current/next event is all day
  start_time?: string // Start time of current/next event
  end_time?: string // End time of current/next event
  location?: string
  description?: string
  supported_features?: number
}

export interface CalendarState extends BaseEntityHook<CalendarAttributes> {
  currentEvent: CalendarEvent | null
  message: string | null
  isAllDay: boolean
  startTime: string | null
  endTime: string | null
  location: string | null
  description: string | null
  hasActiveEvent: boolean
  supportsCreate: boolean
  supportsDelete: boolean
  supportsUpdate: boolean
  createEvent: (event: Omit<CalendarEvent, 'uid'>) => Promise<void>
  deleteEvent: (uid: string, recurrenceRange?: 'THIS_AND_FUTURE' | 'THIS' | 'ALL') => Promise<void>
  updateEvent: (uid: string, event: Partial<CalendarEvent>, recurrenceRange?: 'THIS_AND_FUTURE' | 'THIS' | 'ALL') => Promise<void>
  getEvents: (startDate: string, endDate: string) => Promise<CalendarEvent[]>
}
