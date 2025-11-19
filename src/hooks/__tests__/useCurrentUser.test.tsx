import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCurrentUser } from '../useCurrentUser'
import type { CurrentUser } from '../../types'

// Mock HAProvider
const mockConnection = {
  sendMessagePromise: vi.fn()
}

const mockUseHAConnection = vi.fn()

vi.mock('../../providers/HAProvider', () => ({
  useHAConnection: () => mockUseHAConnection()
}))

describe('useCurrentUser', () => {
  const mockUser: CurrentUser = {
    id: 'test-user-id',
    name: 'Test User',
    is_owner: true,
    is_admin: true,
    local_only: false,
    system_generated: false,
    group_ids: ['group-1', 'group-2']
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockConnection.sendMessagePromise.mockResolvedValue(mockUser)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Mock Mode', () => {
    it('should return default mock user when in mock mode without custom user', async () => {
      mockUseHAConnection.mockReturnValue({
        connection: null,
        config: { mockMode: true, url: 'http://test.local:8123' }
      })

      const { result } = renderHook(() => useCurrentUser())

      await waitFor(() => {
        expect(result.current).not.toBeNull()
        expect(result.current?.id).toBe('mock-user-id')
        expect(result.current?.name).toBe('Mock User')
        expect(result.current?.is_owner).toBe(true)
        expect(result.current?.is_admin).toBe(true)
      })

      // Should not call the connection
      expect(mockConnection.sendMessagePromise).not.toHaveBeenCalled()
    })

    it('should return custom mock user when provided in config', async () => {
      const customMockUser: CurrentUser = {
        id: 'custom-mock-id',
        name: 'Custom Mock User',
        is_owner: false,
        is_admin: false,
        local_only: true,
        system_generated: false,
        group_ids: ['custom-group']
      }

      mockUseHAConnection.mockReturnValue({
        connection: null,
        config: {
          mockMode: true,
          mockUser: customMockUser,
          url: 'http://test.local:8123'
        }
      })

      const { result } = renderHook(() => useCurrentUser())

      await waitFor(() => {
        expect(result.current).toEqual(customMockUser)
      })

      expect(mockConnection.sendMessagePromise).not.toHaveBeenCalled()
    })
  })

  describe('Real Connection', () => {
    it('should return null when no connection exists', async () => {
      mockUseHAConnection.mockReturnValue({
        connection: null,
        config: { mockMode: false, url: 'http://test.local:8123' }
      })

      const { result } = renderHook(() => useCurrentUser())

      await waitFor(() => {
        expect(result.current).toBeNull()
      })

      expect(mockConnection.sendMessagePromise).not.toHaveBeenCalled()
    })

    it('should fetch user data when connection exists', async () => {
      mockUseHAConnection.mockReturnValue({
        connection: mockConnection,
        config: { mockMode: false, url: 'http://test.local:8123' }
      })

      const { result } = renderHook(() => useCurrentUser())

      await waitFor(() => {
        expect(result.current).toEqual(mockUser)
      })

      expect(mockConnection.sendMessagePromise).toHaveBeenCalledWith({
        type: 'auth/current_user'
      })
    })

    it('should handle fetch errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockConnection.sendMessagePromise.mockRejectedValue(new Error('Fetch failed'))

      mockUseHAConnection.mockReturnValue({
        connection: mockConnection,
        config: { mockMode: false, url: 'http://test.local:8123' }
      })

      const { result } = renderHook(() => useCurrentUser())

      await waitFor(() => {
        expect(result.current).toBeNull()
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to fetch current user:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Connection Changes', () => {
    it('should refetch user when connection becomes available', async () => {
      // Start with no connection
      mockUseHAConnection.mockReturnValue({
        connection: null,
        config: { mockMode: false, url: 'http://test.local:8123' }
      })

      const { result, rerender } = renderHook(() => useCurrentUser())

      await waitFor(() => {
        expect(result.current).toBeNull()
      })

      expect(mockConnection.sendMessagePromise).not.toHaveBeenCalled()

      // Connection becomes available
      mockUseHAConnection.mockReturnValue({
        connection: mockConnection,
        config: { mockMode: false, url: 'http://test.local:8123' }
      })

      rerender()

      await waitFor(() => {
        expect(result.current).toEqual(mockUser)
      })

      expect(mockConnection.sendMessagePromise).toHaveBeenCalledWith({
        type: 'auth/current_user'
      })
    })

    it('should clear user when connection is lost', async () => {
      // Start with connection
      mockUseHAConnection.mockReturnValue({
        connection: mockConnection,
        config: { mockMode: false, url: 'http://test.local:8123' }
      })

      const { result, rerender } = renderHook(() => useCurrentUser())

      await waitFor(() => {
        expect(result.current).toEqual(mockUser)
      })

      // Connection is lost
      mockUseHAConnection.mockReturnValue({
        connection: null,
        config: { mockMode: false, url: 'http://test.local:8123' }
      })

      rerender()

      await waitFor(() => {
        expect(result.current).toBeNull()
      })
    })
  })

  describe('Mode Switching', () => {
    it('should switch from real mode to mock mode', async () => {
      // Start in real mode
      mockUseHAConnection.mockReturnValue({
        connection: mockConnection,
        config: { mockMode: false, url: 'http://test.local:8123' }
      })

      const { result, rerender } = renderHook(() => useCurrentUser())

      await waitFor(() => {
        expect(result.current).toEqual(mockUser)
      })

      // Switch to mock mode
      mockUseHAConnection.mockReturnValue({
        connection: null,
        config: { mockMode: true, url: 'http://test.local:8123' }
      })

      rerender()

      await waitFor(() => {
        expect(result.current?.id).toBe('mock-user-id')
        expect(result.current?.name).toBe('Mock User')
      })
    })

    it('should switch from mock mode to real mode', async () => {
      // Start in mock mode
      mockUseHAConnection.mockReturnValue({
        connection: null,
        config: { mockMode: true, url: 'http://test.local:8123' }
      })

      const { result, rerender } = renderHook(() => useCurrentUser())

      await waitFor(() => {
        expect(result.current?.id).toBe('mock-user-id')
      })

      // Switch to real mode with connection
      mockUseHAConnection.mockReturnValue({
        connection: mockConnection,
        config: { mockMode: false, url: 'http://test.local:8123' }
      })

      rerender()

      await waitFor(() => {
        expect(result.current).toEqual(mockUser)
      })

      expect(mockConnection.sendMessagePromise).toHaveBeenCalledWith({
        type: 'auth/current_user'
      })
    })
  })

  describe('User Data Properties', () => {
    it('should correctly return all user properties', async () => {
      const fullUser: CurrentUser = {
        id: 'user-123',
        name: 'John Doe',
        is_owner: true,
        is_admin: false,
        local_only: true,
        system_generated: false,
        group_ids: ['admins', 'users', 'editors']
      }

      mockConnection.sendMessagePromise.mockResolvedValue(fullUser)
      mockUseHAConnection.mockReturnValue({
        connection: mockConnection,
        config: { mockMode: false, url: 'http://test.local:8123' }
      })

      const { result } = renderHook(() => useCurrentUser())

      await waitFor(() => {
        expect(result.current).toEqual(fullUser)
        expect(result.current?.id).toBe('user-123')
        expect(result.current?.name).toBe('John Doe')
        expect(result.current?.is_owner).toBe(true)
        expect(result.current?.is_admin).toBe(false)
        expect(result.current?.local_only).toBe(true)
        expect(result.current?.system_generated).toBe(false)
        expect(result.current?.group_ids).toEqual(['admins', 'users', 'editors'])
      })
    })

    it('should handle non-owner, non-admin users', async () => {
      const limitedUser: CurrentUser = {
        id: 'limited-user',
        name: 'Limited User',
        is_owner: false,
        is_admin: false,
        local_only: false,
        system_generated: false,
        group_ids: []
      }

      mockConnection.sendMessagePromise.mockResolvedValue(limitedUser)
      mockUseHAConnection.mockReturnValue({
        connection: mockConnection,
        config: { mockMode: false, url: 'http://test.local:8123' }
      })

      const { result } = renderHook(() => useCurrentUser())

      await waitFor(() => {
        expect(result.current?.is_owner).toBe(false)
        expect(result.current?.is_admin).toBe(false)
        expect(result.current?.group_ids).toEqual([])
      })
    })
  })
})
