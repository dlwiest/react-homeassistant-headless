import { describe, it, expect } from 'vitest'
import { mockServiceCall } from '../mockStateTransitions'

describe('mockStateTransitions - number', () => {
  it('should handle set_value service', () => {
    const result = mockServiceCall(
      'number',
      'set_value',
      '50',
      { min: 0, max: 100, step: 5 },
      { value: 75 }
    )

    expect(result.state).toBe('75')
    expect(result.attributes).toEqual({ min: 0, max: 100, step: 5 })
  })

  it('should clamp value to max', () => {
    const result = mockServiceCall(
      'number',
      'set_value',
      '50',
      { min: 0, max: 100, step: 5 },
      { value: 150 }
    )

    expect(result.state).toBe('100')
  })

  it('should clamp value to min', () => {
    const result = mockServiceCall(
      'number',
      'set_value',
      '50',
      { min: 0, max: 100, step: 5 },
      { value: -10 }
    )

    expect(result.state).toBe('0')
  })

  it('should handle negative ranges', () => {
    const result = mockServiceCall(
      'number',
      'set_value',
      '0',
      { min: -10, max: 10, step: 1 },
      { value: -5 }
    )

    expect(result.state).toBe('-5')
  })
})
