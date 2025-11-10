/**
 * Mock state transitions for testing Home Assistant entity behavior.
 * These functions simulate how Home Assistant would respond to service calls
 * in a test environment.
 */

/**
 * State transition result for mock service calls.
 */
export interface MockStateTransition {
  state: string
  attributes: Record<string, any>
}

/**
 * Simulates a toggle operation on any toggleable entity for testing.
 * 
 * @param currentState - Current entity state
 * @returns New state after toggle
 */
export function mockToggle(currentState: string): string {
  return currentState === 'on' ? 'off' : 'on'
}

/**
 * Simulates a service call for testing and returns the resulting state and attributes.
 * This is used by the mock connection to simulate realistic entity behavior.
 * 
 * @param domain - Entity domain (e.g., "light", "fan")
 * @param service - Service name (e.g., "turn_on", "toggle")
 * @param currentState - Current entity state
 * @param currentAttributes - Current entity attributes
 * @param serviceData - Service call data (includes entity_id and parameters)
 * @returns New state and attributes after mock service call
 */
export function mockServiceCall(
  domain: string,
  service: string,
  currentState: string,
  currentAttributes: Record<string, any>,
  serviceData: Record<string, any>
): MockStateTransition {
  let newAttributes = { ...currentAttributes }
  let newState = currentState
  
  // Extract entity_id from service_data - it's not part of the actual service parameters
  const { entity_id: _entityId, ...params } = serviceData
  
  switch (domain) {
    case 'light':
      ({ state: newState, attributes: newAttributes } = mockLightService(
        service, currentState, newAttributes, params
      ))
      break
      
    case 'fan':
      ({ state: newState, attributes: newAttributes } = mockFanService(
        service, currentState, newAttributes, params
      ))
      break
      
    case 'switch':
      ({ state: newState, attributes: newAttributes } = mockSwitchService(
        service, currentState, newAttributes, params
      ))
      break
      
    case 'lock':
      ({ state: newState, attributes: newAttributes } = mockLockService(
        service, currentState, newAttributes, params
      ))
      break
      
    case 'cover':
      ({ state: newState, attributes: newAttributes } = mockCoverService(
        service, currentState, newAttributes, params
      ))
      break
      
    case 'climate':
      ({ state: newState, attributes: newAttributes } = mockClimateService(
        service, currentState, newAttributes, params
      ))
      break
      
    default:
      // For unknown domains, just handle basic toggle/turn_on/turn_off
      ({ state: newState, attributes: newAttributes } = mockBasicService(
        service, currentState, newAttributes, params
      ))
  }
  
  return { state: newState, attributes: newAttributes }
}

/**
 * Mock light-specific services for testing.
 */
function mockLightService(
  service: string,
  currentState: string,
  attributes: Record<string, any>,
  params: Record<string, any>
): MockStateTransition {
  switch (service) {
    case 'toggle':
      return { state: mockToggle(currentState), attributes }
    
    case 'turn_on':
      return { 
        state: 'on', 
        attributes: { ...attributes, ...params } 
      }
    
    case 'turn_off':
      return { state: 'off', attributes }
    
    default:
      return { state: currentState, attributes }
  }
}

/**
 * Mock fan-specific services for testing.
 */
function mockFanService(
  service: string,
  currentState: string,
  attributes: Record<string, any>,
  params: Record<string, any>
): MockStateTransition {
  switch (service) {
    case 'toggle':
      return { state: mockToggle(currentState), attributes }
    
    case 'turn_on':
      return { 
        state: 'on', 
        attributes: { ...attributes, ...params } 
      }
    
    case 'turn_off':
      return { 
        state: 'off', 
        attributes: { ...attributes, percentage: 0 } 
      }
    
    case 'set_percentage':
      return { 
        state: params.percentage > 0 ? 'on' : 'off',
        attributes: { ...attributes, percentage: params.percentage }
      }
    
    case 'oscillate':
      return { 
        state: currentState,
        attributes: { ...attributes, oscillating: params.oscillating }
      }
    
    case 'set_direction':
      return { 
        state: currentState,
        attributes: { ...attributes, direction: params.direction }
      }
    
    case 'set_preset_mode':
      return { 
        state: 'on',
        attributes: { ...attributes, preset_mode: params.preset_mode }
      }
    
    default:
      return { state: currentState, attributes }
  }
}

/**
 * Mock switch-specific services for testing.
 */
function mockSwitchService(
  service: string,
  currentState: string,
  attributes: Record<string, any>,
  _params: Record<string, any>
): MockStateTransition {
  switch (service) {
    case 'toggle':
      return { state: mockToggle(currentState), attributes }
    
    case 'turn_on':
      return { state: 'on', attributes }
    
    case 'turn_off':
      return { state: 'off', attributes }
    
    default:
      return { state: currentState, attributes }
  }
}

/**
 * Mock lock-specific services for testing.
 */
function mockLockService(
  service: string,
  currentState: string,
  attributes: Record<string, any>,
  _params: Record<string, any>
): MockStateTransition {
  switch (service) {
    case 'lock':
      return { 
        state: 'locked',
        attributes: { ...attributes, changed_by: 'Manual' }
      }
    
    case 'unlock':
      return { 
        state: 'unlocked',
        attributes: { ...attributes, changed_by: 'Manual' }
      }
    
    case 'open':
      return { 
        state: 'open',
        attributes: { ...attributes, changed_by: 'Manual' }
      }
    
    default:
      return { state: currentState, attributes }
  }
}

/**
 * Mock cover-specific services for testing.
 */
function mockCoverService(
  service: string,
  currentState: string,
  attributes: Record<string, any>,
  params: Record<string, any>
): MockStateTransition {
  switch (service) {
    case 'open_cover':
      return { 
        state: 'opening',
        attributes: { ...attributes, current_position: 100 }
      }
    
    case 'close_cover':
      return { 
        state: 'closing',
        attributes: { ...attributes, current_position: 0 }
      }
    
    case 'stop_cover':
      return { 
        state: 'stopped',
        attributes
      }
    
    case 'set_cover_position':
      const position = params.position
      return { 
        state: position === 0 ? 'closed' : position === 100 ? 'open' : 'stopped',
        attributes: { ...attributes, current_position: position }
      }
    
    default:
      return { state: currentState, attributes }
  }
}

/**
 * Mock climate-specific services for testing.
 */
function mockClimateService(
  service: string,
  currentState: string,
  attributes: Record<string, any>,
  params: Record<string, any>
): MockStateTransition {
  switch (service) {
    case 'set_hvac_mode':
      return { 
        state: params.hvac_mode,
        attributes: { ...attributes, hvac_mode: params.hvac_mode }
      }
    
    case 'set_temperature':
      return { 
        state: currentState,
        attributes: { ...attributes, temperature: params.temperature }
      }
    
    case 'turn_on':
      return { 
        state: attributes.hvac_mode || 'heat',
        attributes
      }
    
    case 'turn_off':
      return { 
        state: 'off',
        attributes
      }
    
    default:
      return { state: currentState, attributes }
  }
}

/**
 * Mock basic services for unknown domains in testing.
 */
function mockBasicService(
  service: string,
  currentState: string,
  attributes: Record<string, any>,
  params: Record<string, any>
): MockStateTransition {
  switch (service) {
    case 'toggle':
      return { state: mockToggle(currentState), attributes }
    
    case 'turn_on':
      return { state: 'on', attributes: { ...attributes, ...params } }
    
    case 'turn_off':
      return { state: 'off', attributes }
    
    default:
      return { state: currentState, attributes }
  }
}