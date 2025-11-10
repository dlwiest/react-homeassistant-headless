import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Sensor from '../Sensor'
import { useSensor } from '../../hooks/useSensor'
import type { SensorState } from '../../types'

// Mock useSensor hook
vi.mock('../../hooks/useSensor')

const mockUseSensor = useSensor as any

// Mock sensor entity response
const createMockSensorEntity = (
  entityId: string = 'sensor.test',
  state: string = '23.5',
  attributes: Record<string, any> = {}
): SensorState => ({
  entityId,
  state,
  attributes,
  lastChanged: new Date(),
  lastUpdated: new Date(),
  isUnavailable: state === 'unavailable',
  isConnected: true,
  callService: vi.fn(),
  refresh: vi.fn(),
  value: state === 'unavailable' || state === 'unknown' ? null : 
         (attributes.device_class === 'temperature' || 
          attributes.device_class === 'humidity' ||
          attributes.device_class === 'pressure') && !isNaN(parseFloat(state)) ? parseFloat(state) : state,
  numericValue: state === 'unavailable' || state === 'unknown' ? null : 
                isNaN(parseFloat(state)) ? null : parseFloat(state),
  unitOfMeasurement: attributes.unit_of_measurement,
  deviceClass: attributes.device_class,
  stateClass: attributes.state_class,
  icon: attributes.icon
})

