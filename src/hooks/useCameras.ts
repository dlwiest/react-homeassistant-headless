import { useEntityList } from './useEntityList'
import type { CameraAttributes } from '../types'
import type { EntityState } from '../types/core'

export interface CameraEntity extends EntityState<CameraAttributes> {}

export function useCameras(): CameraEntity[] {
  return useEntityList<CameraEntity>('camera')
}
