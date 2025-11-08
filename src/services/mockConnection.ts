import { useStore } from './entityStore'
import type { Connection } from 'home-assistant-js-websocket'

export function createMockConnection(): Partial<Connection> {
  return {
    sendMessagePromise: async (message: any) => {
      const { type } = message

      if (type === 'call_service') {
        const { domain, service, service_data } = message
        const entityId = service_data.entity_id

        const currentEntity = useStore.getState().entities.get(entityId)
        if (!currentEntity) return

        let newState = currentEntity.state
        let newAttributes = { ...currentEntity.attributes }

        // Simulate service calls based on domain/service
        if (domain === 'light') {
          if (service === 'toggle') {
            newState = currentEntity.state === 'on' ? 'off' : 'on'
          } else if (service === 'turn_on') {
            newState = 'on'
            // Apply any additional data (brightness, color, etc)
            const { entity_id, ...serviceData } = service_data
            Object.assign(newAttributes, serviceData)
          } else if (service === 'turn_off') {
            newState = 'off'
          }
        } else if (domain === 'switch') {
          if (service === 'toggle') {
            newState = currentEntity.state === 'on' ? 'off' : 'on'
          } else if (service === 'turn_on') {
            newState = 'on'
          } else if (service === 'turn_off') {
            newState = 'off'
          }
        } else if (domain === 'climate') {
          if (service === 'set_hvac_mode') {
            newAttributes.hvac_mode = service_data.hvac_mode
          } else if (service === 'set_temperature') {
            if (service_data.temperature !== undefined) {
              newAttributes.temperature = service_data.temperature
            }
            if (service_data.target_temp_low !== undefined) {
              newAttributes.target_temp_low = service_data.target_temp_low
            }
            if (service_data.target_temp_high !== undefined) {
              newAttributes.target_temp_high = service_data.target_temp_high
            }
          }
        } else if (domain === 'fan') {
          if (service === 'toggle') {
            newState = currentEntity.state === 'on' ? 'off' : 'on'
            // Reset percentage when turning off
            if (newState === 'off') {
              newAttributes.percentage = 0
            } else {
              // Set to a default percentage when turning on if it was 0
              if (newAttributes.percentage === 0) {
                newAttributes.percentage = 50
              }
            }
          } else if (service === 'turn_on') {
            newState = 'on'
            // Apply any additional data (percentage, preset_mode, etc)
            const { entity_id, ...serviceData } = service_data
            Object.assign(newAttributes, serviceData)
            // Set default percentage if not specified
            if (newAttributes.percentage === 0 && !serviceData.percentage) {
              newAttributes.percentage = 50
            }
          } else if (service === 'turn_off') {
            newState = 'off'
            newAttributes.percentage = 0
          } else if (service === 'set_percentage') {
            if (service_data.percentage !== undefined) {
              newAttributes.percentage = service_data.percentage
              // Turn on if percentage > 0, off if 0
              newState = service_data.percentage > 0 ? 'on' : 'off'
            }
          } else if (service === 'set_preset_mode') {
            if (service_data.preset_mode !== undefined) {
              newAttributes.preset_mode = service_data.preset_mode
              // Turn on when setting preset mode
              newState = 'on'
            }
          } else if (service === 'oscillate') {
            if (service_data.oscillating !== undefined) {
              newAttributes.oscillating = service_data.oscillating
            }
          } else if (service === 'set_direction') {
            if (service_data.direction !== undefined) {
              newAttributes.direction = service_data.direction
            }
          }
        }

        // Update the entity in the store
        useStore.getState().updateEntity(entityId, {
          ...currentEntity,
          state: newState,
          attributes: newAttributes,
          last_updated: new Date().toISOString(),
          last_changed: newState !== currentEntity.state ? new Date().toISOString() : currentEntity.last_changed,
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
