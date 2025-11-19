import { ReactNode } from 'react'
import { useWeather } from '../hooks/useWeather'
import type { WeatherState } from '../types'

interface WeatherProps {
  entityId: string
  children: (weather: WeatherState) => ReactNode
}

export const Weather = ({ entityId, children }: WeatherProps) => {
  const weather = useWeather(entityId)
  return <>{children(weather)}</>
}
