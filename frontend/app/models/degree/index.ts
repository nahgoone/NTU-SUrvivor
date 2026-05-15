export {
  DEFAULT_DEGREE_REQUIREMENTS,
  DEFAULT_REQUIREMENTS_BY_TYPE,
  DEFAULT_RESTRICTED_SU_AUS,
  DEFAULT_TOTAL_AUS,
  DEFAULT_TOTAL_SU_AUS,
  REQUIREMENT_RESTRICTED_SU_LABEL,
  REQUIREMENT_TOTAL_LABEL,
  REQUIREMENT_TOTAL_SU_LABEL,
  SU_RESTRICTED_MODULE_TYPES,
} from "./degree.constants";

export type {
  CreateDegreeRequirementsInput,
  DegreeRequirements,
  SuPolicy,
} from "./degree.types";

export {
  calculateSuUsage,
  createDegreeRequirements,
  createEmptyRequirementsByType,
  getDefaultDegreeRequirements,
  getTotalTypeRequirement,
  normaliseDegreeRequirements,
  normaliseRequirementAu,
  normaliseSuPolicy,
  requirementsMatchTotalAUs,
  updateRestrictedSUAUsInRequirements,
  updateTotalAUsInRequirements,
  updateTotalSUAUsInRequirements,
  updateTypeRequirementInRequirements,
  validateSuGradeChange,
} from "./degree.utils";

export type { SuGradeChangeValidation, SuUsageSummary } from "./degree.utils";
