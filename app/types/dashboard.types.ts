// app/components/dashboard/dashboard.types.ts

import type { ModuleType } from "../models/module";

export type CompletedAUsByType = Record<ModuleType, number>;

export type DashboardData = {
  cumulativeGpa: number;
  totalCompletedAUs: number;
  remainingAUs: number;
  progressPercentage: number;
  completedByType: CompletedAUsByType;
  typePercentages: CompletedAUsByType;
  remainingPercentage: number;
};
