import { useStore } from './entityStore'
import type { Connection } from 'home-assistant-js-websocket'
import { mockServiceCall } from '../test/utils/mockStateTransitions'

interface ServiceData {
  entity_id: string
  [key: string]: string | number | boolean | undefined | Record<string, unknown>
}

interface MockTodoItem {
  uid: string
  summary: string
  status: 'needs_action' | 'completed'
  due?: string
}

// Store mock todo items separately since they're not in attributes
const mockTodoItems: Record<string, MockTodoItem[]> = {
  'todo.shopping_list': [
    { uid: 'shop-1', summary: 'Buy milk', status: 'needs_action' },
    { uid: 'shop-2', summary: 'Get bread', status: 'completed' }
  ],
  'todo.weekend_projects': [
    { uid: 'proj-1', summary: 'Paint fence', status: 'needs_action' },
    { uid: 'proj-2', summary: 'Fix garage door', status: 'completed' }
  ]
}

interface ServiceCallMessage {
  type: 'call_service'
  domain: string
  service: string
  service_data: ServiceData
  return_response?: boolean
}

interface GetStatesMessage {
  type: 'get_states'
}

type MockMessage = ServiceCallMessage | GetStatesMessage | { type: string }

export function createMockConnection(): Partial<Connection> {
  return {
    sendMessagePromise: async (message: MockMessage) => {
      const { type } = message

      if (type === 'call_service') {
        const { domain, service, service_data, return_response } = message as ServiceCallMessage
        const entityId = service_data.entity_id

        // Handle service calls that return data
        if (return_response) {
          // Mock response for todo.get_items service
          if (domain === 'todo' && service === 'get_items') {
            const items = mockTodoItems[entityId] || []
            return {
              response: {
                [entityId]: { items }
              }
            }
          }
          // Return empty object for other services
          return {}
        }

        // Handle todo service calls
        if (domain === 'todo') {
          const currentItems = mockTodoItems[entityId] || []
          
          switch (service) {
            case 'add_item': {
              const newItem: MockTodoItem = {
                uid: `item-${Date.now()}`,
                summary: service_data.item as string,
                status: 'needs_action'
              }
              mockTodoItems[entityId] = [...currentItems, newItem]
              
              // Update entity state to reflect new count
              const currentEntity = useStore.getState().entities.get(entityId)
              if (currentEntity) {
                useStore.getState().updateEntity(entityId, {
                  ...currentEntity,
                  state: mockTodoItems[entityId].length.toString(),
                  last_updated: new Date().toISOString()
                })
              }
              return
            }
            
            case 'remove_item': {
              const itemId = service_data.item as string
              mockTodoItems[entityId] = currentItems.filter(item => item.uid !== itemId)
              
              // Update entity state
              const currentEntity = useStore.getState().entities.get(entityId)
              if (currentEntity) {
                useStore.getState().updateEntity(entityId, {
                  ...currentEntity,
                  state: mockTodoItems[entityId].length.toString(),
                  last_updated: new Date().toISOString()
                })
              }
              return
            }
            
            case 'update_item': {
              const itemId = service_data.item as string
              const newStatus = service_data.status as 'needs_action' | 'completed'
              mockTodoItems[entityId] = currentItems.map(item =>
                item.uid === itemId ? { ...item, status: newStatus } : item
              )
              
              // Update entity state
              const currentEntity = useStore.getState().entities.get(entityId)
              if (currentEntity) {
                useStore.getState().updateEntity(entityId, {
                  ...currentEntity,
                  last_updated: new Date().toISOString()
                })
              }
              return
            }
            
            case 'remove_completed_items': {
              mockTodoItems[entityId] = currentItems.filter(item => item.status !== 'completed')
              
              // Update entity state
              const currentEntity = useStore.getState().entities.get(entityId)
              if (currentEntity) {
                useStore.getState().updateEntity(entityId, {
                  ...currentEntity,
                  state: mockTodoItems[entityId].length.toString(),
                  last_updated: new Date().toISOString()
                })
              }
              return
            }
          }
        }

        // Handle regular service calls (actions)
        const currentEntity = useStore.getState().entities.get(entityId)
        if (!currentEntity) return

        // Use mock state transition utilities to handle the service call
        const { entity_id: _entityId, ...serviceData } = service_data
        const transition = mockServiceCall(
          domain,
          service,
          currentEntity.state,
          currentEntity.attributes,
          serviceData
        )

        // Update the entity in the store
        useStore.getState().updateEntity(entityId, {
          ...currentEntity,
          state: transition.state,
          attributes: transition.attributes,
          last_updated: new Date().toISOString(),
          last_changed: transition.state !== currentEntity.state ? new Date().toISOString() : currentEntity.last_changed,
        })

        return
      } else if (type === 'get_states') {
        // Return all entities as an array
        return Array.from(useStore.getState().entities.values())
      }

      // Default response
      return {}
    },

    subscribeEvents: () => {
      // Mock subscription - return a no-op unsubscribe that returns a promise
      return Promise.resolve(() => Promise.resolve())
    },

    addEventListener: () => {},
    removeEventListener: () => {},
    close: () => {},
  } as Partial<Connection>
}
