import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Switch } from '../Switch'
import { useSwitch } from '../../hooks/useSwitch'
import type { SwitchState } from '../../hooks/useSwitch'

// Mock useSwitch hook
vi.mock('../../hooks/useSwitch')

const mockUseSwitch = useSwitch as any

// Mock switch entity response
const createMockSwitchEntity = (
  entityId: string = 'switch.test',
  state: string = 'on',
  attributes: Record<string, any> = {}
): SwitchState => ({
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
  turnOn: vi.fn(),
  turnOff: vi.fn(),
  toggle: vi.fn()
})

describe('Switch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSwitch.mockReturnValue(createMockSwitchEntity())
  })

  describe('Basic Functionality', () => {
    it('should render children with switch entity data', () => {
      const mockSwitchEntity = createMockSwitchEntity('switch.living_room', 'on')
      mockUseSwitch.mockReturnValue(mockSwitchEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Switch Content</div>)

      render(
        <Switch entityId="switch.living_room">
          {mockChildren}
        </Switch>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSwitchEntity)
    })

    it('should pass correct entityId to useSwitch hook', () => {
      const entityId = 'switch.bedroom_light'
      
      render(
        <Switch entityId={entityId}>
          {() => <div>Content</div>}
        </Switch>
      )

      expect(mockUseSwitch).toHaveBeenCalledWith(entityId)
    })

    it('should render children function result', () => {
      const { container } = render(
        <Switch entityId="switch.test">
          {() => <div data-testid="switch-content">Switch Control</div>}
        </Switch>
      )

      expect(container.querySelector('[data-testid="switch-content"]')).toBeInTheDocument()
      expect(container.textContent).toBe('Switch Control')
    })
  })

  describe('Switch State Handling', () => {
    it('should handle switch in on state', () => {
      const mockSwitchEntity = createMockSwitchEntity('switch.test', 'on')
      mockUseSwitch.mockReturnValue(mockSwitchEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Switch On</div>)

      render(
        <Switch entityId="switch.test">
          {mockChildren}
        </Switch>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSwitchEntity)
      expect(mockSwitchEntity.state).toBe('on')
      expect(mockSwitchEntity.isOn).toBe(true)
    })

    it('should handle switch in off state', () => {
      const mockSwitchEntity = createMockSwitchEntity('switch.test', 'off')
      mockUseSwitch.mockReturnValue(mockSwitchEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Switch Off</div>)

      render(
        <Switch entityId="switch.test">
          {mockChildren}
        </Switch>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSwitchEntity)
      expect(mockSwitchEntity.state).toBe('off')
      expect(mockSwitchEntity.isOn).toBe(false)
    })

    it('should handle unavailable switch', () => {
      const mockSwitchEntity = createMockSwitchEntity('switch.test', 'unavailable')
      mockUseSwitch.mockReturnValue(mockSwitchEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Switch Unavailable</div>)

      render(
        <Switch entityId="switch.test">
          {mockChildren}
        </Switch>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSwitchEntity)
      expect(mockSwitchEntity.state).toBe('unavailable')
      expect(mockSwitchEntity.isUnavailable).toBe(true)
      expect(mockSwitchEntity.isOn).toBe(false)
    })
  })

  describe('Switch Control Actions', () => {
    it('should support turning switch on', () => {
      const mockTurnOn = vi.fn()
      const mockSwitchEntity = createMockSwitchEntity('switch.test', 'off')
      mockSwitchEntity.turnOn = mockTurnOn
      mockUseSwitch.mockReturnValue(mockSwitchEntity)

      const { getByTestId } = render(
        <Switch entityId="switch.test">
          {(switchEntity) => (
            <button data-testid="turn-on" onClick={() => switchEntity.turnOn()}>
              Turn On
            </button>
          )}
        </Switch>
      )

      fireEvent.click(getByTestId('turn-on'))

      expect(mockTurnOn).toHaveBeenCalled()
    })

    it('should support turning switch off', () => {
      const mockTurnOff = vi.fn()
      const mockSwitchEntity = createMockSwitchEntity('switch.test', 'on')
      mockSwitchEntity.turnOff = mockTurnOff
      mockUseSwitch.mockReturnValue(mockSwitchEntity)

      const { getByTestId } = render(
        <Switch entityId="switch.test">
          {(switchEntity) => (
            <button data-testid="turn-off" onClick={() => switchEntity.turnOff()}>
              Turn Off
            </button>
          )}
        </Switch>
      )

      fireEvent.click(getByTestId('turn-off'))

      expect(mockTurnOff).toHaveBeenCalled()
    })

    it('should support toggling switch', () => {
      const mockToggle = vi.fn()
      const mockSwitchEntity = createMockSwitchEntity('switch.test', 'on')
      mockSwitchEntity.toggle = mockToggle
      mockUseSwitch.mockReturnValue(mockSwitchEntity)

      const { getByTestId } = render(
        <Switch entityId="switch.test">
          {(switchEntity) => (
            <button data-testid="toggle" onClick={() => switchEntity.toggle()}>
              Toggle
            </button>
          )}
        </Switch>
      )

      fireEvent.click(getByTestId('toggle'))

      expect(mockToggle).toHaveBeenCalled()
    })

    it('should support calling generic service', () => {
      const mockCallService = vi.fn()
      const mockSwitchEntity = createMockSwitchEntity('switch.test', 'off')
      mockSwitchEntity.callService = mockCallService
      mockUseSwitch.mockReturnValue(mockSwitchEntity)

      const { getByTestId } = render(
        <Switch entityId="switch.test">
          {(switchEntity) => (
            <button 
              data-testid="service-call" 
              onClick={() => switchEntity.callService('switch', 'turn_on')}
            >
              Service Call
            </button>
          )}
        </Switch>
      )

      fireEvent.click(getByTestId('service-call'))

      expect(mockCallService).toHaveBeenCalledWith('switch', 'turn_on')
    })
  })

  describe('Children Function Patterns', () => {
    it('should support conditional rendering based on switch state', () => {
      const mockSwitchEntity = createMockSwitchEntity('switch.test', 'on')
      mockUseSwitch.mockReturnValue(mockSwitchEntity)

      const { container } = render(
        <Switch entityId="switch.test">
          {(switchEntity) => (
            switchEntity.isOn 
              ? <div data-testid="switch-on">Switch is ON</div>
              : <div data-testid="switch-off">Switch is OFF</div>
          )}
        </Switch>
      )

      expect(container.querySelector('[data-testid="switch-on"]')).toBeInTheDocument()
      expect(container.querySelector('[data-testid="switch-off"]')).not.toBeInTheDocument()
    })

    it('should support rendering switch attributes', () => {
      const mockSwitchEntity = createMockSwitchEntity(
        'switch.smart_plug', 
        'on', 
        { 
          friendly_name: 'Smart Plug',
          current_power_w: 120.5,
          today_energy_kwh: 2.3
        }
      )
      mockUseSwitch.mockReturnValue(mockSwitchEntity)

      const { container } = render(
        <Switch entityId="switch.smart_plug">
          {(switchEntity) => (
            <div data-testid="switch-info">
              {switchEntity.attributes.friendly_name as string}: {switchEntity.attributes.current_power_w as number}W
            </div>
          )}
        </Switch>
      )

      expect(container.textContent).toBe('Smart Plug: 120.5W')
    })

    it('should support complex switch controls', () => {
      const mockTurnOn = vi.fn()
      const mockTurnOff = vi.fn()
      const mockToggle = vi.fn()
      const mockSwitchEntity = createMockSwitchEntity('switch.test', 'off')
      mockSwitchEntity.turnOn = mockTurnOn
      mockSwitchEntity.turnOff = mockTurnOff
      mockSwitchEntity.toggle = mockToggle
      mockUseSwitch.mockReturnValue(mockSwitchEntity)

      const { getByTestId } = render(
        <Switch entityId="switch.test">
          {(switchEntity) => (
            <div>
              <div data-testid="status">
                Status: {switchEntity.isOn ? 'ON' : 'OFF'}
              </div>
              <div>
                <button onClick={() => switchEntity.turnOn()}>On</button>
                <button onClick={() => switchEntity.turnOff()}>Off</button>
                <button onClick={() => switchEntity.toggle()}>Toggle</button>
              </div>
            </div>
          )}
        </Switch>
      )

      expect(getByTestId('status').textContent).toBe('Status: OFF')
    })

    it('should support checking connection status', () => {
      const mockSwitchEntity = createMockSwitchEntity('switch.test', 'on')
      mockSwitchEntity.isConnected = false
      mockUseSwitch.mockReturnValue(mockSwitchEntity)

      const { container } = render(
        <Switch entityId="switch.test">
          {(switchEntity) => (
            <div data-testid="connection-status">
              {switchEntity.isConnected ? 'Connected' : 'Disconnected'}
            </div>
          )}
        </Switch>
      )

      expect(container.textContent).toBe('Disconnected')
    })
  })

  describe('Edge Cases', () => {
    it('should handle switch with no attributes', () => {
      const mockSwitchEntity = createMockSwitchEntity('switch.test', 'on', {})
      mockUseSwitch.mockReturnValue(mockSwitchEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>No Attributes</div>)

      render(
        <Switch entityId="switch.test">
          {mockChildren}
        </Switch>
      )

      expect(mockChildren).toHaveBeenCalledWith(mockSwitchEntity)
      expect(mockSwitchEntity.attributes).toEqual({})
    })

    it('should handle switch with special entityId characters', () => {
      const specialEntityId = 'switch.test_switch-2'
      
      render(
        <Switch entityId={specialEntityId}>
          {() => <div>Special ID</div>}
        </Switch>
      )

      expect(mockUseSwitch).toHaveBeenCalledWith(specialEntityId)
    })

    it('should re-render when entityId prop changes', () => {
      const mockChildren = vi.fn().mockReturnValue(<div>Content</div>)
      
      const { rerender } = render(
        <Switch entityId="switch.test1">
          {mockChildren}
        </Switch>
      )

      expect(mockUseSwitch).toHaveBeenLastCalledWith('switch.test1')

      rerender(
        <Switch entityId="switch.test2">
          {mockChildren}
        </Switch>
      )

      expect(mockUseSwitch).toHaveBeenLastCalledWith('switch.test2')
    })

    it('should handle switch state changes during interaction', () => {
      // Start with switch off
      let mockSwitchEntity = createMockSwitchEntity('switch.test', 'off')
      mockUseSwitch.mockReturnValue(mockSwitchEntity)

      const { container, rerender } = render(
        <Switch entityId="switch.test">
          {(switchEntity) => (
            <div data-testid="switch-state">
              {switchEntity.isOn ? 'ON' : 'OFF'}
            </div>
          )}
        </Switch>
      )

      expect(container.querySelector('[data-testid="switch-state"]')?.textContent).toBe('OFF')

      // Switch turns on
      mockSwitchEntity = createMockSwitchEntity('switch.test', 'on')
      mockUseSwitch.mockReturnValue(mockSwitchEntity)
      rerender(
        <Switch entityId="switch.test">
          {(switchEntity) => (
            <div data-testid="switch-state">
              {switchEntity.isOn ? 'ON' : 'OFF'}
            </div>
          )}
        </Switch>
      )

      expect(container.querySelector('[data-testid="switch-state"]')?.textContent).toBe('ON')
    })
  })

  describe('Integration', () => {
    it('should inherit all base entity properties', () => {
      const mockSwitchEntity = createMockSwitchEntity('switch.test', 'on', {
        friendly_name: 'Test Switch'
      })
      mockUseSwitch.mockReturnValue(mockSwitchEntity)

      const mockChildren = vi.fn().mockReturnValue(<div>Switch</div>)

      render(
        <Switch entityId="switch.test">
          {mockChildren}
        </Switch>
      )

      const passedEntity = mockChildren.mock.calls[0][0]
      
      // Should have all base entity properties
      expect(passedEntity.entityId).toBe('switch.test')
      expect(passedEntity.state).toBe('on')
      expect(passedEntity.attributes).toBeDefined()
      expect(passedEntity.lastChanged).toBeDefined()
      expect(passedEntity.lastUpdated).toBeDefined()
      expect(passedEntity.isUnavailable).toBeDefined()
      expect(passedEntity.isConnected).toBeDefined()
      expect(passedEntity.callService).toBeDefined()
      expect(passedEntity.refresh).toBeDefined()
      
      // Plus switch-specific properties
      expect(passedEntity.isOn).toBeDefined()
      expect(passedEntity.turnOn).toBeDefined()
      expect(passedEntity.turnOff).toBeDefined()
      expect(passedEntity.toggle).toBeDefined()
    })
  })
})