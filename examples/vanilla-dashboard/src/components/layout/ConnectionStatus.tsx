import { useHAConnection } from 'hass-react'

export const ConnectionStatus = () => {
  const { connected, connecting, error, reconnect, config } = useHAConnection()
  
  const autoReconnectEnabled = config.options?.autoReconnect !== false

  const getStatusClass = () => {
    if (connected) return 'connected'
    if (connecting) return 'connecting'
    if (error) return 'error'
    return ''
  }

  const getStatusText = () => {
    if (connecting && !connected) return '⏳ Connecting to Home Assistant...'
    if (connected && !connecting) return '✅ Connected to Home Assistant'
    if (!connected && !connecting && error && autoReconnectEnabled) return '🔄 Reconnecting...'
    if (!connected && !connecting && error && !autoReconnectEnabled) return `❌ ${error.message}`
    if (!connected && !connecting && !error) return '⚠️ Disconnected'
    return ''
  }

  return (
    <div className={`connection-status ${getStatusClass()}`}>
      <span>{getStatusText()}</span>
      {!connected && !connecting && error && !autoReconnectEnabled && (
        <button className="btn btn-primary" onClick={reconnect}>
          Retry Connection
        </button>
      )}
    </div>
  )
}