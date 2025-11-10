import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import {
  validateEntityIdFormat,
  useEntityExistenceWarning,
  useEntityIdValidation,
  useEntityValidation
} from '../entityValidation'

// Mock the entity store
vi.mock('../../services/entityStore', () => ({
  useStore: {
    getState: () => ({
      entities: new Map([
        ['light.existing', { entity_id: 'light.existing', state: 'on' }]
      ])
    })
  }
}))

describe('entityValidation utilities', () => {
  let consoleMock: any

  beforeEach(() => {
    consoleMock = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    consoleMock.mockRestore()
    vi.useRealTimers()
  })

  describe('validateEntityIdFormat', () => {
    it('should return true for valid entity ID', () => {
      const result = validateEntityIdFormat('light.living_room')
      expect(result).toBe(true)
      expect(consoleMock).not.toHaveBeenCalled()
    })

    it('should return false and warn for empty entity ID', () => {
      const result = validateEntityIdFormat('')
      expect(result).toBe(false)
      expect(consoleMock).toHaveBeenCalledWith('entityId is required')
    })

    it('should return false and warn for entity ID without domain', () => {
      const result = validateEntityIdFormat('living_room')
      expect(result).toBe(false)
      expect(consoleMock).toHaveBeenCalledWith(
        'Invalid entity ID format "living_room". ' +
        'Entity IDs should be in format "domain.entity_name" (e.g., "light.living_room")'
      )
    })

    it('should include hook name in warning when provided', () => {
      validateEntityIdFormat('', 'useLight')
      expect(consoleMock).toHaveBeenCalledWith('useLight: entityId is required')
    })

    it('should include hook name in format warning', () => {
      validateEntityIdFormat('living_room', 'useLight')
      expect(consoleMock).toHaveBeenCalledWith(
        'useLight: Invalid entity ID format "living_room". ' +
        'Entity IDs should be in format "domain.entity_name" (e.g., "light.living_room")'
      )
    })
  })

  describe('useEntityExistenceWarning', () => {
    it('should not warn when entity exists', () => {
      const mockEntity = { entity_id: 'light.existing', state: 'on' }
      
      renderHook(() => 
        useEntityExistenceWarning('light.existing', true, mockEntity)
      )
      
      vi.runAllTimers()
      expect(consoleMock).not.toHaveBeenCalled()
    })

    it('should not warn when not connected', () => {
      renderHook(() => 
        useEntityExistenceWarning('light.missing', false, undefined)
      )
      
      vi.runAllTimers()
      expect(consoleMock).not.toHaveBeenCalled()
    })

    it('should not warn when entity ID is empty', () => {
      renderHook(() => 
        useEntityExistenceWarning('', true, undefined)
      )
      
      vi.runAllTimers()
      expect(consoleMock).not.toHaveBeenCalled()
    })

    it('should warn when entity is missing after delay', () => {
      renderHook(() => 
        useEntityExistenceWarning('light.missing', true, undefined)
      )
      
      vi.runAllTimers()
      expect(consoleMock).toHaveBeenCalledWith(
        'Entity "light.missing" not found in Home Assistant. ' +
        'Check that the entity exists and is available.'
      )
    })

    it('should use custom delay', () => {
      renderHook(() => 
        useEntityExistenceWarning('light.missing', true, undefined, 5000)
      )
      
      vi.advanceTimersByTime(4999)
      expect(consoleMock).not.toHaveBeenCalled()
      
      vi.advanceTimersByTime(1)
      expect(consoleMock).toHaveBeenCalled()
    })

    it('should cleanup timer on unmount', () => {
      const { unmount } = renderHook(() => 
        useEntityExistenceWarning('light.missing', true, undefined)
      )
      
      unmount()
      vi.runAllTimers()
      expect(consoleMock).not.toHaveBeenCalled()
    })

    it('should cleanup and restart timer when dependencies change', () => {
      let entityId = 'light.missing1'
      const { rerender } = renderHook(() => 
        useEntityExistenceWarning(entityId, true, undefined)
      )
      
      // Change entity ID before timer fires
      entityId = 'light.missing2'
      rerender()
      
      vi.runAllTimers()
      expect(consoleMock).toHaveBeenCalledWith(
        'Entity "light.missing2" not found in Home Assistant. ' +
        'Check that the entity exists and is available.'
      )
    })
  })

  describe('useEntityIdValidation', () => {
    it('should validate entity ID format on mount and changes', () => {
      let entityId = 'invalid_format'
      const { rerender } = renderHook(() => 
        useEntityIdValidation(entityId, 'useLight')
      )
      
      expect(consoleMock).toHaveBeenCalledWith(
        'useLight: Invalid entity ID format "invalid_format". ' +
        'Entity IDs should be in format "domain.entity_name" (e.g., "light.living_room")'
      )
      
      consoleMock.mockClear()
      
      entityId = 'light.valid'
      rerender()
      
      expect(consoleMock).not.toHaveBeenCalled()
    })
  })

  describe('useEntityValidation', () => {
    it('should combine format and existence validation', () => {
      renderHook(() => 
        useEntityValidation('invalid_format', true, undefined, 'useLight')
      )
      
      // Should validate format immediately
      expect(consoleMock).toHaveBeenCalledWith(
        'useLight: Invalid entity ID format "invalid_format". ' +
        'Entity IDs should be in format "domain.entity_name" (e.g., "light.living_room")'
      )
      
      consoleMock.mockClear()
      
      // Should also check existence after delay (but this won't warn due to format issue)
      vi.runAllTimers()
    })

    it('should work with valid entity that exists', () => {
      const mockEntity = { entity_id: 'light.existing', state: 'on' }
      
      renderHook(() => 
        useEntityValidation('light.existing', true, mockEntity, 'useLight')
      )
      
      vi.runAllTimers()
      expect(consoleMock).not.toHaveBeenCalled()
    })

    it('should warn about missing entity with valid format', () => {
      renderHook(() => 
        useEntityValidation('light.missing', true, undefined, 'useLight')
      )
      
      vi.runAllTimers()
      expect(consoleMock).toHaveBeenCalledWith(
        'Entity "light.missing" not found in Home Assistant. ' +
        'Check that the entity exists and is available.'
      )
    })

    it('should use custom existence check delay', () => {
      renderHook(() => 
        useEntityValidation('light.missing', true, undefined, 'useLight', 3000)
      )
      
      vi.advanceTimersByTime(2999)
      expect(consoleMock).not.toHaveBeenCalled()
      
      vi.advanceTimersByTime(1)
      expect(consoleMock).toHaveBeenCalledWith(
        'Entity "light.missing" not found in Home Assistant. ' +
        'Check that the entity exists and is available.'
      )
    })
  })
})