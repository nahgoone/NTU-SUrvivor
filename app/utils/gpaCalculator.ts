// app/utils/gpaCalculator.ts

import {
  GRADE_POINTS,
  countsTowardGpa,
  isModuleCompleted,
  type Module,
} from "../models/module";

export type GpaSummary = {
  totalCompletedAUs: number;
  totalGpaAUs: number;
  cumulativeGpa: number;
};

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
    totalGpaAUs === 0 ? 0 : Number((totalGradePoints / totalGpaAUs).toFixed(2));

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
