// app/models/module/index.ts

export {
  DEFAULT_GRADE,
  DEFAULT_MODULE_TYPE,
  GRADE_POINTS,
  GRADES,
  MODULE_TYPES,
  MODULE_TYPE_ALIASES,
  NON_COMPLETED_GRADES,
  NON_GPA_GRADES,
  NO_SEMESTER_LABEL,
} from "./module.constants";

export type { Grade, ModuleType } from "./module.constants";

export type {
  CreateModuleInput,
  Module,
  UpdateModuleInput,
} from "./module.types";

export {
  countsTowardGpa,
  createModule,
  getModuleLevel,
  getModuleSemesterLabel,
  isModuleCompleted,
  normaliseGrade,
  normaliseModule,
  normaliseModuleAu,
  normaliseModuleCode,
  normaliseModuleName,
  normaliseModuleType,
  normaliseSemester,
  updateModuleAu,
  updateModuleCode,
  updateModuleData,
  updateModuleGrade,
  updateModuleName,
  updateModuleSemester,
  updateModuleType,
} from "./module.utils";
