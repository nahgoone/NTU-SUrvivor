import {
  getEffectiveModuleTypeForAu,
  isSuGradedModule,
  normaliseGrade,
  normaliseModuleType,
  type Grade,
  type Module,
  type ModuleType,
} from "../module";

import {
  DEFAULT_DEGREE_REQUIREMENTS,
  DEFAULT_TOTAL_AUS,
  DEFAULT_TOTAL_SU_AUS,
  DEFAULT_RESTRICTED_SU_AUS,
  SU_RESTRICTED_MODULE_TYPES,
} from "./degree.constants";

import type {
  CreateDegreeRequirementsInput,
  DegreeRequirements,
  SuPolicy,
} from "./degree.types";

export type SuUsageSummary = {
  totalUsedSUAUs: number;
  totalRemainingSUAUs: number;
  restrictedUsedSUAUs: number;
  restrictedRemainingSUAUs: number;
  bdeCountedSUAUs: number;
  exceedsTotalSULimit: boolean;
  exceedsRestrictedSULimit: boolean;
};

export type SuGradeChangeValidation = {
  allowed: boolean;
  message?: string;
};

export function validateSuGradeChange(
  modules: Module[],
  requirements: DegreeRequirements,
  moduleId: string,
  nextGrade: string,
): SuGradeChangeValidation {
  const normalisedNextGrade = normaliseGrade(nextGrade);

  // Only need to block when user is trying to set S/U.
  if (normalisedNextGrade !== "S/U") {
    return {
      allowed: true,
    };
  }

  const targetModule = modules.find((module) => module.id === moduleId);

  if (!targetModule) {
    return {
      allowed: false,
      message: "Module could not be found.",
    };
  }

  const targetModuleType = normaliseModuleType(targetModule.type);

  const proposedModules = modules.map((module) =>
    module.id === moduleId
      ? {
          ...module,
          grade: normalisedNextGrade as Grade,
        }
      : module,
  );

  const proposedSuUsage = calculateSuUsage(proposedModules, requirements);

  if (proposedSuUsage.exceedsTotalSULimit) {
    return {
      allowed: false,
      message: `You have exceeded your total S/U limit of ${requirements.suPolicy.totalSUAUs} AU.`,
    };
  }

  if (proposedSuUsage.exceedsRestrictedSULimit) {
    return {
      allowed: false,
      message: `You can only use ${requirements.suPolicy.restrictedSUAUs} AU of S/U for Core, MPE, or ICC modules.`,
    };
  }

  return {
    allowed: true,
    message:
      targetModuleType === "MPE"
        ? "This MPE will be counted towards BDE AUs because it is S/U."
        : undefined,
  };
}

export function createDegreeRequirements(
  input?: CreateDegreeRequirementsInput,
): DegreeRequirements {
  return {
    totalAUs: normaliseRequirementAu(input?.totalAUs ?? DEFAULT_TOTAL_AUS),
    byType: {
      ...createEmptyRequirementsByType(),
      ...normaliseRequirementsByType(input?.byType),
    },
    suPolicy: normaliseSuPolicy(input?.suPolicy),
  };
}

export function normaliseDegreeRequirements(
  requirements?: CreateDegreeRequirementsInput,
): DegreeRequirements {
  return createDegreeRequirements(requirements);
}

export function normaliseSuPolicy(
  suPolicy?: CreateDegreeRequirementsInput["suPolicy"],
): SuPolicy {
  return {
    totalSUAUs: normaliseRequirementAu(
      suPolicy?.totalSUAUs ?? DEFAULT_TOTAL_SU_AUS,
    ),
    restrictedSUAUs: normaliseRequirementAu(
      suPolicy?.restrictedSUAUs ?? DEFAULT_RESTRICTED_SU_AUS,
    ),
  };
}

export function updateTotalSUAUsInRequirements(
  requirements: DegreeRequirements,
  totalSUAUs: number | string,
): DegreeRequirements {
  return {
    ...requirements,
    suPolicy: {
      ...requirements.suPolicy,
      totalSUAUs: normaliseRequirementAu(totalSUAUs),
    },
  };
}

export function updateRestrictedSUAUsInRequirements(
  requirements: DegreeRequirements,
  restrictedSUAUs: number | string,
): DegreeRequirements {
  return {
    ...requirements,
    suPolicy: {
      ...requirements.suPolicy,
      restrictedSUAUs: normaliseRequirementAu(restrictedSUAUs),
    },
  };
}

export function calculateSuUsage(
  modules: Module[],
  requirements: DegreeRequirements,
): SuUsageSummary {
  let totalUsedSUAUs = 0;
  let restrictedUsedSUAUs = 0;
  let bdeCountedSUAUs = 0;

  modules.forEach((module) => {
    if (!isSuGradedModule(module)) return;

    totalUsedSUAUs += module.au;

    const originalType = normaliseModuleType(module.type);
    const effectiveType = getEffectiveModuleTypeForAu(module);

    if (SU_RESTRICTED_MODULE_TYPES.includes(originalType)) {
      restrictedUsedSUAUs += module.au;
    }

    if (effectiveType === "BDE") {
      bdeCountedSUAUs += module.au;
    }
  });

  const totalRemainingSUAUs = Math.max(
    requirements.suPolicy.totalSUAUs - totalUsedSUAUs,
    0,
  );

  const restrictedRemainingSUAUs = Math.max(
    requirements.suPolicy.restrictedSUAUs - restrictedUsedSUAUs,
    0,
  );

  return {
    totalUsedSUAUs,
    totalRemainingSUAUs,
    restrictedUsedSUAUs,
    restrictedRemainingSUAUs,
    bdeCountedSUAUs,
    exceedsTotalSULimit: totalUsedSUAUs > requirements.suPolicy.totalSUAUs,
    exceedsRestrictedSULimit:
      restrictedUsedSUAUs > requirements.suPolicy.restrictedSUAUs,
  };
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
  return Object.fromEntries(
    Object.keys(DEFAULT_DEGREE_REQUIREMENTS.byType).map((type) => [type, 0]),
  ) as Record<ModuleType, number>;
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
    suPolicy: {
      ...DEFAULT_DEGREE_REQUIREMENTS.suPolicy,
    },
  };
}
