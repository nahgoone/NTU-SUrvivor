// app/components/dashboard/Dashboard.tsx
"use client";

import { useModuleStore } from "../../stores/useModuleStore";
import DashboardSummary from "./DashboardSummary";
import DegreeRequirementsEditor from "./DegreeRequirementsEditor";
import StickyDashboard from "./StickyDashboard";
import { useDashboardData } from "../../hooks/dashboard/useDashboardData";
import { useStickyDashboard } from "../../hooks/dashboard/useStickyDashboard";

export default function Dashboard() {
  const modules = useModuleStore((state) => state.modules);

  const degreeRequirements = useModuleStore(
    (state) => state.degreeRequirements,
  );

  const updateTotalAUs = useModuleStore((state) => state.updateTotalAUs);

  const updateTypeRequirement = useModuleStore(
    (state) => state.updateTypeRequirement,
  );

  const dashboardData = useDashboardData(modules, degreeRequirements);

  const { targetRef: dashboardRef, showStickyDashboard } =
    useStickyDashboard<HTMLElement>(80);

  return (
    <>
      <section
        ref={dashboardRef}
        className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <DashboardSummary
          dashboardData={dashboardData}
          degreeRequirements={degreeRequirements}
        />
      </section>

      <DegreeRequirementsEditor
        degreeRequirements={degreeRequirements}
        updateTotalAUs={updateTotalAUs}
        updateTypeRequirement={updateTypeRequirement}
      />

      <StickyDashboard
        show={showStickyDashboard}
        dashboardData={dashboardData}
      />
    </>
  );
}
