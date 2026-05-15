// app/models/module/module.constants.ts

export const MODULE_TYPES = ["Core", "MPE", "BDE", "ICC", "Other"] as const;

export type ModuleType = (typeof MODULE_TYPES)[number];

export const GRADES = [
  "",
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "D+",
  "D",
  "F",
  "S/U",
  "PASS",
  "EX",
] as const;

export type Grade = (typeof GRADES)[number];

export const GRADE_POINTS: Partial<Record<Grade, number>> = {
  "A+": 5.0,
  A: 5.0,
  "A-": 4.5,
  "B+": 4.0,
  B: 3.5,
  "B-": 3.0,
  "C+": 2.5,
  C: 2.0,
  "D+": 1.5,
  D: 1.0,
  F: 0.0,
};

export const NON_GPA_GRADES: readonly Grade[] = ["", "S/U", "PASS", "EX"];

export const NON_COMPLETED_GRADES: readonly Grade[] = [""];

export const MODULE_TYPE_ALIASES: Record<string, ModuleType> = {
  "Major PE": "MPE",
  GERPE: "Other",
};

export const NO_SEMESTER_LABEL = "No Semester";

export const DEFAULT_MODULE_TYPE: ModuleType = "Other";

export const DEFAULT_GRADE: Grade = "";
