// app/models/degreeRequirements/index.ts

export {
  DEFAULT_DEGREE_REQUIREMENTS,
  DEFAULT_REQUIREMENTS_BY_TYPE,
  DEFAULT_TOTAL_AUS,
  REQUIREMENT_TOTAL_LABEL,
} from "./degree.constants";

export type {
  CreateDegreeRequirementsInput,
  DegreeRequirements,
  DegreeRequirementType,
} from "./degree.types";

export {
  createDegreeRequirements,
  createEmptyRequirementsByType,
  getDefaultDegreeRequirements,
  getTotalTypeRequirement,
  normaliseDegreeRequirements,
  normaliseRequirementAu,
  requirementsMatchTotalAUs,
  updateTotalAUsInRequirements,
  updateTypeRequirementInRequirements,
} from "./degree.utils";
