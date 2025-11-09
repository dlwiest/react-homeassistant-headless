import { createContext, useContext, useEffect, useReducer, useCallback, useRef, ReactNode } from 'react'
import { createConnection, createLongLivedTokenAuth, Connection } from 'home-assistant-js-websocket'
import { useStore } from '../services/entityStore'
import { createMockConnection } from '../services/mockConnection'
import type { HAConfig, ConnectionStatus, EntityState } from '../types'

// Valid conneciton states
type ConnectionState =
  | { type: 'idle'; connection: null; error: null; retryCount: 0 }
  | { type: 'connecting'; connection: null; error: null; retryCount: number }
  | { type: 'connected'; connection: Connection; error: null; retryCount: 0 }
  | { type: 'disconnected'; connection: null; error: null; retryCount: number }
  | { type: 'error'; connection: null; error: Error; retryCount: number }

// All possible state transitions
type ConnectionAction =
  | { type: 'START_CONNECTING' }
  | { type: 'CONNECTION_SUCCESS'; connection: Connection }
  | { type: 'CONNECTION_ERROR'; error: Error }
  | { type: 'DISCONNECTED' }
  | { type: 'RETRY_SCHEDULED' }
  | { type: 'MANUAL_RECONNECT' }
  | { type: 'READY_EVENT'; connection: Connection }

// State machine
function connectionReducer(state: ConnectionState, action: ConnectionAction): ConnectionState {
  switch (action.type) {
    case 'START_CONNECTING':
      return {
        type: 'connecting',
        connection: null,
        error: null,
        retryCount: state.retryCount
      }

    case 'CONNECTION_SUCCESS':
      // Accept connection success in most states, but ignore if already connected with same connection
      if (state.type === 'connected' && state.connection === action.connection) {
        // Already connected with the same connection, ignore duplicate ready event
        return state
      }

      return {
        type: 'connected',
        connection: action.connection,
        error: null,
        retryCount: 0
      }

    case 'CONNECTION_ERROR':
      return {
        type: 'error',
        connection: null,
        error: action.error,
        retryCount: state.retryCount + 1
      }

    case 'DISCONNECTED':
      return {
        type: 'disconnected',
        connection: null,
        error: null,
        retryCount: state.retryCount + 1
      }

    case 'RETRY_SCHEDULED':
      return {
        type: 'connecting',
        connection: null,
        error: null,
        retryCount: state.retryCount
      }

    case 'MANUAL_RECONNECT':
      return {
        type: 'idle',
        connection: null,
        error: null,
        retryCount: 0
      }

    case 'READY_EVENT':
      // Accept ready events in most states to allow reconnection
      return {
        type: 'connected',
        connection: action.connection,
        error: null,
        retryCount: 0
      }

    default:
      return state
  }
}

interface HAContextValue extends ConnectionStatus {
  connection: Connection | null
  config: HAConfig
}

const HAContext = createContext<HAContextValue | null>(null)

export function useHAConnection() {
  const context = useContext(HAContext)
  if (!context) {
    throw new Error('useHAConnection must be used within HAProvider')
  }
  return context
}

interface HAProviderProps {
  children: ReactNode
  url: string
  token?: string
  mockMode?: boolean
  mockData?: Record<string, EntityState>
  options?: HAConfig['options']
}

