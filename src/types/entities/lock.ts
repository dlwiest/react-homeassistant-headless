import type { BaseEntityHook } from '../core'

// Lock types
export interface LockAttributes {
  friendly_name?: string
  supported_features?: number
  code_format?: string
  changed_by?: string
  code_arm_required?: boolean
}

export interface LockState extends BaseEntityHook<LockAttributes> {
  isLocked: boolean
  isUnlocked: boolean
  isUnknown: boolean
  changedBy?: string
  supportsOpen: boolean
  lock: () => Promise<void>
  unlock: (code?: string) => Promise<void>
  open: (code?: string) => Promise<void>
}

export const LockFeatures = {
  SUPPORT_OPEN: 1,
} as const
