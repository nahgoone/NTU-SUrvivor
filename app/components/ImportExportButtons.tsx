// app/components/ImportExportButtons.tsx
"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useModuleStore } from "../stores/useModuleStore";

import {
  parseImportedWorkbook,
  readWorkbook,
  writeExportWorkbook,
  writeTemplateWorkbook,
} from "../utils/excel";

export default function ImportExportButtons() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const modules = useModuleStore((state) => state.modules);
  const setModules = useModuleStore((state) => state.setModules);

  const degreeRequirements = useModuleStore(
    (state) => state.degreeRequirements,
  );

  const setDegreeRequirements = useModuleStore(
    (state) => state.setDegreeRequirements,
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleExportData() {
    setError("");
    setSuccess("");

    if (modules.length === 0) {
      setError("There is no module data to export yet.");
      return;
    }

    writeExportWorkbook(modules, degreeRequirements);
    setSuccess("Data exported successfully.");
  }

  function handleImportClick() {
    setError("");
    setSuccess("");
    fileInputRef.current?.click();
  }

  async function handleImportData(event: ChangeEvent<HTMLInputElement>) {
    setError("");
    setSuccess("");

    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = readWorkbook(arrayBuffer);

      const result = parseImportedWorkbook(workbook);

      if (result.errors.length > 0) {
        setError(formatImportErrors(result.errors));
        return;
      }

      setModules(result.modules);

      if (result.degreeRequirements) {
        setDegreeRequirements(result.degreeRequirements);
      }

      setSuccess(`Imported ${result.modules.length} module(s) successfully.`);
    } catch {
      setError("Something went wrong while reading the Excel file.");
    }
  }

  function handleDownloadTemplate() {
    setError("");
    setSuccess("");

    writeTemplateWorkbook();
    setSuccess("Sample template downloaded successfully.");
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleExportData}
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          Export Data
        </button>

        <button
          type="button"
          onClick={handleImportClick}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
        >
          Import Data
        </button>

        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
        >
          Download Template
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleImportData}
          className="hidden"
        />
      </div>

      {success && (
        <p className="mt-3 text-sm font-medium text-green-600">{success}</p>
      )}

      {error && (
        <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </pre>
      )}
    </div>
  );
}

function formatImportErrors(errors: string[]): string {
  return [
    "Import failed. Please fix the following row(s):",
    ...errors.slice(0, 8),
    errors.length > 8 ? `...and ${errors.length - 8} more error(s).` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
