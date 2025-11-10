// Domain validation utilities
export {
  validateAndNormalizeDomain,
  createDomainValidator,
  extractDomain,
  extractEntityName
} from './entityId'

// Feature detection utilities
export {
  hasFeature,
  checkFeatures,
  getSupportedFeatures,
  createFeatureChecker
} from './features'

// Service call helper utilities
export {
  createBasicControlDefs,
  createFeatureBasedControlDef,
  createOptionBasedControlDef,
  createNumericControlDef,
  createTurnOnControlDef,
  type CallServiceFunction
} from './serviceHelpers'

// Entity validation utilities
export {
  validateEntityIdFormat,
  useEntityExistenceWarning,
  useEntityIdValidation,
  useEntityValidation
} from './entityValidation'