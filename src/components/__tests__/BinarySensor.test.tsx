import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BinarySensor } from '../BinarySensor'
import { useBinarySensor } from '../../hooks/useBinarySensor'
import type { BinarySensorState } from '../../types'

// Mock useBinarySensor hook
vi.mock('../../hooks/useBinarySensor')

const mockUseBinarySensor = useBinarySensor as any

// Mock binary sensor entity response
const createMockBinarySensorEntity = (
  entityId: string = 'binary_sensor.test',
  state: string = 'off',
  attributes: Record<string, any> = {}
): BinarySensorState => ({
  entityId,
  state,
  attributes,
  lastChanged: new Date(),
  lastUpdated: new Date(),
  isUnavailable: state === 'unavailable',
  isConnected: true,
  callService: vi.fn(),
  refresh: vi.fn(),
  isOn: state === 'on',
  isOff: state === 'off',
  deviceClass: attributes.device_class,
  icon: attributes.icon
})

describe('BinarySensor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseBinarySensor.mockReturnValue(createMockBinarySensorEntity())
  })

  describe('Basic Functionality', () => {
    it('should render children with binary sensor entity data', () => {
      const mockBinarySensorEntity = createMockBinarySensorEntity(
        'binary_sensor.kitchen_door', 
        'on', 
        { device_class: 'door' }
      )
      mockUseBinarySensor.mockReturnValue(mockBinarySensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Binary Sensor Content</div>)

      render(
        <BinarySensor entityId="binary_sensor.kitchen_door">
          {mockChildren}
        </BinarySensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockBinarySensorEntity)
    })

    it('should pass correct entityId to useBinarySensor hook', () => {
      const entityId = 'binary_sensor.motion_sensor'
      
      render(
        <BinarySensor entityId={entityId}>
          {() => <div>Content</div>}
        </BinarySensor>
      )

      expect(mockUseBinarySensor).toHaveBeenCalledWith(entityId)
    })

    it('should render children function result', () => {
      const { container } = render(
        <BinarySensor entityId="binary_sensor.test">
          {() => <div data-testid="binary-sensor-content">Binary Sensor Control</div>}
        </BinarySensor>
      )

      expect(container.querySelector('[data-testid="binary-sensor-content"]')).toBeInTheDocument()
      expect(container.textContent).toBe('Binary Sensor Control')
    })
  })

  describe('Binary Sensor State Handling', () => {
    it('should handle binary sensor in on state', () => {
      const mockBinarySensorEntity = createMockBinarySensorEntity('binary_sensor.test', 'on')
      mockUseBinarySensor.mockReturnValue(mockBinarySensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Sensor On</div>)

      render(
        <BinarySensor entityId="binary_sensor.test">
          {mockChildren}
        </BinarySensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockBinarySensorEntity)
      expect(mockBinarySensorEntity.state).toBe('on')
      expect(mockBinarySensorEntity.isOn).toBe(true)
      expect(mockBinarySensorEntity.isOff).toBe(false)
    })

    it('should handle binary sensor in off state', () => {
      const mockBinarySensorEntity = createMockBinarySensorEntity('binary_sensor.test', 'off')
      mockUseBinarySensor.mockReturnValue(mockBinarySensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Sensor Off</div>)

      render(
        <BinarySensor entityId="binary_sensor.test">
          {mockChildren}
        </BinarySensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockBinarySensorEntity)
      expect(mockBinarySensorEntity.state).toBe('off')
      expect(mockBinarySensorEntity.isOn).toBe(false)
      expect(mockBinarySensorEntity.isOff).toBe(true)
    })

    it('should handle unavailable binary sensor', () => {
      const mockBinarySensorEntity = createMockBinarySensorEntity('binary_sensor.test', 'unavailable')
      mockUseBinarySensor.mockReturnValue(mockBinarySensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Sensor Unavailable</div>)

      render(
        <BinarySensor entityId="binary_sensor.test">
          {mockChildren}
        </BinarySensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockBinarySensorEntity)
      expect(mockBinarySensorEntity.state).toBe('unavailable')
      expect(mockBinarySensorEntity.isUnavailable).toBe(true)
      expect(mockBinarySensorEntity.isOn).toBe(false)
      expect(mockBinarySensorEntity.isOff).toBe(false)
    })
  })

  describe('Device Class Handling', () => {
    it('should handle door device class', () => {
      const mockBinarySensorEntity = createMockBinarySensorEntity(
        'binary_sensor.door', 
        'on', 
        { device_class: 'door', friendly_name: 'Kitchen Door' }
      )
      mockUseBinarySensor.mockReturnValue(mockBinarySensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Door Sensor</div>)

      render(
        <BinarySensor entityId="binary_sensor.door">
          {mockChildren}
        </BinarySensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockBinarySensorEntity)
      expect(mockBinarySensorEntity.deviceClass).toBe('door')
      expect(mockBinarySensorEntity.isOn).toBe(true) // Door open
    })

    it('should handle motion device class', () => {
      const mockBinarySensorEntity = createMockBinarySensorEntity(
        'binary_sensor.motion', 
        'on', 
        { device_class: 'motion', friendly_name: 'Living Room Motion' }
      )
      mockUseBinarySensor.mockReturnValue(mockBinarySensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Motion Sensor</div>)

      render(
        <BinarySensor entityId="binary_sensor.motion">
          {mockChildren}
        </BinarySensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockBinarySensorEntity)
      expect(mockBinarySensorEntity.deviceClass).toBe('motion')
      expect(mockBinarySensorEntity.isOn).toBe(true) // Motion detected
    })

    it('should handle window device class', () => {
      const mockBinarySensorEntity = createMockBinarySensorEntity(
        'binary_sensor.window', 
        'off', 
        { device_class: 'window', friendly_name: 'Bedroom Window' }
      )
      mockUseBinarySensor.mockReturnValue(mockBinarySensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Window Sensor</div>)

      render(
        <BinarySensor entityId="binary_sensor.window">
          {mockChildren}
        </BinarySensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockBinarySensorEntity)
      expect(mockBinarySensorEntity.deviceClass).toBe('window')
      expect(mockBinarySensorEntity.isOff).toBe(true) // Window closed
    })

    it('should handle occupancy device class', () => {
      const mockBinarySensorEntity = createMockBinarySensorEntity(
        'binary_sensor.occupancy', 
        'on', 
        { device_class: 'occupancy', friendly_name: 'Office Occupancy' }
      )
      mockUseBinarySensor.mockReturnValue(mockBinarySensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Occupancy Sensor</div>)

      render(
        <BinarySensor entityId="binary_sensor.occupancy">
          {mockChildren}
        </BinarySensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockBinarySensorEntity)
      expect(mockBinarySensorEntity.deviceClass).toBe('occupancy')
      expect(mockBinarySensorEntity.isOn).toBe(true) // Room occupied
    })
  })

  describe('Children Function Patterns', () => {
    it('should support conditional rendering based on binary sensor state', () => {
      const mockBinarySensorEntity = createMockBinarySensorEntity('binary_sensor.test', 'on')
      mockUseBinarySensor.mockReturnValue(mockBinarySensorEntity)

      const { container } = render(
        <BinarySensor entityId="binary_sensor.test">
          {(binarySensor) => (
            binarySensor.isOn 
              ? <div data-testid="sensor-on">Sensor is ON</div>
              : <div data-testid="sensor-off">Sensor is OFF</div>
          )}
        </BinarySensor>
      )

      expect(container.querySelector('[data-testid="sensor-on"]')).toBeInTheDocument()
      expect(container.querySelector('[data-testid="sensor-off"]')).not.toBeInTheDocument()
    })

    it('should support rendering sensor attributes', () => {
      const mockBinarySensorEntity = createMockBinarySensorEntity(
        'binary_sensor.door', 
        'on', 
        { 
          friendly_name: 'Kitchen Door',
          device_class: 'door',
          icon: 'mdi:door'
        }
      )
      mockUseBinarySensor.mockReturnValue(mockBinarySensorEntity)

      const { container } = render(
        <BinarySensor entityId="binary_sensor.door">
          {(binarySensor) => (
            <div data-testid="sensor-info">
              {binarySensor.attributes.friendly_name as string}: {binarySensor.isOn ? 'Open' : 'Closed'}
            </div>
          )}
        </BinarySensor>
      )

      expect(container.textContent).toBe('Kitchen Door: Open')
    })

    it('should support checking device class', () => {
      const mockBinarySensorEntity = createMockBinarySensorEntity(
        'binary_sensor.motion', 
        'on', 
        { device_class: 'motion' }
      )
      mockUseBinarySensor.mockReturnValue(mockBinarySensorEntity)

      const { container } = render(
        <BinarySensor entityId="binary_sensor.motion">
          {(binarySensor) => (
            <div data-testid="device-type">
              {binarySensor.deviceClass === 'motion' ? 'Motion Detected' : 'Other Sensor'}
            </div>
          )}
        </BinarySensor>
      )

      expect(container.textContent).toBe('Motion Detected')
    })

    it('should support checking connection status', () => {
      const mockBinarySensorEntity = createMockBinarySensorEntity('binary_sensor.test', 'on')
      mockBinarySensorEntity.isConnected = false
      mockUseBinarySensor.mockReturnValue(mockBinarySensorEntity)

      const { container } = render(
        <BinarySensor entityId="binary_sensor.test">
          {(binarySensor) => (
            <div data-testid="connection-status">
              {binarySensor.isConnected ? 'Connected' : 'Disconnected'}
            </div>
          )}
        </BinarySensor>
      )

      expect(container.textContent).toBe('Disconnected')
    })
  })

  describe('Edge Cases', () => {
    it('should handle binary sensor with no attributes', () => {
      const mockBinarySensorEntity = createMockBinarySensorEntity('binary_sensor.test', 'on', {})
      mockUseBinarySensor.mockReturnValue(mockBinarySensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>No Attributes</div>)

      render(
        <BinarySensor entityId="binary_sensor.test">
          {mockChildren}
        </BinarySensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockBinarySensorEntity)
      expect(mockBinarySensorEntity.attributes).toEqual({})
      expect(mockBinarySensorEntity.deviceClass).toBeUndefined()
    })

    it('should handle binary sensor with special entityId characters', () => {
      const specialEntityId = 'binary_sensor.door_sensor-main'
      
      render(
        <BinarySensor entityId={specialEntityId}>
          {() => <div>Special ID</div>}
        </BinarySensor>
      )

      expect(mockUseBinarySensor).toHaveBeenCalledWith(specialEntityId)
    })

    it('should re-render when entityId prop changes', () => {
      const mockChildren = vi.fn().mockReturnValue(<div>Content</div>)
      
      const { rerender } = render(
        <BinarySensor entityId="binary_sensor.test1">
          {mockChildren}
        </BinarySensor>
      )

      expect(mockUseBinarySensor).toHaveBeenLastCalledWith('binary_sensor.test1')

      rerender(
        <BinarySensor entityId="binary_sensor.test2">
          {mockChildren}
        </BinarySensor>
      )

      expect(mockUseBinarySensor).toHaveBeenLastCalledWith('binary_sensor.test2')
    })

    it('should handle binary sensor state changes during operation', () => {
      // Start with sensor off
      let mockBinarySensorEntity = createMockBinarySensorEntity('binary_sensor.test', 'off')
      mockUseBinarySensor.mockReturnValue(mockBinarySensorEntity)

      const { container, rerender } = render(
        <BinarySensor entityId="binary_sensor.test">
          {(binarySensor) => (
            <div data-testid="sensor-state">
              {binarySensor.isOn ? 'ON' : 'OFF'}
            </div>
          )}
        </BinarySensor>
      )

      expect(container.querySelector('[data-testid="sensor-state"]')?.textContent).toBe('OFF')

      // Sensor turns on
      mockBinarySensorEntity = createMockBinarySensorEntity('binary_sensor.test', 'on')
      mockUseBinarySensor.mockReturnValue(mockBinarySensorEntity)
      rerender(
        <BinarySensor entityId="binary_sensor.test">
          {(binarySensor) => (
            <div data-testid="sensor-state">
              {binarySensor.isOn ? 'ON' : 'OFF'}
            </div>
          )}
        </BinarySensor>
      )

      expect(container.querySelector('[data-testid="sensor-state"]')?.textContent).toBe('ON')
    })
  })

  describe('Integration', () => {
    it('should inherit all base entity properties', () => {
      const mockBinarySensorEntity = createMockBinarySensorEntity('binary_sensor.test', 'on', {
        friendly_name: 'Test Binary Sensor',
        device_class: 'door',
        icon: 'mdi:door'
      })
      mockUseBinarySensor.mockReturnValue(mockBinarySensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Binary Sensor</div>)

      render(
        <BinarySensor entityId="binary_sensor.test">
          {mockChildren}
        </BinarySensor>
      )

      const passedEntity = mockChildren.mock.calls[0][0]
      
      // Should have all base entity properties
      expect(passedEntity.entityId).toBe('binary_sensor.test')
      expect(passedEntity.state).toBe('on')
      expect(passedEntity.attributes).toBeDefined()
      expect(passedEntity.lastChanged).toBeDefined()
      expect(passedEntity.lastUpdated).toBeDefined()
      expect(passedEntity.isUnavailable).toBeDefined()
      expect(passedEntity.isConnected).toBeDefined()
      expect(passedEntity.callService).toBeDefined()
      expect(passedEntity.refresh).toBeDefined()
      
      // Plus binary sensor-specific properties
      expect(passedEntity.isOn).toBeDefined()
      expect(passedEntity.isOff).toBeDefined()
      expect(passedEntity.deviceClass).toBeDefined()
      expect(passedEntity.icon).toBeDefined()
    })
  })

  describe('Real-world Use Cases', () => {
    it('should work with kitchen door sensor', () => {
      const mockBinarySensorEntity = createMockBinarySensorEntity(
        'binary_sensor.kitchen_multisensor', 
        'on', 
        { 
          device_class: 'door',
          friendly_name: 'Kitchen Door',
          icon: 'mdi:door'
        }
      )
      mockUseBinarySensor.mockReturnValue(mockBinarySensorEntity)

      const { container } = render(
        <BinarySensor entityId="binary_sensor.kitchen_multisensor">
          {(sensor) => (
            <div data-testid="kitchen-door">
              Kitchen Door: {sensor.isOn ? 'Open' : 'Closed'}
            </div>
          )}
        </BinarySensor>
      )

      expect(container.textContent).toBe('Kitchen Door: Open')
      expect(mockBinarySensorEntity.deviceClass).toBe('door')
    })
  })
})