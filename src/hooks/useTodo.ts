import { useEntity } from './useEntity'
import { createDomainValidator } from '../utils/entityId'
import type { TodoState, TodoAttributes, TodoItem } from '../types'
import { TodoFeatures } from '../types'
import { useState, useEffect, useCallback } from 'react'
import { checkFeatures } from '../utils/features'
import { FeatureNotSupportedError } from '../utils/errors'

const validateTodoEntityId = createDomainValidator('todo', 'useTodo')

export function useTodo(entityId: string): TodoState {
  const normalizedEntityId = validateTodoEntityId(entityId)
  const entity = useEntity<TodoAttributes>(normalizedEntityId)
  const { state, callServiceWithResponse, callService, attributes } = entity
  
  const [items, setItems] = useState<TodoItem[]>([])
  const [isLoadingItems, setIsLoadingItems] = useState(false)

  const itemCount = state === 'unknown' ? 0 : parseInt(state, 10) || 0
  
  // Check supported features
  const features = checkFeatures(attributes.supported_features, {
    addItem: TodoFeatures.SUPPORT_ADD_ITEM,
    removeItem: TodoFeatures.SUPPORT_REMOVE_ITEM,
    updateItem: TodoFeatures.SUPPORT_UPDATE_ITEM,
    clearCompleted: TodoFeatures.SUPPORT_CLEAR_COMPLETED
  })
  
  const { addItem: supportsAddItem, removeItem: supportsRemoveItem, updateItem: supportsUpdateItem, clearCompleted: supportsClearCompleted } = features

  // Fetch todo items when the component mounts or entity state changes
  useEffect(() => {
    const fetchItems = async () => {
      if (!entity.isConnected || entity.error) return
      
      try {
        setIsLoadingItems(true)
        // Use the todo.get_items service to fetch items
        const response = await callServiceWithResponse<{ response: Record<string, { items: TodoItem[] }> }>('todo', 'get_items', {
          entity_id: normalizedEntityId
        })
        
        // The service returns the items nested under response -> entity ID
        if (response?.response?.[normalizedEntityId]?.items && Array.isArray(response.response[normalizedEntityId].items)) {
          setItems(response.response[normalizedEntityId].items)
        }
      } catch (error) {
        console.error('[useTodo] Failed to fetch todo items:', error)
        setItems([])
      } finally {
        setIsLoadingItems(false)
      }
    }

    fetchItems()
  }, [normalizedEntityId, entity.isConnected, state, callServiceWithResponse])

  // Sort items to prioritize unchecked items
  const sortedItems = [...items].sort((a, b) => {
    if (a.status === 'needs_action' && b.status === 'completed') return -1
    if (a.status === 'completed' && b.status === 'needs_action') return 1
    return 0
  })

  // Refresh items after any operation
  const refreshItems = useCallback(async () => {
    try {
      const response = await callServiceWithResponse<{ response: Record<string, { items: TodoItem[] }> }>('todo', 'get_items', {
        entity_id: normalizedEntityId
      })
      
      if (response?.response?.[normalizedEntityId]?.items && Array.isArray(response.response[normalizedEntityId].items)) {
        setItems(response.response[normalizedEntityId].items)
      }
    } catch (error) {
      console.error('[useTodo] Failed to refresh items:', error)
    }
  }, [normalizedEntityId, callServiceWithResponse])

  // Add a new todo item
  const addItem = useCallback(async (summary: string) => {
    if (!supportsAddItem) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'adding items')
    }

    try {
      await callService('todo', 'add_item', {
        item: summary
      })
      // Refresh items after adding
      await refreshItems()
    } catch (error) {
      console.error('[useTodo] Failed to add item:', error)
      throw error
    }
  }, [callService, normalizedEntityId, supportsAddItem, refreshItems])

  // Remove a todo item
  const removeItem = useCallback(async (uid: string) => {
    if (!supportsRemoveItem) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'removing items')
    }

    try {
      await callService('todo', 'remove_item', {
        item: uid
      })
      // Refresh items after removing
      await refreshItems()
    } catch (error) {
      console.error('[useTodo] Failed to remove item:', error)
      throw error
    }
  }, [callService, normalizedEntityId, supportsRemoveItem, refreshItems])

  // Update a todo item (toggle checked/unchecked)
  const updateItem = useCallback(async (uid: string, status: 'needs_action' | 'completed') => {
    if (!supportsUpdateItem) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'updating items')
    }

    try {
      await callService('todo', 'update_item', {
        item: uid,
        status
      })
      // Refresh items after updating
      await refreshItems()
    } catch (error) {
      console.error('[useTodo] Failed to update item:', error)
      throw error
    }
  }, [callService, normalizedEntityId, supportsUpdateItem, refreshItems])

  // Toggle item status
  const toggleItem = useCallback(async (uid: string) => {
    const item = items.find(i => i.uid === uid)
    if (!item) return
    
    const newStatus = item.status === 'completed' ? 'needs_action' : 'completed'
    await updateItem(uid, newStatus)
  }, [items, updateItem])

  // Remove all completed items
  const clearCompleted = useCallback(async () => {
    if (!supportsClearCompleted) {
      throw new FeatureNotSupportedError(normalizedEntityId, 'clearing completed items')
    }

    try {
      await callService('todo', 'remove_completed_items')
      // Refresh items after clearing
      await refreshItems()
    } catch (error) {
      console.error('[useTodo] Failed to clear completed items:', error)
      throw error
    }
  }, [callService, normalizedEntityId, supportsClearCompleted, refreshItems])

  return {
    ...entity,
    itemCount,
    items: sortedItems,
    isLoadingItems,
    supportsAddItem,
    supportsRemoveItem,
    supportsUpdateItem,
    supportsClearCompleted,
    addItem,
    removeItem,
    updateItem,
    toggleItem,
    clearCompleted,
  }
}