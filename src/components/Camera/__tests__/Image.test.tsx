import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Image } from '../Image'

describe('Camera.Image', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render img with correct URL', () => {
      render(<Image url="http://example.com/camera.jpg" />)

      const img = screen.getByRole('img')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', 'http://example.com/camera.jpg')
    })

    it('should return null when URL is null', () => {
      const { container } = render(<Image url={null} />)
      expect(container.firstChild).toBeNull()
    })

    it('should apply custom alt text', () => {
      render(<Image url="http://example.com/camera.jpg" alt="Front door camera" />)

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('alt', 'Front door camera')
    })

    it('should apply className', () => {
      render(<Image url="http://example.com/camera.jpg" className="custom-camera-image" />)

      const img = screen.getByRole('img')
      expect(img).toHaveClass('custom-camera-image')
    })
  })

  describe('Error Handling', () => {
    it('should hide image on error', () => {
      const { container } = render(<Image url="http://example.com/broken.jpg" />)

      const img = screen.getByRole('img')
      expect(img).toBeInTheDocument()

      // Simulate error
      fireEvent.error(img)

      // Image should be removed from DOM
      expect(container.firstChild).toBeNull()
    })

    it('should call onError callback when error occurs', () => {
      const onError = vi.fn()
      render(<Image url="http://example.com/broken.jpg" onError={onError} />)

      const img = screen.getByRole('img')
      fireEvent.error(img)

      expect(onError).toHaveBeenCalledTimes(1)
    })

    it('should not call onError if callback not provided', () => {
      const { container } = render(<Image url="http://example.com/broken.jpg" />)

      const img = screen.getByRole('img')

      // Should not throw
      expect(() => {
        fireEvent.error(img)
      }).not.toThrow()

      expect(container.firstChild).toBeNull()
    })

    it('should not re-render image after error', () => {
      const { rerender, container } = render(<Image url="http://example.com/broken.jpg" />)

      const img = screen.getByRole('img')
      fireEvent.error(img)

      expect(container.firstChild).toBeNull()

      // Try to re-render with same URL
      rerender(<Image url="http://example.com/broken.jpg" />)

      // Should still be null (error state persists)
      expect(container.firstChild).toBeNull()
    })

    it('should render new image when URL changes after error', () => {
      const { rerender, container } = render(<Image url="http://example.com/broken.jpg" />)

      const img = screen.getByRole('img')
      fireEvent.error(img)

      // After error, image is removed
      expect(container.firstChild).toBeNull()

      // URL changes - component key changes, should render fresh
      rerender(<Image url="http://example.com/working.jpg" />)

      // Check if new image rendered (error state is per-URL)
      const newImg = screen.queryByRole('img')
      expect(newImg).toBeInTheDocument()
      expect(newImg).toHaveAttribute('src', 'http://example.com/working.jpg')
    })
  })

  describe('URL Changes', () => {
    it('should update src when URL changes', () => {
      const { rerender } = render(<Image url="http://example.com/camera1.jpg" />)

      let img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', 'http://example.com/camera1.jpg')

      rerender(<Image url="http://example.com/camera2.jpg" />)

      img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', 'http://example.com/camera2.jpg')
    })

    it('should remove image when URL becomes null', () => {
      const { rerender, container } = render(<Image url="http://example.com/camera.jpg" />)

      expect(screen.getByRole('img')).toBeInTheDocument()

      rerender(<Image url={null} />)

      expect(container.firstChild).toBeNull()
    })

    it('should render image when URL changes from null to valid', () => {
      const { rerender } = render(<Image url={null} />)

      expect(screen.queryByRole('img')).not.toBeInTheDocument()

      rerender(<Image url="http://example.com/camera.jpg" />)

      const img = screen.getByRole('img')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', 'http://example.com/camera.jpg')
    })
  })

  describe('Props Validation', () => {
    it('should handle empty string URL as falsy', () => {
      const { container } = render(<Image url="" />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long URLs', () => {
      const longUrl = 'http://example.com/' + 'a'.repeat(1000) + '.jpg'
      render(<Image url={longUrl} />)

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', longUrl)
    })

    it('should handle URLs with special characters', () => {
      const specialUrl = 'http://example.com/camera?token=abc123&timestamp=2024-01-01T00:00:00.000Z'
      render(<Image url={specialUrl} />)

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', specialUrl)
    })

    it('should handle data URLs', () => {
      const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      render(<Image url={dataUrl} />)

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', dataUrl)
    })
  })
})
