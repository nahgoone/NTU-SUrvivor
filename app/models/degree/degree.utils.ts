// app/models/degreeRequirements/degreeRequirements.utils.ts

import { MODULE_TYPES, normaliseModuleType, type ModuleType } from "../module";

import {
  DEFAULT_DEGREE_REQUIREMENTS,
  DEFAULT_TOTAL_AUS,
} from "./degree.constants";

import type {
  CreateDegreeRequirementsInput,
  DegreeRequirements,
} from "./degree.types";

export function createDegreeRequirements(
  input?: CreateDegreeRequirementsInput,
): DegreeRequirements {
  return {
    totalAUs: normaliseRequirementAu(input?.totalAUs ?? DEFAULT_TOTAL_AUS),
    byType: {
      ...createEmptyRequirementsByType(),
      ...normaliseRequirementsByType(input?.byType),
    },
  };
}

export function normaliseDegreeRequirements(
  requirements: CreateDegreeRequirementsInput,
): DegreeRequirements {
  return createDegreeRequirements(requirements);
}

export function updateTotalAUsInRequirements(
  requirements: DegreeRequirements,
  totalAUs: number | string,
): DegreeRequirements {
  return {
    ...requirements,
    totalAUs: normaliseRequirementAu(totalAUs),
  };
}

export function updateTypeRequirementInRequirements(
  requirements: DegreeRequirements,
  type: ModuleType,
  requiredAUs: number | string,
): DegreeRequirements {
  return {
    ...requirements,
    byType: {
      ...requirements.byType,
      [type]: normaliseRequirementAu(requiredAUs),
    },
  };
}

export function getTotalTypeRequirement(
  requirements: DegreeRequirements,
): number {
  return Object.values(requirements.byType).reduce(
    (sum, value) => sum + value,
    0,
  );
}

export function requirementsMatchTotalAUs(
  requirements: DegreeRequirements,
): boolean {
  return getTotalTypeRequirement(requirements) === requirements.totalAUs;
}

export function normaliseRequirementAu(value: number | string): number {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
}

export function createEmptyRequirementsByType(): Record<ModuleType, number> {
  return Object.fromEntries(MODULE_TYPES.map((type) => [type, 0])) as Record<
    ModuleType,
    number
  >;
}

function normaliseRequirementsByType(
  byType?: Partial<Record<ModuleType, number | string>>,
): Partial<Record<ModuleType, number>> {
  if (!byType) return {};

  return Object.fromEntries(
    Object.entries(byType).map(([type, value]) => {
      const normalisedType = normaliseModuleType(type);

      return [normalisedType, normaliseRequirementAu(value ?? 0)];
    }),
  ) as Partial<Record<ModuleType, number>>;
}

export function getDefaultDegreeRequirements(): DegreeRequirements {
  return {
    totalAUs: DEFAULT_DEGREE_REQUIREMENTS.totalAUs,
    byType: {
      ...DEFAULT_DEGREE_REQUIREMENTS.byType,
    },
  };
}
