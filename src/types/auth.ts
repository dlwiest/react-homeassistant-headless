// Authentication types for OAuth and token-based auth

export type AuthMode = 'token' | 'oauth' | 'auto'

export interface StoredAuthData {
  access_token: string
  refresh_token?: string
  expires_at?: number
  hassUrl: string
  created_at: number
}

export interface AuthError {
  code: string
  message: string
  userMessage: string  // User-friendly message
  type: 'network' | 'auth_expired' | 'invalid_credentials' | 'oauth_cancelled' | 'config_error' | 'unknown'
  recoverable: boolean  // Whether user can retry
  retryAction?: 'retry_auth' | 'check_config' | 'contact_admin'
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  error: AuthError | null
  authMode: AuthMode | null
  hassUrl: string | null
}

export interface AuthConfig {
  hassUrl: string
  redirectUri?: string
  authMode?: AuthMode
  token?: string
  tokenRefreshBufferMinutes?: number
}

export interface OAuthCallbackData {
  code?: string
  state?: string
  error?: string
  error_description?: string
}