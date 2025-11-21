import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Cover } from '../Cover'
import { useCover } from '../../hooks/useCover'
import type { CoverState } from '../../hooks/useCover'

// Mock useCover hook
vi.mock('../../hooks/useCover')

const mockUseCover = useCover as any

// Mock cover entity response
const createMockCoverEntity = (
  entityId: string = 'cover.test',
  state: string = 'closed',
  attributes: Record<string, any> = {}
) => ({
  entityId,
  state,
  attributes,
  lastChanged: new Date(),
  lastUpdated: new Date(),
  isUnavailable: state === 'unavailable',
  isConnected: true,
  callService: vi.fn(),
  callServiceWithResponse: vi.fn(),
  refresh: vi.fn(),
  isOpen: state === 'open',
  isClosed: state === 'closed',
  isOpening: state === 'opening',
  isClosing: state === 'closing',
  position: attributes.current_position,
  open: vi.fn(),
  close: vi.fn(),
  stop: vi.fn(),
  setPosition: vi.fn()
})

describe('Cover', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseCover.mockReturnValue(createMockCoverEntity())
  })

  describe('Basic Functionality', () => {
    it('should render children with cover entity data', () => {
      const mockCoverEntity = createMockCoverEntity('cover.garage_door', 'closed')
      mockUseCover.mockReturnValue(mockCoverEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Cover Content</div>)

      render(
        <Cover entityId="cover.garage_door">
          {mockChildren}
        </Cover>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockCoverEntity)
    })

    it('should pass correct entityId to useCover hook', () => {
      const entityId = 'cover.bedroom_blinds'
      
      render(
        <Cover entityId={entityId}>
          {() => <div>Content</div>}
        </Cover>
      )

      expect(mockUseCover).toHaveBeenCalledWith(entityId)
    })

    it('should render children function result', () => {
      const { container } = render(
        <Cover entityId="cover.test">
          {() => <div data-testid="cover-content">Cover Control</div>}
        </Cover>
      )

      expect(container.querySelector('[data-testid="cover-content"]')).toBeInTheDocument()
      expect(container.textContent).toBe('Cover Control')
    })
  })

  describe('Cover State Handling', () => {
    it('should handle cover in open state', () => {
      const mockCoverEntity = createMockCoverEntity('cover.test', 'open')
      mockUseCover.mockReturnValue(mockCoverEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Cover Open</div>)

      render(
        <Cover entityId="cover.test">
          {mockChildren}
        </Cover>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockCoverEntity)
      expect(mockCoverEntity.state).toBe('open')
      expect(mockCoverEntity.isOpen).toBe(true)
      expect(mockCoverEntity.isClosed).toBe(false)
    })

    it('should handle cover in closed state', () => {
      const mockCoverEntity = createMockCoverEntity('cover.test', 'closed')
      mockUseCover.mockReturnValue(mockCoverEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Cover Closed</div>)

      render(
        <Cover entityId="cover.test">
          {mockChildren}
        </Cover>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockCoverEntity)
      expect(mockCoverEntity.state).toBe('closed')
      expect(mockCoverEntity.isOpen).toBe(false)
      expect(mockCoverEntity.isClosed).toBe(true)
    })

    it('should handle cover in opening state', () => {
      const mockCoverEntity = createMockCoverEntity('cover.test', 'opening')
      mockUseCover.mockReturnValue(mockCoverEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Cover Opening</div>)

      render(
        <Cover entityId="cover.test">
          {mockChildren}
        </Cover>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockCoverEntity)
      expect(mockCoverEntity.state).toBe('opening')
      expect(mockCoverEntity.isOpening).toBe(true)
      expect(mockCoverEntity.isOpen).toBe(false)
      expect(mockCoverEntity.isClosed).toBe(false)
    })

    it('should handle cover in closing state', () => {
      const mockCoverEntity = createMockCoverEntity('cover.test', 'closing')
      mockUseCover.mockReturnValue(mockCoverEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Cover Closing</div>)

      render(
        <Cover entityId="cover.test">
          {mockChildren}
        </Cover>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockCoverEntity)
      expect(mockCoverEntity.state).toBe('closing')
      expect(mockCoverEntity.isClosing).toBe(true)
      expect(mockCoverEntity.isOpen).toBe(false)
      expect(mockCoverEntity.isClosed).toBe(false)
    })

    it('should handle unavailable cover', () => {
      const mockCoverEntity = createMockCoverEntity('cover.test', 'unavailable')
      mockUseCover.mockReturnValue(mockCoverEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Cover Unavailable</div>)

      render(
        <Cover entityId="cover.test">
          {mockChildren}
        </Cover>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockCoverEntity)
      expect(mockCoverEntity.state).toBe('unavailable')
      expect(mockCoverEntity.isUnavailable).toBe(true)
    })

    it('should handle cover with position', () => {
      const mockCoverEntity = createMockCoverEntity('cover.test', 'open', { current_position: 75 })
      mockUseCover.mockReturnValue(mockCoverEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Cover Position</div>)

      render(
        <Cover entityId="cover.test">
          {mockChildren}
        </Cover>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockCoverEntity)
      expect(mockCoverEntity.position).toBe(75)
    })
  })

  describe('Cover Control Actions', () => {
    it('should support opening cover', () => {
      const mockOpen = vi.fn()
      const mockCoverEntity = createMockCoverEntity('cover.test', 'closed')
      mockCoverEntity.open = mockOpen
      mockUseCover.mockReturnValue(mockCoverEntity)

      const { getByTestId } = render(
        <Cover entityId="cover.test">
          {(cover) => (
            <button data-testid="open" onClick={() => cover.open()}>
              Open
            </button>
          )}
        </Cover>
      )

      fireEvent.click(getByTestId('open'))

      expect(mockOpen).toHaveBeenCalled()
    })

    it('should support closing cover', () => {
      const mockClose = vi.fn()
      const mockCoverEntity = createMockCoverEntity('cover.test', 'open')
      mockCoverEntity.close = mockClose
      mockUseCover.mockReturnValue(mockCoverEntity)

      const { getByTestId } = render(
        <Cover entityId="cover.test">
          {(cover) => (
            <button data-testid="close" onClick={() => cover.close()}>
              Close
            </button>
          )}
        </Cover>
      )

      fireEvent.click(getByTestId('close'))

      expect(mockClose).toHaveBeenCalled()
    })

    it('should support stopping cover', () => {
      const mockStop = vi.fn()
      const mockCoverEntity = createMockCoverEntity('cover.test', 'opening')
      mockCoverEntity.stop = mockStop
      mockUseCover.mockReturnValue(mockCoverEntity)

      const { getByTestId } = render(
        <Cover entityId="cover.test">
          {(cover) => (
            <button data-testid="stop" onClick={() => cover.stop()}>
              Stop
            </button>
          )}
        </Cover>
      )

      fireEvent.click(getByTestId('stop'))

      expect(mockStop).toHaveBeenCalled()
    })

    it('should support setting cover position', () => {
      const mockSetPosition = vi.fn()
      const mockCoverEntity = createMockCoverEntity('cover.test', 'open')
      mockCoverEntity.setPosition = mockSetPosition
      mockUseCover.mockReturnValue(mockCoverEntity)

      const { getByTestId } = render(
        <Cover entityId="cover.test">
          {(cover) => (
            <button data-testid="set-position" onClick={() => cover.setPosition(50)}>
              Set Position 50%
            </button>
          )}
        </Cover>
      )

      fireEvent.click(getByTestId('set-position'))

      expect(mockSetPosition).toHaveBeenCalledWith(50)
    })

  })

  describe('Children Function Patterns', () => {
    it('should support conditional rendering based on cover state', () => {
      const mockCoverEntity = createMockCoverEntity('cover.test', 'open')
      mockUseCover.mockReturnValue(mockCoverEntity)

      const { container } = render(
        <Cover entityId="cover.test">
          {(cover) => (
            cover.isOpen 
              ? <div data-testid="cover-open">Cover is OPEN</div>
              : <div data-testid="cover-closed">Cover is CLOSED</div>
          )}
        </Cover>
      )

      expect(container.querySelector('[data-testid="cover-open"]')).toBeInTheDocument()
      expect(container.querySelector('[data-testid="cover-closed"]')).not.toBeInTheDocument()
    })

    it('should support rendering cover attributes', () => {
      const mockCoverEntity = createMockCoverEntity(
        'cover.bedroom_blinds', 
        'open', 
        { 
          friendly_name: 'Bedroom Blinds',
          current_position: 85,
          device_class: 'blind'
        }
      )
      mockUseCover.mockReturnValue(mockCoverEntity)

      const { container } = render(
        <Cover entityId="cover.bedroom_blinds">
          {(cover) => (
            <div data-testid="cover-info">
              {cover.attributes.friendly_name as string}: {cover.position}%
            </div>
          )}
        </Cover>
      )

      expect(container.textContent).toBe('Bedroom Blinds: 85%')
    })

    it('should support complex cover controls', () => {
      const mockOpen = vi.fn()
      const mockClose = vi.fn()
      const mockStop = vi.fn()
      const mockSetPosition = vi.fn()
      const mockCoverEntity = createMockCoverEntity('cover.test', 'closed')
      mockCoverEntity.open = mockOpen
      mockCoverEntity.close = mockClose
      mockCoverEntity.stop = mockStop
      mockCoverEntity.setPosition = mockSetPosition
      mockUseCover.mockReturnValue(mockCoverEntity)

      const { getByTestId } = render(
        <Cover entityId="cover.test">
          {(cover) => (
            <div>
              <div data-testid="status">
                Status: {cover.isClosed ? 'CLOSED' : cover.isOpen ? 'OPEN' : 'MOVING'}
              </div>
              <div>
                <button onClick={() => cover.open()}>Open</button>
                <button onClick={() => cover.close()}>Close</button>
                <button onClick={() => cover.stop()}>Stop</button>
                <button onClick={() => cover.setPosition(50)}>50%</button>
              </div>
            </div>
          )}
        </Cover>
      )

      expect(getByTestId('status').textContent).toBe('Status: CLOSED')
    })

    it('should support checking connection status', () => {
      const mockCoverEntity = createMockCoverEntity('cover.test', 'open')
      mockCoverEntity.isConnected = false
      mockUseCover.mockReturnValue(mockCoverEntity)

      const { container } = render(
        <Cover entityId="cover.test">
          {(cover) => (
            <div data-testid="connection-status">
              {cover.isConnected ? 'Connected' : 'Disconnected'}
            </div>
          )}
        </Cover>
      )

      expect(container.textContent).toBe('Disconnected')
    })
  })

  describe('Edge Cases', () => {
    it('should handle cover with no attributes', () => {
      const mockCoverEntity = createMockCoverEntity('cover.test', 'open', {})
      mockUseCover.mockReturnValue(mockCoverEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>No Attributes</div>)

      render(
        <Cover entityId="cover.test">
          {mockChildren}
        </Cover>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockCoverEntity)
      expect(mockCoverEntity.attributes).toEqual({})
    })

    it('should handle cover with special entityId characters', () => {
      const specialEntityId = 'cover.garage_door-main'
      
      render(
        <Cover entityId={specialEntityId}>
          {() => <div>Special ID</div>}
        </Cover>
      )

      expect(mockUseCover).toHaveBeenCalledWith(specialEntityId)
    })

    it('should re-render when entityId prop changes', () => {
      const mockChildren = vi.fn().mockReturnValue(<div>Content</div>)
      
      const { rerender } = render(
        <Cover entityId="cover.test1">
          {mockChildren}
        </Cover>
      )

      expect(mockUseCover).toHaveBeenLastCalledWith('cover.test1')

      rerender(
        <Cover entityId="cover.test2">
          {mockChildren}
        </Cover>
      )

      expect(mockUseCover).toHaveBeenLastCalledWith('cover.test2')
    })

    it('should handle cover state changes during operation', () => {
      // Start with cover closed
      let mockCoverEntity = createMockCoverEntity('cover.test', 'closed')
      mockUseCover.mockReturnValue(mockCoverEntity)

      const { container, rerender } = render(
        <Cover entityId="cover.test">
          {(cover) => (
            <div data-testid="cover-state">
              {cover.isClosed ? 'CLOSED' : cover.isOpen ? 'OPEN' : 'MOVING'}
            </div>
          )}
        </Cover>
      )

      expect(container.querySelector('[data-testid="cover-state"]')?.textContent).toBe('CLOSED')

      // Cover starts opening
      mockCoverEntity = createMockCoverEntity('cover.test', 'opening')
      mockUseCover.mockReturnValue(mockCoverEntity)
      rerender(
        <Cover entityId="cover.test">
          {(cover) => (
            <div data-testid="cover-state">
              {cover.isClosed ? 'CLOSED' : cover.isOpen ? 'OPEN' : 'MOVING'}
            </div>
          )}
        </Cover>
      )

      expect(container.querySelector('[data-testid="cover-state"]')?.textContent).toBe('MOVING')

      // Cover becomes open
      mockCoverEntity = createMockCoverEntity('cover.test', 'open')
      mockUseCover.mockReturnValue(mockCoverEntity)
      rerender(
        <Cover entityId="cover.test">
          {(cover) => (
            <div data-testid="cover-state">
              {cover.isClosed ? 'CLOSED' : cover.isOpen ? 'OPEN' : 'MOVING'}
            </div>
          )}
        </Cover>
      )

      expect(container.querySelector('[data-testid="cover-state"]')?.textContent).toBe('OPEN')
    })

    it('should handle cover without position support', () => {
      const mockCoverEntity = createMockCoverEntity('cover.test', 'open', {})
      mockUseCover.mockReturnValue(mockCoverEntity)

      const { container } = render(
        <Cover entityId="cover.test">
          {(cover) => (
            <div data-testid="position">
              Position: {cover.position !== undefined ? `${cover.position}%` : 'Unknown'}
            </div>
          )}
        </Cover>
      )

      expect(container.textContent).toBe('Position: Unknown')
    })
  })

  describe('Integration', () => {
    it('should inherit all base entity properties', () => {
      const mockCoverEntity = createMockCoverEntity('cover.test', 'open', {
        friendly_name: 'Test Cover',
        current_position: 50
      })
      mockUseCover.mockReturnValue(mockCoverEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Cover</div>)

      render(
        <Cover entityId="cover.test">
          {mockChildren}
        </Cover>
      )

      const passedEntity = mockChildren.mock.calls[0][0]
      
      // Should have all base entity properties
      expect(passedEntity.entityId).toBe('cover.test')
      expect(passedEntity.state).toBe('open')
      expect(passedEntity.attributes).toBeDefined()
      expect(passedEntity.lastChanged).toBeDefined()
      expect(passedEntity.lastUpdated).toBeDefined()
      expect(passedEntity.isUnavailable).toBeDefined()
      expect(passedEntity.isConnected).toBeDefined()
      expect(passedEntity.callService).toBeDefined()
      expect(passedEntity.refresh).toBeDefined()
      
      // Plus cover-specific properties
      expect(passedEntity.isOpen).toBeDefined()
      expect(passedEntity.isClosed).toBeDefined()
      expect(passedEntity.isOpening).toBeDefined()
      expect(passedEntity.isClosing).toBeDefined()
      expect(passedEntity.position).toBeDefined()
      expect(passedEntity.open).toBeDefined()
      expect(passedEntity.close).toBeDefined()
      expect(passedEntity.stop).toBeDefined()
      expect(passedEntity.setPosition).toBeDefined()
    })
  })
})