// Standardized error types for Home Assistant React hooks.
// State/Connectivity errors - stored in hook state for entity availability
// Action errors - thrown by service calls for component handling

// Suggested actions users can take when errors occur
export type ErrorRetryAction =
  | 'retry'           // Simply retry the operation
  | 'check_entity'    // Check if entity exists/is configured correctly
  | 'check_config'    // Check Home Assistant configuration
  | 'check_network'   // Check network connection
  | 'contact_admin'   // Contact system administrator
  | 'none'            // No action available

// Base class for all Home Assistant related errors
// Includes user-friendly messaging and recovery suggestions
export class HomeAssistantError extends Error {
  public readonly userMessage: string     // User-friendly error message for UI
  public readonly recoverable: boolean     // Whether user can retry this operation
  public readonly retryAction: ErrorRetryAction  // Suggested action to take

  constructor(
    message: string,
    public readonly code: string,
    userMessage?: string,
    recoverable: boolean = false,
    retryAction: ErrorRetryAction = 'none',
    public readonly context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'HomeAssistantError'
    this.userMessage = userMessage || message
    this.recoverable = recoverable
    this.retryAction = retryAction
  }
}

// State/connectivity errors (stored in hook state)

// Error thrown when trying to use a feature that the entity doesn't support
export class FeatureNotSupportedError extends HomeAssistantError {
  constructor(entityId: string, featureName: string, supportedFeatures?: number) {
    const technicalMessage = `Feature "${featureName}" is not supported by entity "${entityId}". Check the entity's supported_features.`
    const userMessage = `This device doesn't support ${featureName}. Check your device capabilities in Home Assistant.`

    super(
      technicalMessage,
      'FEATURE_NOT_SUPPORTED',
      userMessage,
      false, // Not recoverable - device limitation
      'check_entity',
      { entityId, featureName, supportedFeatures }
    )
    this.name = 'FeatureNotSupportedError'
  }
}

// Error thrown when service call parameters are invalid
export class InvalidParameterError extends HomeAssistantError {
  constructor(parameterName: string, value: unknown, expectedType?: string, allowedValues?: unknown[]) {
    const valueInfo = allowedValues
      ? `Expected one of: ${allowedValues.join(', ')}`
      : expectedType
        ? `Expected type: ${expectedType}`
        : 'Invalid value'

    const technicalMessage = `Invalid parameter "${parameterName}": ${value}. ${valueInfo}`
    const userMessage = allowedValues
      ? `Invalid ${parameterName}. Please use one of: ${allowedValues.join(', ')}`
      : `Invalid ${parameterName}. Please check the value and try again.`

    super(
      technicalMessage,
      'INVALID_PARAMETER',
      userMessage,
      false, // Not recoverable without fixing the parameter
      'none',
      { parameterName, value, expectedType, allowedValues }
    )
    this.name = 'InvalidParameterError'
  }
}

// Error thrown when an entity is not found or unavailable
export class EntityNotAvailableError extends HomeAssistantError {
  constructor(entityId: string, reason?: string) {
    const reasonText = reason ? ` Reason: ${reason}` : ''
    const technicalMessage = `Entity "${entityId}" is not available.${reasonText}`
    const userMessage = reason === 'Entity not found'
      ? `Device "${entityId}" not found. Please check that it exists in Home Assistant.`
      : `Device "${entityId}" is currently unavailable. It may be offline or disconnected.`

    super(
      technicalMessage,
      'ENTITY_NOT_AVAILABLE',
      userMessage,
      true, // Recoverable - entity might come back online
      'check_entity',
      { entityId, reason }
    )
    this.name = 'EntityNotAvailableError'
  }
}

// Error thrown when there's no connection to Home Assistant
export class ConnectionError extends HomeAssistantError {
  constructor(operation: string) {
    const technicalMessage = `Cannot ${operation}: Not connected to Home Assistant`
    const userMessage = `Not connected to Home Assistant. Please check your connection and try again.`

    super(
      technicalMessage,
      'CONNECTION_ERROR',
      userMessage,
      true, // Recoverable - connection might be restored
      'check_network',
      { operation }
    )
    this.name = 'ConnectionError'
  }
}

