import { useState, useEffect, useCallback } from 'react'
import type { AuthState, AuthError, AuthConfig } from '../types/auth'
import { hasStoredAuth, loadAuthData } from '../services/tokenStorage'
import { logout as authLogout, isOAuthCallback } from '../services/auth'

// Type guard for AuthError
function isAuthError(error: unknown): error is AuthError {
  return error instanceof Error && 
    'userMessage' in error && 
    'type' in error && 
    'recoverable' in error &&
    'code' in error
}

// Hook for managing authentication state
export function useAuth(hassUrl: string | null, authMode: AuthConfig['authMode'] = 'auto') {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
    authMode: null,
    hassUrl
  })

  // Update authentication state
  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setAuthState(prev => ({ ...prev, ...updates }))
  }, [])

  // Check authentication status
  const checkAuth = useCallback(async () => {
    if (!hassUrl) {
      updateAuthState({
        isAuthenticated: false,
        isLoading: false,
        authMode: null,
        hassUrl: null
      })
      return
    }

    updateAuthState({ isLoading: true, error: null })

    try {
      // Check if we have stored auth or this is an OAuth callback
      const hasStored = hasStoredAuth(hassUrl)
      const isCallback = isOAuthCallback()
      
      if (hasStored || isCallback) {
        // Verify the stored auth is still valid
        const storedAuth = loadAuthData(hassUrl)
        const isValid = storedAuth && (!storedAuth.expires_at || Date.now() < storedAuth.expires_at)
        
        updateAuthState({
          isAuthenticated: isValid || isCallback,
          isLoading: false,
          authMode: 'oauth',
          hassUrl
        })
      } else {
        // No stored auth
        updateAuthState({
          isAuthenticated: false,
          isLoading: false,
          authMode: authMode || 'auto',
          hassUrl
        })
      }
    } catch (error) {
      // If it's already an AuthError, use it; otherwise create a generic one
      const authError: AuthError = isAuthError(error)
        ? error
        : {
            code: 'unknown',
            message: error instanceof Error ? error.message : 'Authentication check failed',
            userMessage: 'Failed to check authentication status. Please try again.',
            type: 'unknown',
            recoverable: true,
            retryAction: 'retry_auth'
          }
      
      updateAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: authError,
        authMode: authMode || 'auto',
        hassUrl
      })
    }
  }, [hassUrl, authMode, updateAuthState])

  // Login function (triggers OAuth flow)
  const login = useCallback(() => {
    if (!hassUrl) return
    
    updateAuthState({ error: null })
    // This will be handled by the HAProvider connection logic
    // which will redirect to OAuth if needed
  }, [hassUrl, updateAuthState])

  // Logout function
  const logout = useCallback(() => {
    if (!hassUrl) return
    
    authLogout(hassUrl)
    updateAuthState({
      isAuthenticated: false,
      error: null,
      authMode: authMode || 'auto',
      hassUrl
    })
  }, [hassUrl, authMode, updateAuthState])

  // Set authentication error
  const setAuthError = useCallback((error: AuthError | null) => {
    updateAuthState({ error, isLoading: false })
  }, [updateAuthState])

  // Set authenticated state
  const setAuthenticated = useCallback((authenticated: boolean) => {
    updateAuthState({ 
      isAuthenticated: authenticated, 
      isLoading: false,
      error: authenticated ? null : authState.error
    })
  }, [updateAuthState, authState.error])

  // Check auth on mount and when hassUrl changes
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    ...authState,
    login,
    logout,
    setAuthError,
    setAuthenticated,
    checkAuth
  }
}