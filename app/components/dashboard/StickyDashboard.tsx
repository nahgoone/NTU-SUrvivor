// app/components/dashboard/StickyDashboard.tsx

import { formatGpa } from "@/app/utils/gpaCalculator";
import type { DashboardData } from "../../types/dashboard.types";
import AuProgressBar from "./AuProgressBar";

type StickyDashboardProps = {
  show: boolean;
  dashboardData: DashboardData;
};

export default function StickyDashboard({
  show,
  dashboardData,
}: StickyDashboardProps) {
  return (
    <aside
      className={`fixed bottom-5 right-5 z-50 w-70 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur transition-all duration-500 ease-out ${
        show
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-4 scale-95 opacity-0"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-gray-500">Current CGPA</p>

          <div className="mt-1 flex items-end gap-1">
            <p className="text-3xl font-bold tracking-tight text-gray-900">
              {formatGpa(dashboardData.cumulativeGpa)}
            </p>

            <span className="mb-1 text-sm font-medium text-gray-500">
              / 5.00
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 px-3 py-2 text-right">
          <p className="text-xs text-gray-500">Progress</p>

          <p className="text-sm font-semibold text-gray-900">
            {Math.round(dashboardData.progressPercentage)}%
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-gray-600">
            {dashboardData.totalCompletedAUs} AUs completed
          </span>

          <span className="text-gray-500">
            {dashboardData.remainingAUs} left
          </span>
        </div>

        <AuProgressBar dashboardData={dashboardData} heightClass="h-3" />
      </div>
    </aside>
  );
}
