import { describe, it, expect } from 'vitest'
import {
  hasFeature,
  checkFeatures,
  getSupportedFeatures,
  createFeatureChecker
} from '../features'

// Mock feature flags for testing (similar to LightFeatures)
const MockFeatures = {
  SUPPORT_BRIGHTNESS: 1,
  SUPPORT_COLOR_TEMP: 2,
  SUPPORT_EFFECT: 4,
  SUPPORT_COLOR: 16,
  SUPPORT_WHITE_VALUE: 128
} as const

describe('features utilities', () => {
  describe('hasFeature', () => {
    it('should return true when feature is supported', () => {
      const supportedFeatures = MockFeatures.SUPPORT_BRIGHTNESS | MockFeatures.SUPPORT_COLOR
      
      expect(hasFeature(supportedFeatures, MockFeatures.SUPPORT_BRIGHTNESS)).toBe(true)
      expect(hasFeature(supportedFeatures, MockFeatures.SUPPORT_COLOR)).toBe(true)
    })

    it('should return false when feature is not supported', () => {
      const supportedFeatures = MockFeatures.SUPPORT_BRIGHTNESS
      
      expect(hasFeature(supportedFeatures, MockFeatures.SUPPORT_COLOR)).toBe(false)
      expect(hasFeature(supportedFeatures, MockFeatures.SUPPORT_EFFECT)).toBe(false)
    })

    it('should handle undefined supported_features', () => {
      expect(hasFeature(undefined, MockFeatures.SUPPORT_BRIGHTNESS)).toBe(false)
      expect(hasFeature(null as any, MockFeatures.SUPPORT_BRIGHTNESS)).toBe(false)
    })

    it('should handle zero supported_features', () => {
      expect(hasFeature(0, MockFeatures.SUPPORT_BRIGHTNESS)).toBe(false)
    })

    it('should handle all features supported', () => {
      const allFeatures = Object.values(MockFeatures).reduce((acc, val) => acc | val, 0)
      
      expect(hasFeature(allFeatures, MockFeatures.SUPPORT_BRIGHTNESS)).toBe(true)
      expect(hasFeature(allFeatures, MockFeatures.SUPPORT_COLOR)).toBe(true)
      expect(hasFeature(allFeatures, MockFeatures.SUPPORT_EFFECT)).toBe(true)
    })
  })

  describe('checkFeatures', () => {
    const featureMap = {
      brightness: MockFeatures.SUPPORT_BRIGHTNESS,
      colorTemp: MockFeatures.SUPPORT_COLOR_TEMP,
      effects: MockFeatures.SUPPORT_EFFECT,
      color: MockFeatures.SUPPORT_COLOR
    }

    it('should check multiple features correctly', () => {
      const supportedFeatures = MockFeatures.SUPPORT_BRIGHTNESS | MockFeatures.SUPPORT_COLOR
      
      const result = checkFeatures(supportedFeatures, featureMap)
      
      expect(result).toEqual({
        brightness: true,
        colorTemp: false,
        effects: false,
        color: true
      })
    })

    it('should handle undefined supported_features', () => {
      const result = checkFeatures(undefined, featureMap)
      
      expect(result).toEqual({
        brightness: false,
        colorTemp: false,
        effects: false,
        color: false
      })
    })

    it('should handle empty feature map', () => {
      const result = checkFeatures(MockFeatures.SUPPORT_BRIGHTNESS, {})
      expect(result).toEqual({})
    })

    it('should handle zero supported_features', () => {
      const result = checkFeatures(0, featureMap)
      
      expect(result).toEqual({
        brightness: false,
        colorTemp: false,
        effects: false,
        color: false
      })
    })
  })

  describe('getSupportedFeatures', () => {
    const featureMap = {
      brightness: MockFeatures.SUPPORT_BRIGHTNESS,
      colorTemp: MockFeatures.SUPPORT_COLOR_TEMP,
      effects: MockFeatures.SUPPORT_EFFECT,
      color: MockFeatures.SUPPORT_COLOR
    }

    it('should return array of supported feature names', () => {
      const supportedFeatures = MockFeatures.SUPPORT_BRIGHTNESS | MockFeatures.SUPPORT_EFFECT
      
      const result = getSupportedFeatures(supportedFeatures, featureMap)
      
      expect(result).toEqual(['brightness', 'effects'])
    })

    it('should return empty array when no features supported', () => {
      const result = getSupportedFeatures(0, featureMap)
      expect(result).toEqual([])
    })

    it('should handle undefined supported_features', () => {
      const result = getSupportedFeatures(undefined, featureMap)
      expect(result).toEqual([])
    })

    it('should return all features when all are supported', () => {
      const allFeatures = Object.values(featureMap).reduce((acc, val) => acc | val, 0)
      
      const result = getSupportedFeatures(allFeatures, featureMap)
      
      expect(result).toEqual(['brightness', 'colorTemp', 'effects', 'color'])
    })

    it('should handle empty feature map', () => {
      const result = getSupportedFeatures(MockFeatures.SUPPORT_BRIGHTNESS, {})
      expect(result).toEqual([])
    })
  })

  describe('createFeatureChecker', () => {
    const featureMap = {
      brightness: MockFeatures.SUPPORT_BRIGHTNESS,
      colorTemp: MockFeatures.SUPPORT_COLOR_TEMP,
      effects: MockFeatures.SUPPORT_EFFECT
    }

    it('should create a feature checker function', () => {
      const checkLightFeatures = createFeatureChecker(featureMap)
      
      expect(typeof checkLightFeatures).toBe('function')
    })

    it('should create feature checker that works correctly', () => {
      const checkLightFeatures = createFeatureChecker(featureMap)
      const supportedFeatures = MockFeatures.SUPPORT_BRIGHTNESS | MockFeatures.SUPPORT_EFFECT
      
      const result = checkLightFeatures(supportedFeatures)
      
      expect(result).toEqual({
        brightness: true,
        colorTemp: false,
        effects: true
      })
    })

    it('should create feature checker that handles undefined', () => {
      const checkLightFeatures = createFeatureChecker(featureMap)
      
      const result = checkLightFeatures(undefined)
      
      expect(result).toEqual({
        brightness: false,
        colorTemp: false,
        effects: false
      })
    })
  })

  describe('real-world scenarios', () => {
    // These test realistic Home Assistant feature combinations
    it('should work with actual light features', () => {
      // A typical smart bulb that supports brightness and color
      const smartBulbFeatures = 1 | 16 // SUPPORT_BRIGHTNESS | SUPPORT_COLOR
      
      expect(hasFeature(smartBulbFeatures, 1)).toBe(true)   // brightness
      expect(hasFeature(smartBulbFeatures, 2)).toBe(false)  // color_temp
      expect(hasFeature(smartBulbFeatures, 4)).toBe(false)  // effects
      expect(hasFeature(smartBulbFeatures, 16)).toBe(true)  // color
    })

    it('should work with basic switch (no features)', () => {
      expect(hasFeature(0, 1)).toBe(false)
      expect(hasFeature(undefined, 1)).toBe(false)
    })

    it('should work with advanced light (all features)', () => {
      const advancedLightFeatures = 1 | 2 | 4 | 16 // All common light features
      
      const features = checkFeatures(advancedLightFeatures, {
        brightness: 1,
        colorTemp: 2,
        effects: 4,
        color: 16
      })
      
      expect(Object.values(features).every(Boolean)).toBe(true)
    })
  })
})