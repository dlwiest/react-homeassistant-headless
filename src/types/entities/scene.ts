import type { BaseEntityHook } from '../core'

// Scene types
export interface SceneAttributes {
  friendly_name?: string
  icon?: string
  [key: string]: unknown
}

export interface SceneState extends BaseEntityHook<SceneAttributes> {
  activate: (transition?: number) => Promise<void>
}
