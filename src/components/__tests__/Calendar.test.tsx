import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Calendar } from '../Calendar'
import { useCalendar } from '../../hooks/useCalendar'

// Mock the hook
vi.mock('../../hooks/useCalendar')

const mockUseCalendar = vi.mocked(useCalendar)

describe('Calendar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with calendar state', () => {
    const mockCalendarState = {
      entityId: 'calendar.personal',
      state: 'on',
      attributes: {
        friendly_name: 'Personal Calendar',
        message: 'Team Meeting',
        all_day: false,
        start_time: '2024-01-15T10:00:00',
        end_time: '2024-01-15T11:00:00',
        location: 'Conference Room A',
        description: 'Weekly team sync',
        supported_features: 7
      },
      hasActiveEvent: true,
      currentEvent: {
        summary: 'Team Meeting',
        start: '2024-01-15T10:00:00',
        end: '2024-01-15T11:00:00',
        location: 'Conference Room A',
        description: 'Weekly team sync'
      },
      message: 'Team Meeting',
      startTime: '2024-01-15T10:00:00',
      endTime: '2024-01-15T11:00:00',
      location: 'Conference Room A',
      description: 'Weekly team sync',
      isAllDay: false,
      supportsCreate: true,
      supportsDelete: true,
      supportsUpdate: true,
      isConnected: true,
      lastChanged: new Date('2024-01-01T12:00:00Z'),
      lastUpdated: new Date('2024-01-01T12:30:00Z'),
      context: { id: '123', parent_id: null, user_id: null },
      error: null,
      callService: vi.fn(),
      callServiceWithResponse: vi.fn(),
      refresh: vi.fn(),
      isUnavailable: false,
      getEvents: vi.fn(),
      createEvent: vi.fn(),
      deleteEvent: vi.fn(),
      updateEvent: vi.fn()
    }

    mockUseCalendar.mockReturnValue(mockCalendarState)

    const { getByTestId } = render(
      <Calendar entityId="calendar.personal">
        {(calendar) => (
          <div data-testid="calendar-content">
            <h3>{calendar.attributes.friendly_name}</h3>
            {calendar.hasActiveEvent && calendar.currentEvent && (
              <div data-testid="active-event">
                <div data-testid="event-summary">{calendar.currentEvent.summary}</div>
                <div data-testid="event-location">{calendar.location}</div>
              </div>
            )}
          </div>
        )}
      </Calendar>
    )

    expect(mockUseCalendar).toHaveBeenCalledWith('calendar.personal')
    expect(getByTestId('calendar-content')).toBeInTheDocument()
    expect(getByTestId('active-event')).toBeInTheDocument()
    expect(getByTestId('event-summary')).toHaveTextContent('Team Meeting')
    expect(getByTestId('event-location')).toHaveTextContent('Conference Room A')
  })

  it('should handle no active event', () => {
    const mockCalendarState = {
      entityId: 'calendar.work',
      state: 'off',
      attributes: {
        friendly_name: 'Work Calendar'
      },
      hasActiveEvent: false,
      currentEvent: null,
      message: null,
      startTime: null,
      endTime: null,
      location: null,
      description: null,
      isAllDay: false,
      supportsCreate: true,
      supportsDelete: false,
      supportsUpdate: false,
      isConnected: true,
      lastChanged: new Date(),
      lastUpdated: new Date(),
      context: { id: '123', parent_id: null, user_id: null },
      error: null,
      callService: vi.fn(),
      callServiceWithResponse: vi.fn(),
      refresh: vi.fn(),
      isUnavailable: false,
      getEvents: vi.fn(),
      createEvent: vi.fn(),
      deleteEvent: vi.fn(),
      updateEvent: vi.fn()
    }

    mockUseCalendar.mockReturnValue(mockCalendarState)

    const { getByTestId, queryByTestId } = render(
      <Calendar entityId="calendar.work">
        {(calendar) => (
          <div data-testid="calendar-content">
            <h3>{calendar.attributes.friendly_name}</h3>
            {calendar.hasActiveEvent ? (
              <div data-testid="active-event">Active</div>
            ) : (
              <div data-testid="no-event">No active events</div>
            )}
          </div>
        )}
      </Calendar>
    )

    expect(getByTestId('calendar-content')).toBeInTheDocument()
    expect(queryByTestId('active-event')).not.toBeInTheDocument()
    expect(getByTestId('no-event')).toHaveTextContent('No active events')
  })

  it('should handle error state', () => {
    const mockCalendarState = {
      entityId: 'calendar.error',
      state: 'unknown',
      attributes: {},
      hasActiveEvent: false,
      currentEvent: null,
      message: null,
      startTime: null,
      endTime: null,
      location: null,
      description: null,
      isAllDay: false,
      supportsCreate: false,
      supportsDelete: false,
      supportsUpdate: false,
      isConnected: false,
      lastChanged: new Date(),
      lastUpdated: new Date(),
      context: { id: '123', parent_id: null, user_id: null },
      error: { name: 'EntityError', message: 'Calendar not available' },
      callService: vi.fn(),
      callServiceWithResponse: vi.fn(),
      refresh: vi.fn(),
      isUnavailable: true,
      getEvents: vi.fn(),
      createEvent: vi.fn(),
      deleteEvent: vi.fn(),
      updateEvent: vi.fn()
    }

    mockUseCalendar.mockReturnValue(mockCalendarState)

    const { getByTestId } = render(
      <Calendar entityId="calendar.error">
        {(calendar) => (
          <div data-testid="error-calendar">
            {calendar.error && <span data-testid="error-message">{calendar.error.message}</span>}
          </div>
        )}
      </Calendar>
    )

    expect(getByTestId('error-message')).toHaveTextContent('Calendar not available')
  })

  it('should pass through all calendar properties', () => {
    const mockCalendarState = {
      entityId: 'calendar.test',
      state: 'on',
      attributes: {
        friendly_name: 'Test Calendar',
        message: 'Test Event',
        all_day: true,
        start_time: '2024-01-15',
        end_time: '2024-01-15',
        supported_features: 7
      },
      hasActiveEvent: true,
      currentEvent: {
        summary: 'Test Event',
        start: '2024-01-15',
        end: '2024-01-15'
      },
      message: 'Test Event',
      startTime: '2024-01-15',
      endTime: '2024-01-15',
      location: null,
      description: null,
      isAllDay: true,
      supportsCreate: true,
      supportsDelete: true,
      supportsUpdate: true,
      isConnected: true,
      lastChanged: new Date('2024-01-01T12:00:00Z'),
      lastUpdated: new Date('2024-01-01T12:30:00Z'),
      context: { id: '123', parent_id: null, user_id: null },
      error: null,
      callService: vi.fn(),
      callServiceWithResponse: vi.fn(),
      refresh: vi.fn(),
      isUnavailable: false,
      getEvents: vi.fn(),
      createEvent: vi.fn(),
      deleteEvent: vi.fn(),
      updateEvent: vi.fn()
    }

    mockUseCalendar.mockReturnValue(mockCalendarState)

    const { getByTestId } = render(
      <Calendar entityId="calendar.test">
        {(calendar) => (
          <div data-testid="full-calendar">
            <div data-testid="entity-id">{calendar.entityId}</div>
            <div data-testid="state">{calendar.state}</div>
            <div data-testid="has-event">{calendar.hasActiveEvent.toString()}</div>
            <div data-testid="is-all-day">{calendar.isAllDay.toString()}</div>
            <div data-testid="connected">{calendar.isConnected.toString()}</div>
            <div data-testid="supports-create">{calendar.supportsCreate.toString()}</div>
            <div data-testid="supports-delete">{calendar.supportsDelete.toString()}</div>
            <div data-testid="supports-update">{calendar.supportsUpdate.toString()}</div>
          </div>
        )}
      </Calendar>
    )

    expect(getByTestId('entity-id')).toHaveTextContent('calendar.test')
    expect(getByTestId('state')).toHaveTextContent('on')
    expect(getByTestId('has-event')).toHaveTextContent('true')
    expect(getByTestId('is-all-day')).toHaveTextContent('true')
    expect(getByTestId('connected')).toHaveTextContent('true')
    expect(getByTestId('supports-create')).toHaveTextContent('true')
    expect(getByTestId('supports-delete')).toHaveTextContent('true')
    expect(getByTestId('supports-update')).toHaveTextContent('true')
  })

  it('should handle all-day events', () => {
    const mockCalendarState = {
      entityId: 'calendar.holidays',
      state: 'on',
      attributes: {
        friendly_name: 'Holidays',
        message: 'New Year',
        all_day: true,
        start_time: '2024-01-01',
        end_time: '2024-01-01'
      },
      hasActiveEvent: true,
      currentEvent: {
        summary: 'New Year',
        start: '2024-01-01',
        end: '2024-01-01'
      },
      message: 'New Year',
      startTime: '2024-01-01',
      endTime: '2024-01-01',
      location: null,
      description: null,
      isAllDay: true,
      supportsCreate: true,
      supportsDelete: false,
      supportsUpdate: false,
      isConnected: true,
      lastChanged: new Date(),
      lastUpdated: new Date(),
      context: { id: '123', parent_id: null, user_id: null },
      error: null,
      callService: vi.fn(),
      callServiceWithResponse: vi.fn(),
      refresh: vi.fn(),
      isUnavailable: false,
      getEvents: vi.fn(),
      createEvent: vi.fn(),
      deleteEvent: vi.fn(),
      updateEvent: vi.fn()
    }

    mockUseCalendar.mockReturnValue(mockCalendarState)

    const { getByTestId } = render(
      <Calendar entityId="calendar.holidays">
        {(calendar) => (
          <div data-testid="all-day-calendar">
            {calendar.isAllDay && <span data-testid="all-day-badge">All Day Event</span>}
            <div data-testid="event-name">{calendar.message}</div>
          </div>
        )}
      </Calendar>
    )

    expect(getByTestId('all-day-badge')).toHaveTextContent('All Day Event')
    expect(getByTestId('event-name')).toHaveTextContent('New Year')
  })
})
