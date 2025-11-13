import { beforeAll, afterEach, vi } from 'vitest'
import '@testing-library/jest-dom'

// Suppress React act warnings in tests - these are expected for our async state updates
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to') &&
      args[0].includes('was not wrapped in act')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

// Clean up any pending timers after each test
afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})