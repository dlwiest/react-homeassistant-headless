/**
 * Standardized error types for Home Assistant React hooks.
 * 
 * Two main categories:
 * 1. State/Connectivity errors - stored in hook state for entity availability
 * 2. Action errors - thrown by service calls for component handling
 */

/**
 * Base class for all Home Assistant related errors.
 */
export class HomeAssistantError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, any>
  ) {
    super(message)
    this.name = 'HomeAssistantError'
  }
}

// State/connectivity errors (stored in hook state)

/**
 * Error thrown when trying to use a feature that the entity doesn't support.
 */
export class FeatureNotSupportedError extends HomeAssistantError {
  constructor(entityId: string, featureName: string, supportedFeatures?: number) {
    super(
      `Feature "${featureName}" is not supported by entity "${entityId}". Check the entity's supported_features.`,
      'FEATURE_NOT_SUPPORTED',
      { entityId, featureName, supportedFeatures }
    )
    this.name = 'FeatureNotSupportedError'
  }
}

/**
 * Error thrown when service call parameters are invalid.
 */
export class InvalidParameterError extends HomeAssistantError {
  constructor(parameterName: string, value: any, expectedType?: string, allowedValues?: any[]) {
    const valueInfo = allowedValues 
      ? `Expected one of: ${allowedValues.join(', ')}`
      : expectedType 
        ? `Expected type: ${expectedType}`
        : 'Invalid value'
    
    super(
      `Invalid parameter "${parameterName}": ${value}. ${valueInfo}`,
      'INVALID_PARAMETER',
      { parameterName, value, expectedType, allowedValues }
    )
    this.name = 'InvalidParameterError'
  }
}

/**
 * Error thrown when an entity is not found or unavailable.
 */
export class EntityNotAvailableError extends HomeAssistantError {
  constructor(entityId: string, reason?: string) {
    const reasonText = reason ? ` Reason: ${reason}` : ''
    super(
      `Entity "${entityId}" is not available.${reasonText}`,
      'ENTITY_NOT_AVAILABLE',
      { entityId, reason }
    )
    this.name = 'EntityNotAvailableError'
  }
}

/**
 * Error thrown when there's no connection to Home Assistant.
 */
export class ConnectionError extends HomeAssistantError {
  constructor(operation: string) {
    super(
      `Cannot ${operation}: Not connected to Home Assistant`,
      'CONNECTION_ERROR',
      { operation }
    )
    this.name = 'ConnectionError'
  }
}

/**
 * Error thrown when a service call fails.
 */
export class ServiceCallError extends HomeAssistantError {
  constructor(
    domain: string, 
    service: string, 
    originalError: Error,
    entityId?: string
  ) {
    const entityInfo = entityId ? ` for entity "${entityId}"` : ''
    super(
      `Service call failed: ${domain}.${service}${entityInfo}. ${originalError.message}`,
      'SERVICE_CALL_ERROR',
      { domain, service, entityId, originalError }
    )
    this.name = 'ServiceCallError'
  }
}

/**
 * Error thrown when entity domain doesn't match expected type.
 */
export class DomainMismatchError extends HomeAssistantError {
  constructor(entityId: string, expectedDomain: string, actualDomain: string, hookName: string) {
    super(
      `${hookName}: Entity "${entityId}" has domain "${actualDomain}" but expects "${expectedDomain}" domain. Use useEntity() or the appropriate domain-specific hook instead.`,
      'DOMAIN_MISMATCH',
      { entityId, expectedDomain, actualDomain, hookName }
    )
    this.name = 'DomainMismatchError'
  }
}

/**
 * Utility function to determine if an error is retryable.
 */
export function isRetryableError(error: Error): boolean {
  // Network errors, timeout errors, and temporary service unavailability are retryable
  return (
    error.message.includes('timeout') ||
    error.message.includes('network') ||
    error.message.includes('connection') ||
    error.message.includes('503') || // Service unavailable
    error.message.includes('502') || // Bad gateway
    error.message.includes('429')    // Rate limited
  )
}

/**
 * Utility function to get user-friendly error messages.
 */
export function getUserFriendlyErrorMessage(error: Error): string {
  if (error instanceof HomeAssistantError) {
    return error.message
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

/**
 * Categories of errors for different handling strategies.
 */
export enum ErrorCategory {
  CONNECTION = 'connection',      // Network/connection issues - retryable
  VALIDATION = 'validation',      // Input validation - not retryable
  FEATURE = 'feature',           // Feature not supported - not retryable  
  PERMISSION = 'permission',      // Permission denied - not retryable
  TEMPORARY = 'temporary',        // Temporary service issues - retryable
  UNKNOWN = 'unknown'            // Unknown errors - might be retryable
}

/**
 * Categorize an error for appropriate handling.
 */
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