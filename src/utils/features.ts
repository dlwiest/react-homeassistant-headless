// Checks if a specific feature is supported using bitwise operations
export function hasFeature(supportedFeatures: number | undefined, feature: number): boolean {
  return ((supportedFeatures || 0) & feature) !== 0
}

// Checks multiple features at once and returns an object with boolean values
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

// Gets a list of supported features by name
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

// Creates a feature checker function for a specific feature set
export function createFeatureChecker<T extends Record<string, number>>(featureMap: T) {
  return (supportedFeatures: number | undefined) => {
    return checkFeatures(supportedFeatures, featureMap)
  }
}