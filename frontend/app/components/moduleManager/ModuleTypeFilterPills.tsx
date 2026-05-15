import {
  ALL_TYPE_FILTER,
  TYPE_FILTERS,
} from "../../constants/moduleManager.constants";
import { getModuleTypeStyle } from "../../utils/moduleStyles";
import { normaliseModuleType } from "../../models/module";
import type { TypeFilter } from "../../types/moduleManager.types";

type ModuleTypeFilterPillsProps = {
  typeFilter: TypeFilter;
  onTypeFilterChange: (value: TypeFilter) => void;
};

export default function ModuleTypeFilterPills({
  typeFilter,
  onTypeFilterChange,
}: ModuleTypeFilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2 lg:col-span-4">
      {TYPE_FILTERS.map((type) => {
        const isActive = typeFilter === type;

        if (type === ALL_TYPE_FILTER) {
          return (
            <button
              key={type}
              type="button"
              onClick={() => onTypeFilterChange(type)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition ${
                isActive
                  ? "bg-gray-900 text-white ring-gray-900"
                  : "bg-white text-gray-600 ring-gray-200 hover:bg-gray-50"
              }`}
            >
              All Types
            </button>
          );
        }

        const normalisedType = normaliseModuleType(type);
        const styles = getModuleTypeStyle(normalisedType);

        return (
          <button
            key={type}
            type="button"
            onClick={() => onTypeFilterChange(type)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition ${
              isActive
                ? `${styles.progress} text-white ring-transparent`
                : `${styles.badge} hover:opacity-80`
            }`}
          >
            {normalisedType}
          </button>
        );
      })}
    </div>
  );
}
