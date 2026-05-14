import {
  GRADES,
  MODULE_TYPES,
  getEffectiveModuleTypeForAu,
  normaliseModuleType,
  type Module,
  type ModuleType,
} from "../../models/module";
import ModuleTypeBadge from "./ModuleTypeBadge";
import ModuleTypeSelect from "./ModuleTypeSelect";
import { getModuleTypeStyle } from "../../utils/moduleStyles";

type ModuleTableProps = {
  modules: Module[];
  onUpdateModuleGrade: (id: string, grade: string) => void;
  onUpdateModuleType: (id: string, type: ModuleType) => void;
  onDeleteModule: (id: string) => void;
};

export default function ModuleTable({
  modules,
  onUpdateModuleGrade,
  onUpdateModuleType,
  onDeleteModule,
}: ModuleTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full min-w-190 border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
            <th className="px-3 py-3 font-medium">Code</th>
            <th className="px-3 py-3 font-medium">Name</th>
            <th className="px-3 py-3 font-medium">AU</th>
            <th className="px-3 py-3 font-medium">Type</th>
            <th className="px-3 py-3 font-medium">Grade</th>
            <th className="px-3 py-3 font-medium"></th>
          </tr>
        </thead>

        <tbody>
          {modules.map((module) => {
            const originalType = normaliseModuleType(module.type);
            const originalTypeStyle = getModuleTypeStyle(originalType);
            const effectiveType = getEffectiveModuleTypeForAu(module);
            const typeChangedBySuRule = originalType !== effectiveType;

            return (
              <tr
                key={module.id}
                className="border-b border-gray-100 last:border-b-0"
              >
                <td className="px-3 py-3 font-medium text-gray-900">
                  {module.code}
                </td>

                <td className="px-3 py-3 text-gray-700">{module.name}</td>

                <td className="px-3 py-3 text-gray-700">{module.au}</td>

                <td className="px-3 py-3">
                  <div className="flex flex-col gap-2">
                    <ModuleTypeSelect
                      value={originalType}
                      onChange={(type) => onUpdateModuleType(module.id, type)}
                    />

                    {typeChangedBySuRule && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          Counted as
                        </span>
                        <ModuleTypeBadge module={module} />
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-3 py-3">
                  <select
                    value={module.grade ?? ""}
                    onChange={(event) =>
                      onUpdateModuleGrade(module.id, event.target.value)
                    }
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                  >
                    {GRADES.map((grade) => (
                      <option key={grade || "empty"} value={grade}>
                        {grade || "No grade yet"}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="px-3 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onDeleteModule(module.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
