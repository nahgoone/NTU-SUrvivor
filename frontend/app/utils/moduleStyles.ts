// app/utils/moduleStyles.ts

import { normaliseModuleType, type ModuleType } from "../models/module";

type ModuleTypeStyle = {
  dot: string;
  badge: string;
  progress: string;
  softBg: string;
  text: string;
};

export const MODULE_TYPE_STYLES: Record<ModuleType, ModuleTypeStyle> = {
  Core: {
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 ring-blue-200",
    progress: "bg-blue-500",
    softBg: "bg-blue-50",
    text: "text-blue-700",
  },
  MPE: {
    dot: "bg-purple-500",
    badge: "bg-purple-50 text-purple-700 ring-purple-200",
    progress: "bg-purple-500",
    softBg: "bg-purple-50",
    text: "text-purple-700",
  },
  BDE: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    progress: "bg-emerald-500",
    softBg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  ICC: {
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    progress: "bg-amber-500",
    softBg: "bg-amber-50",
    text: "text-amber-700",
  },
  Other: {
    dot: "bg-gray-400",
    badge: "bg-gray-50 text-gray-700 ring-gray-200",
    progress: "bg-gray-400",
    softBg: "bg-gray-50",
    text: "text-gray-700",
  },
};

export function getModuleTypeStyle(type: string): ModuleTypeStyle {
  const normalisedType = normaliseModuleType(type);
  return MODULE_TYPE_STYLES[normalisedType];
}
