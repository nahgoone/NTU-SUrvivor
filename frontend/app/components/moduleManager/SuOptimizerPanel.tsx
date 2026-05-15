// app/components/modules/SuOptimizerPanel.tsx

import { useSuOptimizer } from "../../hooks/useSUOptimizer";
import { formatGpa } from "../../utils/gpaCalculator";
export default function SuOptimizerPanel() {
  const {
    result,
    canApplyRecommendation,
    runOptimizer,
    applyRecommendation,
    clearRecommendation,
  } = useSuOptimizer();

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            S/U Optimizer
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Automatically finds the S/U combination that gives the highest
            projected CGPA while respecting your S/U limits.
          </p>
        </div>

        <button
          type="button"
          onClick={runOptimizer}
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          Run Optimizer
        </button>
      </div>

      {result && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <OptimizerStat
              label="Current CGPA"
              value={formatGpa(result.currentGpa)}
            />
            <OptimizerStat
              label="Projected CGPA"
              value={formatGpa(result.projectedGpa)}
            />
            <OptimizerStat
              label="Increase"
              value={`+${formatGpa(result.gpaIncrease)}`}
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <OptimizerStat
              label="Total S/U Used"
              value={`${result.totalSUAUsUsed} / ${result.totalSUAUsAvailable} AU`}
            />
            <OptimizerStat
              label="Restricted S/U Used"
              value={`${result.restrictedSUAUsUsed} / ${result.restrictedSUAUsAvailable} AU`}
            />
          </div>

          {result.recommendedModules.length > 0 ? (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-900">
                Recommended modules to S/U
              </p>

              <div className="mt-2 space-y-2">
                {result.recommendedModules.map(({ module, reason }) => (
                  <div
                    key={module.id}
                    className="rounded-xl border border-gray-200 p-3"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {module.code} · {module.grade} · {module.au} AU
                    </p>
                    <p className="text-sm text-gray-500">{module.name}</p>
                    <p className="mt-1 text-xs text-gray-500">{reason}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={clearRecommendation}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={applyRecommendation}
                  disabled={!canApplyRecommendation}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Apply Recommendations
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{result.message}</p>
          )}
        </div>
      )}
    </div>
  );
}

type OptimizerStatProps = {
  label: string;
  value: string;
};

function OptimizerStat({ label, value }: OptimizerStatProps) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-gray-900">{value}</p>
    </div>
  );
}
