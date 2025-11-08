import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Fan from '../Fan'
import { useFan } from '../../hooks/useFan'

// Mock the useFan hook
vi.mock('../../hooks/useFan')

const mockFanState = {
  entityId: 'fan.test',
  state: 'on',
  attributes: {},
  lastChanged: new Date(),
  lastUpdated: new Date(),
  isUnavailable: false,
  isConnected: true,
  isOn: true,
  percentage: 75,
  presetMode: 'medium',
  isOscillating: true,
  direction: 'forward' as const,
  supportsSetSpeed: true,
  supportsOscillate: true,
  supportsDirection: true,
  supportsPresetMode: true,
  availablePresetModes: ['low', 'medium', 'high'],
  toggle: vi.fn(),
  turnOn: vi.fn(),
  turnOff: vi.fn(),
  setPercentage: vi.fn(),
  setPresetMode: vi.fn(),
  setOscillating: vi.fn(),
  setDirection: vi.fn(),
  callService: vi.fn(),
  refresh: vi.fn(),
  error: undefined
}

describe('Fan Component', () => {
  const mockUseFan = useFan as any
  
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseFan.mockReturnValue(mockFanState)
  })

  it('should render children with fan state', () => {
    render(
      <Fan entityId="fan.test">
        {(fan) => (
          <div>
            <span data-testid="fan-state">{fan.isOn ? 'On' : 'Off'}</span>
            <span data-testid="fan-percentage">{fan.percentage}%</span>
            <span data-testid="fan-preset">{fan.presetMode}</span>
            <span data-testid="fan-oscillating">{fan.isOscillating ? 'Yes' : 'No'}</span>
            <span data-testid="fan-direction">{fan.direction}</span>
          </div>
        )}
      </Fan>
    )

    expect(screen.getByTestId('fan-state')).toHaveTextContent('On')
    expect(screen.getByTestId('fan-percentage')).toHaveTextContent('75%')
    expect(screen.getByTestId('fan-preset')).toHaveTextContent('medium')
    expect(screen.getByTestId('fan-oscillating')).toHaveTextContent('Yes')
    expect(screen.getByTestId('fan-direction')).toHaveTextContent('forward')
  })

  it('should call useFan with correct entity ID', () => {
    render(
      <Fan entityId="fan.test">
        {() => <div>Test</div>}
      </Fan>
    )

    expect(useFan).toHaveBeenCalledWith('fan.test')
  })

  it('should render with different fan states', () => {
    const offFanState = {
      ...mockFanState,
      isOn: false,
      percentage: 0,
      isOscillating: false,
      presetMode: undefined,
      direction: undefined
    }

    mockUseFan.mockReturnValue(offFanState)

    render(
      <Fan entityId="fan.test">
        {(fan) => (
          <div>
            <span data-testid="fan-state">{fan.isOn ? 'On' : 'Off'}</span>
            <span data-testid="fan-percentage">{fan.percentage}%</span>
            <span data-testid="fan-oscillating">{fan.isOscillating ? 'Yes' : 'No'}</span>
          </div>
        )}
      </Fan>
    )

    expect(screen.getByTestId('fan-state')).toHaveTextContent('Off')
    expect(screen.getByTestId('fan-percentage')).toHaveTextContent('0%')
    expect(screen.getByTestId('fan-oscillating')).toHaveTextContent('No')
  })

  it('should render feature support flags', () => {
    render(
      <Fan entityId="fan.test">
        {(fan) => (
          <div>
            <span data-testid="supports-speed">{fan.supportsSetSpeed ? 'Yes' : 'No'}</span>
            <span data-testid="supports-oscillate">{fan.supportsOscillate ? 'Yes' : 'No'}</span>
            <span data-testid="supports-direction">{fan.supportsDirection ? 'Yes' : 'No'}</span>
            <span data-testid="supports-preset">{fan.supportsPresetMode ? 'Yes' : 'No'}</span>
          </div>
        )}
      </Fan>
    )

    expect(screen.getByTestId('supports-speed')).toHaveTextContent('Yes')
    expect(screen.getByTestId('supports-oscillate')).toHaveTextContent('Yes')
    expect(screen.getByTestId('supports-direction')).toHaveTextContent('Yes')
    expect(screen.getByTestId('supports-preset')).toHaveTextContent('Yes')
  })
})