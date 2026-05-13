import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { validateSuGradeChange } from "../models/degree";
import { useModuleStore } from "../stores/useModuleStore";
import {
  getModuleLevel,
  getModuleSemesterLabel,
  getEffectiveModuleTypeForAu,
} from "../models/module";
import {
  ALL_TYPE_FILTER,
  INITIAL_MODULE_FORM,
  SEMESTER_FILTER_ALL,
} from "../constants/moduleManager.constants";
import { compareSemestersDescending } from "../utils/semesterUtils";
import type {
  CodeLevelFilter,
  GroupedModules,
  ModuleForm,
  TypeFilter,
} from "../types/moduleManager.types";

export function useModuleManager() {
  const modules = useModuleStore((state) => state.modules);
  const degreeRequirements = useModuleStore(
    (state) => state.degreeRequirements,
  );
  const addModule = useModuleStore((state) => state.addModule);
  const updateModule = useModuleStore((state) => state.updateModule);
  const deleteModule = useModuleStore((state) => state.deleteModule);

  const [searchTerm, setSearchTerm] = useState("");
  const [codeLevelFilter, setCodeLevelFilter] =
    useState<CodeLevelFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(ALL_TYPE_FILTER);
  const [semesterFilter, setSemesterFilter] = useState(SEMESTER_FILTER_ALL);

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<ModuleForm>(INITIAL_MODULE_FORM);
  const [formError, setFormError] = useState("");

  const semesterFilters = useMemo(() => {
    const semesters = Array.from(
      new Set(modules.map((module) => getModuleSemesterLabel(module))),
    ).sort(compareSemestersDescending);

    return [SEMESTER_FILTER_ALL, ...semesters];
  }, [modules]);

  const groupedModules = useMemo<GroupedModules[]>(() => {
    const filteredModules = modules.filter((module) => {
      const searchValue = searchTerm.toLowerCase();

      const matchesSearch =
        module.code.toLowerCase().includes(searchValue) ||
        module.name.toLowerCase().includes(searchValue);

      const moduleLevel = getModuleLevel(module);

      const matchesCodeLevel =
        codeLevelFilter === "all"
          ? true
          : codeLevelFilter === "others"
            ? !["1", "2", "3", "4"].includes(moduleLevel)
            : moduleLevel === codeLevelFilter;

      const matchesType =
        typeFilter === ALL_TYPE_FILTER
          ? true
          : getEffectiveModuleTypeForAu(module) === typeFilter;

      const moduleSemester = getModuleSemesterLabel(module);

      const matchesSemester =
        semesterFilter === SEMESTER_FILTER_ALL
          ? true
          : moduleSemester === semesterFilter;

      return (
        matchesSearch && matchesCodeLevel && matchesType && matchesSemester
      );
    });

    const grouped = filteredModules.reduce<Record<string, typeof modules>>(
      (acc, module) => {
        const semester = getModuleSemesterLabel(module);

        if (!acc[semester]) {
          acc[semester] = [];
        }

        acc[semester].push(module);
        return acc;
      },
      {},
    );

    return Object.entries(grouped)
      .map(([semester, modules]) => ({
        semester,
        modules: modules.sort((a, b) => a.code.localeCompare(b.code)),
      }))
      .sort((a, b) => compareSemestersDescending(a.semester, b.semester));
  }, [modules, searchTerm, codeLevelFilter, typeFilter, semesterFilter]);

  const hasFilters =
    searchTerm !== "" ||
    codeLevelFilter !== "all" ||
    typeFilter !== ALL_TYPE_FILTER ||
    semesterFilter !== SEMESTER_FILTER_ALL;

  function clearFilters() {
    setSearchTerm("");
    setCodeLevelFilter("all");
    setTypeFilter(ALL_TYPE_FILTER);
    setSemesterFilter(SEMESTER_FILTER_ALL);
  }

  function toggleAddForm() {
    setShowAddForm((current) => !current);
    setFormError("");
  }

  function updateFormField(field: keyof ModuleForm, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function handleAddModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const au = Number(form.au);

    if (!form.code.trim()) {
      setFormError("Module code is required.");
      return;
    }

    if (!form.name.trim()) {
      setFormError("Module name is required.");
      return;
    }

    if (!Number.isFinite(au) || au <= 0) {
      setFormError("AU must be a valid positive number.");
      return;
    }

    addModule({
      code: form.code,
      name: form.name,
      au,
      type: form.type,
      grade: form.grade,
      semester: form.semester,
    });

    setForm(INITIAL_MODULE_FORM);
    setShowAddForm(false);
  }

  function updateModuleGrade(moduleId: string, grade: string) {
    const validation = validateSuGradeChange(
      modules,
      degreeRequirements,
      moduleId,
      grade,
    );

    if (!validation.allowed) {
      toast.error(validation.message ?? "This S/U change is not allowed.");
      return;
    }

    updateModule(moduleId, {
      grade,
    });

    if (validation.message) {
      toast.info(validation.message);
    }
  }

  return {
    modules,
    groupedModules,
    semesterFilters,

    searchTerm,
    setSearchTerm,

    codeLevelFilter,
    setCodeLevelFilter,

    typeFilter,
    setTypeFilter,

    semesterFilter,
    setSemesterFilter,

    hasFilters,
    clearFilters,

    showAddForm,
    toggleAddForm,

    form,
    updateFormField,
    formError,
    handleAddModule,

    deleteModule,
    updateModuleGrade,
  };
}
