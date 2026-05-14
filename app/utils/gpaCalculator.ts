// app/utils/gpaCalculator.ts

import {
  GRADE_POINTS,
  countsTowardGpa,
  isModuleCompleted,
  type Module,
} from "../models/module";

export const GPA_DECIMAL_PLACES = 3;

export type GpaSummary = {
  totalCompletedAUs: number;
  totalGpaAUs: number;
  cumulativeGpa: number;
};

export function roundGpa(value: number): number {
  return Number(value.toFixed(GPA_DECIMAL_PLACES));
}

export function formatGpa(value: number): string {
  return value.toFixed(GPA_DECIMAL_PLACES);
}

export function calculateGpa(modules: Module[]): GpaSummary {
  let totalCompletedAUs = 0;
  let totalGpaAUs = 0;
  let totalGradePoints = 0;

  modules.forEach((module) => {
    if (isModuleCompleted(module)) {
      totalCompletedAUs += module.au;
    }

    if (!countsTowardGpa(module)) {
      return;
    }

    const gradePoint = GRADE_POINTS[module.grade];

    if (gradePoint === undefined) {
      return;
    }

    totalGpaAUs += module.au;
    totalGradePoints += module.au * gradePoint;
  });

  const cumulativeGpa =
    totalGpaAUs === 0 ? 0 : roundGpa(totalGradePoints / totalGpaAUs);

  return {
    totalCompletedAUs,
    totalGpaAUs,
    cumulativeGpa,
  };
}

export function calculateRemainingAUs(
  modules: Module[],
  totalDegreeRequirement: number,
): number {
  const { totalCompletedAUs } = calculateGpa(modules);

  return Math.max(totalDegreeRequirement - totalCompletedAUs, 0);
}
