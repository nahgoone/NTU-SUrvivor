// app/utils/excel/moduleExcel.types.ts

import type { DegreeRequirements } from "../../models/degree";
import type { Module } from "../../models/module";

export type ModuleExcelRow = {
  Code?: string;
  Name?: string;
  AU?: string | number;
  Type?: string;
  Grade?: string;
  Semester?: string;
};

export type RequirementExcelRow = {
  Type?: string;
  RequiredAUs?: string | number;
};

export type ImportedWorkbookResult = {
  modules: Module[];
  degreeRequirements?: DegreeRequirements;
  errors: string[];
};
