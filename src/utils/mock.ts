import { ReactElement } from 'react'

export function createMockProvider(mockData: Record<string, unknown>) {
  // This is a placeholder for future mock provider functionality
  // mockData will be used in future implementation
  const MockProvider = ({ children }: { children: ReactElement }) => {
    // TODO: Use mockData to provide mock entities
    console.log('Mock data:', Object.keys(mockData).length, 'entities')
    return children
  }

  return MockProvider
}
