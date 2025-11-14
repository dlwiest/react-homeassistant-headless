import { useHAConnection } from 'hass-react'

export const ConnectionStatus = () => {
  const { connected, connecting, error, reconnect, config } = useHAConnection()
  
  const autoReconnectEnabled = config.options?.autoReconnect !== false

  const getStatusText = () => {
    if (connecting && !connected) return 'Connecting...'
    if (connected && !connecting) return 'Connected'
    if (!connected && !connecting && error && autoReconnectEnabled) return 'Reconnecting...'
    if (!connected && !connecting && error && !autoReconnectEnabled) return error.message
    if (!connected && !connecting && !error) return 'Disconnected'
    return ''
  }

  const getStatusClasses = () => {
    const base = "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border"
    if (connected) return `${base} bg-emerald-500/10 border-emerald-500/30 text-emerald-400`
    if (connecting) return `${base} bg-blue-500/10 border-blue-500/30 text-blue-400`
    if (error) return `${base} bg-red-500/10 border-red-500/30 text-red-400`
    return base
  }

  return (
    <div className={getStatusClasses()}>
      {connected && (
        <div className="h-2 w-2 rounded-full bg-emerald-500" style={{ animation: 'pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
      )}
      <span>{getStatusText()}</span>
      {!connected && !connecting && error && !autoReconnectEnabled && (
        <button className="ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-white text-xs transition-colors" onClick={reconnect}>
          Retry
        </button>
      )}
    </div>
  )
}