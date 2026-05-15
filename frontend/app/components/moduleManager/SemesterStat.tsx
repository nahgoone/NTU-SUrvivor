type SemesterStatProps = {
  label: string;
  value: string;
  className: string;
};

export default function SemesterStat({
  label,
  value,
  className,
}: SemesterStatProps) {
  return (
    <div
      className={`rounded-xl bg-white px-3 py-2 text-right ring-1 ${className}`}
    >
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}