// Error thrown when a service call fails
export class ServiceCallError extends HomeAssistantError {
  constructor(
    domain: string,
    service: string,
    originalError: Error,
    entityId?: string
  ) {
    const entityInfo = entityId ? ` for entity "${entityId}"` : ''
    const technicalMessage = `Service call failed: ${domain}.${service}${entityInfo}. ${originalError.message}`
    const userMessage = `Operation failed. Please try again or check your Home Assistant logs for details.`

    super(
      technicalMessage,
      'SERVICE_CALL_ERROR',
      userMessage,
      true, // Recoverable - might be temporary
      'retry',
      { domain, service, entityId, originalError }
    )
    this.name = 'ServiceCallError'
  }
}

// Error thrown when entity domain doesn't match expected type
export class DomainMismatchError extends HomeAssistantError {
  constructor(entityId: string, expectedDomain: string, actualDomain: string, hookName: string) {
    const technicalMessage = `${hookName}: Entity "${entityId}" has domain "${actualDomain}" but expects "${expectedDomain}" domain. Use useEntity() or the appropriate domain-specific hook instead.`
    const userMessage = `Wrong hook for this device type. "${entityId}" is a ${actualDomain}, not a ${expectedDomain}. Please use the correct hook for this device.`

    super(
      technicalMessage,
      'DOMAIN_MISMATCH',
      userMessage,
      false, // Not recoverable - wrong hook being used
      'none',
      { entityId, expectedDomain, actualDomain, hookName }
    )
    this.name = 'DomainMismatchError'
  }
}

// Determines if an error is retryable
export function isRetryableError(error: Error): boolean {
  // Check if it's our custom error with recoverable property
  if (error instanceof HomeAssistantError) {
    return error.recoverable
  }

  // Fallback: check message for known retryable errors
  return (
    error.message.includes('timeout') ||
    error.message.includes('network') ||
    error.message.includes('connection') ||
    error.message.includes('503') || // Service unavailable
    error.message.includes('502') || // Bad gateway
    error.message.includes('429')    // Rate limited
  )
}

// Gets user-friendly error messages
export function getUserFriendlyErrorMessage(error: Error): string {
  // Use userMessage from our custom errors
  if (error instanceof HomeAssistantError) {
    return error.userMessage
  }

  // Handle common HA API errors with friendly messages
  if (error.message.includes('timeout')) {
    return 'Request timed out. Please try again.'
  }

  if (error.message.includes('404')) {
    return 'Service not found. The entity or service may not be available.'
  }

  if (error.message.includes('403')) {
    return 'Permission denied. Check your Home Assistant permissions.'
  }

  // Default fallback
  return 'An unexpected error occurred. Please try again.'
}

// Error categories for different handling strategies
export enum ErrorCategory {
  CONNECTION = 'connection',      // Network/connection issues - retryable
  VALIDATION = 'validation',      // Input validation - not retryable
  FEATURE = 'feature',           // Feature not supported - not retryable  
  PERMISSION = 'permission',      // Permission denied - not retryable
  TEMPORARY = 'temporary',        // Temporary service issues - retryable
  UNKNOWN = 'unknown'            // Unknown errors - might be retryable
}

// Categorizes an error for appropriate handling
export function categorizeError(error: Error): ErrorCategory {
  if (error instanceof ConnectionError) return ErrorCategory.CONNECTION
  if (error instanceof FeatureNotSupportedError) return ErrorCategory.FEATURE
  if (error instanceof InvalidParameterError) return ErrorCategory.VALIDATION
  if (error instanceof DomainMismatchError) return ErrorCategory.VALIDATION
  
  const message = error.message.toLowerCase()
  
  if (message.includes('permission') || message.includes('403') || message.includes('unauthorized')) {
    return ErrorCategory.PERMISSION
  }
  
  if (message.includes('timeout') || message.includes('503') || message.includes('502')) {
    return ErrorCategory.TEMPORARY
  }
  
  return ErrorCategory.UNKNOWN
}