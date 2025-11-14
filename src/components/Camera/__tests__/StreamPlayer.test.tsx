import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { StreamPlayer } from '../StreamPlayer'
import type { StreamState } from '../../../types'

describe('Camera.StreamPlayer', () => {
  let mockVideoPlay: any
  let mockVideoPause: any

  beforeEach(() => {
    // Mock HTMLVideoElement methods
    mockVideoPlay = vi.fn().mockResolvedValue(undefined)
    mockVideoPause = vi.fn()

    // Mock canPlayType
    Object.defineProperty(HTMLVideoElement.prototype, 'play', {
      value: mockVideoPlay,
      writable: true
    })
    Object.defineProperty(HTMLVideoElement.prototype, 'pause', {
      value: mockVideoPause,
      writable: true
    })
    Object.defineProperty(HTMLVideoElement.prototype, 'canPlayType', {
      value: vi.fn().mockReturnValue('probably'),
      writable: true
    })

    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should return null when stream is not active', () => {
      const streamState: StreamState = {
        isLoading: false,
        isActive: false,
        error: null,
        url: null,
        type: null
      }

      const { container } = render(<StreamPlayer stream={streamState} />)
      expect(container.firstChild).toBeNull()
    })

    it('should return null when stream has no URL', () => {
      const streamState: StreamState = {
        isLoading: false,
        isActive: true,
        error: null,
        url: null,
        type: 'hls'
      }

      const { container } = render(<StreamPlayer stream={streamState} />)
      expect(container.firstChild).toBeNull()
    })

    it('should render video element for HLS stream', () => {
      const streamState: StreamState = {
        isLoading: false,
        isActive: true,
        error: null,
        url: 'http://example.com/stream.m3u8',
        type: 'hls'
      }

      render(<StreamPlayer stream={streamState} />)

      const video = document.querySelector('video') as HTMLVideoElement
      expect(video).toBeInTheDocument()
      expect(video.controls).toBe(true)
      expect(video.autoplay).toBe(true)
      expect(video.muted).toBe(true)
    })

    it('should render img element for MJPEG stream', () => {
      const streamState: StreamState = {
        isLoading: false,
        isActive: true,
        error: null,
        url: 'http://example.com/stream.mjpeg',
        type: 'mjpeg'
      }

      render(<StreamPlayer stream={streamState} />)

      const img = document.querySelector('img')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', 'http://example.com/stream.mjpeg')
      expect(img).toHaveAttribute('alt', 'Camera stream')
    })
  })

  describe('Props', () => {
    it('should apply className', () => {
      const streamState: StreamState = {
        isLoading: false,
        isActive: true,
        error: null,
        url: 'http://example.com/stream.m3u8',
        type: 'hls'
      }

      render(<StreamPlayer stream={streamState} className="custom-stream-player" />)

      const video = document.querySelector('video')
      expect(video).toHaveClass('custom-stream-player')
    })

    it('should respect autoPlay prop', () => {
      const streamState: StreamState = {
        isLoading: false,
        isActive: true,
        error: null,
        url: 'http://example.com/stream.m3u8',
        type: 'hls'
      }

      const { rerender } = render(<StreamPlayer stream={streamState} autoPlay={false} />)

      let video = document.querySelector('video') as HTMLVideoElement
      expect(video.autoplay).toBe(false)

      rerender(<StreamPlayer stream={streamState} autoPlay={true} />)
      video = document.querySelector('video') as HTMLVideoElement
      expect(video.autoplay).toBe(true)
    })

    it('should respect muted prop', () => {
      const streamState: StreamState = {
        isLoading: false,
        isActive: true,
        error: null,
        url: 'http://example.com/stream.m3u8',
        type: 'hls'
      }

      const { rerender } = render(<StreamPlayer stream={streamState} muted={false} />)

      let video = document.querySelector('video') as HTMLVideoElement
      expect(video.muted).toBe(false)

      rerender(<StreamPlayer stream={streamState} muted={true} />)
      video = document.querySelector('video') as HTMLVideoElement
      expect(video.muted).toBe(true)
    })

    it('should respect controls prop', () => {
      const streamState: StreamState = {
        isLoading: false,
        isActive: true,
        error: null,
        url: 'http://example.com/stream.m3u8',
        type: 'hls'
      }

      const { rerender } = render(<StreamPlayer stream={streamState} controls={false} />)

      let video = document.querySelector('video') as HTMLVideoElement
      expect(video.controls).toBe(false)

      rerender(<StreamPlayer stream={streamState} controls={true} />)
      video = document.querySelector('video') as HTMLVideoElement
      expect(video.controls).toBe(true)
    })
  })

  describe('Stream Management', () => {
    it('should update video src when stream URL changes', async () => {
      const initialStream: StreamState = {
        isLoading: false,
        isActive: true,
        error: null,
        url: 'http://example.com/stream1.m3u8',
        type: 'hls'
      }

      const { rerender } = render(<StreamPlayer stream={initialStream} />)

      await waitFor(() => {
        const video = document.querySelector('video') as HTMLVideoElement
        expect(video.src).toContain('stream1.m3u8')
      })

      const updatedStream: StreamState = {
        ...initialStream,
        url: 'http://example.com/stream2.m3u8'
      }

      rerender(<StreamPlayer stream={updatedStream} />)

      await waitFor(() => {
        const video = document.querySelector('video') as HTMLVideoElement
        expect(video.src).toContain('stream2.m3u8')
      })
    })

    it('should clear video when stream becomes inactive', async () => {
      const activeStream: StreamState = {
        isLoading: false,
        isActive: true,
        error: null,
        url: 'http://example.com/stream.m3u8',
        type: 'hls'
      }

      const { rerender, container } = render(<StreamPlayer stream={activeStream} />)

      await waitFor(() => {
        expect(document.querySelector('video')).toBeInTheDocument()
      })

      const inactiveStream: StreamState = {
        isLoading: false,
        isActive: false,
        error: null,
        url: null,
        type: null
      }

      rerender(<StreamPlayer stream={inactiveStream} />)

      expect(container.firstChild).toBeNull()
    })

    it('should handle stream type changes', () => {
      const hlsStream: StreamState = {
        isLoading: false,
        isActive: true,
        error: null,
        url: 'http://example.com/stream.m3u8',
        type: 'hls'
      }

      const { rerender } = render(<StreamPlayer stream={hlsStream} />)
      expect(document.querySelector('video')).toBeInTheDocument()
      expect(document.querySelector('img')).not.toBeInTheDocument()

      const mjpegStream: StreamState = {
        isLoading: false,
        isActive: true,
        error: null,
        url: 'http://example.com/stream.mjpeg',
        type: 'mjpeg'
      }

      rerender(<StreamPlayer stream={mjpegStream} />)
      expect(document.querySelector('video')).not.toBeInTheDocument()
      expect(document.querySelector('img')).toBeInTheDocument()
    })
  })

  describe('MJPEG Streams', () => {
    it('should render MJPEG as img element', () => {
      const streamState: StreamState = {
        isLoading: false,
        isActive: true,
        error: null,
        url: 'http://example.com/camera_proxy_stream',
        type: 'mjpeg'
      }

      render(<StreamPlayer stream={streamState} />)

      const img = document.querySelector('img')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', 'http://example.com/camera_proxy_stream')
    })

    it('should apply className to MJPEG img', () => {
      const streamState: StreamState = {
        isLoading: false,
        isActive: true,
        error: null,
        url: 'http://example.com/stream.mjpeg',
        type: 'mjpeg'
      }

      render(<StreamPlayer stream={streamState} className="mjpeg-stream" />)

      const img = document.querySelector('img')
      expect(img).toHaveClass('mjpeg-stream')
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing stream type gracefully', () => {
      const streamState: StreamState = {
        isLoading: false,
        isActive: true,
        error: null,
        url: 'http://example.com/stream',
        type: null as any
      }

      const { container } = render(<StreamPlayer stream={streamState} />)
      // Should render video by default for non-mjpeg types
      expect(document.querySelector('video')).toBeInTheDocument()
    })

    it('should handle webrtc type as video', () => {
      const streamState: StreamState = {
        isLoading: false,
        isActive: true,
        error: null,
        url: 'http://example.com/webrtc',
        type: 'webrtc'
      }

      render(<StreamPlayer stream={streamState} />)
      expect(document.querySelector('video')).toBeInTheDocument()
    })
  })
})
