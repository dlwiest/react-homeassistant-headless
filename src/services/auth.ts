import { 
  getAuth, 
  createConnection, 
  createLongLivedTokenAuth,
  Auth,
  Connection,
  type AuthData,
  type SaveTokensFunc 
} from 'home-assistant-js-websocket'
import type { AuthConfig, AuthError, StoredAuthData } from '../types/auth'
import { saveAuthData, loadAuthData, removeAuthData } from './tokenStorage'

// Constants
const ONE_DAY_MS = 24 * 60 * 60 * 1000
const DEFAULT_TOKEN_BUFFER_MINUTES = 30 // Buffer time before token expiration to trigger refresh

// Generate OAuth authorization URL for Home Assistant
export function getOAuthUrl(hassUrl: string, redirectUri?: string): string {
  if (!hassUrl || typeof hassUrl !== 'string') {
    throw createAuthError('config_error', 'hassUrl is required and must be a string')
  }
  
  const cleanUrl = hassUrl.replace(/\/$/, '')
  // Convert WebSocket URL to HTTP URL for OAuth
  const httpUrl = cleanUrl.replace(/^ws:\/\//, 'http://').replace(/^wss:\/\//, 'https://')
  const redirect = redirectUri || window.location.href
  const state = generateRandomState()
  
  // Store state for verification
  sessionStorage.setItem('hass-oauth-state', state)
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: new URL(redirect).origin, // Use origin only as client_id
    redirect_uri: redirect,
    state
  })
  
  return `${httpUrl}/auth/authorize?${params.toString()}`
}

// Handle OAuth callback with authorization code
export async function handleOAuthCallback(hassUrl: string): Promise<Auth> {
  if (!hassUrl || typeof hassUrl !== 'string') {
    throw createAuthError('config_error', 'hassUrl is required and must be a string')
  }
  
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')
  const error = urlParams.get('error')
  
  if (error) {
    const errorType = error === 'access_denied' ? 'oauth_cancelled' : 'invalid_credentials'
    const errorCode = error
    throw createAuthError(errorType, urlParams.get('error_description') || error, errorCode)
  }
  
  if (!code) {
    throw createAuthError('oauth_cancelled', 'No authorization code received', 'no_code')
  }
  
  // Verify state parameter
  const storedState = sessionStorage.getItem('hass-oauth-state')
  if (state !== storedState) {
    console.warn('OAuth state mismatch:', { received: state, stored: storedState })
    throw createAuthError('config_error', 'OAuth state parameter mismatch - possible security issue', 'state_mismatch')
  }
  
  // Clean up state
  sessionStorage.removeItem('hass-oauth-state')
  
  // Exchange code for tokens
  const auth = await getAuth({
    hassUrl,
    authCode: code,
    clientId: window.location.origin, // Use origin as client_id to match OAuth request
    redirectUrl: window.location.href.split('?')[0] // Use current URL without query params
  })
  
  // Store the auth data
  saveAuthData(hassUrl, {
    access_token: auth.data.access_token,
    refresh_token: auth.data.refresh_token,
    expires_at: auth.data.expires
  })
  
  // Clean up OAuth parameters from URL
  const url = new URL(window.location.href)
  url.searchParams.delete('code')
  url.searchParams.delete('state')
  window.history.replaceState({}, document.title, url.toString())
  
  return auth
}

// Create connection using stored or provided authentication
export async function createAuthenticatedConnection(config: AuthConfig): Promise<{ connection: Connection; auth: Auth }> {
  const { hassUrl, token, authMode, tokenRefreshBufferMinutes = DEFAULT_TOKEN_BUFFER_MINUTES } = config
  
  // Determine auth method
  const shouldUseOAuth = authMode === 'oauth' || (authMode === 'auto' && !token)
  
  let auth: Auth
  
  if (shouldUseOAuth) {
    // Try to load stored OAuth tokens
    const storedAuth = loadAuthData(hassUrl)
    
    if (storedAuth) {
      // Use stored tokens and refresh if needed
      auth = createAuthFromStoredData(storedAuth)
      try {
        auth = await refreshTokenIfNeeded(auth, tokenRefreshBufferMinutes)
      } catch (refreshError) {
        // Token refresh failed, clear stored tokens and redirect to OAuth
        removeAuthData(hassUrl)
        window.location.href = getOAuthUrl(hassUrl, config.redirectUri)
        throw refreshError
      }
    } else {
      // Check if this is an OAuth callback
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('code')) {
        auth = await handleOAuthCallback(hassUrl)
      } else {
        // Redirect to OAuth
        window.location.href = getOAuthUrl(hassUrl, config.redirectUri)
        throw createAuthError('auth_expired', 'Redirecting to authentication')
      }
    }
  } else {
    // Use long-lived token
    if (!token) {
      throw createAuthError('invalid_credentials', 'No token provided for token-based authentication')
    }
    auth = createLongLivedTokenAuth(hassUrl, token)
  }
  
  // Create and return connection with auth object
  const connection = await createConnection({ auth })
  return { connection, auth }
}

