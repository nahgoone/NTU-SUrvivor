// app/models/degreeRequirements/degreeRequirements.constants.ts

import { MODULE_TYPES, type ModuleType } from "../module";

export const DEFAULT_TOTAL_AUS = 138;

export const REQUIREMENT_TOTAL_LABEL = "Total";

export const DEFAULT_REQUIREMENTS_BY_TYPE = Object.fromEntries(
  MODULE_TYPES.map((type) => [type, 0]),
) as Record<ModuleType, number>;

export const DEFAULT_DEGREE_REQUIREMENTS = {
  totalAUs: DEFAULT_TOTAL_AUS,
  byType: DEFAULT_REQUIREMENTS_BY_TYPE,
};
