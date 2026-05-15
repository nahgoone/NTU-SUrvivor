// app/models/module/module.types.ts

import type { Grade, ModuleType } from "./module.constants";

export type Module = {
  id: string;
  code: string;
  name: string;
  au: number;
  type: ModuleType;
  grade: Grade;
  semester: string;
};

export type CreateModuleInput = {
  id?: string;
  code: string;
  name: string;
  au: number | string;
  type: string;
  grade: string;
  semester: string;
};

export type UpdateModuleInput = Partial<Omit<CreateModuleInput, "id">>;
