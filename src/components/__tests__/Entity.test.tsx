import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Entity from '../Entity'
import { useEntity } from '../../hooks/useEntity'
import type { BaseEntityHook } from '../../types'

// Mock useEntity hook
vi.mock('../../hooks/useEntity')

const mockUseEntity = useEntity as any

// Mock entity response
const createMockEntity = (
  entityId: string = 'sensor.test',
  state: string = 'on',
  attributes: Record<string, any> = {}
): BaseEntityHook => ({
  entityId,
  state,
  attributes,
  lastChanged: new Date(),
  lastUpdated: new Date(),
  isUnavailable: state === 'unavailable',
  isConnected: true,
  callService: vi.fn(),
  refresh: vi.fn()
})

describe('Entity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseEntity.mockReturnValue(createMockEntity())
  })

  describe('Basic Functionality', () => {
    it('should render children with entity data', () => {
      const mockEntity = createMockEntity('sensor.temperature', '23.5', { unit: '°C' })
      mockUseEntity.mockReturnValue(mockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Test Content</div>)

      render(
        <Entity entityId="sensor.temperature">
          {mockChildren}
        </Entity>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockEntity)
    })

    it('should pass correct entityId to useEntity hook', () => {
      const entityId = 'light.living_room'
      
      render(
        <Entity entityId={entityId}>
          {() => <div>Content</div>}
        </Entity>
      )

      expect(mockUseEntity).toHaveBeenCalledWith(entityId)
    })

    it('should render children function result', () => {
      const { container } = render(
        <Entity entityId="sensor.test">
          {() => <div data-testid="child-content">Hello World</div>}
        </Entity>
      )

      expect(container.querySelector('[data-testid="child-content"]')).toBeInTheDocument()
      expect(container.textContent).toBe('Hello World')
    })
  })

  describe('Entity State Handling', () => {
    it('should handle entity in on state', () => {
      const mockEntity = createMockEntity('switch.test', 'on')
      mockUseEntity.mockReturnValue(mockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Switch On</div>)

      render(
        <Entity entityId="switch.test">
          {mockChildren}
        </Entity>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockEntity)
      expect(mockEntity.state).toBe('on')
      expect(mockEntity.isUnavailable).toBe(false)
    })

    it('should handle entity in off state', () => {
      const mockEntity = createMockEntity('switch.test', 'off')
      mockUseEntity.mockReturnValue(mockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Switch Off</div>)

      render(
        <Entity entityId="switch.test">
          {mockChildren}
        </Entity>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockEntity)
      expect(mockEntity.state).toBe('off')
      expect(mockEntity.isUnavailable).toBe(false)
    })

    it('should handle unavailable entity', () => {
      const mockEntity = createMockEntity('sensor.test', 'unavailable')
      mockUseEntity.mockReturnValue(mockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Unavailable</div>)

      render(
        <Entity entityId="sensor.test">
          {mockChildren}
        </Entity>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockEntity)
      expect(mockEntity.state).toBe('unavailable')
      expect(mockEntity.isUnavailable).toBe(true)
    })

    it('should handle entity with complex attributes', () => {
      const complexAttributes = {
        friendly_name: 'Living Room Temperature',
        unit_of_measurement: '°C',
        device_class: 'temperature',
        state_class: 'measurement'
      }
      const mockEntity = createMockEntity('sensor.temperature', '22.1', complexAttributes)
      mockUseEntity.mockReturnValue(mockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Temperature Sensor</div>)

      render(
        <Entity entityId="sensor.temperature">
          {mockChildren}
        </Entity>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockEntity)
      expect(mockEntity.attributes).toEqual(complexAttributes)
    })
  })

  describe('Children Function Patterns', () => {
    it('should support conditional rendering based on entity state', () => {
      const mockEntity = createMockEntity('light.test', 'on', { brightness: 255 })
      mockUseEntity.mockReturnValue(mockEntity)

      const { container } = render(
        <Entity entityId="light.test">
          {(entity) => (
            entity.state === 'on' 
              ? <div data-testid="light-on">Light is On</div>
              : <div data-testid="light-off">Light is Off</div>
          )}
        </Entity>
      )

      expect(container.querySelector('[data-testid="light-on"]')).toBeInTheDocument()
      expect(container.querySelector('[data-testid="light-off"]')).not.toBeInTheDocument()
    })

    it('should support rendering entity attributes', () => {
      const mockEntity = createMockEntity(
        'sensor.temperature', 
        '23.5', 
        { unit_of_measurement: '°C', friendly_name: 'Room Temperature' }
      )
      mockUseEntity.mockReturnValue(mockEntity)

      const { container } = render(
        <Entity entityId="sensor.temperature">
          {(entity) => (
            <div data-testid="sensor-display">
              {entity.attributes.friendly_name}: {entity.state}{entity.attributes.unit_of_measurement}
            </div>
          )}
        </Entity>
      )

      expect(container.textContent).toBe('Room Temperature: 23.5°C')
    })

    it('should support calling entity methods', () => {
      const mockCallService = vi.fn()
      const mockRefresh = vi.fn()
      const mockEntity = createMockEntity('switch.test', 'off')
      mockEntity.callService = mockCallService
      mockEntity.refresh = mockRefresh
      mockUseEntity.mockReturnValue(mockEntity)

      const { getByTestId } = render(
        <Entity entityId="switch.test">
          {(entity) => (
            <div>
              <button data-testid="call-service" onClick={() => entity.callService('switch', 'turn_on')}>
                Turn On
              </button>
              <button data-testid="refresh" onClick={() => entity.refresh()}>
                Refresh
              </button>
            </div>
          )}
        </Entity>
      )

      getByTestId('call-service').click()
      getByTestId('refresh').click()

      expect(mockCallService).toHaveBeenCalledWith('switch', 'turn_on')
      expect(mockRefresh).toHaveBeenCalled()
    })

    it('should support checking connection status', () => {
      const mockEntity = createMockEntity('sensor.test', '42')
      mockEntity.isConnected = false
      mockUseEntity.mockReturnValue(mockEntity)

      const { container } = render(
        <Entity entityId="sensor.test">
          {(entity) => (
            <div data-testid="connection-status">
              {entity.isConnected ? 'Connected' : 'Disconnected'}
            </div>
          )}
        </Entity>
      )

      expect(container.textContent).toBe('Disconnected')
    })

    it('should support accessing timestamps', () => {
      const lastChanged = new Date('2023-01-01T12:00:00Z')
      const lastUpdated = new Date('2023-01-01T12:05:00Z')
      const mockEntity = createMockEntity('sensor.test', 'on')
      mockEntity.lastChanged = lastChanged
      mockEntity.lastUpdated = lastUpdated
      mockUseEntity.mockReturnValue(mockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Timestamps</div>)

      render(
        <Entity entityId="sensor.test">
          {mockChildren}
        </Entity>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockEntity)
      expect(mockEntity.lastChanged).toBe(lastChanged)
      expect(mockEntity.lastUpdated).toBe(lastUpdated)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty entity attributes', () => {
      const mockEntity = createMockEntity('sensor.test', 'unknown', {})
      mockUseEntity.mockReturnValue(mockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>No Attributes</div>)

      render(
        <Entity entityId="sensor.test">
          {mockChildren}
        </Entity>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockEntity)
      expect(mockEntity.attributes).toEqual({})
    })

    it('should handle null/undefined attribute values', () => {
      const mockEntity = createMockEntity('sensor.test', 'on', {
        brightness: null,
        color: undefined,
        effect: 'none'
      })
      mockUseEntity.mockReturnValue(mockEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Mixed Attributes</div>)

      render(
        <Entity entityId="sensor.test">
          {mockChildren}
        </Entity>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockEntity)
      expect(mockEntity.attributes.brightness).toBeNull()
      expect(mockEntity.attributes.color).toBeUndefined()
      expect(mockEntity.attributes.effect).toBe('none')
    })

    it('should handle entity with special characters in entityId', () => {
      const specialEntityId = 'sensor.test_sensor-2'
      
      render(
        <Entity entityId={specialEntityId}>
          {() => <div>Special ID</div>}
        </Entity>
      )

      expect(mockUseEntity).toHaveBeenCalledWith(specialEntityId)
    })

    it('should re-render when entityId prop changes', () => {
      const mockChildren = vi.fn().mockReturnValue(<div>Content</div>)
      
      const { rerender } = render(
        <Entity entityId="sensor.test1">
          {mockChildren}
        </Entity>
      )

      expect(mockUseEntity).toHaveBeenLastCalledWith('sensor.test1')

      rerender(
        <Entity entityId="sensor.test2">
          {mockChildren}
        </Entity>
      )

      expect(mockUseEntity).toHaveBeenLastCalledWith('sensor.test2')
    })
  })

  describe('Performance', () => {
    it('should not re-render unnecessarily when children function is stable', () => {
      const stableChildren = vi.fn().mockReturnValue(<div>Stable</div>)
      
      const { rerender } = render(
        <Entity entityId="sensor.test">
          {stableChildren}
        </Entity>
      )

      const firstCallCount = stableChildren.mock.calls.length

      // Re-render with same props
      rerender(
        <Entity entityId="sensor.test">
          {stableChildren}
        </Entity>
      )

      // Should only be called once more (for the re-render), not multiple times
      expect(stableChildren.mock.calls.length).toBe(firstCallCount + 1)
    })
  })
})