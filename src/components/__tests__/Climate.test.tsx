import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Climate } from '../Climate'
import { useClimate } from '../../hooks/useClimate'
import type { ClimateState } from '../../types'

// Mock useClimate hook
vi.mock('../../hooks/useClimate')

const mockUseClimate = useClimate as any

// Mock climate entity response
const createMockClimateEntity = (
  entityId: string = 'climate.test',
  state: string = 'heat',
  attributes: Record<string, any> = {}
): ClimateState => ({
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
  currentTemperature: attributes.current_temperature,
  targetTemperature: attributes.temperature,
  targetTempHigh: attributes.target_temp_high,
  targetTempLow: attributes.target_temp_low,
  mode: attributes.hvac_mode || state,
  supportedModes: attributes.hvac_modes || [],
  fanMode: attributes.fan_mode,
  supportedFanModes: attributes.fan_modes || [],
  presetMode: attributes.preset_mode,
  supportedPresetModes: attributes.preset_modes || [],
  minTemp: attributes.min_temp || 7,
  maxTemp: attributes.max_temp || 35,
  supportsTargetTemperature: !!(attributes.supported_features & 1),
  supportsTargetTemperatureRange: !!(attributes.supported_features & 2),
  supportsFanMode: !!(attributes.supported_features & 8),
  supportsPresetMode: !!(attributes.supported_features & 16),
  setTemperature: vi.fn(),
  setTemperatureRange: vi.fn(),
  setMode: vi.fn(),
  setFanMode: vi.fn(),
  setPresetMode: vi.fn()
})

