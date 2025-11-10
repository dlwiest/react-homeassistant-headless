import { vi, expect } from 'vitest'
import type { BaseEntityHook } from '../../types'

/**
 * Creates a mock entity for testing purposes.
 * 
 * @param entityId - Full entity ID (e.g., "light.living_room")
 * @param state - Entity state (e.g., "on", "off", "unavailable")
 * @param attributes - Entity attributes object
 * @returns Mock entity that matches BaseEntityHook interface
 */
export function createMockEntity<T = Record<string, any>>(
  entityId: string,
  state: string = 'on',
  attributes: T = {} as T
): BaseEntityHook<T> {
  return {
    entityId,
    state,
    attributes,
    lastChanged: new Date(),
    lastUpdated: new Date(),
    isUnavailable: state === 'unavailable',
    isConnected: true,
    callService: vi.fn(),
    refresh: vi.fn()
  }
}

/**
 * Creates a domain-specific mock entity factory function.
 * 
 * @param domain - The domain for entities created by this factory
 * @returns Function that creates mock entities for the specified domain
 */
export function createMockEntityFactory(domain: string) {
  return <T = Record<string, any>>(
    entityName: string = 'test',
    state: string = 'on',
    attributes: T = {} as T
  ) => createMockEntity<T>(`${domain}.${entityName}`, state, attributes)
}

// Pre-built domain-specific factories for convenience
export const createMockLightEntity = createMockEntityFactory('light')
export const createMockFanEntity = createMockEntityFactory('fan')
export const createMockSwitchEntity = createMockEntityFactory('switch')
export const createMockLockEntity = createMockEntityFactory('lock')
export const createMockClimateEntity = createMockEntityFactory('climate')
export const createMockSensorEntity = createMockEntityFactory('sensor')
export const createMockCoverEntity = createMockEntityFactory('cover')

/**
 * Creates a mock entity with default attributes for specific domains.
 * This includes typical attributes that are commonly tested.
 */
export const createMockEntityWithDefaults = {
  light: (entityName: string = 'test', state: string = 'on') =>
    createMockLightEntity(entityName, state, {
      friendly_name: `Test Light ${entityName}`,
      supported_features: 1, // SUPPORT_BRIGHTNESS by default
      brightness: state === 'on' ? 255 : 0
    }),

  fan: (entityName: string = 'test', state: string = 'on') =>
    createMockFanEntity(entityName, state, {
      friendly_name: `Test Fan ${entityName}`,
      supported_features: 1, // SUPPORT_SET_SPEED by default
      percentage: state === 'on' ? 50 : 0
    }),

  switch: (entityName: string = 'test', state: string = 'on') =>
    createMockSwitchEntity(entityName, state, {
      friendly_name: `Test Switch ${entityName}`
    }),

  lock: (entityName: string = 'test', state: string = 'locked') =>
    createMockLockEntity(entityName, state, {
      friendly_name: `Test Lock ${entityName}`,
      supported_features: 0
    }),

  climate: (entityName: string = 'test', state: string = 'heat') =>
    createMockClimateEntity(entityName, state, {
      friendly_name: `Test Climate ${entityName}`,
      supported_features: 1, // SUPPORT_TARGET_TEMPERATURE by default
      current_temperature: 22,
      target_temperature: 24
    }),

  sensor: (entityName: string = 'test', state: string = '23.5') =>
    createMockSensorEntity(entityName, state, {
      friendly_name: `Test Sensor ${entityName}`,
      unit_of_measurement: '°C',
      device_class: 'temperature'
    }),

  cover: (entityName: string = 'test', state: string = 'closed') =>
    createMockCoverEntity(entityName, state, {
      friendly_name: `Test Cover ${entityName}`,
      supported_features: 15, // SUPPORT_OPEN | SUPPORT_CLOSE | SUPPORT_STOP | SUPPORT_SET_POSITION
      current_position: state === 'open' ? 100 : 0
    })
}

/**
 * Creates a mock entity with specific features enabled for testing.
 * 
 * @param domain - Entity domain
 * @param entityName - Entity name (will be prefixed with domain)
 * @param features - Array of feature flag values to enable
 * @param state - Entity state
 * @param additionalAttributes - Any additional attributes
 * @returns Mock entity with specified features enabled
 */
export function createMockEntityWithFeatures<T = Record<string, any>>(
  domain: string,
  entityName: string,
  features: number[],
  state: string = 'on',
  additionalAttributes: Partial<T> = {}
): BaseEntityHook<T> {
  const supportedFeatures = features.reduce((acc, feature) => acc | feature, 0)
  
  return createMockEntity<T>(
    `${domain}.${entityName}`,
    state,
    {
      friendly_name: `Test ${domain} ${entityName}`,
      supported_features: supportedFeatures,
      ...additionalAttributes
    } as T
  )
}

/**
 * Utility to extract the mock function from a service call for testing.
 * 
 * @param mockEntity - Mock entity created by createMockEntity
 * @returns The vi.fn() mock for callService
 */
export function getMockServiceCall(mockEntity: BaseEntityHook): any {
  return mockEntity.callService
}

/**
 * Helper to verify that a service was called with specific parameters.
 * This is a convenience function for test assertions.
 * 
 * @param mockEntity - Mock entity created by createMockEntity
 * @param domain - Expected domain
 * @param service - Expected service name
 * @param data - Expected service data (optional)
 * @returns The mock call for use in expect() statements
 */
export function expectServiceCalled(
  mockEntity: BaseEntityHook,
  domain: string,
  service: string,
  data?: object
) {
  const mockCall = getMockServiceCall(mockEntity)
  
  if (data !== undefined) {
    return expect(mockCall).toHaveBeenCalledWith(domain, service, data)
  } else {
    return expect(mockCall).toHaveBeenCalledWith(domain, service)
  }
}