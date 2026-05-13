// app/utils/excel/moduleExcel.constants.ts

import { MODULE_TYPES } from "../../models/module";
import {
  DEFAULT_TOTAL_AUS,
  REQUIREMENT_TOTAL_LABEL,
} from "../../models/degree";
import type { ModuleExcelRow, RequirementExcelRow } from "./moduleExcel.types";

export const SHEET_NAMES = {
  MODULES: "Modules",
  REQUIREMENTS: "Requirements",
  NOTES: "Notes",
} as const;

export const MODULE_EXCEL_COLUMNS = [
  "Code",
  "Name",
  "AU",
  "Type",
  "Grade",
  "Semester",
] as const;

export const REQUIRED_MODULE_COLUMNS = [
  "Code",
  "Name",
  "AU",
  "Type",
  "Grade",
] as const;

export const REQUIREMENT_EXCEL_COLUMNS = ["Type", "RequiredAUs"] as const;

export const EXPORT_FILE_NAME = "gpa-modules.xlsx";

export const TEMPLATE_FILE_NAME = "gpa-modules-template.xlsx";

export const TEMPLATE_MODULE_ROWS: ModuleExcelRow[] = [
  {
    Code: "SC2006",
    Name: "Software Engineering",
    AU: 3,
    Type: "Core",
    Grade: "A-",
    Semester: "Y2S2",
  },
  {
    Code: "SC1006",
    Name: "Computer Architecture",
    AU: 3,
    Type: "Core",
    Grade: "",
    Semester: "Y1S2",
  },
  {
    Code: "BDE001",
    Name: "Design Thinking",
    AU: 3,
    Type: "BDE",
    Grade: "S/U",
    Semester: "Y2S1",
  },
];

export const TEMPLATE_REQUIREMENT_ROWS: RequirementExcelRow[] = [
  { Type: REQUIREMENT_TOTAL_LABEL, RequiredAUs: DEFAULT_TOTAL_AUS },
  ...MODULE_TYPES.map((type) => ({
    Type: type,
    RequiredAUs: 0,
  })),
];

export const TEMPLATE_NOTES_ROWS = [
  ["Column", "Required?", "Notes"],
  ["Code", "Yes", "Module code, e.g. SC2006"],
  ["Name", "Yes", "Module name"],
  ["AU", "Yes", "Academic Units. Must be a positive number."],
  ["Type", "Yes", `Examples: ${MODULE_TYPES.join(", ")}`],
  ["Grade", "Yes", "Can be left blank if module is not completed yet."],
  ["Semester", "No", "Example: Y2S2"],
];
