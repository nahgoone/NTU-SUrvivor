import {
  GRADES,
  getEffectiveModuleTypeForAu,
  normaliseModuleType,
  type Module,
  type ModuleType,
} from "../../models/module";
import ModuleTypeBadge from "./ModuleTypeBadge";
import ModuleTypeSelect from "./ModuleTypeSelect";

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
      <table className="w-full min-w-[750px] table-fixed border-collapse text-sm">
        <colgroup>
          <col className="w-[30px]" />
          <col className="w-[130px]" />
          <col className="w-[18px]" />
          <col className="w-[50px]" />
          <col className="w-[35px]" />
          <col className="w-[20px]" />
        </colgroup>

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
            const effectiveType = getEffectiveModuleTypeForAu(module);
            const typeChangedBySuRule = originalType !== effectiveType;

            return (
              <tr
                key={module.id}
                className="border-b border-gray-100 last:border-b-0"
              >
                <td className="px-3 py-3 font-medium text-gray-900">
                  <span className="block truncate" title={module.code}>
                    {module.code}
                  </span>
                </td>

                <td className="px-3 py-3 text-gray-700">
                  <span className="block truncate" title={module.name}>
                    {module.name}
                  </span>
                </td>

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
                    className="w-20 rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                  >
                    {GRADES.map((grade) => (
                      <option key={grade || "empty"} value={grade}>
                        {grade || "—"}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="px-3 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onDeleteModule(module.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 hover:text-red-700"
                    aria-label={`Remove ${module.code}`}
                    title="Remove module"
                  >
                    <TrashIcon />
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

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}
