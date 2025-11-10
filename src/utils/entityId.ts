interface DomainValidationOptions {
  warnOnWrongDomain?: boolean
  hookName?: string
}

/**
 * Validates and normalizes an entity ID for a specific domain.
 * 
 * @param entityId - The entity ID to validate (can be full "domain.entity" or just "entity")
 * @param expectedDomain - The expected domain (e.g., "light", "fan", "switch")
 * @param options - Configuration options for validation behavior
 * @returns Normalized entity ID in format "domain.entity"
 */
export function validateAndNormalizeDomain(
  entityId: string,
  expectedDomain: string,
  options: DomainValidationOptions = {}
): string {
  const { warnOnWrongDomain = false, hookName } = options

  // If entityId already contains domain, validate it
  if (entityId.includes('.')) {
    if (warnOnWrongDomain && !entityId.startsWith(`${expectedDomain}.`)) {
      const [actualDomain] = entityId.split('.')
      const hookPrefix = hookName ? `${hookName}: ` : ''
      console.warn(
        `${hookPrefix}Entity "${entityId}" has domain "${actualDomain}" but expects "${expectedDomain}" domain. ` +
        `This may not work as expected. Use useEntity() or the appropriate domain-specific hook instead.`
      )
    }
    return entityId
  }

  // If no domain specified, prepend the expected domain
  return `${expectedDomain}.${entityId}`
}

/**
 * Creates a domain validator function for a specific domain and hook.
 * This is useful for creating consistent validators across hooks.
 * 
 * @param expectedDomain - The domain this validator is for
 * @param hookName - The name of the hook using this validator
 * @returns A function that validates entity IDs for this domain
 */
export function createDomainValidator(expectedDomain: string, hookName: string) {
  return (entityId: string): string => {
    return validateAndNormalizeDomain(entityId, expectedDomain, {
      warnOnWrongDomain: true,
      hookName
    })
  }
}

/**
 * Extracts the domain from a full entity ID.
 * 
 * @param entityId - Full entity ID in format "domain.entity"
 * @returns The domain part, or null if invalid format
 */
export function extractDomain(entityId: string): string | null {
  if (!entityId.includes('.')) {
    return null
  }
  
  return entityId.split('.')[0]
}

/**
 * Extracts the entity name from a full entity ID.
 * 
 * @param entityId - Full entity ID in format "domain.entity"  
 * @returns The entity name part, or the original string if no domain
 */
export function extractEntityName(entityId: string): string {
  if (!entityId.includes('.')) {
    return entityId
  }
  
  return entityId.split('.').slice(1).join('.')
}