import React, { useState, useEffect } from 'react'
import { useCalendar } from 'hass-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConnectionIndicator } from "@/components/ui/connection-indicator"
import { Calendar, MapPin, Plus, X } from "lucide-react"

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
        setUpcomingEvents(events.slice(0, 5))
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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>
              {calendar.hasActiveEvent ? 'Event in progress' : 'No active event'}
            </CardDescription>
          </div>
          <Calendar className="h-5 w-5 text-slate-400" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Current Event */}
        {calendar.currentEvent && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-200">Current/Next Event</h4>
            <div className="rounded-md border border-slate-700 bg-slate-800/50 p-3 space-y-2">
              <div className="font-semibold text-slate-100">{calendar.currentEvent.summary}</div>
              {calendar.startTime && (
                <div className="text-xs text-slate-400">
                  Start: {new Date(calendar.startTime).toLocaleString()}
                </div>
              )}
              {calendar.endTime && (
                <div className="text-xs text-slate-400">
                  End: {new Date(calendar.endTime).toLocaleString()}
                </div>
              )}
              {calendar.location && (
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="h-3 w-3" />
                  {calendar.location}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-200">Upcoming Events</h4>
          {upcomingEvents.length === 0 ? (
            <div className="text-center text-slate-400 py-6 text-sm">
              No upcoming events
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-2 rounded-md hover:bg-slate-700/30 transition-colors border-b border-slate-700/50 last:border-0">
                  <div className="font-medium text-sm text-slate-200">{event.summary}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {new Date(event.start).toLocaleDateString()} at {new Date(event.start).toLocaleTimeString()}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <MapPin className="h-3 w-3" />
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
          <div>
            {!showCreateForm ? (
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setShowCreateForm(true)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  className="flex h-9 w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-1 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Event title"
                  value={newEvent.summary}
                  onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
                />
                <input
                  type="datetime-local"
                  className="flex h-9 w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-1 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
                  value={newEvent.start}
                  onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value + ':00' })}
                />
                <input
                  type="datetime-local"
                  className="flex h-9 w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-1 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
                  value={newEvent.end}
                  onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value + ':00' })}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleCreateEvent} disabled={!newEvent.summary.trim()}>
                    Add
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setShowCreateForm(false)
                    setNewEvent({ summary: '', start: '', end: '', description: '' })
                  }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-2">
        <div className="flex flex-wrap gap-1.5">
          {calendar.supportsCreate && <Badge>Create</Badge>}
          {calendar.supportsUpdate && <Badge>Update</Badge>}
          {calendar.supportsDelete && <Badge>Delete</Badge>}
        </div>
        <ConnectionIndicator isConnected={calendar.isConnected} className="pt-2" />
      </CardFooter>
    </Card>
  )
}
