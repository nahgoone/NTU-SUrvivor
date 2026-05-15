import { MODULE_TYPES } from "../models/module";
import type {
  CodeLevelFilter,
  ModuleForm,
  TypeFilter,
} from "../types/moduleManager.types";

export const INITIAL_MODULE_FORM: ModuleForm = {
  code: "",
  name: "",
  au: "",
  type: "Core",
  grade: "",
  semester: "",
};

export const CODE_LEVEL_FILTERS: {
  label: string;
  value: CodeLevelFilter;
}[] = [
  { label: "All Levels", value: "all" },
  { label: "1xxx", value: "1" },
  { label: "2xxx", value: "2" },
  { label: "3xxx", value: "3" },
  { label: "4xxx", value: "4" },
  { label: "Others", value: "others" },
];

export const ALL_TYPE_FILTER: TypeFilter = "All Types";

export const TYPE_FILTERS: TypeFilter[] = [ALL_TYPE_FILTER, ...MODULE_TYPES];

export const SEMESTER_FILTER_ALL = "All Semesters";
