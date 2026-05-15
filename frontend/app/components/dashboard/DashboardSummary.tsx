// app/components/dashboard/DashboardSummary.tsx

import { MODULE_TYPES } from "../../models/module";
import type { DegreeRequirements } from "../../models/degree";
import { getModuleTypeStyle } from "../../utils/moduleStyles";
import type { DashboardData } from "../../types/dashboard.types";
import AuProgressBar from "./AuProgressBar";
import ProgressLegend from "./ProgressLegend";
import { formatGpa } from "@/app/utils/gpaCalculator";

type DashboardSummaryProps = {
  dashboardData: DashboardData;
  degreeRequirements: DegreeRequirements;
};

export default function DashboardSummary({
  dashboardData,
  degreeRequirements,
}: DashboardSummaryProps) {
  return (
    <>
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-500">Current CGPA</p>

        <div className="mt-2 flex items-end gap-2">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            {formatGpa(dashboardData.cumulativeGpa)}
          </h1>

          <span className="mb-1 text-lg font-medium text-gray-500">/ 5.00</span>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              AU Progress
            </h2>

            <p className="text-sm text-gray-500">
              {dashboardData.totalCompletedAUs} AUs completed ·{" "}
              {dashboardData.remainingAUs} AUs remaining
            </p>
          </div>

          <p className="text-sm font-semibold text-gray-700">
            {Math.round(dashboardData.progressPercentage)}%
          </p>
        </div>

        <AuProgressBar dashboardData={dashboardData} />

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {MODULE_TYPES.map((type) => {
            const styles = getModuleTypeStyle(type);

            return (
              <ProgressLegend
                key={type}
                label={type}
                completed={dashboardData.completedByType[type]}
                required={degreeRequirements.byType[type]}
                colorClass={styles.dot}
              />
            );
          })}

          <ProgressLegend
            label="Remaining"
            completed={dashboardData.remainingAUs}
            colorClass="bg-gray-300"
          />
        </div>
      </div>
    </>
  );
}
