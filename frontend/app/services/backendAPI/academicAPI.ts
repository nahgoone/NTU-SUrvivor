// frontend/app/services/backendApi/academicApi.ts

import type { Module } from "../../models/module";
import type { DegreeRequirements } from "../../models/degree";
import { postToBackend } from "./backendAPIClient";

export type BackendGpaSummary = {
  totalCompletedAUs: number;
  totalGpaAUs: number;
  totalGradePoints: number;
  cumulativeGpa: number;
};

export type BackendSuOptimizerResult = {
  currentGpa: number;
  projectedGpa: number;
  gpaIncrease: number;
  recommendedModuleIds: string[];
  totalSUAUsUsed: number;
  restrictedSUAUsUsed: number;
  message: string;
};

export function calculateGpaWithBackend(
  modules: Module[],
): Promise<BackendGpaSummary> {
  return postToBackend<{ modules: Module[] }, BackendGpaSummary>(
    "/api/academic/gpa",
    {
      body: {
        modules,
      },
    },
  );
}

export function optimiseSuWithBackend(
  modules: Module[],
  degreeRequirements: DegreeRequirements,
): Promise<BackendSuOptimizerResult> {
  return postToBackend<
    {
      modules: Module[];
      degreeRequirements: DegreeRequirements;
    },
    BackendSuOptimizerResult
  >("/api/academic/su-optimise", {
    body: {
      modules,
      degreeRequirements,
    },
  });
}
