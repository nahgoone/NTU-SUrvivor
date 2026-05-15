// app/components/dashboard/ProgressLegend.tsx

type ProgressLegendProps = {
  label: string;
  completed: number;
  required?: number;
  colorClass: string;
};

export default function ProgressLegend({
  label,
  completed,
  required,
  colorClass,
}: ProgressLegendProps) {
  const percentage =
    required && required > 0 ? Math.min((completed / required) * 100, 100) : 0;

  return (
    <div className="rounded-xl border border-gray-200 p-3">
      <div className="flex items-center gap-2">
        <span className={`h-3 w-3 rounded-full ${colorClass}`} />
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </div>

      {required !== undefined ? (
        <>
          <p className="mt-2 text-xl font-semibold text-gray-900">
            {completed} / {required} AU
          </p>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full ${colorClass}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </>
      ) : (
        <p className="mt-2 text-xl font-semibold text-gray-900">
          {completed} AU
        </p>
      )}
    </div>
  );
}
