import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Camera } from '../Camera'

// Mock the hook
vi.mock('../../hooks/useCamera', () => ({
  useCamera: vi.fn()
}))

import { useCamera } from '../../hooks/useCamera'
import type { CameraState } from '../../types'

describe('Camera Component', () => {
  const mockUseCamera = useCamera as any

  const createMockCameraState = (overrides: Partial<CameraState> = {}): CameraState => ({
    // Base entity properties
    entityId: 'camera.test',
    state: 'idle',
    attributes: {
      friendly_name: 'Test Camera',
      access_token: 'mock-token',
    },
    lastChanged: new Date(),
    lastUpdated: new Date(),
    isUnavailable: false,
    isConnected: true,
    error: undefined,
    callService: vi.fn(),
    callServiceWithResponse: vi.fn(),
    refresh: vi.fn(),

    // Camera-specific properties
    isOn: true,
    isRecording: false,
    isStreaming: false,
    isIdle: true,
    motionDetectionEnabled: false,
    imageUrl: 'http://hass.local:8123/api/camera_proxy/camera.test?token=mock-token&_cb=0',
    streamState: {
      isLoading: false,
      isActive: false,
      error: null,
      url: null,
      type: null
    },
    accessToken: 'mock-token',
    brand: 'TestBrand',
    model: 'TestModel',
    supportsOnOff: true,
    supportsStream: false,
    
    // Methods
    turnOn: vi.fn(),
    turnOff: vi.fn(),
    enableMotionDetection: vi.fn(),
    disableMotionDetection: vi.fn(),
    snapshot: vi.fn(),
    playStream: vi.fn(),
    record: vi.fn(),
    refreshImage: vi.fn(),

    // Stream methods
    getStreamUrl: vi.fn(),
    startStream: vi.fn(),
    stopStream: vi.fn(),
    retryStream: vi.fn(),

    // Apply overrides
    ...overrides
  })

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseCamera.mockReturnValue(createMockCameraState())
  })

  it('should render camera state correctly', () => {
    const mockState = createMockCameraState({
      entityId: 'camera.basement_door',
      state: 'recording',
      isRecording: true,
      isIdle: false,
      motionDetectionEnabled: true,
      brand: 'Hikvision',
      model: 'DS-2CD2T47G1-L'
    })
    
    mockUseCamera.mockReturnValue(mockState)

    render(
      <Camera entityId="camera.basement_door">
        {(camera) => (
          <div data-testid="camera-info">
            <span data-testid="entity-id">{camera.entityId}</span>
            <span data-testid="state">{camera.state}</span>
            <span data-testid="recording">{camera.isRecording ? 'Recording' : 'Not Recording'}</span>
            <span data-testid="motion">{camera.motionDetectionEnabled ? 'Motion On' : 'Motion Off'}</span>
            <span data-testid="brand">{camera.brand}</span>
            <span data-testid="model">{camera.model}</span>
          </div>
        )}
      </Camera>
    )

    expect(screen.getByTestId('entity-id')).toHaveTextContent('camera.basement_door')
    expect(screen.getByTestId('state')).toHaveTextContent('recording')
    expect(screen.getByTestId('recording')).toHaveTextContent('Recording')
    expect(screen.getByTestId('motion')).toHaveTextContent('Motion On')
    expect(screen.getByTestId('brand')).toHaveTextContent('Hikvision')
    expect(screen.getByTestId('model')).toHaveTextContent('DS-2CD2T47G1-L')
  })

  it('should render camera capabilities correctly', () => {
    const mockState = createMockCameraState({
      supportsOnOff: true,
      supportsStream: true
    })
    
    mockUseCamera.mockReturnValue(mockState)

    render(
      <Camera entityId="camera.test">
        {(camera) => (
          <div data-testid="capabilities">
            <span data-testid="on-off">{camera.supportsOnOff ? 'On/Off Supported' : 'On/Off Not Supported'}</span>
            <span data-testid="stream">{camera.supportsStream ? 'Stream Supported' : 'Stream Not Supported'}</span>
          </div>
        )}
      </Camera>
    )

    expect(screen.getByTestId('on-off')).toHaveTextContent('On/Off Supported')
    expect(screen.getByTestId('stream')).toHaveTextContent('Stream Supported')
  })

  it('should render image URL correctly', () => {
    const mockState = createMockCameraState({
      imageUrl: 'http://homeassistant.local:8123/api/camera_proxy/camera.test?token=secret123&_cb=5'
    })
    
    mockUseCamera.mockReturnValue(mockState)

    render(
      <Camera entityId="camera.test">
        {(camera) => (
          <div data-testid="image-container">
            {camera.imageUrl && (
              <img src={camera.imageUrl} alt="Camera feed" data-testid="camera-image" />
            )}
          </div>
        )}
      </Camera>
    )

    const image = screen.getByTestId('camera-image')
    expect(image).toHaveAttribute('src', 'http://homeassistant.local:8123/api/camera_proxy/camera.test?token=secret123&_cb=5')
  })

  it('should handle missing image URL gracefully', () => {
    const mockState = createMockCameraState({
      imageUrl: null
    })
    
    mockUseCamera.mockReturnValue(mockState)

    render(
      <Camera entityId="camera.test">
        {(camera) => (
          <div data-testid="image-container">
            {camera.imageUrl ? (
              <img src={camera.imageUrl} alt="Camera feed" data-testid="camera-image" />
            ) : (
              <span data-testid="no-image">No image available</span>
            )}
          </div>
        )}
      </Camera>
    )

    expect(screen.getByTestId('no-image')).toHaveTextContent('No image available')
    expect(screen.queryByTestId('camera-image')).not.toBeInTheDocument()
  })

  it('should call useCamera with correct entity ID', () => {
    render(
      <Camera entityId="camera.front_door">
        {() => <div>Test</div>}
      </Camera>
    )

    expect(mockUseCamera).toHaveBeenCalledWith('camera.front_door')
  })

  it('should call camera methods correctly', () => {
    const mockTurnOn = vi.fn()
    const mockSnapshot = vi.fn()
    const mockRefreshImage = vi.fn()
    
    const mockState = createMockCameraState({
      turnOn: mockTurnOn,
      snapshot: mockSnapshot,
      refreshImage: mockRefreshImage
    })
    
    mockUseCamera.mockReturnValue(mockState)

    render(
      <Camera entityId="camera.test">
        {(camera) => (
          <div>
            <button onClick={camera.turnOn} data-testid="turn-on">Turn On</button>
            <button onClick={camera.snapshot} data-testid="snapshot">Snapshot</button>
            <button onClick={camera.refreshImage} data-testid="refresh">Refresh</button>
          </div>
        )}
      </Camera>
    )

    screen.getByTestId('turn-on').click()
    expect(mockTurnOn).toHaveBeenCalled()

    screen.getByTestId('snapshot').click()
    expect(mockSnapshot).toHaveBeenCalled()

    screen.getByTestId('refresh').click()
    expect(mockRefreshImage).toHaveBeenCalled()
  })

  it('should handle different camera states', () => {
    const testCases = [
      { state: 'idle', isIdle: true, isRecording: false, isStreaming: false },
      { state: 'recording', isIdle: false, isRecording: true, isStreaming: false },
      { state: 'streaming', isIdle: false, isRecording: false, isStreaming: true },
      { state: 'off', isIdle: false, isRecording: false, isStreaming: false }
    ]

    testCases.forEach(({ state, isIdle, isRecording, isStreaming }, index) => {
      const mockState = createMockCameraState({
        state,
        isIdle,
        isRecording,
        isStreaming
      })
      
      mockUseCamera.mockReturnValue(mockState)

      const { unmount } = render(
        <Camera entityId="camera.test">
          {(camera) => (
            <div data-testid={`state-info-${index}`}>
              <span data-testid={`state-${index}`}>{camera.state}</span>
              <span data-testid={`idle-${index}`}>{camera.isIdle ? 'idle' : 'not-idle'}</span>
              <span data-testid={`recording-${index}`}>{camera.isRecording ? 'recording' : 'not-recording'}</span>
              <span data-testid={`streaming-${index}`}>{camera.isStreaming ? 'streaming' : 'not-streaming'}</span>
            </div>
          )}
        </Camera>
      )

      expect(screen.getByTestId(`state-${index}`)).toHaveTextContent(state)
      expect(screen.getByTestId(`idle-${index}`)).toHaveTextContent(isIdle ? 'idle' : 'not-idle')
      expect(screen.getByTestId(`recording-${index}`)).toHaveTextContent(isRecording ? 'recording' : 'not-recording')
      expect(screen.getByTestId(`streaming-${index}`)).toHaveTextContent(isStreaming ? 'streaming' : 'not-streaming')
      
      // Clean up between tests to avoid DOM overlaps
      unmount()
    })
  })

  it('should handle errors correctly', () => {
    const mockState = createMockCameraState({
      error: new Error('Connection failed')
    })
    
    mockUseCamera.mockReturnValue(mockState)

    render(
      <Camera entityId="camera.test">
        {(camera) => (
          <div data-testid="error-container">
            {camera.error && (
              <span data-testid="error-message">{camera.error.message}</span>
            )}
          </div>
        )}
      </Camera>
    )

    expect(screen.getByTestId('error-message')).toHaveTextContent('Connection failed')
  })

  it('should render with minimal props', () => {
    const minimalMockState = createMockCameraState({
      entityId: 'camera.minimal'
    })
    mockUseCamera.mockReturnValue(minimalMockState)

    render(
      <Camera entityId="camera.minimal">
        {(camera) => <span data-testid="minimal">{camera.entityId}</span>}
      </Camera>
    )

    expect(screen.getByTestId('minimal')).toHaveTextContent('camera.minimal')
    expect(mockUseCamera).toHaveBeenCalledWith('camera.minimal')
  })

  it('should pass through all camera properties', () => {
    const mockState = createMockCameraState({
      entityId: 'camera.comprehensive',
      state: 'streaming',
      isOn: true,
      isRecording: false,
      isStreaming: true,
      isIdle: false,
      motionDetectionEnabled: true,
      accessToken: 'comprehensive-token',
      brand: 'ComprehensiveBrand',
      model: 'ComprehensiveModel',
      supportsOnOff: true,
      supportsStream: true
    })
    
    mockUseCamera.mockReturnValue(mockState)

    render(
      <Camera entityId="camera.comprehensive">
        {(camera) => (
          <div data-testid="comprehensive">
            <span data-testid="entity-id">{camera.entityId}</span>
            <span data-testid="state">{camera.state}</span>
            <span data-testid="is-on">{camera.isOn.toString()}</span>
            <span data-testid="is-recording">{camera.isRecording.toString()}</span>
            <span data-testid="is-streaming">{camera.isStreaming.toString()}</span>
            <span data-testid="is-idle">{camera.isIdle.toString()}</span>
            <span data-testid="motion">{camera.motionDetectionEnabled.toString()}</span>
            <span data-testid="token">{camera.accessToken || 'no-token'}</span>
            <span data-testid="brand">{camera.brand || 'no-brand'}</span>
            <span data-testid="model">{camera.model || 'no-model'}</span>
            <span data-testid="supports-on-off">{camera.supportsOnOff.toString()}</span>
            <span data-testid="supports-stream">{camera.supportsStream.toString()}</span>
          </div>
        )}
      </Camera>
    )

    expect(screen.getByTestId('entity-id')).toHaveTextContent('camera.comprehensive')
    expect(screen.getByTestId('state')).toHaveTextContent('streaming')
    expect(screen.getByTestId('is-on')).toHaveTextContent('true')
    expect(screen.getByTestId('is-recording')).toHaveTextContent('false')
    expect(screen.getByTestId('is-streaming')).toHaveTextContent('true')
    expect(screen.getByTestId('is-idle')).toHaveTextContent('false')
    expect(screen.getByTestId('motion')).toHaveTextContent('true')
    expect(screen.getByTestId('token')).toHaveTextContent('comprehensive-token')
    expect(screen.getByTestId('brand')).toHaveTextContent('ComprehensiveBrand')
    expect(screen.getByTestId('model')).toHaveTextContent('ComprehensiveModel')
    expect(screen.getByTestId('supports-on-off')).toHaveTextContent('true')
    expect(screen.getByTestId('supports-stream')).toHaveTextContent('true')
  })
})