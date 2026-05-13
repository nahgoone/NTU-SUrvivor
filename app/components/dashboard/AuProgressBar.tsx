// app/components/dashboard/AuProgressBar.tsx

import { MODULE_TYPES } from "../../models/module";
import { getModuleTypeStyle } from "../../utils/moduleStyles";
import type { DashboardData } from "../../types/dashboard.types";

type AuProgressBarProps = {
  dashboardData: DashboardData;
  heightClass?: string;
};

export default function AuProgressBar({
  dashboardData,
  heightClass = "h-4",
}: AuProgressBarProps) {
  return (
    <div
      className={`flex w-full overflow-hidden rounded-full bg-gray-100 ${heightClass}`}
    >
      {MODULE_TYPES.map((type) => {
        const styles = getModuleTypeStyle(type);

        return (
          <div
            key={type}
            className={`h-full ${styles.progress}`}
            style={{ width: `${dashboardData.typePercentages[type]}%` }}
            title={`${type}: ${dashboardData.completedByType[type]} AUs`}
          />
        );
      })}

      <div
        className="h-full bg-gray-200"
        style={{ width: `${dashboardData.remainingPercentage}%` }}
        title={`Remaining: ${dashboardData.remainingAUs} AUs`}
      />
    </div>
  );
}
