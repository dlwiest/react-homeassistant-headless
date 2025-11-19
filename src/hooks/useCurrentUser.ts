import { useState, useEffect } from 'react'
import { useHAConnection } from '../providers/HAProvider'
import type { CurrentUser } from '../types'

export function useCurrentUser(): CurrentUser | null {
  const { connection, config } = useHAConnection()
  const [user, setUser] = useState<CurrentUser | null>(null)

  useEffect(() => {
    // Return configurable mock user in mock mode
    if (config.mockMode) {
      setUser(config.mockUser || {
        id: 'mock-user-id',
        name: 'Mock User',
        is_owner: true,
        is_admin: true,
        local_only: false,
        system_generated: false,
        group_ids: ['mock-group-1'],
      })
      return
    }

    if (!connection) {
      setUser(null)
      return
    }

    // Fetch current user info from Home Assistant
    const fetchUser = async () => {
      try {
        const result = await connection.sendMessagePromise({
          type: 'auth/current_user',
        })
        setUser(result as CurrentUser)
      } catch (error) {
        console.error('Failed to fetch current user:', error)
        setUser(null)
      }
    }

    fetchUser()
  }, [connection, config.mockMode, config.mockUser])

  return user
}
