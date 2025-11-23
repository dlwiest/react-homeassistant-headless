import type { BaseEntityHook } from '../core'

// DateTime types
export interface DateTimeAttributes {
  friendly_name?: string
  icon?: string
}

export interface DateTimeState extends BaseEntityHook<DateTimeAttributes> {
  date: Date | null
  isAvailable: boolean
}
