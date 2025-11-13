import { useState, useEffect, useCallback } from 'react'
import type { AuthState, AuthError, AuthConfig } from '../types/auth'
import { hasStoredAuth, loadAuthData } from '../services/tokenStorage'
import { logout as authLogout, isOAuthCallback } from '../services/auth'

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
      const authError: AuthError = {
        code: 'unknown',
        message: error instanceof Error ? error.message : 'Authentication check failed',
        type: 'unknown'
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