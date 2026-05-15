// app/models/suOptimizer/suOptimizer.utils.ts

import {
  GRADE_POINTS,
  type Module,
  type ModuleType,
  normaliseModuleType,
} from "../../models/module";

import {
  SU_RESTRICTED_MODULE_TYPES,
  calculateSuUsage,
  type DegreeRequirements,
} from "../../models/degree";

import { calculateGpa, roundGpa } from "../../utils/gpaCalculator";

import type {
  SuOptimizerCandidate,
  SuOptimizerResult,
} from "./suOptimizer.types";

type OptimizerState = {
  removedAUs: number;
  restrictedAUs: number;
  removedGradePoints: number;
  moduleIds: string[];
};

export function optimiseSuUsage(
  modules: Module[],
  degreeRequirements: DegreeRequirements,
): SuOptimizerResult {
  const currentGpaSummary = calculateGpa(modules);
  const currentSuUsage = calculateSuUsage(modules, degreeRequirements);

  const totalSuCapacity = Math.max(
    degreeRequirements.suPolicy.totalSUAUs - currentSuUsage.totalUsedSUAUs,
    0,
  );

  const restrictedSuCapacity = Math.max(
    degreeRequirements.suPolicy.restrictedSUAUs -
      currentSuUsage.restrictedUsedSUAUs,
    0,
  );

  const candidates = getSuOptimizerCandidates(modules);

  if (candidates.length === 0) {
    return {
      currentGpa: currentGpaSummary.cumulativeGpa,
      projectedGpa: currentGpaSummary.cumulativeGpa,
      gpaIncrease: 0,
      recommendedModules: [],
      totalSUAUsUsed: 0,
      restrictedSUAUsUsed: 0,
      totalSUAUsAvailable: totalSuCapacity,
      restrictedSUAUsAvailable: restrictedSuCapacity,
      message: "No eligible modules found for S/U optimisation.",
    };
  }

  const bestState = findBestSuCombination({
    candidates,
    currentTotalGpaAUs: currentGpaSummary.totalGpaAUs,
    currentTotalGradePoints:
      currentGpaSummary.cumulativeGpa * currentGpaSummary.totalGpaAUs,
    totalSuCapacity,
    restrictedSuCapacity,
  });

  if (!bestState || bestState.moduleIds.length === 0) {
    return {
      currentGpa: currentGpaSummary.cumulativeGpa,
      projectedGpa: currentGpaSummary.cumulativeGpa,
      gpaIncrease: 0,
      recommendedModules: [],
      totalSUAUsUsed: 0,
      restrictedSUAUsUsed: 0,
      totalSUAUsAvailable: totalSuCapacity,
      restrictedSUAUsAvailable: restrictedSuCapacity,
      message: "No S/U combination improves your CGPA.",
    };
  }

  const projectedGpa = calculateProjectedGpa({
    currentTotalGpaAUs: currentGpaSummary.totalGpaAUs,
    currentTotalGradePoints:
      currentGpaSummary.cumulativeGpa * currentGpaSummary.totalGpaAUs,
    removedAUs: bestState.removedAUs,
    removedGradePoints: bestState.removedGradePoints,
  });

  const recommendedModules = bestState.moduleIds
    .map((moduleId) => modules.find((module) => module.id === moduleId))
    .filter((module): module is Module => Boolean(module))
    .map((module) => ({
      module,
      reason: getRecommendationReason(module),
    }));

  return {
    currentGpa: currentGpaSummary.cumulativeGpa,
    projectedGpa,
    gpaIncrease: roundGpa(projectedGpa - currentGpaSummary.cumulativeGpa),
    recommendedModules,
    totalSUAUsUsed: bestState.removedAUs,
    restrictedSUAUsUsed: bestState.restrictedAUs,
    totalSUAUsAvailable: totalSuCapacity,
    restrictedSUAUsAvailable: restrictedSuCapacity,
    message: `Recommended S/U for ${recommendedModules.length} module(s).`,
  };
}

function getSuOptimizerCandidates(modules: Module[]): SuOptimizerCandidate[] {
  return modules
    .filter((module) => isEligibleForSuOptimisation(module))
    .map((module) => {
      const gradePoint = GRADE_POINTS[module.grade];

      if (gradePoint === undefined) {
        return null;
      }

      const moduleType = normaliseModuleType(module.type);

      const restrictedAUsUsed = isRestrictedSuType(moduleType) ? module.au : 0;

      return {
        module,
        au: module.au,
        gradePoint,
        restrictedAUsUsed,
        gradePointsRemoved: module.au * gradePoint,
      };
    })
    .filter(
      (candidate): candidate is SuOptimizerCandidate => candidate !== null,
    );
}