describe('Sensor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSensor.mockReturnValue(createMockSensorEntity())
  })

  describe('Basic Functionality', () => {
    it('should render children with sensor entity data', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.temperature', '23.5', {
        unit_of_measurement: '°C',
        device_class: 'temperature'
      })
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Sensor Content</div>)

      render(
        <Sensor entityId="sensor.temperature">
          {mockChildren}
        </Sensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSensorEntity)
    })

    it('should pass correct entityId to useSensor hook', () => {
      const entityId = 'sensor.humidity_living_room'
      
      render(
        <Sensor entityId={entityId}>
          {() => <div>Content</div>}
        </Sensor>
      )

      expect(mockUseSensor).toHaveBeenCalledWith(entityId)
    })

    it('should render children function result', () => {
      const { container } = render(
        <Sensor entityId="sensor.test">
          {() => <div data-testid="sensor-content">Sensor Display</div>}
        </Sensor>
      )

      expect(container.querySelector('[data-testid="sensor-content"]')).toBeInTheDocument()
      expect(container.textContent).toBe('Sensor Display')
    })
  })

  describe('Sensor Value Handling', () => {
    it('should handle temperature sensor with numeric value', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.temperature', '23.5', {
        unit_of_measurement: '°C',
        device_class: 'temperature',
        friendly_name: 'Living Room Temperature'
      })
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Temperature</div>)

      render(
        <Sensor entityId="sensor.temperature">
          {mockChildren}
        </Sensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSensorEntity)
      expect(mockSensorEntity.value).toBe(23.5)
      expect(mockSensorEntity.numericValue).toBe(23.5)
      expect(mockSensorEntity.unitOfMeasurement).toBe('°C')
      expect(mockSensorEntity.deviceClass).toBe('temperature')
    })

    it('should handle humidity sensor', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.humidity', '65.2', {
        unit_of_measurement: '%',
        device_class: 'humidity'
      })
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Humidity</div>)

      render(
        <Sensor entityId="sensor.humidity">
          {mockChildren}
        </Sensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSensorEntity)
      expect(mockSensorEntity.value).toBe(65.2)
      expect(mockSensorEntity.unitOfMeasurement).toBe('%')
      expect(mockSensorEntity.deviceClass).toBe('humidity')
    })

    it('should handle pressure sensor', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.pressure', '1013.25', {
        unit_of_measurement: 'hPa',
        device_class: 'pressure'
      })
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Pressure</div>)

      render(
        <Sensor entityId="sensor.pressure">
          {mockChildren}
        </Sensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSensorEntity)
      expect(mockSensorEntity.value).toBe(1013.25)
      expect(mockSensorEntity.deviceClass).toBe('pressure')
    })

    it('should handle string-based sensor values', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.weather_condition', 'sunny', {
        device_class: 'enum',
        friendly_name: 'Weather Condition'
      })
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Weather</div>)

      render(
        <Sensor entityId="sensor.weather_condition">
          {mockChildren}
        </Sensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSensorEntity)
      expect(mockSensorEntity.value).toBe('sunny')
      expect(mockSensorEntity.numericValue).toBeNull()
      expect(mockSensorEntity.deviceClass).toBe('enum')
    })

    it('should handle unavailable sensor', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.test', 'unavailable')
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Sensor Unavailable</div>)

      render(
        <Sensor entityId="sensor.test">
          {mockChildren}
        </Sensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSensorEntity)
      expect(mockSensorEntity.isUnavailable).toBe(true)
      expect(mockSensorEntity.value).toBeNull()
      expect(mockSensorEntity.numericValue).toBeNull()
    })

    it('should handle unknown sensor state', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.test', 'unknown')
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Unknown State</div>)

      render(
        <Sensor entityId="sensor.test">
          {mockChildren}
        </Sensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSensorEntity)
      expect(mockSensorEntity.state).toBe('unknown')
      expect(mockSensorEntity.value).toBeNull()
      expect(mockSensorEntity.numericValue).toBeNull()
    })
  })

  describe('Different Device Classes', () => {
    it('should handle energy sensor', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.energy_usage', '1250.5', {
        unit_of_measurement: 'kWh',
        device_class: 'energy',
        state_class: 'total_increasing'
      })
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Energy</div>)

      render(
        <Sensor entityId="sensor.energy_usage">
          {mockChildren}
        </Sensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSensorEntity)
      expect(mockSensorEntity.value).toBe('1250.5') // energy is not auto-parsed
      expect(mockSensorEntity.deviceClass).toBe('energy')
      expect(mockSensorEntity.stateClass).toBe('total_increasing')
    })

    it('should handle power sensor', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.power_consumption', '150.75', {
        unit_of_measurement: 'W',
        device_class: 'power',
        state_class: 'measurement'
      })
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Power</div>)

      render(
        <Sensor entityId="sensor.power_consumption">
          {mockChildren}
        </Sensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSensorEntity)
      expect(mockSensorEntity.value).toBe('150.75') // power is not auto-parsed
      expect(mockSensorEntity.deviceClass).toBe('power')
      expect(mockSensorEntity.unitOfMeasurement).toBe('W')
    })

    it('should handle battery sensor', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.battery_level', '85', {
        unit_of_measurement: '%',
        device_class: 'battery',
        icon: 'mdi:battery-80'
      })
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Battery</div>)

      render(
        <Sensor entityId="sensor.battery_level">
          {mockChildren}
        </Sensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSensorEntity)
      expect(mockSensorEntity.value).toBe('85') // Battery might not auto-convert to number
      expect(mockSensorEntity.numericValue).toBe(85)
      expect(mockSensorEntity.deviceClass).toBe('battery')
      expect(mockSensorEntity.icon).toBe('mdi:battery-80')
    })

    it('should handle timestamp sensor', () => {
      const timestamp = '2023-01-01T12:00:00Z'
      const mockSensorEntity = createMockSensorEntity('sensor.last_updated', timestamp, {
        device_class: 'timestamp',
        icon: 'mdi:clock'
      })
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Timestamp</div>)

      render(
        <Sensor entityId="sensor.last_updated">
          {mockChildren}
        </Sensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSensorEntity)
      expect(mockSensorEntity.value).toBe(timestamp)
      expect(mockSensorEntity.deviceClass).toBe('timestamp')
    })
  })

  describe('Children Function Patterns', () => {
    it('should support conditional rendering based on sensor value', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.temperature', '77.0', {
        unit_of_measurement: '°F',
        device_class: 'temperature'
      })
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const { container } = render(
        <Sensor entityId="sensor.temperature">
          {(sensor) => (
            <div data-testid="temp-display">
              {sensor.numericValue != null && sensor.numericValue > 70 
                ? `Warm: ${sensor.value}${sensor.unitOfMeasurement}` 
                : `Cool: ${sensor.value}${sensor.unitOfMeasurement}`
              }
            </div>
          )}
        </Sensor>
      )

      expect(container.textContent).toBe('Warm: 77°F')
    })

    it('should support displaying sensor attributes', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.weather', 'sunny', {
        friendly_name: 'Weather Condition',
        device_class: 'enum',
        icon: 'mdi:weather-sunny',
        attribution: 'Weather API'
      })
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const { container } = render(
        <Sensor entityId="sensor.weather">
          {(sensor) => (
            <div data-testid="sensor-info">
              {sensor.attributes.friendly_name as string}: {sensor.value} (Class: {sensor.deviceClass})
            </div>
          )}
        </Sensor>
      )

      expect(container.textContent).toBe('Weather Condition: sunny (Class: enum)')
    })

    it('should support numeric value formatting', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.humidity', '65.789', {
        unit_of_measurement: '%',
        device_class: 'humidity'
      })
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const { container } = render(
        <Sensor entityId="sensor.humidity">
          {(sensor) => (
            <div data-testid="formatted-value">
              {sensor.numericValue != null 
                ? `${sensor.numericValue.toFixed(1)}${sensor.unitOfMeasurement}` 
                : sensor.value
              }
            </div>
          )}
        </Sensor>
      )

      expect(container.textContent).toBe('65.8%')
    })

    it('should support handling missing values gracefully', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.test', 'unavailable')
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const { container } = render(
        <Sensor entityId="sensor.test">
          {(sensor) => (
            <div data-testid="status">
              {sensor.isUnavailable 
                ? 'Sensor unavailable' 
                : `Value: ${sensor.value}`
              }
            </div>
          )}
        </Sensor>
      )

      expect(container.textContent).toBe('Sensor unavailable')
    })

    it('should support complex sensor dashboard', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.energy', '1250.5', {
        unit_of_measurement: 'kWh',
        device_class: 'energy',
        state_class: 'total_increasing',
        friendly_name: 'Total Energy',
        last_reset: '2023-01-01T00:00:00Z'
      })
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const { getByTestId } = render(
        <Sensor entityId="sensor.energy">
          {(sensor) => (
            <div>
              <div data-testid="title">{sensor.attributes.friendly_name as string}</div>
              <div data-testid="value">
                {sensor.numericValue != null ? sensor.numericValue.toLocaleString() : 'N/A'}{sensor.unitOfMeasurement}
              </div>
              <div data-testid="class">Device Class: {sensor.deviceClass}</div>
              <div data-testid="state-class">State Class: {sensor.stateClass}</div>
            </div>
          )}
        </Sensor>
      )

      expect(getByTestId('title').textContent).toBe('Total Energy')
      expect(getByTestId('value').textContent).toBe('1,250.5kWh')
      expect(getByTestId('class').textContent).toBe('Device Class: energy')
      expect(getByTestId('state-class').textContent).toBe('State Class: total_increasing')
    })
  })

  describe('Edge Cases', () => {
    it('should handle sensor with no device class', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.custom', 'active', {
        friendly_name: 'Custom Sensor'
      })
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Custom</div>)

      render(
        <Sensor entityId="sensor.custom">
          {mockChildren}
        </Sensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSensorEntity)
      expect(mockSensorEntity.deviceClass).toBeUndefined()
      expect(mockSensorEntity.value).toBe('active')
    })

    it('should handle sensor with no unit of measurement', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.count', '42', {
        device_class: 'measurement'
      })
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Count</div>)

      render(
        <Sensor entityId="sensor.count">
          {mockChildren}
        </Sensor>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSensorEntity)
      expect(mockSensorEntity.unitOfMeasurement).toBeUndefined()
      expect(mockSensorEntity.numericValue).toBe(42)
    })

    it('should handle sensor entityId changes', () => {
      const mockChildren = vi.fn().mockReturnValue(<div>Content</div>)
      
      const { rerender } = render(
        <Sensor entityId="sensor.test1">
          {mockChildren}
        </Sensor>
      )

      expect(mockUseSensor).toHaveBeenLastCalledWith('sensor.test1')

      rerender(
        <Sensor entityId="sensor.test2">
          {mockChildren}
        </Sensor>
      )

      expect(mockUseSensor).toHaveBeenLastCalledWith('sensor.test2')
    })

    it('should handle special numeric edge cases', () => {
      const testCases = [
        { state: '0', expectedValue: '0', expectedNumeric: 0 },
        { state: '0.0', expectedValue: '0.0', expectedNumeric: 0 },
        { state: '-5.5', expectedValue: '-5.5', expectedNumeric: -5.5 },
        { state: '1e10', expectedValue: '1e10', expectedNumeric: 10000000000 },
        { state: 'NaN', expectedValue: 'NaN', expectedNumeric: null },
        { state: 'Infinity', expectedValue: 'Infinity', expectedNumeric: Infinity }
      ]

      testCases.forEach(({ state, expectedValue, expectedNumeric }) => {
        const mockSensorEntity = createMockSensorEntity('sensor.test', state, {
          device_class: 'measurement'
        })
        mockUseSensor.mockReturnValue(mockSensorEntity)

        const mockChildren = vi.fn().mockReturnValue(<div>Test</div>)

        render(
          <Sensor entityId="sensor.test">
            {mockChildren}
          </Sensor>
        )

        const passedEntity = mockChildren.mock.calls[0][0]
        expect(passedEntity.value).toBe(expectedValue)
        expect(passedEntity.numericValue).toBe(expectedNumeric)

        // Clear for next iteration
        vi.clearAllMocks()
      })
    })
  })

  describe('Integration', () => {
    it('should inherit all base entity properties', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.test', '23.5', {
        friendly_name: 'Test Sensor',
        unit_of_measurement: '°C',
        device_class: 'temperature'
      })
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Sensor</div>)

      render(
        <Sensor entityId="sensor.test">
          {mockChildren}
        </Sensor>
      )

      const passedEntity = mockChildren.mock.calls[0][0]
      
      // Should have all base entity properties
      expect(passedEntity.entityId).toBe('sensor.test')
      expect(passedEntity.state).toBe('23.5')
      expect(passedEntity.attributes).toBeDefined()
      expect(passedEntity.lastChanged).toBeDefined()
      expect(passedEntity.lastUpdated).toBeDefined()
      expect(passedEntity.isUnavailable).toBeDefined()
      expect(passedEntity.isConnected).toBeDefined()
      expect(passedEntity.callService).toBeDefined()
      expect(passedEntity.refresh).toBeDefined()
      
      // Plus sensor-specific properties
      expect(passedEntity.value).toBeDefined()
      expect(passedEntity.numericValue).toBeDefined()
      expect(passedEntity.unitOfMeasurement).toBeDefined()
      expect(passedEntity.deviceClass).toBeDefined()
    })

    it('should handle connection status changes', () => {
      const mockSensorEntity = createMockSensorEntity('sensor.test', '25.0')
      mockSensorEntity.isConnected = false
      mockUseSensor.mockReturnValue(mockSensorEntity)

      const { container } = render(
        <Sensor entityId="sensor.test">
          {(sensor) => (
            <div data-testid="connection-status">
              {sensor.isConnected ? 'Connected' : 'Disconnected'}
            </div>
          )}
        </Sensor>
      )

      expect(container.textContent).toBe('Disconnected')
    })
  })
})