import { normaliseModuleType } from "../../models/module";
import { getModuleTypeStyle } from "../../utils/moduleStyles";

type ModuleTypeBadgeProps = {
  type: string;
};

export default function ModuleTypeBadge({ type }: ModuleTypeBadgeProps) {
  const normalisedType = normaliseModuleType(type);
  const styles = getModuleTypeStyle(normalisedType);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${styles.badge}`}
    >
      <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
      {normalisedType}
    </span>
  );
}
