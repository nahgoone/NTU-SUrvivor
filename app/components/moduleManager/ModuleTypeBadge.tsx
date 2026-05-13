import { getEffectiveModuleTypeForAu, type Module } from "../../models/module";
import { getModuleTypeStyle } from "../../utils/moduleStyles";

type ModuleTypeBadgeProps = {
  module: Module;
};

export default function ModuleTypeBadge({ module }: ModuleTypeBadgeProps) {
  const effectiveType = getEffectiveModuleTypeForAu(module);
  const styles = getModuleTypeStyle(effectiveType);

  const originalTypeChanged = module.type !== effectiveType;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${styles.badge}`}
      title={
        originalTypeChanged
          ? `Original type: ${module.type}. Counted as ${effectiveType} because grade is S/U.`
          : effectiveType
      }
    >
      <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
      {effectiveType}
    </span>
  );
}
