import { FeatureNotSupportedError, InvalidParameterError } from './errors'

/**
 * Type definition for the callService function used throughout hooks.
 */
export type CallServiceFunction = (domain: string, service: string, data?: object) => Promise<void>

/**
 * Creates basic control function definitions for hooks to use with useCallback.
 * These functions are common across light, switch, fan, and other controllable entities.
 * 
 * @param callService - The service call function from useEntity
 * @param domain - The domain for this entity (e.g., "light", "fan", "switch")
 * @returns Object with function definitions for use with useCallback
 */
export function createBasicControlDefs(
  callService: CallServiceFunction,
  domain: string
) {
  return {
    toggle: async () => {
      await callService(domain, 'toggle')
    },
    
    turnOnSimple: async () => {
      await callService(domain, 'turn_on')
    },
    
    turnOnWithParams: async (params?: object) => {
      await callService(domain, 'turn_on', params)
    },
    
    turnOff: async () => {
      await callService(domain, 'turn_off')
    }
  }
}

/**
 * Configuration for feature-based controls.
 */
interface FeatureControlOptions {
  /** The entity ID for warning messages */
  entityId: string
  /** Whether this feature is supported */
  isSupported: boolean
  /** Human-readable feature name for warning messages */
  featureName: string
  /** The service name to call */
  serviceName: string
}

/**
 * Creates a feature-based control function definition with validation and warnings.
 * This handles the common pattern of checking feature support and warning users.
 * 
 * @param callService - The service call function from useEntity
 * @param domain - The domain for this entity
 * @param options - Configuration for the feature control
 * @param paramBuilder - Function that builds service call parameters from input
 * @returns Feature control function definition for use with useCallback
 */
export function createFeatureBasedControlDef<T>(
  callService: CallServiceFunction,
  domain: string,
  options: FeatureControlOptions,
  paramBuilder: (value: T) => object | undefined
) {
  const { entityId, isSupported, featureName, serviceName } = options
  
  return async (value: T) => {
    if (!isSupported) {
      throw new FeatureNotSupportedError(entityId, featureName)
    }
    
    const params = paramBuilder(value)
    await callService(domain, serviceName, params)
  }
}

/**
 * Creates a simple feature control definition that validates against available options.
 * This is useful for things like effects, preset modes, etc.
 * 
 * @param callService - The service call function from useEntity
 * @param domain - The domain for this entity
 * @param availableOptions - Array of valid options
 * @param serviceName - Service to call
 * @param paramName - Parameter name in service call
 * @returns Control function definition for use with useCallback
 */
export function createOptionBasedControlDef(
  callService: CallServiceFunction,
  domain: string,
  availableOptions: string[],
  serviceName: string,
  paramName: string
) {
  return async (option: string | null) => {
    // Handle clearing option (null or empty string)
    if (!option || option === '') {
      await callService(domain, serviceName, { [paramName]: option === null ? 'off' : option })
      return
    }
    
    // Throw error if option is not in available list
    if (availableOptions.length > 0 && !availableOptions.includes(option)) {
      throw new InvalidParameterError(paramName, option, undefined, availableOptions)
    }
    
    await callService(domain, serviceName, { [paramName]: option })
  }
}

/**
 * Creates a numeric control definition with value clamping and validation.
 * 
 * @param callService - The service call function from useEntity
 * @param domain - The domain for this entity
 * @param serviceName - Service to call
 * @param paramName - Parameter name in service call
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Control function definition for use with useCallback
 */
export function createNumericControlDef(
  callService: CallServiceFunction,
  domain: string,
  serviceName: string,
  paramName: string,
  min: number = 0,
  max: number = 255
) {
  return async (value: number) => {
    const clampedValue = Math.max(min, Math.min(max, value))
    await callService(domain, serviceName, { [paramName]: clampedValue })
  }
}

/**
 * Helper to create a turn_on based control definition (common pattern for lights, fans).
 * 
 * @param callService - The service call function from useEntity
 * @param domain - The domain for this entity
 * @param paramName - Parameter name to pass to turn_on service
 * @returns Function definition for use with useCallback that calls turn_on with the specified parameter
 */
export function createTurnOnControlDef<T>(
  callService: CallServiceFunction,
  domain: string,
  paramName: string,
  transformer?: (value: T) => any
) {
  return async (value: T) => {
    const finalValue = transformer ? transformer(value) : value
    await callService(domain, 'turn_on', { [paramName]: finalValue })
  }
}