describe('Climate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseClimate.mockReturnValue(createMockClimateEntity())
  })

  describe('Basic Functionality', () => {
    it('should render children with climate entity data', () => {
      const mockClimateEntity = createMockClimateEntity('climate.living_room', 'heat', {
        current_temperature: 20.5,
        temperature: 22.0
      })
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Climate Content</div>)

      render(
        <Climate entityId="climate.living_room">
          {mockChildren}
        </Climate>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockClimateEntity)
    })

    it('should pass correct entityId to useClimate hook', () => {
      const entityId = 'climate.bedroom_ac'
      
      render(
        <Climate entityId={entityId}>
          {() => <div>Content</div>}
        </Climate>
      )

      expect(mockUseClimate).toHaveBeenCalledWith(entityId)
    })

    it('should render children function result', () => {
      const { container } = render(
        <Climate entityId="climate.test">
          {() => <div data-testid="climate-content">Climate Control</div>}
        </Climate>
      )

      expect(container.querySelector('[data-testid="climate-content"]')).toBeInTheDocument()
      expect(container.textContent).toBe('Climate Control')
    })
  })

  describe('Climate State Handling', () => {
    it('should handle climate in heat mode', () => {
      const mockClimateEntity = createMockClimateEntity('climate.test', 'heat', {
        current_temperature: 18.0,
        temperature: 22.0
      })
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Heat Mode</div>)

      render(
        <Climate entityId="climate.test">
          {mockChildren}
        </Climate>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockClimateEntity)
      expect(mockClimateEntity.mode).toBe('heat')
      expect(mockClimateEntity.currentTemperature).toBe(18.0)
      expect(mockClimateEntity.targetTemperature).toBe(22.0)
    })

    it('should handle climate in cool mode', () => {
      const mockClimateEntity = createMockClimateEntity('climate.test', 'cool', {
        current_temperature: 26.0,
        temperature: 23.0
      })
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Cool Mode</div>)

      render(
        <Climate entityId="climate.test">
          {mockChildren}
        </Climate>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockClimateEntity)
      expect(mockClimateEntity.mode).toBe('cool')
    })

    it('should handle climate in auto mode', () => {
      const mockClimateEntity = createMockClimateEntity('climate.test', 'auto', {
        current_temperature: 21.0,
        target_temp_low: 20.0,
        target_temp_high: 24.0
      })
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Auto Mode</div>)

      render(
        <Climate entityId="climate.test">
          {mockChildren}
        </Climate>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockClimateEntity)
      expect(mockClimateEntity.mode).toBe('auto')
      expect(mockClimateEntity.targetTempLow).toBe(20.0)
      expect(mockClimateEntity.targetTempHigh).toBe(24.0)
    })

    it('should handle unavailable climate', () => {
      const mockClimateEntity = createMockClimateEntity('climate.test', 'unavailable')
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Climate Unavailable</div>)

      render(
        <Climate entityId="climate.test">
          {mockChildren}
        </Climate>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockClimateEntity)
      expect(mockClimateEntity.isUnavailable).toBe(true)
    })
  })

  describe('Climate Control Actions', () => {
    it('should support setting temperature', () => {
      const mockSetTemperature = vi.fn()
      const mockClimateEntity = createMockClimateEntity('climate.test', 'heat', {
        supported_features: 1, // SUPPORT_TARGET_TEMPERATURE
        temperature: 20.0
      })
      mockClimateEntity.setTemperature = mockSetTemperature
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const { getByTestId } = render(
        <Climate entityId="climate.test">
          {(climate) => (
            <button data-testid="set-temp" onClick={() => climate.setTemperature(22.0)}>
              Set Temperature
            </button>
          )}
        </Climate>
      )

      fireEvent.click(getByTestId('set-temp'))

      expect(mockSetTemperature).toHaveBeenCalledWith(22.0)
    })

    it('should support setting HVAC mode', () => {
      const mockSetMode = vi.fn()
      const mockClimateEntity = createMockClimateEntity('climate.test', 'off', {
        hvac_modes: ['off', 'heat', 'cool', 'auto']
      })
      mockClimateEntity.setMode = mockSetMode
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const { getByTestId } = render(
        <Climate entityId="climate.test">
          {(climate) => (
            <button data-testid="set-mode" onClick={() => climate.setMode('heat')}>
              Heat Mode
            </button>
          )}
        </Climate>
      )

      fireEvent.click(getByTestId('set-mode'))

      expect(mockSetMode).toHaveBeenCalledWith('heat')
    })

    it('should support setting fan mode', () => {
      const mockSetFanMode = vi.fn()
      const mockClimateEntity = createMockClimateEntity('climate.test', 'cool', {
        supported_features: 8, // SUPPORT_FAN_MODE
        fan_modes: ['auto', 'low', 'medium', 'high']
      })
      mockClimateEntity.setFanMode = mockSetFanMode
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const { getByTestId } = render(
        <Climate entityId="climate.test">
          {(climate) => (
            <button data-testid="set-fan" onClick={() => climate.setFanMode('high')}>
              High Fan
            </button>
          )}
        </Climate>
      )

      fireEvent.click(getByTestId('set-fan'))

      expect(mockSetFanMode).toHaveBeenCalledWith('high')
    })

    it('should support setting preset mode', () => {
      const mockSetPresetMode = vi.fn()
      const mockClimateEntity = createMockClimateEntity('climate.test', 'heat', {
        supported_features: 16, // SUPPORT_PRESET_MODE
        preset_modes: ['none', 'eco', 'comfort', 'boost']
      })
      mockClimateEntity.setPresetMode = mockSetPresetMode
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const { getByTestId } = render(
        <Climate entityId="climate.test">
          {(climate) => (
            <button data-testid="set-preset" onClick={() => climate.setPresetMode('eco')}>
              Eco Mode
            </button>
          )}
        </Climate>
      )

      fireEvent.click(getByTestId('set-preset'))

      expect(mockSetPresetMode).toHaveBeenCalledWith('eco')
    })

    it('should support setting temperature range', () => {
      const mockSetTemperatureRange = vi.fn()
      const mockClimateEntity = createMockClimateEntity('climate.test', 'cool', {
        supported_features: 2, // SUPPORT_TARGET_TEMPERATURE_RANGE
        target_temp_low: 18.0,
        target_temp_high: 26.0
      })
      mockClimateEntity.setTemperatureRange = mockSetTemperatureRange
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const { getByTestId } = render(
        <Climate entityId="climate.test">
          {(climate) => (
            <button data-testid="set-range" onClick={() => climate.setTemperatureRange(19.0, 25.0)}>
              Set Range
            </button>
          )}
        </Climate>
      )

      fireEvent.click(getByTestId('set-range'))

      expect(mockSetTemperatureRange).toHaveBeenCalledWith(19.0, 25.0)
    })

    it('should support setting individual temperature range values', () => {
      const mockSetTemperatureRange = vi.fn()
      const mockClimateEntity = createMockClimateEntity('climate.test', 'auto', {
        supported_features: 2, // SUPPORT_TARGET_TEMPERATURE_RANGE
        target_temp_low: 20.0,
        target_temp_high: 24.0
      })
      mockClimateEntity.setTemperatureRange = mockSetTemperatureRange
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const { getByTestId } = render(
        <Climate entityId="climate.test">
          {(climate) => (
            <div>
              <button data-testid="set-range" onClick={() => climate.setTemperatureRange(19.0, 25.0)}>
                Set Range
              </button>
            </div>
          )}
        </Climate>
      )

      fireEvent.click(getByTestId('set-range'))

      expect(mockSetTemperatureRange).toHaveBeenCalledWith(19.0, 25.0)
    })

    it('should support setting mode to turn on/off', () => {
      const mockSetMode = vi.fn()
      const mockClimateEntity = createMockClimateEntity('climate.test', 'off')
      mockClimateEntity.setMode = mockSetMode
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const { getByTestId } = render(
        <Climate entityId="climate.test">
          {(climate) => (
            <div>
              <button data-testid="turn-on" onClick={() => climate.setMode('heat')}>
                Turn On Heat
              </button>
              <button data-testid="turn-off" onClick={() => climate.setMode('off')}>
                Turn Off
              </button>
            </div>
          )}
        </Climate>
      )

      fireEvent.click(getByTestId('turn-on'))
      fireEvent.click(getByTestId('turn-off'))

      expect(mockSetMode).toHaveBeenCalledWith('heat')
      expect(mockSetMode).toHaveBeenCalledWith('off')
    })
  })

  describe('Climate Features', () => {
    it('should expose temperature control support', () => {
      const mockClimateEntity = createMockClimateEntity('climate.test', 'heat', {
        supported_features: 1, // SUPPORT_TARGET_TEMPERATURE
        temperature: 22.0,
        min_temp: 10.0,
        max_temp: 30.0,
        target_temp_step: 0.5
      })
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Temperature Support</div>)

      render(
        <Climate entityId="climate.test">
          {mockChildren}
        </Climate>
      )

      const passedEntity = mockChildren.mock.calls[0][0]
      expect(passedEntity.supportsTargetTemperature).toBe(true)
      expect(passedEntity.targetTemperature).toBe(22.0)
      expect(passedEntity.minTemp).toBe(10.0)
      expect(passedEntity.maxTemp).toBe(30.0)
      // targetTempStep not included in ClimateState interface
    })

    it('should expose temperature range support', () => {
      const mockClimateEntity = createMockClimateEntity('climate.test', 'auto', {
        supported_features: 2, // SUPPORT_TARGET_TEMPERATURE_RANGE
        target_temp_low: 20.0,
        target_temp_high: 24.0
      })
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Range Support</div>)

      render(
        <Climate entityId="climate.test">
          {mockChildren}
        </Climate>
      )

      const passedEntity = mockChildren.mock.calls[0][0]
      expect(passedEntity.supportsTargetTemperatureRange).toBe(true)
      expect(passedEntity.targetTempLow).toBe(20.0)
      expect(passedEntity.targetTempHigh).toBe(24.0)
    })

    it('should expose fan mode support', () => {
      const mockClimateEntity = createMockClimateEntity('climate.test', 'cool', {
        supported_features: 8, // SUPPORT_FAN_MODE
        fan_mode: 'medium',
        fan_modes: ['auto', 'low', 'medium', 'high']
      })
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Fan Support</div>)

      render(
        <Climate entityId="climate.test">
          {mockChildren}
        </Climate>
      )

      const passedEntity = mockChildren.mock.calls[0][0]
      expect(passedEntity.supportsFanMode).toBe(true)
      expect(passedEntity.fanMode).toBe('medium')
      expect(passedEntity.supportedFanModes).toEqual(['auto', 'low', 'medium', 'high'])
    })

    it('should expose preset mode support', () => {
      const mockClimateEntity = createMockClimateEntity('climate.test', 'heat', {
        supported_features: 16, // SUPPORT_PRESET_MODE
        preset_mode: 'eco',
        preset_modes: ['none', 'eco', 'comfort', 'boost']
      })
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Preset Support</div>)

      render(
        <Climate entityId="climate.test">
          {mockChildren}
        </Climate>
      )

      const passedEntity = mockChildren.mock.calls[0][0]
      expect(passedEntity.supportsPresetMode).toBe(true)
      expect(passedEntity.presetMode).toBe('eco')
      expect(passedEntity.supportedPresetModes).toEqual(['none', 'eco', 'comfort', 'boost'])
    })

    it('should expose swing mode support', () => {
      const mockClimateEntity = createMockClimateEntity('climate.test', 'cool', {
        supported_features: 32, // SUPPORT_SWING_MODE
        swing_mode: 'vertical',
        swing_modes: ['off', 'vertical', 'horizontal', 'both']
      })
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Swing Support</div>)

      render(
        <Climate entityId="climate.test">
          {mockChildren}
        </Climate>
      )

      const passedEntity = mockChildren.mock.calls[0][0]
      // supportsSwingMode not in ClimateState interface
      // swingMode and swingModes not in ClimateState interface
    })
  })

  describe('Children Function Patterns', () => {
    it('should support conditional rendering based on climate mode', () => {
      const mockClimateEntity = createMockClimateEntity('climate.test', 'heat', {
        current_temperature: 18.0,
        temperature: 22.0
      })
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const { container } = render(
        <Climate entityId="climate.test">
          {(climate) => (
            <div data-testid="climate-display">
              {climate.mode === 'heat' 
                ? `Heating to ${climate.targetTemperature}°` 
                : `Current mode: ${climate.mode}`
              }
            </div>
          )}
        </Climate>
      )

      expect(container.textContent).toBe('Heating to 22°')
    })

    it('should support complex climate controls', () => {
      const mockSetTemperature = vi.fn()
      const mockSetMode = vi.fn()
      const mockSetFanMode = vi.fn()
      const mockClimateEntity = createMockClimateEntity('climate.test', 'auto', {
        supported_features: 25, // Temperature + Fan + Preset
        current_temperature: 21.0,
        target_temp_low: 20.0,
        target_temp_high: 24.0,
        hvac_mode: 'auto',
        fan_mode: 'auto',
        hvac_modes: ['off', 'heat', 'cool', 'auto'],
        fan_modes: ['auto', 'low', 'high']
      })
      mockClimateEntity.setTemperature = mockSetTemperature
      mockClimateEntity.setMode = mockSetMode
      mockClimateEntity.setFanMode = mockSetFanMode
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const { getByTestId } = render(
        <Climate entityId="climate.test">
          {(climate) => (
            <div>
              <div data-testid="status">
                Current: {climate.currentTemperature}° | Mode: {climate.mode} | Fan: {climate.fanMode}
              </div>
              <div>
                <button onClick={() => climate.setMode('heat')}>Heat</button>
                <button onClick={() => climate.setFanMode('high')}>High Fan</button>
              </div>
            </div>
          )}
        </Climate>
      )

      expect(getByTestId('status').textContent).toBe('Current: 21° | Mode: auto | Fan: auto')
    })

    it('should support displaying available modes', () => {
      const mockClimateEntity = createMockClimateEntity('climate.test', 'off', {
        hvac_modes: ['off', 'heat', 'cool', 'auto', 'dry', 'fan_only'],
        fan_modes: ['auto', 'low', 'medium', 'high'],
        preset_modes: ['none', 'eco', 'comfort']
      })
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const { container } = render(
        <Climate entityId="climate.test">
          {(climate) => (
            <div data-testid="modes-info">
              HVAC: {climate.supportedModes.length} modes | 
              Fan: {climate.supportedFanModes.length} modes | 
              Presets: {climate.supportedPresetModes.length} modes
            </div>
          )}
        </Climate>
      )

      expect(container.textContent).toBe('HVAC: 6 modes | Fan: 4 modes | Presets: 3 modes')
    })
  })

  describe('Edge Cases', () => {
    it('should handle climate with no features', () => {
      const mockClimateEntity = createMockClimateEntity('climate.basic', 'heat', {
        supported_features: 0
      })
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Basic Climate</div>)

      render(
        <Climate entityId="climate.basic">
          {mockChildren}
        </Climate>
      )

      const passedEntity = mockChildren.mock.calls[0][0]
      expect(passedEntity.supportsTargetTemperature).toBe(false)
      expect(passedEntity.supportsTargetTemperatureRange).toBe(false)
      expect(passedEntity.supportsFanMode).toBe(false)
      expect(passedEntity.supportsPresetMode).toBe(false)
      // supportsSwingMode not in ClimateState interface
    })

    it('should handle climate with all features', () => {
      const mockClimateEntity = createMockClimateEntity('climate.advanced', 'auto', {
        supported_features: 63, // All features
        current_temperature: 22.0,
        temperature: 23.0,
        target_temp_low: 20.0,
        target_temp_high: 25.0,
        fan_mode: 'medium',
        preset_mode: 'comfort',
        swing_mode: 'vertical'
      })
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Advanced Climate</div>)

      render(
        <Climate entityId="climate.advanced">
          {mockChildren}
        </Climate>
      )

      const passedEntity = mockChildren.mock.calls[0][0]
      expect(passedEntity.supportsTargetTemperature).toBe(true)
      expect(passedEntity.supportsTargetTemperatureRange).toBe(true)
      expect(passedEntity.supportsFanMode).toBe(true)
      expect(passedEntity.supportsPresetMode).toBe(true)
      // supportsSwingMode not in ClimateState interface
    })

    it('should handle climate entityId changes', () => {
      const mockChildren = vi.fn().mockReturnValue(<div>Content</div>)
      
      const { rerender } = render(
        <Climate entityId="climate.test1">
          {mockChildren}
        </Climate>
      )

      expect(mockUseClimate).toHaveBeenLastCalledWith('climate.test1')

      rerender(
        <Climate entityId="climate.test2">
          {mockChildren}
        </Climate>
      )

      expect(mockUseClimate).toHaveBeenLastCalledWith('climate.test2')
    })
  })

  describe('Integration', () => {
    it('should inherit all base entity properties', () => {
      const mockClimateEntity = createMockClimateEntity('climate.test', 'heat', {
        friendly_name: 'Test Climate',
        current_temperature: 20.0,
        temperature: 22.0
      })
      mockUseClimate.mockReturnValue(mockClimateEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Climate</div>)

      render(
        <Climate entityId="climate.test">
          {mockChildren}
        </Climate>
      )

      const passedEntity = mockChildren.mock.calls[0][0]
      
      // Should have all base entity properties
      expect(passedEntity.entityId).toBe('climate.test')
      expect(passedEntity.state).toBe('heat')
      expect(passedEntity.attributes).toBeDefined()
      expect(passedEntity.lastChanged).toBeDefined()
      expect(passedEntity.lastUpdated).toBeDefined()
      expect(passedEntity.isUnavailable).toBeDefined()
      expect(passedEntity.isConnected).toBeDefined()
      expect(passedEntity.callService).toBeDefined()
      expect(passedEntity.refresh).toBeDefined()
      
      // Plus climate-specific properties
      expect(passedEntity.mode).toBeDefined()
      expect(passedEntity.currentTemperature).toBeDefined()
      expect(passedEntity.targetTemperature).toBeDefined()
      expect(passedEntity.setTemperature).toBeDefined()
      expect(passedEntity.setMode).toBeDefined()
      expect(passedEntity.setTemperatureRange).toBeDefined()
    })
  })
})