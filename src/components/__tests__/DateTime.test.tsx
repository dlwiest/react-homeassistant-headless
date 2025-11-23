import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DateTime } from '../DateTime'
import { useDateTime } from '../../hooks/useDateTime'
import type { DateTimeState } from '../../types'

// Mock useDateTime hook
vi.mock('../../hooks/useDateTime')

const mockUseDateTime = useDateTime as any

// Mock datetime entity response
const createMockDateTimeEntity = (
  date: Date | null = new Date('2024-01-15T14:30:00Z'),
  isAvailable: boolean = true
): DateTimeState => ({
  entityId: 'sensor.date_time_iso',
  state: date ? date.toISOString() : 'unavailable',
  attributes: {
    friendly_name: 'Date & Time',
    icon: 'mdi:clock'
  },
  lastChanged: new Date(),
  lastUpdated: new Date(),
  isUnavailable: !isAvailable,
  isConnected: true,
  callService: vi.fn(),
  callServiceWithResponse: vi.fn(),
  refresh: vi.fn(),
  date,
  isAvailable
})

describe('DateTime', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseDateTime.mockReturnValue(createMockDateTimeEntity())
  })

  describe('Basic Functionality', () => {
    it('should render children with datetime entity data', () => {
      const testDate = new Date('2024-01-15T14:30:00Z')
      const mockDateTimeEntity = createMockDateTimeEntity(testDate, true)
      mockUseDateTime.mockReturnValue(mockDateTimeEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>DateTime Content</div>)

      render(
        <DateTime>
          {mockChildren}
        </DateTime>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockDateTimeEntity)
    })

    it('should call useDateTime hook', () => {
      render(
        <DateTime>
          {() => <div>Content</div>}
        </DateTime>
      )

      expect(mockUseDateTime).toHaveBeenCalled()
    })

    it('should render children function result', () => {
      const { container } = render(
        <DateTime>
          {() => <div data-testid="datetime-content">Test Content</div>}
        </DateTime>
      )

      expect(container.querySelector('[data-testid="datetime-content"]')).toBeInTheDocument()
    })

    it('should pass date object to children', () => {
      const testDate = new Date('2024-01-15T14:30:00Z')
      mockUseDateTime.mockReturnValue(createMockDateTimeEntity(testDate, true))

      const mockChildren = vi.fn().mockReturnValue(<div>DateTime</div>)

      render(
        <DateTime>
          {mockChildren}
        </DateTime>
      )

      const passedData = mockChildren.mock.calls[0][0]
      expect(passedData.date).toEqual(testDate)
      expect(passedData.isAvailable).toBe(true)
    })
  })

  describe('Unavailable State', () => {
    it('should handle unavailable sensor', () => {
      mockUseDateTime.mockReturnValue(createMockDateTimeEntity(null, false))

      const mockChildren = vi.fn().mockReturnValue(<div>Unavailable</div>)

      render(
        <DateTime>
          {mockChildren}
        </DateTime>
      )

      const passedData = mockChildren.mock.calls[0][0]
      expect(passedData.date).toBeNull()
      expect(passedData.isAvailable).toBe(false)
    })

    it('should allow conditional rendering based on availability', () => {
      mockUseDateTime.mockReturnValue(createMockDateTimeEntity(null, false))

      const { container } = render(
        <DateTime>
          {(datetime) => datetime.isAvailable ? (
            <div data-testid="available">Available</div>
          ) : (
            <div data-testid="unavailable">Unavailable</div>
          )}
        </DateTime>
      )

      expect(container.querySelector('[data-testid="unavailable"]')).toBeInTheDocument()
      expect(container.querySelector('[data-testid="available"]')).not.toBeInTheDocument()
    })
  })

  describe('Entity Properties', () => {
    it('should provide access to all entity properties', () => {
      const testDate = new Date('2024-01-15T14:30:00Z')
      const mockEntity = createMockDateTimeEntity(testDate, true)
      mockUseDateTime.mockReturnValue(mockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Content</div>)

      render(
        <DateTime>
          {mockChildren}
        </DateTime>
      )

      const passedData = mockChildren.mock.calls[0][0]
      expect(passedData.entityId).toBe('sensor.date_time_iso')
      expect(passedData.attributes).toEqual(mockEntity.attributes)
      expect(passedData.lastChanged).toBeDefined()
      expect(passedData.lastUpdated).toBeDefined()
      expect(passedData.isConnected).toBe(true)
    })
  })

  describe('Rendering Patterns', () => {
    it('should support displaying formatted date', () => {
      const testDate = new Date('2024-01-15T14:30:00Z')
      mockUseDateTime.mockReturnValue(createMockDateTimeEntity(testDate, true))

      const { container } = render(
        <DateTime>
          {(datetime) => (
            <div data-testid="formatted-date">
              {datetime.date?.toLocaleDateString()}
            </div>
          )}
        </DateTime>
      )

      const element = container.querySelector('[data-testid="formatted-date"]')
      expect(element).toBeInTheDocument()
      expect(element?.textContent).toBeTruthy()
    })

    it('should support displaying formatted time', () => {
      const testDate = new Date('2024-01-15T14:30:00Z')
      mockUseDateTime.mockReturnValue(createMockDateTimeEntity(testDate, true))

      const { container } = render(
        <DateTime>
          {(datetime) => (
            <div data-testid="formatted-time">
              {datetime.date?.toLocaleTimeString()}
            </div>
          )}
        </DateTime>
      )

      const element = container.querySelector('[data-testid="formatted-time"]')
      expect(element).toBeInTheDocument()
      expect(element?.textContent).toBeTruthy()
    })

    it('should handle null date gracefully', () => {
      mockUseDateTime.mockReturnValue(createMockDateTimeEntity(null, false))

      const { container } = render(
        <DateTime>
          {(datetime) => (
            <div data-testid="safe-render">
              {datetime.date ? datetime.date.toLocaleString() : 'No time available'}
            </div>
          )}
        </DateTime>
      )

      const element = container.querySelector('[data-testid="safe-render"]')
      expect(element).toBeInTheDocument()
      expect(element?.textContent).toBe('No time available')
    })
  })
})
