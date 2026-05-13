import { CODE_LEVEL_FILTERS } from "../../constants/moduleManager.constants";
import type {
  CodeLevelFilter,
  TypeFilter,
} from "../../types/moduleManager.types";
import ModuleTypeFilterPills from "./ModuleTypeFilterPills";

type ModuleFiltersProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;

  codeLevelFilter: CodeLevelFilter;
  onCodeLevelFilterChange: (value: CodeLevelFilter) => void;

  semesterFilter: string;
  onSemesterFilterChange: (value: string) => void;
  semesterFilters: string[];

  typeFilter: TypeFilter;
  onTypeFilterChange: (value: TypeFilter) => void;

  hasFilters: boolean;
  onClearFilters: () => void;
};

export default function ModuleFilters({
  searchTerm,
  onSearchTermChange,
  codeLevelFilter,
  onCodeLevelFilterChange,
  semesterFilter,
  onSemesterFilterChange,
  semesterFilters,
  typeFilter,
  onTypeFilterChange,
  hasFilters,
  onClearFilters,
}: ModuleFiltersProps) {
  return (
    <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_150px_170px_auto]">
      <input
        value={searchTerm}
        onChange={(event) => onSearchTermChange(event.target.value)}
        placeholder="Search by module code or name..."
        className="rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
      />

      <select
        value={codeLevelFilter}
        onChange={(event) =>
          onCodeLevelFilterChange(event.target.value as CodeLevelFilter)
        }
        className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
      >
        {CODE_LEVEL_FILTERS.map((filter) => (
          <option key={filter.value} value={filter.value}>
            {filter.label}
          </option>
        ))}
      </select>

      <select
        value={semesterFilter}
        onChange={(event) => onSemesterFilterChange(event.target.value)}
        className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
      >
        {semesterFilters.map((semester) => (
          <option key={semester} value={semester}>
            {semester}
          </option>
        ))}
      </select>

      <ModuleTypeFilterPills
        typeFilter={typeFilter}
        onTypeFilterChange={onTypeFilterChange}
      />

      <button
        type="button"
        onClick={onClearFilters}
        disabled={!hasFilters}
        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Clear
      </button>
    </div>
  );
}
