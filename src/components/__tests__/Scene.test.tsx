import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Scene } from '../Scene'
import { useScene } from '../../hooks/useScene'

// Mock the hook
vi.mock('../../hooks/useScene')

const mockUseScene = vi.mocked(useScene)

describe('Scene Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with scene state', () => {
    const mockSceneState = {
      entityId: 'scene.movie_night',
      state: 'scening',
      attributes: {
        friendly_name: 'Movie Night',
        icon: 'mdi:movie'
      },
      isConnected: true,
      lastChanged: new Date('2024-01-01T12:00:00Z'),
      lastUpdated: new Date('2024-01-01T12:30:00Z'),
      context: { id: '123', parent_id: null, user_id: null },
      error: undefined,
      refresh: vi.fn(),
      isUnavailable: false,
      activate: vi.fn()
    }

    mockUseScene.mockReturnValue(mockSceneState)

    const { getByTestId } = render(
      <Scene entityId="scene.movie_night">
        {(scene) => (
          <div data-testid="scene-content">
            <h3>{scene.attributes.friendly_name}</h3>
            <span data-testid="scene-icon">{scene.attributes.icon}</span>
          </div>
        )}
      </Scene>
    )

    expect(mockUseScene).toHaveBeenCalledWith('scene.movie_night')
    expect(getByTestId('scene-content')).toBeInTheDocument()
    expect(getByTestId('scene-icon')).toHaveTextContent('mdi:movie')
  })

  it('should pass activate function', () => {
    const mockActivate = vi.fn()
    const mockSceneState = {
      entityId: 'scene.relax',
      state: 'scening',
      attributes: {
        friendly_name: 'Relax'
      },
      isConnected: true,
      lastChanged: new Date(),
      lastUpdated: new Date(),
      context: { id: '123', parent_id: null, user_id: null },
      error: undefined,
      refresh: vi.fn(),
      isUnavailable: false,
      activate: mockActivate
    }

    mockUseScene.mockReturnValue(mockSceneState)

    const { getByTestId } = render(
      <Scene entityId="scene.relax">
        {(scene) => (
          <button data-testid="activate-button" onClick={() => scene.activate()}>
            Activate
          </button>
        )}
      </Scene>
    )

    const button = getByTestId('activate-button')
    button.click()

    expect(mockActivate).toHaveBeenCalled()
  })

  it('should handle error state', () => {
    const mockSceneState = {
      entityId: 'scene.error',
      state: 'unknown',
      attributes: {},
      isConnected: false,
      lastChanged: new Date(),
      lastUpdated: new Date(),
      context: { id: '123', parent_id: null, user_id: null },
      error: { name: 'EntityError', message: 'Scene not available' },
      refresh: vi.fn(),
      isUnavailable: true,
      activate: vi.fn()
    }

    mockUseScene.mockReturnValue(mockSceneState)

    const { getByTestId } = render(
      <Scene entityId="scene.error">
        {(scene) => (
          <div data-testid="error-scene">
            {scene.error && <span data-testid="error-message">{scene.error.message}</span>}
          </div>
        )}
      </Scene>
    )

    expect(getByTestId('error-message')).toHaveTextContent('Scene not available')
  })

  it('should pass through all scene properties', () => {
    const mockSceneState = {
      entityId: 'scene.test',
      state: 'scening',
      attributes: {
        friendly_name: 'Test Scene',
        icon: 'mdi:test'
      },
      isConnected: true,
      lastChanged: new Date('2024-01-01T12:00:00Z'),
      lastUpdated: new Date('2024-01-01T12:30:00Z'),
      context: { id: '123', parent_id: null, user_id: null },
      error: undefined,
      refresh: vi.fn(),
      isUnavailable: false,
      activate: vi.fn()
    }

    mockUseScene.mockReturnValue(mockSceneState)

    const { getByTestId } = render(
      <Scene entityId="scene.test">
        {(scene) => (
          <div data-testid="full-scene">
            <div data-testid="entity-id">{scene.entityId}</div>
            <div data-testid="state">{scene.state}</div>
            <div data-testid="connected">{scene.isConnected.toString()}</div>
            <div data-testid="friendly-name">{scene.attributes.friendly_name}</div>
          </div>
        )}
      </Scene>
    )

    expect(getByTestId('entity-id')).toHaveTextContent('scene.test')
    expect(getByTestId('state')).toHaveTextContent('scening')
    expect(getByTestId('connected')).toHaveTextContent('true')
    expect(getByTestId('friendly-name')).toHaveTextContent('Test Scene')
  })

  it('should handle scene with transition parameter', () => {
    const mockActivate = vi.fn()
    const mockSceneState = {
      entityId: 'scene.bright',
      state: 'scening',
      attributes: {
        friendly_name: 'Bright'
      },
      isConnected: true,
      lastChanged: new Date(),
      lastUpdated: new Date(),
      context: { id: '123', parent_id: null, user_id: null },
      error: undefined,
      refresh: vi.fn(),
      isUnavailable: false,
      activate: mockActivate
    }

    mockUseScene.mockReturnValue(mockSceneState)

    const { getByTestId } = render(
      <Scene entityId="scene.bright">
        {(scene) => (
          <button data-testid="activate-with-transition" onClick={() => scene.activate(5)}>
            Activate with Transition
          </button>
        )}
      </Scene>
    )

    const button = getByTestId('activate-with-transition')
    button.click()

    expect(mockActivate).toHaveBeenCalledWith(5)
  })
})
