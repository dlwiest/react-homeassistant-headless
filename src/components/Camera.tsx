import { ReactNode } from 'react'
import { useCamera } from '../hooks/useCamera'
import type { CameraState } from '../types'

export interface CameraProps {
  entityId: string
  children: (camera: CameraState) => ReactNode
}

export function Camera({ entityId, children }: CameraProps) {
  const camera = useCamera(entityId)
  return <>{children(camera)}</>
}

export default Camera