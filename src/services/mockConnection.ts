import { useStore } from './entityStore'
import type { Connection } from 'home-assistant-js-websocket'
import { mockServiceCall } from '../test/utils/mockStateTransitions'

interface ServiceData {
  entity_id: string
  [key: string]: string | number | boolean | undefined
}

interface ServiceCallMessage {
  type: 'call_service'
  domain: string
  service: string
  service_data: ServiceData
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
        const { domain, service, service_data } = message as ServiceCallMessage
        const entityId = service_data.entity_id

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
