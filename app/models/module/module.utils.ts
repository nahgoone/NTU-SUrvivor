// app/models/module/module.utils.ts

import {
  DEFAULT_GRADE,
  DEFAULT_MODULE_TYPE,
  GRADES,
  MODULE_TYPES,
  MODULE_TYPE_ALIASES,
  NON_COMPLETED_GRADES,
  NON_GPA_GRADES,
  NO_SEMESTER_LABEL,
  type Grade,
  type ModuleType,
} from "./module.constants";

import type {
  CreateModuleInput,
  Module,
  UpdateModuleInput,
} from "./module.types";

export function createModule(input: CreateModuleInput): Module {
  return {
    id: input.id ?? crypto.randomUUID(),
    code: normaliseModuleCode(input.code),
    name: normaliseModuleName(input.name),
    au: normaliseModuleAu(input.au),
    type: normaliseModuleType(input.type),
    grade: normaliseGrade(input.grade),
    semester: normaliseSemester(input.semester),
  };
}

export function isSuGradedModule(module: Module): boolean {
  return module.grade === "S/U";
}

export function getEffectiveModuleTypeForAu(module: Module): ModuleType {
  const originalType = normaliseModuleType(module.type);

  // School rule:
  // If an MPE is S/U, it is counted towards BDE AUs instead of MPE AUs.
  if (module.grade === "S/U" && originalType === "MPE") {
    return "BDE";
  }

  return originalType;
}

export function normaliseModule(module: Module): Module {
  return createModule(module);
}

export function updateModuleData(
  module: Module,
  updates: UpdateModuleInput,
): Module {
  return createModule({
    ...module,
    ...updates,
    id: module.id,
  });
}

export function normaliseModuleCode(code: string): string {
  return String(code ?? "")
    .trim()
    .toUpperCase();
}

export function normaliseModuleName(name: string): string {
  return String(name ?? "").trim();
}

export function normaliseModuleAu(au: number | string): number {
  const parsedAu = Number(au);

  if (!Number.isFinite(parsedAu) || parsedAu <= 0) {
    throw new Error("AU must be a valid positive number.");
  }

  return parsedAu;
}

export function normaliseModuleType(type: string): ModuleType {
  const cleanedType = String(type ?? "").trim();

  if (cleanedType in MODULE_TYPE_ALIASES) {
    return MODULE_TYPE_ALIASES[cleanedType];
  }

  if (MODULE_TYPES.includes(cleanedType as ModuleType)) {
    return cleanedType as ModuleType;
  }

  return DEFAULT_MODULE_TYPE;
}

export function normaliseGrade(grade: string): Grade {
  const cleanedGrade = String(grade ?? "")
    .trim()
    .toUpperCase();

  if (GRADES.includes(cleanedGrade as Grade)) {
    return cleanedGrade as Grade;
  }

  return DEFAULT_GRADE;
}

export function normaliseSemester(semester: string): string {
  return String(semester ?? "")
    .trim()
    .toUpperCase();
}

export function getModuleSemesterLabel(module: Module): string {
  return module.semester || NO_SEMESTER_LABEL;
}

export function getModuleLevel(module: Module): string {
  const match = module.code.match(/\d/);
  return match ? match[0] : "others";
}

export function isModuleCompleted(module: Module): boolean {
  return !NON_COMPLETED_GRADES.includes(module.grade);
}

export function countsTowardGpa(module: Module): boolean {
  return !NON_GPA_GRADES.includes(module.grade);
}

export function updateModuleCode(module: Module, code: string): Module {
  return updateModuleData(module, {
    code: normaliseModuleCode(code),
  });
}

export function updateModuleName(module: Module, name: string): Module {
  return updateModuleData(module, {
    name: normaliseModuleName(name),
  });
}

export function updateModuleAu(module: Module, au: number): Module {
  return updateModuleData(module, {
    au: normaliseModuleAu(au),
  });
}

export function updateModuleType(module: Module, type: string): Module {
  return updateModuleData(module, {
    type: normaliseModuleType(type),
  });
}

export function updateModuleGrade(module: Module, grade: string): Module {
  return updateModuleData(module, {
    grade: normaliseGrade(grade),
  });
}

export function updateModuleSemester(module: Module, semester: string): Module {
  return updateModuleData(module, {
    semester: normaliseSemester(semester),
  });
}
