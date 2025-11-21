import type { ReactNode } from 'react'
import { useScene } from '../hooks/useScene'
import type { SceneState } from '../types'

interface SceneProps {
  entityId: string
  children: (scene: SceneState) => ReactNode
}

export function Scene({ entityId, children }: SceneProps) {
  const scene = useScene(entityId)
  return <>{children(scene)}</>
}
