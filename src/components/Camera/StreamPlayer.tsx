import { useRef, useEffect, CSSProperties } from 'react'
import type { StreamState } from '../../types'

export interface StreamPlayerProps {
  stream: StreamState
  style?: CSSProperties
  className?: string
  autoPlay?: boolean
  muted?: boolean
  controls?: boolean
}

export function StreamPlayer({
  stream,
  style,
  className,
  autoPlay = true,
  muted = true,
  controls = true
}: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Handle stream URL changes and playback
  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current
    const { isActive, url, type } = stream

    if (isActive && url) {
      if (type === 'hls') {
        // For HLS streams, use native video if supported
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url
          video.play().catch(err => console.error('HLS playback error:', err))
        } else {
          console.warn('HLS not natively supported. Consider adding hls.js library.')
          video.src = url
          video.play().catch(err => console.error('HLS playback error:', err))
        }
      } else if (type === 'mjpeg') {
        video.src = url
        video.play().catch(err => console.error('MJPEG playback error:', err))
      }
    } else {
      // Clear video when stream stops
      video.pause()
      video.src = ''
    }
  }, [stream.isActive, stream.url, stream.type])

  if (!stream.isActive || !stream.url) {
    return null
  }

  const defaultStyle: CSSProperties = {
    width: '100%',
    maxWidth: '640px',
    height: 'auto',
    backgroundColor: '#000',
    ...style
  }

  // Use img element for MJPEG streams (more efficient)
  if (stream.type === 'mjpeg') {
    return (
      <img
        src={stream.url}
        alt="Camera stream"
        style={defaultStyle}
        className={className}
      />
    )
  }

  // Use video element for HLS and other streams
  return (
    <video
      ref={videoRef}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      style={defaultStyle}
      className={className}
    />
  )
}
