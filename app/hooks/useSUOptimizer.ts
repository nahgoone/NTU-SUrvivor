// app/hooks/modules/useSuOptimizer.ts

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useModuleStore } from "../stores/useModuleStore";
import {
  optimiseSuUsage,
  type SuOptimizerResult,
} from "../services/suOptimizer";

export function useSuOptimizer() {
  const modules = useModuleStore((state) => state.modules);

  const degreeRequirements = useModuleStore(
    (state) => state.degreeRequirements,
  );

  const updateModule = useModuleStore((state) => state.updateModule);

  const [result, setResult] = useState<SuOptimizerResult | null>(null);

  const canApplyRecommendation =
    result !== null && result.recommendedModules.length > 0;

  function runOptimizer() {
    const optimisationResult = optimiseSuUsage(modules, degreeRequirements);
    setResult(optimisationResult);

    if (optimisationResult.recommendedModules.length === 0) {
      toast.info(optimisationResult.message);
      return;
    }

    toast.success(
      `Found ${optimisationResult.recommendedModules.length} recommended S/U change(s).`,
    );
  }

  function applyRecommendation() {
    if (!result || result.recommendedModules.length === 0) {
      toast.error("No S/U recommendations to apply.");
      return;
    }

    result.recommendedModules.forEach(({ module }) => {
      updateModule(module.id, {
        grade: "S/U",
      });
    });

    toast.success("S/U recommendations applied.");
    setResult(null);
  }

  function clearRecommendation() {
    setResult(null);
  }

  return {
    result,
    canApplyRecommendation,
    runOptimizer,
    applyRecommendation,
    clearRecommendation,
  };
}