function isEligibleForSuOptimisation(module: Module): boolean {
  const gradePoint = GRADE_POINTS[module.grade];

  if (gradePoint === undefined) {
    return false;
  }

  // Do not recommend S/U for A or A+ because it cannot improve GPA.
  if (gradePoint >= 5.0) {
    return false;
  }

  // Already S/U, blank, EX, etc. are excluded because they have no grade point.
  return true;
}

function isRestrictedSuType(type: ModuleType): boolean {
  return SU_RESTRICTED_MODULE_TYPES.includes(type);
}

function findBestSuCombination({
  candidates,
  currentTotalGpaAUs,
  currentTotalGradePoints,
  totalSuCapacity,
  restrictedSuCapacity,
}: {
  candidates: SuOptimizerCandidate[];
  currentTotalGpaAUs: number;
  currentTotalGradePoints: number;
  totalSuCapacity: number;
  restrictedSuCapacity: number;
}): OptimizerState | null {
  const states = new Map<string, OptimizerState>();

  const initialState: OptimizerState = {
    removedAUs: 0,
    restrictedAUs: 0,
    removedGradePoints: 0,
    moduleIds: [],
  };

  states.set(getStateKey(0, 0), initialState);

  candidates.forEach((candidate) => {
    const currentStates = Array.from(states.values());

    currentStates.forEach((state) => {
      const nextRemovedAUs = state.removedAUs + candidate.au;
      const nextRestrictedAUs =
        state.restrictedAUs + candidate.restrictedAUsUsed;

      if (nextRemovedAUs > totalSuCapacity) return;
      if (nextRestrictedAUs > restrictedSuCapacity) return;

      const nextState: OptimizerState = {
        removedAUs: nextRemovedAUs,
        restrictedAUs: nextRestrictedAUs,
        removedGradePoints:
          state.removedGradePoints + candidate.gradePointsRemoved,
        moduleIds: [...state.moduleIds, candidate.module.id],
      };

      const key = getStateKey(nextRemovedAUs, nextRestrictedAUs);
      const existingState = states.get(key);

      /**
       * For the same AU usage, keep the state that removes fewer grade points.
       * This usually gives a better projected GPA because we are removing
       * weaker grades from the GPA calculation.
       */
      if (
        !existingState ||
        nextState.removedGradePoints < existingState.removedGradePoints
      ) {
        states.set(key, nextState);
      }
    });
  });

  let bestState: OptimizerState | null = null;
  let bestProjectedGpa = calculateProjectedGpa({
    currentTotalGpaAUs,
    currentTotalGradePoints,
    removedAUs: 0,
    removedGradePoints: 0,
  });

  Array.from(states.values()).forEach((state) => {
    if (state.removedAUs === 0) return;

    const projectedGpa = calculateProjectedGpa({
      currentTotalGpaAUs,
      currentTotalGradePoints,
      removedAUs: state.removedAUs,
      removedGradePoints: state.removedGradePoints,
    });

    if (projectedGpa > bestProjectedGpa) {
      bestProjectedGpa = projectedGpa;
      bestState = state;
    }
  });

  return bestState;
}

function calculateProjectedGpa({
  currentTotalGpaAUs,
  currentTotalGradePoints,
  removedAUs,
  removedGradePoints,
}: {
  currentTotalGpaAUs: number;
  currentTotalGradePoints: number;
  removedAUs: number;
  removedGradePoints: number;
}): number {
  const remainingGpaAUs = currentTotalGpaAUs - removedAUs;

  if (remainingGpaAUs <= 0) {
    return 0;
  }

  const remainingGradePoints = currentTotalGradePoints - removedGradePoints;

  return roundGpa(remainingGradePoints / remainingGpaAUs);
}

function getStateKey(totalAUs: number, restrictedAUs: number): string {
  return `${totalAUs}-${restrictedAUs}`;
}

function getRecommendationReason(module: Module): string {
  const moduleType = normaliseModuleType(module.type);

  if (moduleType === "MPE") {
    return "S/U improves CGPA. This MPE will be counted towards BDE AUs after S/U.";
  }

  return "S/U improves CGPA by removing this grade from GPA calculation.";
}
