import type { Module, ModuleType } from "../models/module";

export type ModuleForm = {
  code: string;
  name: string;
  au: string;
  type: string;
  grade: string;
  semester: string;
};

export type CodeLevelFilter = "all" | "1" | "2" | "3" | "4" | "others";

export type TypeFilter = "All Types" | ModuleType;

export type GroupedModules = {
  semester: string;
  modules: Module[];
};
