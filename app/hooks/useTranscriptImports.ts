// app/hooks/modules/useTranscriptImport.ts

import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { useModuleStore } from "../stores/useModuleStore";
import {
  extractPdfTextItems,
  parseNtuTranscript,
  type TranscriptParseResult,
} from "../services/transcriptParser";
import { createModule } from "../models/module";

export function useTranscriptImport() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const modules = useModuleStore((state) => state.modules);
  const setModules = useModuleStore((state) => state.setModules);

  const [parseResult, setParseResult] = useState<TranscriptParseResult | null>(
    null,
  );

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleTranscriptFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF transcript.");
      return;
    }

    try {
      const textItems = await extractPdfTextItems(file);
      const result = parseNtuTranscript(textItems);

      setParseResult(result);

      if (result.modules.length === 0) {
        toast.error("No modules could be parsed from this transcript.");
        return;
      }

      toast.success(`Parsed ${result.modules.length} module(s).`);
    } catch {
      toast.error("Failed to parse transcript. Please check the PDF format.");
    }
  }

  function importParsedModules() {
    if (!parseResult || parseResult.modules.length === 0) {
      toast.error("No parsed modules to import.");
      return;
    }

    const existingKeys = new Set(
      modules.map((module) => `${module.code}-${module.semester}`),
    );

    const newModules = parseResult.modules
      .filter(
        (module) => !existingKeys.has(`${module.code}-${module.semester}`),
      )
      .map(({ source, ...module }) => createModule(module));

    setModules([...modules, ...newModules]);

    toast.success(`Imported ${newModules.length} new module(s).`);
    setParseResult(null);
  }

  function clearParseResult() {
    setParseResult(null);
  }

  return {
    fileInputRef,
    parseResult,
    openFilePicker,
    handleTranscriptFileChange,
    importParsedModules,
    clearParseResult,
  };
}
