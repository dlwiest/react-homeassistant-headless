/**
 * Checks if a specific feature is supported using bitwise operations.
 * 
 * @param supportedFeatures - The supported_features value from entity attributes
 * @param feature - The feature flag to check (e.g., LightFeatures.SUPPORT_BRIGHTNESS)
 * @returns true if the feature is supported, false otherwise
 */
export function hasFeature(supportedFeatures: number | undefined, feature: number): boolean {
  return ((supportedFeatures || 0) & feature) !== 0
}

/**
 * Checks multiple features at once and returns an object with boolean values.
 * This is useful for checking all features for a domain in one operation.
 * 
 * @param supportedFeatures - The supported_features value from entity attributes
 * @param featureMap - Object mapping feature names to feature flag values
 * @returns Object with same keys as featureMap but with boolean values
 * 
 * @example
 * const features = checkFeatures(attributes.supported_features, {
 *   brightness: LightFeatures.SUPPORT_BRIGHTNESS,
 *   color: LightFeatures.SUPPORT_COLOR,
 *   effects: LightFeatures.SUPPORT_EFFECT
 * });
 * // Returns: { brightness: true, color: false, effects: true }
 */
export function checkFeatures<T extends Record<string, number>>(
  supportedFeatures: number | undefined,
  featureMap: T
): Record<keyof T, boolean> {
  const features = supportedFeatures || 0
  const result = {} as Record<keyof T, boolean>
  
  for (const [key, value] of Object.entries(featureMap)) {
    result[key as keyof T] = (features & value) !== 0
  }
  
  return result
}

/**
 * Gets a list of supported features by name.
 * Useful for debugging or displaying capabilities to users.
 * 
 * @param supportedFeatures - The supported_features value from entity attributes
 * @param featureMap - Object mapping feature names to feature flag values
 * @returns Array of feature names that are supported
 * 
 * @example
 * const supportedList = getSupportedFeatures(attributes.supported_features, {
 *   brightness: LightFeatures.SUPPORT_BRIGHTNESS,
 *   color: LightFeatures.SUPPORT_COLOR
 * });
 * // Returns: ['brightness'] (if only brightness is supported)
 */
export function getSupportedFeatures<T extends Record<string, number>>(
  supportedFeatures: number | undefined,
  featureMap: T
): Array<keyof T> {
  const features = supportedFeatures || 0
  const supportedList: Array<keyof T> = []
  
  for (const [key, value] of Object.entries(featureMap)) {
    if ((features & value) !== 0) {
      supportedList.push(key as keyof T)
    }
  }
  
  return supportedList
}

/**
 * Creates a feature checker function for a specific feature set.
 * This is useful for creating domain-specific feature checkers.
 * 
 * @param featureMap - Object mapping feature names to feature flag values
 * @returns Function that checks features against the provided map
 */
export function createFeatureChecker<T extends Record<string, number>>(featureMap: T) {
  return (supportedFeatures: number | undefined) => {
    return checkFeatures(supportedFeatures, featureMap)
  }
}