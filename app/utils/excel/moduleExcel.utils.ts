// app/utils/excel/moduleExcel.utils.ts

import * as XLSX from "xlsx";

import {
  MODULE_TYPE_ALIASES,
  MODULE_TYPES,
  createModule,
  type Module,
  type ModuleType,
} from "../../models/module";

import {
  getDefaultDegreeRequirements,
  normaliseRequirementAu,
  REQUIREMENT_TOTAL_LABEL,
  type DegreeRequirements,
  REQUIREMENT_RESTRICTED_SU_LABEL,
  REQUIREMENT_TOTAL_SU_LABEL,
} from "../../models/degree";

import {
  EXPORT_FILE_NAME,
  MODULE_EXCEL_COLUMNS,
  REQUIRED_MODULE_COLUMNS,
  REQUIREMENT_EXCEL_COLUMNS,
  SHEET_NAMES,
  TEMPLATE_FILE_NAME,
  TEMPLATE_MODULE_ROWS,
  TEMPLATE_NOTES_ROWS,
  TEMPLATE_REQUIREMENT_ROWS,
} from "./moduleExcel.constants";

import type {
  ImportedWorkbookResult,
  ModuleExcelRow,
  RequirementExcelRow,
} from "./moduleExcel.types";

export function readWorkbook(arrayBuffer: ArrayBuffer): XLSX.WorkBook {
  return XLSX.read(arrayBuffer, { type: "array" });
}

export function writeExportWorkbook(
  modules: Module[],
  degreeRequirements: DegreeRequirements,
): void {
  const workbook = buildExportWorkbook(modules, degreeRequirements);
  XLSX.writeFile(workbook, EXPORT_FILE_NAME);
}

export function writeTemplateWorkbook(): void {
  const workbook = buildTemplateWorkbook();
  XLSX.writeFile(workbook, TEMPLATE_FILE_NAME);
}

export function buildExportWorkbook(
  modules: Module[],
  degreeRequirements: DegreeRequirements,
): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();

  const sortedModules = [...modules].sort(compareModulesForExport);

  const moduleRows = sortedModules.map(moduleToExcelRow);
  const requirementRows = degreeRequirementsToExcelRows(degreeRequirements);

  const modulesWorksheet = XLSX.utils.json_to_sheet(moduleRows);
  const requirementsWorksheet = XLSX.utils.json_to_sheet(requirementRows);

  applyModuleColumnWidths(modulesWorksheet);
  applyRequirementColumnWidths(requirementsWorksheet);

  XLSX.utils.book_append_sheet(workbook, modulesWorksheet, SHEET_NAMES.MODULES);

  XLSX.utils.book_append_sheet(
    workbook,
    requirementsWorksheet,
    SHEET_NAMES.REQUIREMENTS,
  );

  return workbook;
}

export function buildTemplateWorkbook(): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();

  const modulesWorksheet = XLSX.utils.json_to_sheet(TEMPLATE_MODULE_ROWS);

  const requirementsWorksheet = XLSX.utils.json_to_sheet(
    TEMPLATE_REQUIREMENT_ROWS,
  );

  const notesWorksheet = XLSX.utils.aoa_to_sheet(TEMPLATE_NOTES_ROWS);

  applyModuleColumnWidths(modulesWorksheet);
  applyRequirementColumnWidths(requirementsWorksheet);

  notesWorksheet["!cols"] = [{ wch: 15 }, { wch: 12 }, { wch: 55 }];

  XLSX.utils.book_append_sheet(
    workbook,
    requirementsWorksheet,
    SHEET_NAMES.REQUIREMENTS,
  );

  XLSX.utils.book_append_sheet(workbook, modulesWorksheet, SHEET_NAMES.MODULES);

  XLSX.utils.book_append_sheet(workbook, notesWorksheet, SHEET_NAMES.NOTES);

  return workbook;
}

export function parseImportedWorkbook(
  workbook: XLSX.WorkBook,
): ImportedWorkbookResult {
  const modulesWorksheet =
    workbook.Sheets[SHEET_NAMES.MODULES] ??
    workbook.Sheets[workbook.SheetNames[0]];

  if (!modulesWorksheet) {
    return {
      modules: [],
      errors: ["The uploaded Excel file does not contain any sheets."],
    };
  }

  const columnError = validateModuleColumns(modulesWorksheet);

  if (columnError) {
    return {
      modules: [],
      errors: [columnError],
    };
  }

  const moduleRows = XLSX.utils.sheet_to_json<ModuleExcelRow>(
    modulesWorksheet,
    {
      defval: "",
    },
  );

  if (moduleRows.length === 0) {
    return {
      modules: [],
      errors: ["The Modules sheet is empty."],
    };
  }

  const { modules, errors } = parseModuleRows(moduleRows);

  if (errors.length > 0) {
    return {
      modules: [],
      errors,
    };
  }

  const requirementsWorksheet = workbook.Sheets[SHEET_NAMES.REQUIREMENTS];

  const degreeRequirements = requirementsWorksheet
    ? parseRequirementRows(
        XLSX.utils.sheet_to_json<RequirementExcelRow>(requirementsWorksheet, {
          defval: "",
        }),
      )
    : undefined;

  return {
    modules,
    degreeRequirements,
    errors: [],
  };
}

function moduleToExcelRow(module: Module): ModuleExcelRow {
  return {
    Code: module.code,
    Name: module.name,
    AU: module.au,
    Type: module.type,
    Grade: module.grade,
    Semester: module.semester,
  };
}

