import { useCallback, useMemo, useState } from 'react'
import { useEntity } from './useEntity'
import { useHAConnection } from '../providers/HAProvider'
import type { CameraState, CameraAttributes } from '../types'
import { CameraFeatures } from '../types'
import { createDomainValidator } from '../utils/entityId'
import { checkFeatures } from '../utils/features'
import { FeatureNotSupportedError } from '../utils/errors'

const validateCameraEntityId = createDomainValidator('camera', 'useCamera')

export function useCamera(entityId: string): CameraState {
  const normalizedEntityId = validateCameraEntityId(entityId)
  const entity = useEntity<CameraAttributes>(normalizedEntityId)
  const { config } = useHAConnection()
  const { attributes, state, callService } = entity
  const [imageRefreshKey, setImageRefreshKey] = useState(0)

  // Feature detection using bit flags
  const features = useMemo(() => {
    return checkFeatures(attributes.supported_features, {
      onOff: CameraFeatures.SUPPORT_ON_OFF,
      stream: CameraFeatures.SUPPORT_STREAM,
    })
  }, [attributes.supported_features])

  // State derivations
  const isOn = state !== 'off' && state !== 'unavailable' && state !== 'unknown'
  const isRecording = state === 'recording'
  const isStreaming = state === 'streaming' 
  const isIdle = state === 'idle'
  const motionDetectionEnabled = attributes.motion_detection ?? false
  const accessToken = attributes.access_token

  // Generate camera image URL using the access token from entity attributes
  const imageUrl = useMemo(() => {
    if (!accessToken || !config.url) {
      return null
    }
    
    // Convert WebSocket URL to HTTP URL if needed
    const httpUrl = config.url.replace(/^ws:\/\//, 'http://').replace(/^wss:\/\//, 'https://')
    const baseUrl = httpUrl.replace(/\/$/, '') // Remove trailing slash
    
    // Add cache-busting parameter to ensure fresh images
    return `${baseUrl}/api/camera_proxy/${normalizedEntityId}?token=${accessToken}&_cb=${imageRefreshKey}`
  }, [accessToken, config.url, normalizedEntityId, imageRefreshKey])

  // Camera control actions
  const turnOn = useCallback(async () => {
    if (!features.onOff) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'turn on')
    }
    await callService('camera', 'turn_on')
  }, [callService, features.onOff, normalizedEntityId])

  const turnOff = useCallback(async () => {
    if (!features.onOff) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'turn off')
    }
    await callService('camera', 'turn_off')
  }, [callService, features.onOff, normalizedEntityId])

  const enableMotionDetection = useCallback(async () => {
    await callService('camera', 'enable_motion_detection')
  }, [callService])

  const disableMotionDetection = useCallback(async () => {
    await callService('camera', 'disable_motion_detection')
  }, [callService])

  const snapshot = useCallback(async () => {
    await callService('camera', 'snapshot')
  }, [callService])

  const playStream = useCallback(async (mediaPlayer?: string) => {
    if (!features.stream) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'streaming')
    }
    
    try {
      const params: Record<string, unknown> = {}
      if (mediaPlayer) {
        params.media_player = mediaPlayer
      }
      
      await callService('camera', 'play_stream', Object.keys(params).length ? params : undefined)
    } catch (error) {
      console.error('Play stream failed, trying alternative approach:', error)
      // Some cameras might not support play_stream service
      // Try enabling streaming mode instead
      throw new Error('Camera streaming not supported or media player required')
    }
  }, [callService, features.stream, normalizedEntityId])

  const record = useCallback(async (filename?: string, duration?: number) => {
    const params: Record<string, unknown> = {}
    if (filename) params.filename = filename
    if (duration) params.duration = duration
    
    await callService('camera', 'record', Object.keys(params).length ? params : undefined)
  }, [callService])

  // Force refresh the camera image by updating the cache-busting key
  const refreshImage = useCallback(async () => {
    setImageRefreshKey(prev => prev + 1)
    // Also refresh entity state to get any updated access token
    await entity.refresh()
  }, [entity.refresh])

  return {
    ...entity,
    isOn,
    isRecording,
    isStreaming,
    isIdle,
    motionDetectionEnabled,
    imageUrl,
    accessToken,
    brand: attributes.brand,
    model: attributes.model,
    supportsOnOff: features.onOff,
    supportsStream: features.stream,
    turnOn,
    turnOff,
    enableMotionDetection,
    disableMotionDetection,
    snapshot,
    playStream,
    record,
    refreshImage,
  }
}