// Logout and clear stored authentication
export function logout(hassUrl: string): void {
  if (!hassUrl || typeof hassUrl !== 'string') {
    throw createAuthError('config_error', 'hassUrl is required and must be a string')
  }
  
  removeAuthData(hassUrl)
  // Clear URL parameters if they exist
  if (window.location.search.includes('code=')) {
    const url = new URL(window.location.href)
    url.searchParams.delete('code')
    url.searchParams.delete('state')
    window.history.replaceState({}, document.title, url.toString())
  }
}

// Check if current URL contains OAuth callback parameters
export function isOAuthCallback(): boolean {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.has('code') || urlParams.has('error')
}

// Generate cryptographically secure random state for OAuth flow
function generateRandomState(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// Create Auth from stored token data with refresh capability
function createAuthFromStoredData(storedAuth: StoredAuthData): Auth {
  if (storedAuth.refresh_token) {
    // Create OAuth auth with refresh capability
    const authData: AuthData = {
      hassUrl: storedAuth.hassUrl,
      clientId: null,
      expires: storedAuth.expires_at || Date.now() + ONE_DAY_MS,
      refresh_token: storedAuth.refresh_token,
      access_token: storedAuth.access_token,
      expires_in: Math.floor((storedAuth.expires_at || Date.now() + ONE_DAY_MS) - Date.now()) / 1000
    }
    
    // Create save function that updates our localStorage
    const saveTokens: SaveTokensFunc = (data: AuthData | null) => {
      if (data) {
        saveAuthData(storedAuth.hassUrl, {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: data.expires
        })
      }
    }
    
    return new Auth(authData, saveTokens)
  } else {
    // Fallback to long-lived token (no refresh capability)
    return createLongLivedTokenAuth(storedAuth.hassUrl, storedAuth.access_token)
  }
}

// Check if auth token is expired or will expire soon
export function isTokenExpiring(auth: Auth, bufferMinutes: number = DEFAULT_TOKEN_BUFFER_MINUTES): boolean {
  try {
    if (auth.expired) return true
    
    // Check if expires within buffer time
    const bufferMs = bufferMinutes * 60 * 1000
    return auth.data.expires <= Date.now() + bufferMs
  } catch {
    return false
  }
}

// Refresh auth token if needed
export async function refreshTokenIfNeeded(auth: Auth, bufferMinutes: number = DEFAULT_TOKEN_BUFFER_MINUTES): Promise<Auth> {
  if (isTokenExpiring(auth, bufferMinutes)) {
    try {
      await auth.refreshAccessToken()
      return auth
    } catch (error) {
      // Refresh failed - token might be revoked
      throw createAuthError('auth_expired', 'Token refresh failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }
  return auth
}

// Create standardized auth errors with user-friendly messages
function createAuthError(type: AuthError['type'], message: string, code?: string): AuthError {
  const errorMap: Record<AuthError['type'], {
    userMessage: string
    recoverable: boolean
    retryAction?: AuthError['retryAction']
  }> = {
    network: {
      userMessage: 'Unable to connect to Home Assistant. Please check your network connection and try again.',
      recoverable: true,
      retryAction: 'retry_auth'
    },
    auth_expired: {
      userMessage: 'Your authentication has expired. Please sign in again.',
      recoverable: true,
      retryAction: 'retry_auth'
    },
    invalid_credentials: {
      userMessage: 'Authentication failed. Please check your credentials and try again.',
      recoverable: true,
      retryAction: 'retry_auth'
    },
    oauth_cancelled: {
      userMessage: 'Authentication was cancelled. Please try signing in again.',
      recoverable: true,
      retryAction: 'retry_auth'
    },
    config_error: {
      userMessage: 'There is a configuration problem with Home Assistant. Please contact your administrator.',
      recoverable: false,
      retryAction: 'contact_admin'
    },
    unknown: {
      userMessage: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
      recoverable: true,
      retryAction: 'retry_auth'
    }
  }

  const errorInfo = errorMap[type]
  
  return {
    code: code || type,
    message,
    userMessage: errorInfo.userMessage,
    type,
    recoverable: errorInfo.recoverable,
    retryAction: errorInfo.retryAction
  }
}