function degreeRequirementsToExcelRows(
  degreeRequirements: DegreeRequirements,
): RequirementExcelRow[] {
  return [
    {
      Type: REQUIREMENT_TOTAL_LABEL,
      RequiredAUs: degreeRequirements.totalAUs,
    },
    {
      Type: REQUIREMENT_TOTAL_SU_LABEL,
      RequiredAUs: degreeRequirements.suPolicy.totalSUAUs,
    },
    {
      Type: REQUIREMENT_RESTRICTED_SU_LABEL,
      RequiredAUs: degreeRequirements.suPolicy.restrictedSUAUs,
    },
    ...Object.entries(degreeRequirements.byType).map(([type, requiredAUs]) => ({
      Type: type,
      RequiredAUs: requiredAUs,
    })),
  ];
}

function validateModuleColumns(worksheet: XLSX.WorkSheet): string | null {
  const uploadedColumns = getWorksheetHeaders(worksheet);

  const missingColumns = REQUIRED_MODULE_COLUMNS.filter(
    (column) => !uploadedColumns.includes(column),
  );

  if (missingColumns.length === 0) {
    return null;
  }

  return `Missing required column(s): ${missingColumns.join(
    ", ",
  )}. Please make sure your Excel file has these columns: ${REQUIRED_MODULE_COLUMNS.join(
    ", ",
  )}.`;
}

function getWorksheetHeaders(worksheet: XLSX.WorkSheet): string[] {
  const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  return (rows[0] ?? []).map((header) => String(header).trim());
}

function parseModuleRows(rows: ModuleExcelRow[]): {
  modules: Module[];
  errors: string[];
} {
  const modules: Module[] = [];
  const errors: string[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    const code = String(row.Code ?? "").trim();
    const name = String(row.Name ?? "").trim();
    const au = row.AU;
    const type = String(row.Type ?? "").trim();
    const grade = String(row.Grade ?? "").trim();
    const semester = String(row.Semester ?? "").trim();

    const rowErrors: string[] = [];

    if (!code) rowErrors.push(`Row ${rowNumber}: Code is missing.`);
    if (!name) rowErrors.push(`Row ${rowNumber}: Name is missing.`);
    if (!type) rowErrors.push(`Row ${rowNumber}: Type is missing.`);

    const parsedAu = Number(au);

    if (!Number.isFinite(parsedAu) || parsedAu <= 0) {
      rowErrors.push(`Row ${rowNumber}: AU must be a valid positive number.`);
    }

    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
      return;
    }

    try {
      modules.push(
        createModule({
          code,
          name,
          au: parsedAu,
          type,
          grade,
          semester,
        }),
      );
    } catch (error) {
      errors.push(
        `Row ${rowNumber}: ${
          error instanceof Error ? error.message : "Invalid module data."
        }`,
      );
    }
  });

  return {
    modules,
    errors,
  };
}

function parseRequirementRows(rows: RequirementExcelRow[]): DegreeRequirements {
  const requirements = getDefaultDegreeRequirements();

  rows.forEach((row) => {
    const type = String(row.Type ?? "").trim();
    const requiredAUs = normaliseRequirementAu(row.RequiredAUs ?? 0);

    if (!type) return;

    if (type === REQUIREMENT_TOTAL_LABEL) {
      requirements.totalAUs = requiredAUs;
      return;
    }

    const requirementType = normaliseRequirementType(type);

    if (!requirementType) return;

    if (type === REQUIREMENT_TOTAL_SU_LABEL) {
      requirements.suPolicy.totalSUAUs = requiredAUs;
      return;
    }

    if (type === REQUIREMENT_RESTRICTED_SU_LABEL) {
      requirements.suPolicy.restrictedSUAUs = requiredAUs;
      return;
    }

    requirements.byType[requirementType] = requiredAUs;
  });

  return requirements;
}

function normaliseRequirementType(type: string): ModuleType | null {
  if (type in MODULE_TYPE_ALIASES) {
    return MODULE_TYPE_ALIASES[type];
  }

  if (MODULE_TYPES.includes(type as ModuleType)) {
    return type as ModuleType;
  }

  return null;
}

function compareModulesForExport(a: Module, b: Module): number {
  const semesterComparison =
    parseSemesterScore(b.semester) - parseSemesterScore(a.semester);

  if (semesterComparison !== 0) {
    return semesterComparison;
  }

  return a.code.localeCompare(b.code);
}

function parseSemesterScore(semester: string): number {
  const match = semester
    .trim()
    .toUpperCase()
    .match(/^Y(\d+)S(\d+)$/);

  if (!match) {
    return -1;
  }

  const year = Number(match[1]);
  const sem = Number(match[2]);

  return year * 10 + sem;
}

function applyModuleColumnWidths(worksheet: XLSX.WorkSheet): void {
  worksheet["!cols"] = MODULE_EXCEL_COLUMNS.map((column) => {
    if (column === "Name") return { wch: 32 };
    if (column === "Code") return { wch: 15 };
    return { wch: 12 };
  });
}

function applyRequirementColumnWidths(worksheet: XLSX.WorkSheet): void {
  worksheet["!cols"] = REQUIREMENT_EXCEL_COLUMNS.map((column) => {
    if (column === "RequiredAUs") return { wch: 15 };
    return { wch: 15 };
  });
}
