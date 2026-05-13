// app/models/degreeRequirements/degreeRequirements.types.ts

import type { ModuleType } from "../module";

export type DegreeRequirements = {
  totalAUs: number;
  byType: Record<ModuleType, number>;
};

export type DegreeRequirementType = ModuleType;

export type CreateDegreeRequirementsInput = {
  totalAUs?: number | string;
  byType?: Partial<Record<ModuleType, number | string>>;
};
