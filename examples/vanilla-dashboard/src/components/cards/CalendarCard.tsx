import React, { useState, useEffect } from 'react'
import { useCalendar } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface CalendarCardProps {
  entityId: string
  name: string
}

export const CalendarCard = ({ entityId, name }: CalendarCardProps) => {
  const calendar = useCalendar(entityId)
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newEvent, setNewEvent] = useState({
    summary: '',
    start: '',
    end: '',
    description: ''
  })

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const start = new Date().toISOString()
        const end = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        const events = await calendar.getEvents(start, end)
        setUpcomingEvents(events.slice(0, 5)) // Show only next 5 events
      } catch (error) {
        console.error('Failed to fetch events:', error)
      }
    }
    fetchEvents()
  }, [calendar.getEvents])

  const handleCreateEvent = async () => {
    if (!newEvent.summary || !newEvent.start || !newEvent.end) {
      alert('Please fill in summary, start, and end times')
      return
    }

    try {
      await calendar.createEvent({
        summary: newEvent.summary,
        start: newEvent.start,
        end: newEvent.end,
        description: newEvent.description || undefined
      })
      setNewEvent({ summary: '', start: '', end: '', description: '' })
      setShowCreateForm(false)

      // Refresh events
      const start = new Date().toISOString()
      const end = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      const events = await calendar.getEvents(start, end)
      setUpcomingEvents(events.slice(0, 5))
    } catch (error) {
      alert(`Failed to create event: ${error}`)
    }
  }

  return (
          <Card>
            <CardHeader
              title={name}
              subtitle={calendar.hasActiveEvent ? 'Event in progress' : 'No active event'}
            />

            <CardContent>
              {/* Current Event */}
              {calendar.currentEvent && (
                <div className="calendar-current-event" style={{ marginBottom: '1.5em' }}>
                  <h4 style={{ margin: '0 0 0.5em 0', fontSize: '0.9em', fontWeight: '600' }}>Current/Next Event</h4>
                  <div style={{
                    background: 'var(--bg-slate-dark)',
                    border: '1px solid var(--border-medium)',
                    padding: '0.75em',
                    borderRadius: '4px'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5em' }}>{calendar.currentEvent.summary}</div>
                    {calendar.startTime && (
                      <div style={{ fontSize: '0.85em', marginBottom: '0.25em', opacity: 0.9 }}>
                        Start: {new Date(calendar.startTime).toLocaleString()}
                      </div>
                    )}
                    {calendar.endTime && (
                      <div style={{ fontSize: '0.85em', marginBottom: '0.25em', opacity: 0.9 }}>
                        End: {new Date(calendar.endTime).toLocaleString()}
                      </div>
                    )}
                    {calendar.location && (
                      <div style={{ fontSize: '0.85em', opacity: 0.8 }}>
                        Location: {calendar.location}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Upcoming Events */}
              <div className="calendar-upcoming" style={{ marginBottom: '1em' }}>
                <h4 style={{ margin: '0 0 0.5em 0', fontSize: '0.9em', fontWeight: '600' }}>Upcoming Events</h4>
                {upcomingEvents.length === 0 ? (
                  <p style={{ fontSize: '0.9em', opacity: 0.7 }}>No upcoming events</p>
                ) : (
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {upcomingEvents.map((event, index) => (
                      <div key={index} style={{
                        padding: '0.5em 0',
                        borderBottom: index < upcomingEvents.length - 1 ? '1px solid var(--border-light)' : 'none',
                        fontSize: '0.9em'
                      }}>
                        <div style={{ fontWeight: '500', marginBottom: '0.25em' }}>{event.summary}</div>
                        <div style={{ fontSize: '0.85em', opacity: 0.8 }}>
                          {new Date(event.start).toLocaleDateString()} at {new Date(event.start).toLocaleTimeString()}
                        </div>
                        {event.location && (
                          <div style={{ fontSize: '0.8em', opacity: 0.7, marginTop: '0.25em' }}>
                            {event.location}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Create Event Form */}
              {calendar.supportsCreate && (
                <div style={{ marginTop: '1em' }}>
                  {!showCreateForm ? (
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="media-button"
                      style={{ width: '100%' }}
                    >
                      Create Event
                    </button>
                  ) : (
                    <div className="calendar-create-form" style={{ marginTop: '0.5em', display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
                      <input
                        type="text"
                        placeholder="Event title"
                        value={newEvent.summary}
                        onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
                        className="select-input"
                      />
                      <input
                        type="datetime-local"
                        value={newEvent.start}
                        onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value + ':00' })}
                        className="select-input"
                      />
                      <input
                        type="datetime-local"
                        value={newEvent.end}
                        onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value + ':00' })}
                        className="select-input"
                      />
                      <div style={{ display: 'flex', gap: '0.5em' }}>
                        <button onClick={handleCreateEvent} className="media-button" style={{ flex: 1 }}>
                          Add
                        </button>
                        <button onClick={() => setShowCreateForm(false)} className="media-button" style={{ flex: 1 }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter>
              <div className="todo-footer-buttons">
                {calendar.supportsCreate && (
                  <button className="todo-footer-button">Create</button>
                )}
                {calendar.supportsUpdate && (
                  <button className="todo-footer-button">Update</button>
                )}
                {calendar.supportsDelete && (
                  <button className="todo-footer-button">Delete</button>
                )}
              </div>
              <div className={`connection-indicator ${calendar.isConnected ? 'connected' : 'disconnected'}`}>
                <div className="connection-dot"></div>
                <span>{calendar.isConnected ? 'Online' : 'Offline'}</span>
              </div>
            </CardFooter>
          </Card>
  )
}
