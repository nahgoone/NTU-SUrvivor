import {
  GRADES,
  type Module,
  type UpdateModuleInput,
} from "../../models/module";
import ModuleTypeBadge from "./ModuleTypeBadge";

type ModuleTableProps = {
  modules: Module[];
  onUpdateModuleGrade: (id: string, grade: string) => void;
  onDeleteModule: (id: string) => void;
};

export default function ModuleTable({
  modules,
  onUpdateModuleGrade,
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
          {modules.map((module) => (
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
                <ModuleTypeBadge module={module} />
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
