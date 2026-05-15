// app/models/degreeRequirements/degreeRequirements.constants.ts

import { MODULE_TYPES, type ModuleType } from "../module";

export const DEFAULT_TOTAL_AUS = 138;
export const DEFAULT_TOTAL_SU_AUS = 21;
export const DEFAULT_RESTRICTED_SU_AUS = 12;

export const REQUIREMENT_TOTAL_LABEL = "Total";
export const REQUIREMENT_TOTAL_SU_LABEL = "S/U Total";
export const REQUIREMENT_RESTRICTED_SU_LABEL = "S/U Restricted";

export const SU_RESTRICTED_MODULE_TYPES = [
  "Core",
  "MPE",
  "ICC",
] as readonly ModuleType[];

export const DEFAULT_REQUIREMENTS_BY_TYPE = Object.fromEntries(
  MODULE_TYPES.map((type) => [type, 0]),
) as Record<ModuleType, number>;

export const DEFAULT_DEGREE_REQUIREMENTS = {
  totalAUs: DEFAULT_TOTAL_AUS,
  byType: DEFAULT_REQUIREMENTS_BY_TYPE,
  suPolicy: {
    totalSUAUs: DEFAULT_TOTAL_SU_AUS,
    restrictedSUAUs: DEFAULT_RESTRICTED_SU_AUS,
  },
};
