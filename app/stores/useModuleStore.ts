// app/stores/useModuleStore.ts
"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  createModule,
  normaliseModule,
  updateModuleData,
  type CreateModuleInput,
  type Module,
  type ModuleType,
  type UpdateModuleInput,
} from "../models/module";

import {
  getDefaultDegreeRequirements,
  normaliseDegreeRequirements,
  updateTotalAUsInRequirements,
  updateTypeRequirementInRequirements,
  type DegreeRequirements,
} from "../models/degree";

export type { Module, ModuleType, DegreeRequirements };

type ModuleStore = {
  modules: Module[];

  degreeRequirements: DegreeRequirements;

  addModule: (module: CreateModuleInput) => void;
  updateModule: (id: string, updates: UpdateModuleInput) => void;
  deleteModule: (id: string) => void;
  setModules: (modules: Module[]) => void;

  setDegreeRequirements: (requirements: DegreeRequirements) => void;
  updateTotalAUs: (totalAUs: number) => void;
  updateTypeRequirement: (type: ModuleType, requiredAUs: number) => void;
};

export const useModuleStore = create<ModuleStore>()(
  persist(
    (set) => ({
      modules: [],

      degreeRequirements: getDefaultDegreeRequirements(),

      addModule: (module) =>
        set((state) => ({
          modules: [...state.modules, createModule(module)],
        })),

      updateModule: (id, updates) =>
        set((state) => ({
          modules: state.modules.map((module) =>
            module.id === id ? updateModuleData(module, updates) : module,
          ),
        })),

      deleteModule: (id) =>
        set((state) => ({
          modules: state.modules.filter((module) => module.id !== id),
        })),

      setModules: (modules) =>
        set({
          modules: modules.map(normaliseModule),
        }),

      setDegreeRequirements: (requirements) =>
        set({
          degreeRequirements: normaliseDegreeRequirements(requirements),
        }),

      updateTotalAUs: (totalAUs) =>
        set((state) => ({
          degreeRequirements: updateTotalAUsInRequirements(
            state.degreeRequirements,
            totalAUs,
          ),
        })),

      updateTypeRequirement: (type, requiredAUs) =>
        set((state) => ({
          degreeRequirements: updateTypeRequirementInRequirements(
            state.degreeRequirements,
            type,
            requiredAUs,
          ),
        })),
    }),
    {
      name: "gpa-module-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        modules: state.modules,
        degreeRequirements: state.degreeRequirements,
      }),
    },
  ),
);
