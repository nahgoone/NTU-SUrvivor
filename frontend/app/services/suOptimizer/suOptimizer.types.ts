// app/models/suOptimizer/suOptimizer.types.ts

import type { Module } from "../../models/module";

export type SuOptimizerCandidate = {
  module: Module;
  au: number;
  gradePoint: number;
  restrictedAUsUsed: number;
  gradePointsRemoved: number;
};

export type SuOptimizerRecommendation = {
  module: Module;
  reason: string;
};

export type SuOptimizerResult = {
  currentGpa: number;
  projectedGpa: number;
  gpaIncrease: number;

  recommendedModules: SuOptimizerRecommendation[];

  totalSUAUsUsed: number;
  restrictedSUAUsUsed: number;

  totalSUAUsAvailable: number;
  restrictedSUAUsAvailable: number;

  message: string;
};
