import { useEffect, useRef } from 'react'
import { useEntity } from './useEntity'
import type { DateTimeState, DateTimeAttributes } from '../types'

const DATETIME_ENTITY_ID = 'sensor.date_time_iso'

export function useDateTime(): DateTimeState {
  const entity = useEntity<DateTimeAttributes>(DATETIME_ENTITY_ID)
  const { state } = entity
  const hasLoggedWarning = useRef(false)

  // Log warning once if sensor is unavailable
  useEffect(() => {
    if ((state === 'unavailable' || state === 'unknown') && !hasLoggedWarning.current) {
      console.warn(
        'Home Assistant date_time sensor is unavailable. ' +
        'To enable it: Go to Settings → Devices & Services → Integrations → Time & Date → Add Service → Select "Date & Time (ISO)" → Submit. ' +
        'See https://hass-react.com/docs/entities/datetime for more information.'
      )
      hasLoggedWarning.current = true
    }
  }, [state])

  // Return null for unavailable/unknown states
  if (state === 'unavailable' || state === 'unknown') {
    return {
      ...entity,
      date: null,
      isAvailable: false,
    }
  }

  // Parse ISO 8601 date string into Date object
  let date: Date | null = null
  try {
    const parsed = new Date(state)
    // Validate that the date is valid
    if (!isNaN(parsed.getTime())) {
      date = parsed
    }
  } catch (error) {
    // Invalid date string - return null
    date = null
  }

  return {
    ...entity,
    date,
    isAvailable: true,
  }
}
