import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { EntityState, StateChangedEvent } from '../types'
import type { Connection } from 'home-assistant-js-websocket'

interface WebSocketSubscription {
  unsubscribe: () => void
}

interface EntityStore {
  entities: Map<string, EntityState>
  componentSubscriptions: Map<string, Set<() => void>>
  websocketSubscriptions: Map<string, WebSocketSubscription>
  registeredEntities: Set<string>
  connection: Connection | null

  // Actions
  setConnection: (connection: Connection | null) => void
  updateEntity: (entityId: string, state: EntityState) => void
  registerEntity: (entityId: string, callback: () => void) => void
  unregisterEntity: (entityId: string, callback: () => void) => void
  batchUpdate: (updates: Array<[string, EntityState]>) => void
  clear: () => void
}

export const useStore = create<EntityStore>()(
  subscribeWithSelector((set, get) => ({
    entities: new Map(),
    componentSubscriptions: new Map(),
    websocketSubscriptions: new Map(),
    registeredEntities: new Set(),
    connection: null,

    setConnection: async (connection) => {
      const oldConnection = get().connection
      
      // Clean up old subscriptions if connection changed
      if (oldConnection && oldConnection !== connection) {
        get().websocketSubscriptions.forEach(sub => sub.unsubscribe())
        set({ 
          websocketSubscriptions: new Map(),
          connection 
        })
      } else {
        set({ connection })
      }
      
      // Set up new subscriptions if we have a connection
      if (connection) {
        const registeredEntities = get().registeredEntities
        
        if (registeredEntities.size > 0) {
          // Fetch all states once
          const states = await connection.sendMessagePromise<EntityState[]>({
            type: 'get_states',
          })
          
          // Update all registered entities
          const entityMap = new Map(states.map(s => [s.entity_id, s]))
          registeredEntities.forEach(entityId => {
            const entity = entityMap.get(entityId)
            if (entity) {
              get().updateEntity(entityId, entity)
            }
          })
          
          // Subscribe to all entities
          await Promise.all(
            Array.from(registeredEntities).map(entityId => 
              subscribeToEntityUpdates(connection, entityId, get, set)
            )
          )
        }
      }
    },

    updateEntity: (entityId, state) => {
      set((store) => {
        const newEntities = new Map(store.entities)
        newEntities.set(entityId, state)
        return { entities: newEntities }
      })

      // Notify component subscribers
      const subs = get().componentSubscriptions.get(entityId)
      if (subs) {
        subs.forEach((callback) => callback())
      }
    },

    registerEntity: async (entityId, callback) => {
      
      // Add to registered entities and component subscriptions
      set((store) => {
        const newRegistered = new Set(store.registeredEntities)
        newRegistered.add(entityId)
        
        const newSubs = new Map(store.componentSubscriptions)
        const entitySubs = newSubs.get(entityId) || new Set()
        entitySubs.add(callback)
        newSubs.set(entityId, entitySubs)
        
        return { 
          registeredEntities: newRegistered,
          componentSubscriptions: newSubs 
        }
      })
      
      // If connected and not already subscribed, subscribe now
      const { connection, websocketSubscriptions } = get()
      if (connection && !websocketSubscriptions.has(entityId)) {
        await subscribeToEntity(connection, entityId, get, set)
      }
    },

    unregisterEntity: (entityId, callback) => {
      
      set((store) => {
        const newSubs = new Map(store.componentSubscriptions)
        const entitySubs = newSubs.get(entityId)
        
        if (entitySubs) {
          entitySubs.delete(callback)
          
          // If no more subscribers, clean up everything
          if (entitySubs.size === 0) {
            newSubs.delete(entityId)
            
            const newRegistered = new Set(store.registeredEntities)
            newRegistered.delete(entityId)
            
            // Unsubscribe WebSocket if it exists
            const wsSub = store.websocketSubscriptions.get(entityId)
            if (wsSub) {
              wsSub.unsubscribe()
              const newWsSubs = new Map(store.websocketSubscriptions)
              newWsSubs.delete(entityId)
              return {
                componentSubscriptions: newSubs,
                registeredEntities: newRegistered,
                websocketSubscriptions: newWsSubs
              }
            }
            
            return {
              componentSubscriptions: newSubs,
              registeredEntities: newRegistered
            }
          }
          
          newSubs.set(entityId, entitySubs)
        }
        
        return { componentSubscriptions: newSubs }
      })
    },

    batchUpdate: (updates) => {
      set((store) => {
        const newEntities = new Map(store.entities)
        updates.forEach(([entityId, state]) => {
          newEntities.set(entityId, state)
        })
        return { entities: newEntities }
      })

      // Notify subscribers for all updated entities
      const componentSubs = get().componentSubscriptions
      updates.forEach(([entityId]) => {
        const subs = componentSubs.get(entityId)
        if (subs) {
          subs.forEach((callback) => callback())
        }
      })
    },

    clear: () => {
      // Unsubscribe all WebSocket subscriptions
      get().websocketSubscriptions.forEach(sub => sub.unsubscribe())
      
      set({
        entities: new Map(),
        componentSubscriptions: new Map(),
        websocketSubscriptions: new Map(),
        registeredEntities: new Set(),
        connection: null,
      })
    },
  }))
)

// Helper function to subscribe to a single entity (used when entity is registered after connection)
async function subscribeToEntity(
  connection: Connection,
  entityId: string,
  get: () => EntityStore,
  set: (partial: Partial<EntityStore> | ((state: EntityStore) => Partial<EntityStore>)) => void
) {
  try {
    // Get initial state
    const states = await connection.sendMessagePromise<EntityState[]>({
      type: 'get_states',
    })
    
    const entity = states.find((s: EntityState) => s.entity_id === entityId)
    if (entity) {
      get().updateEntity(entityId, entity)
    }

    // Subscribe to updates
    await subscribeToEntityUpdates(connection, entityId, get, set)
    
  } catch (error) {
    console.error(`Failed to subscribe to entity ${entityId}:`, error)
  }
}

// Helper function to subscribe to entity updates only
async function subscribeToEntityUpdates(
  connection: Connection,
  entityId: string,
  get: () => EntityStore,
  set: (partial: Partial<EntityStore> | ((state: EntityStore) => Partial<EntityStore>)) => void
) {
  try {
    // Subscribe to state changes
    const unsubscribe = await connection.subscribeEvents(
      (event: StateChangedEvent) => {
        if (event.data.entity_id === entityId) {
          get().updateEntity(entityId, event.data.new_state)
        }
      },
      'state_changed'
    )
    
    // Store the subscription
    set((store) => {
      const newWsSubs = new Map(store.websocketSubscriptions)
      newWsSubs.set(entityId, { unsubscribe })
      return { websocketSubscriptions: newWsSubs }
    })
    
  } catch (error) {
    console.error(`Failed to subscribe to entity updates ${entityId}:`, error)
  }
}

// Selector to get entity state
export const selectEntity = (entityId: string) => (state: EntityStore) =>
  state.entities.get(entityId)