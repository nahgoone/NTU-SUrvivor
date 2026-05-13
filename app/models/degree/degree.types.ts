// app/models/degreeRequirements/degreeRequirements.types.ts

import type { ModuleType } from "../module";

export type SuPolicy = {
  totalSUAUs: number;
  restrictedSUAUs: number;
};

export type DegreeRequirements = {
  totalAUs: number;
  byType: Record<ModuleType, number>;
  suPolicy: SuPolicy;
};

export type CreateDegreeRequirementsInput = {
  totalAUs?: number | string;
  byType?: Partial<Record<ModuleType, number | string>>;
  suPolicy?: Partial<{
    totalSUAUs: number | string;
    restrictedSUAUs: number | string;
  }>;
};