const HAProvider = ({ children, url, token, mockMode = false, mockData, options = {} }: HAProviderProps) => {
  const [state, dispatch] = useReducer(connectionReducer, {
    type: 'idle',
    connection: null,
    error: null,
    retryCount: 0
  })

  const retryTimeoutRef = useRef<NodeJS.Timeout>()
  const currentConnectionRef = useRef<Connection | null>(null)
  const setStoreConnection = (() => {
    try {
      return useStore((state) => state.setConnection)
    } catch (error) {
      console.warn('Entity store unavailable, using fallback:', error)
      return () => {} // Fallback no-op function
    }
  })()

  // Development warnings for configuration issues
  useEffect(() => {
    if (!mockMode) {
      if (!url) {
        console.warn('HAProvider: url prop is required when not in mock mode')
      } else if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('ws://') && !url.startsWith('wss://')) {
        console.warn(`HAProvider: url "${url}" should start with http://, https://, ws://, or wss://`)
      }
      
      if (!token) {
        console.warn('HAProvider: token prop is required when not in mock mode. Create a long-lived access token in Home Assistant.')
      }
    } else if (!mockData) {
      console.warn('HAProvider: mockMode is enabled but no mockData provided. Entities will have empty state.')
    }
  }, [url, token, mockMode, mockData])

  // Async connection function
  const attemptConnection = useCallback(async () => {
    if (mockMode) {
      // Handle mock mode
      if (mockData) {
        const mockEntities = Object.entries(mockData).map(([id, data]) => ({
          entity_id: id,
          state: data.state || 'unknown',
          attributes: data.attributes || {},
          last_changed: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          context: { id: '', parent_id: null, user_id: null },
        }))
        try {
          useStore.getState().batchUpdate(mockEntities.map((e) => [e.entity_id, e]))
        } catch (error) {
          console.warn('Failed to populate entity store:', error)
        }
      }

      const mockConn = createMockConnection() as Connection
      currentConnectionRef.current = mockConn
      dispatch({ type: 'CONNECTION_SUCCESS', connection: mockConn })
      try {
        setStoreConnection(mockConn)
      } catch (error) {
        console.warn('Failed to set store connection:', error)
      }
      return
    }

    if (!url || !token) {
      dispatch({ type: 'CONNECTION_ERROR', error: new Error('URL and token are required') })
      return
    }

    try {
      const auth = createLongLivedTokenAuth(url, token)
      const conn = await createConnection({ auth })

      // Set up event listeners
      conn.addEventListener('disconnected', () => {
        currentConnectionRef.current = null
        try {
          setStoreConnection(null)
        } catch (error) {
          console.warn('Failed to clear store connection:', error)
        }
        dispatch({ type: 'DISCONNECTED' })
      })

      // Ready event is for when connection is restored after temporary disconnect
      conn.addEventListener('ready', () => {
        // Use READY_EVENT action - reducer will only accept if in valid state
        currentConnectionRef.current = conn
        dispatch({ type: 'READY_EVENT', connection: conn })
        try {
        setStoreConnection(conn)
      } catch (error) {
        console.warn('Failed to set store connection:', error)
      }
      })

      currentConnectionRef.current = conn
      dispatch({ type: 'CONNECTION_SUCCESS', connection: conn })
      try {
        setStoreConnection(conn)
      } catch (error) {
        console.warn('Failed to set store connection:', error)
      }
    } catch (err) {
      const error = err as Error
      let helpfulMessage = `Connection failed: ${error.message}`
      
      // Provide helpful debugging information
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        helpfulMessage += '\n\nPossible causes:\n• Home Assistant is not running\n• URL is incorrect\n• Network connectivity issues\n• CORS issues (try using ws:// instead of http://)'
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        helpfulMessage += '\n\nPossible causes:\n• Invalid or expired access token\n• Token lacks necessary permissions\n• Check your long-lived access token in Home Assistant'
      } else if (error.message.includes('WebSocket connection') || error.message.includes('ws://')) {
        helpfulMessage += '\n\nWebSocket connection issues:\n• Check if WebSocket is enabled in Home Assistant\n• Verify the WebSocket URL format\n• Check firewall/proxy settings'
      }
      
      console.error(helpfulMessage)
      dispatch({ type: 'CONNECTION_ERROR', error })
    }
  }, [url, token, mockMode, mockData, setStoreConnection])

  // Start a connection attempt
  const connect = useCallback(() => {
    // Clear any pending retries
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }

    dispatch({ type: 'START_CONNECTING' })
    attemptConnection()
  }, [attemptConnection])

  // Manual reconnection (resets retry count)
  const reconnect = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }

    if (!mockMode && currentConnectionRef.current) {
      currentConnectionRef.current.close()
      currentConnectionRef.current = null
    }

    dispatch({ type: 'MANUAL_RECONNECT' })
    // Manual reconnect starts immediately
    setTimeout(() => {
      dispatch({ type: 'START_CONNECTING' })
      attemptConnection()
    }, 0)
  }, [attemptConnection, mockMode])

  // Handle auto-retry for disconnections and errors
  useEffect(() => {
    const shouldAutoRetry = (state.type === 'disconnected' || state.type === 'error') &&
      !mockMode &&
      options.autoReconnect !== false

    if (shouldAutoRetry) {
      const delay = Math.min(1000 * Math.pow(2, state.retryCount - 1), 30000)

      retryTimeoutRef.current = setTimeout(() => {
        dispatch({ type: 'RETRY_SCHEDULED' })
        attemptConnection()
      }, delay)
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [state.type, state.retryCount, mockMode, options.autoReconnect, attemptConnection])

  // Auto-connect on mount
  useEffect(() => {
    connect()

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
      if (currentConnectionRef.current) {
        currentConnectionRef.current.close()
        currentConnectionRef.current = null
      }
      try {
        useStore.getState().clear()
      } catch (error) {
        // Handle store unavailability gracefully
        console.warn('Failed to clear entity store:', error)
      }
    }
  }, [])

  // Map internal state to public interface
  const contextValue: HAContextValue = {
    connection: state.connection,
    connected: state.type === 'connected',
    connecting: state.type === 'connecting',
    error: state.type === 'error' ? state.error : null,
    reconnect,
    config: { url, token, mockMode, mockData, options },
  }

  return <HAContext.Provider value={contextValue}>{children}</HAContext.Provider>
}

export default HAProvider