import React, { useState } from 'react'
import { BinarySensor } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface BinarySensorCardProps {
  entityId: string
  name: string
}

const getDeviceIcon = (deviceClass?: string, isOn?: boolean) => {
  switch (deviceClass) {
    case 'door':
    case 'opening':
      return isOn ? '🚪' : '🚪'
    case 'window':
      return isOn ? '🪟' : '🪟'
    case 'motion':
      return isOn ? '👁️' : '👁️'
    case 'occupancy':
      return isOn ? '👥' : '👤'
    case 'safety':
    case 'smoke':
      return isOn ? '🚨' : '✅'
    case 'gas':
      return isOn ? '⚠️' : '✅'
    default:
      return isOn ? '🟢' : '🔴'
  }
}

const getDeviceLabel = (deviceClass?: string) => {
  switch (deviceClass) {
    case 'door': return 'Door Sensor'
    case 'opening': return 'Door/Window Sensor'
    case 'window': return 'Window Sensor'
    case 'motion': return 'Motion Sensor'
    case 'occupancy': return 'Occupancy Sensor'
    case 'safety': return 'Safety Sensor'
    case 'smoke': return 'Smoke Detector'
    case 'gas': return 'Gas Detector'
    default: return 'Binary Sensor'
  }
}

const getStateText = (deviceClass?: string, isOn?: boolean) => {
  switch (deviceClass) {
    case 'door':
    case 'opening':
      return isOn ? 'Open' : 'Closed'
    case 'window':
      return isOn ? 'Open' : 'Closed'
    case 'motion':
      return isOn ? 'Motion Detected' : 'No Motion'
    case 'occupancy':
      return isOn ? 'Occupied' : 'Not Occupied'
    case 'safety':
    case 'smoke':
    case 'gas':
      return isOn ? 'Alert' : 'OK'
    default:
      return isOn ? 'On' : 'Off'
  }
}

const getStateEmoji = (deviceClass?: string, isOn?: boolean) => {
  const isAlert = ['safety', 'smoke', 'gas'].includes(deviceClass || '')
  
  if (isOn) {
    return isAlert ? '🚨' : '✅'
  }
  return '⚫'
}

const getContextMessage = (deviceClass?: string, isOn?: boolean) => {
  switch (deviceClass) {
    case 'motion':
      return isOn ? '🏃 Movement detected in the area' : '😴 Area is quiet'
    case 'door':
    case 'opening':
      return isOn ? '🚪 Entry is open' : '🔒 Entry is secure'
    case 'occupancy':
      return isOn ? '👥 Someone is present' : '🏠 Room is empty'
    case 'safety':
    case 'smoke':
    case 'gas':
      return isOn ? '⚠️ Alert condition detected!' : '✅ All systems normal'
    default:
      return null
  }
}

export const BinarySensorCard = ({ entityId, name }: BinarySensorCardProps) => {
  const [actionError, setActionError] = useState<string | null>(null)

  return (
    <BinarySensor entityId={entityId}>
      {(binarySensor) => {
        // Check for entity availability errors
        if (binarySensor.error) {
          return (
            <Card>
              <CardHeader 
                title={name}
                subtitle="Entity Error"
              />
              <CardContent>
                <div className="error-message">
                  ⚠️ {binarySensor.error.message}
                </div>
              </CardContent>
            </Card>
          )
        }

        const stateText = getStateText(binarySensor.deviceClass, binarySensor.isOn)
        const deviceLabel = getDeviceLabel(binarySensor.deviceClass)
        const contextMessage = getContextMessage(binarySensor.deviceClass, binarySensor.isOn)
        const isAlert = ['safety', 'smoke', 'gas'].includes(binarySensor.deviceClass || '')

        return (
          <Card>
            <CardHeader 
              title={name}
              subtitle={
                <div className="binary-sensor-status">
                  <span>{binarySensor.isConnected ? stateText : 'Disconnected'}</span>
                  {!binarySensor.isConnected && <span className="disconnected">📶</span>}
                </div>
              }
              icon={getDeviceIcon(binarySensor.deviceClass, binarySensor.isOn)}
            />

            {/* Display action errors */}
            {actionError && (
              <CardContent>
                <div className="error-message">
                  ❌ {actionError}
                  <button 
                    className="error-dismiss"
                    onClick={() => setActionError(null)}
                  >
                    ×
                  </button>
                </div>
              </CardContent>
            )}

            <CardContent>
              <div className="binary-sensor-content">
                {/* Status indicator */}
                <div className="status-section">
                  <div className="status-header">
                    <span>Status</span>
                    <span className={`status-value ${isAlert && binarySensor.isOn ? 'alert' : binarySensor.isOn ? 'active' : 'inactive'}`}>
                      {getStateEmoji(binarySensor.deviceClass, binarySensor.isOn)} {stateText}
                    </span>
                  </div>
                </div>

                {/* Context message */}
                {contextMessage && (
                  <div className="context-message">
                    {contextMessage}
                  </div>
                )}

                {/* Device information */}
                <div className="device-info">
                  <div><strong>Type:</strong> {deviceLabel}</div>
                  {binarySensor.deviceClass && (
                    <div><strong>Class:</strong> {binarySensor.deviceClass}</div>
                  )}
                  {binarySensor.icon && (
                    <div><strong>Icon:</strong> {binarySensor.icon}</div>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <div className="binary-sensor-info">
                <div className="tags">
                  <span className="tag">{deviceLabel}</span>
                  {binarySensor.deviceClass && <span className="tag secondary">{binarySensor.deviceClass}</span>}
                  {binarySensor.isOn && <span className={`tag ${isAlert ? 'alert' : 'active'}`}>
                    {isAlert ? 'ALERT' : 'ACTIVE'}
                  </span>}
                </div>
                <div className="entity-details">
                  <span><strong>Entity ID:</strong> {binarySensor.entityId}</span>
                  <span><strong>Last Updated:</strong> {binarySensor.lastUpdated.toLocaleTimeString()}</span>
                </div>
                {!binarySensor.isConnected && (
                  <p className="connection-warning">
                    ⚠️ Not connected to Home Assistant
                  </p>
                )}
              </div>
            </CardFooter>
          </Card>
        )
      }}
    </BinarySensor>
  )
}