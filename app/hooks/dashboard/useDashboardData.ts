// app/components/dashboard/useDashboardData.ts

import { useMemo } from "react";
import {
  MODULE_TYPES,
  isModuleCompleted,
  normaliseModuleType,
  type Module,
  type ModuleType,
} from "../../models/module";
import type { DegreeRequirements } from "../../models/degree";
import { calculateGpa, calculateRemainingAUs } from "../../utils/gpaCalculator";
import type {
  CompletedAUsByType,
  DashboardData,
} from "../../types/dashboard.types";

export function useDashboardData(
  modules: Module[],
  degreeRequirements: DegreeRequirements,
): DashboardData {
  return useMemo(() => {
    const totalDegreeAUs = degreeRequirements.totalAUs;

    const { totalCompletedAUs, cumulativeGpa } = calculateGpa(modules);

    const remainingAUs = calculateRemainingAUs(modules, totalDegreeAUs);

    const completedByType = createEmptyCompletedByType();

    modules.forEach((module) => {
      if (!isModuleCompleted(module)) return;

      const moduleType = normaliseModuleType(module.type);
      completedByType[moduleType] += module.au;
    });

    const typePercentages = createEmptyCompletedByType();

    MODULE_TYPES.forEach((type) => {
      typePercentages[type] =
        totalDegreeAUs > 0
          ? Math.min((completedByType[type] / totalDegreeAUs) * 100, 100)
          : 0;
    });

    const progressPercentage =
      totalDegreeAUs > 0
        ? Math.min((totalCompletedAUs / totalDegreeAUs) * 100, 100)
        : 0;

    const remainingPercentage =
      totalDegreeAUs > 0
        ? Math.min((remainingAUs / totalDegreeAUs) * 100, 100)
        : 0;

    return {
      cumulativeGpa,
      totalCompletedAUs,
      remainingAUs,
      progressPercentage,
      completedByType,
      typePercentages,
      remainingPercentage,
    };
  }, [modules, degreeRequirements]);
}

function createEmptyCompletedByType(): CompletedAUsByType {
  return Object.fromEntries(MODULE_TYPES.map((type) => [type, 0])) as Record<
    ModuleType,
    number
  >;
}
