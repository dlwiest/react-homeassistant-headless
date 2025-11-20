import React, { useState, useEffect } from 'react'
import { useCalendar } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
  TextField,
  Divider
} from '@mui/material'
import { CalendarMonth, Place } from '@mui/icons-material'

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
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={
          <Typography variant="h6" component="h2">
            {name}
          </Typography>
        }
        subheader={calendar.hasActiveEvent ? 'Event in progress' : 'No active event'}
        avatar={<CalendarMonth />}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          {/* Current Event */}
          {calendar.currentEvent && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Current/Next Event
              </Typography>
              <Box
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'action.hover'
                }}
              >
                <Typography variant="body1" fontWeight="bold" gutterBottom>
                  {calendar.currentEvent.summary}
                </Typography>
                {calendar.startTime && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Start: {new Date(calendar.startTime).toLocaleString()}
                  </Typography>
                )}
                {calendar.endTime && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    End: {new Date(calendar.endTime).toLocaleString()}
                  </Typography>
                )}
                {calendar.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                    <Place sx={{ fontSize: 16 }} color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {calendar.location}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Upcoming Events */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Upcoming Events
            </Typography>
            {upcomingEvents.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                No upcoming events
              </Typography>
            ) : (
              <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                {upcomingEvents.map((event, index) => (
                  <Box
                    key={index}
                    sx={{
                      py: 1.5,
                      borderBottom: index < upcomingEvents.length - 1 ? 1 : 0,
                      borderColor: 'divider'
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      {event.summary}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {new Date(event.start).toLocaleDateString()} at {new Date(event.start).toLocaleTimeString()}
                    </Typography>
                    {event.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <Place sx={{ fontSize: 14 }} color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {event.location}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Create Event Form */}
          {calendar.supportsCreate && (
            <Box>
              {!showCreateForm ? (
                <Button
                  onClick={() => setShowCreateForm(true)}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  + Create Event
                </Button>
              ) : (
                <Stack spacing={1.5}>
                  <TextField
                    size="small"
                    placeholder="Event title"
                    value={newEvent.summary}
                    onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    size="small"
                    type="datetime-local"
                    value={newEvent.start}
                    onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value + ':00' })}
                    fullWidth
                  />
                  <TextField
                    size="small"
                    type="datetime-local"
                    value={newEvent.end}
                    onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value + ':00' })}
                    fullWidth
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleCreateEvent}
                      disabled={!newEvent.summary.trim()}
                      fullWidth
                    >
                      Add
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setShowCreateForm(false)
                        setNewEvent({ summary: '', start: '', end: '', description: '' })
                      }}
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </Box>
                </Stack>
              )}
            </Box>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, pt: 0 }}>
        <Divider />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', px: 1 }}>
          {calendar.supportsCreate && <Chip label="Create" size="small" />}
          {calendar.supportsUpdate && <Chip label="Update" size="small" />}
          {calendar.supportsDelete && <Chip label="Delete" size="small" />}
        </Box>
        <Box sx={{ px: 1, pb: 1 }}>
          <Chip
            label={calendar.isConnected ? 'Online' : 'Offline'}
            size="small"
            color={calendar.isConnected ? 'success' : 'error'}
            variant="outlined"
          />
        </Box>
      </CardActions>
    </Card>
  )
}
