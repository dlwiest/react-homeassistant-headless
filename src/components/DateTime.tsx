import { ReactNode } from 'react'
import { useDateTime } from '../hooks/useDateTime'
import type { DateTimeState } from '../types'

interface DateTimeProps {
  children: (datetime: DateTimeState) => ReactNode
}

export const DateTime = ({ children }: DateTimeProps) => {
  const datetime = useDateTime()
  return <>{children(datetime)}</>
}
