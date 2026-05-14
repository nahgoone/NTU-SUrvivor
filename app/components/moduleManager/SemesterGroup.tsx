import { calculateGpa, formatGpa } from "../../utils/gpaCalculator";
import { getSemesterStyle } from "../../utils/semesterStyles";
import type { GroupedModules } from "../../types/moduleManager.types";
import type { ModuleType } from "../../models/module";
import ModuleTable from "./ModuleTable";
import SemesterStat from "./SemesterStat";

type SemesterGroupProps = {
  group: GroupedModules;
  onUpdateModuleGrade: (id: string, grade: string) => void;
  onUpdateModuleType: (id: string, type: ModuleType) => void;
  onDeleteModule: (id: string) => void;
};

export default function SemesterGroup({
  group,
  onUpdateModuleGrade,
  onUpdateModuleType,
  onDeleteModule,
}: SemesterGroupProps) {
  const semesterStyle = getSemesterStyle(group.semester);
  const semesterStats = calculateGpa(group.modules);

  return (
    <div
      className={`overflow-hidden rounded-2xl border shadow-sm ${semesterStyle.container}`}
    >
      <div
        className={`flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${semesterStyle.header}`}
      >
        <div className="flex items-center gap-3">
          <span className={`h-12 w-1.5 rounded-full ${semesterStyle.strip}`} />

          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {group.semester}
            </h3>

            <p className="text-xs text-gray-500">
              {group.modules.length} module
              {group.modules.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <SemesterStat
            label="Sem GPA"
            value={formatGpa(semesterStats.cumulativeGpa)}
            className={semesterStyle.pill}
          />

          <SemesterStat
            label="AUs Earned"
            value={`${semesterStats.totalCompletedAUs} AU`}
            className={semesterStyle.pill}
          />
        </div>
      </div>

      <div className="p-3">
        <ModuleTable
          modules={group.modules}
          onUpdateModuleGrade={onUpdateModuleGrade}
          onUpdateModuleType={onUpdateModuleType}
          onDeleteModule={onDeleteModule}
        />
      </div>
    </div>
  );
}
