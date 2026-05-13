"use client";

import { useModuleManager } from "../../hooks/useModuleManager";
import ModuleManagerHeader from "./ModuleManagerHeader";
import ModuleAddForm from "./ModuleAddForm";
import ModuleFilters from "./ModuleFilters";
import SemesterGroup from "./SemesterGroup";
export default function ModuleManager() {
  const {
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

    updateModuleGrade,
    deleteModule,
  } = useModuleManager();

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <ModuleManagerHeader
        showAddForm={showAddForm}
        onToggleAddForm={toggleAddForm}
      />

      {showAddForm && (
        <ModuleAddForm
          form={form}
          formError={formError}
          onFormChange={updateFormField}
          onSubmit={handleAddModule}
        />
      )}

      <ModuleFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        codeLevelFilter={codeLevelFilter}
        onCodeLevelFilterChange={setCodeLevelFilter}
        semesterFilter={semesterFilter}
        onSemesterFilterChange={setSemesterFilter}
        semesterFilters={semesterFilters}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
      />

      {groupedModules.length === 0 ? (
        <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
          {modules.length === 0
            ? "No modules added yet. Add a module manually or import an Excel sheet."
            : "No modules match the selected filters."}
        </p>
      ) : (
        <div className="space-y-6">
          {groupedModules.map((group) => (
            <SemesterGroup
              key={group.semester}
              group={group}
              onUpdateModuleGrade={updateModuleGrade}
              onDeleteModule={deleteModule}
            />
          ))}
        </div>
      )}
    </section>
  );
}
