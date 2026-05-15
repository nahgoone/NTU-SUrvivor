// app/components/modules/TranscriptImportPanel.tsx

import { useTranscriptImport } from "../../hooks/useTranscriptImports";

export default function TranscriptImportPanel() {
  const {
    fileInputRef,
    parseResult,
    openFilePicker,
    handleTranscriptFileChange,
    importParsedModules,
    clearParseResult,
  } = useTranscriptImport();

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Import from NTU Transcript
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Upload an official NTU transcript PDF to extract modules
            automatically. You can still edit module type and grades afterwards.
          </p>
        </div>

        <button
          type="button"
          onClick={openFilePicker}
          className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
        >
          Upload Transcript PDF
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleTranscriptFileChange}
          className="hidden"
        />
      </div>

      {parseResult && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Parsed {parseResult.modules.length} module(s)
              </p>

              {parseResult.summary.cgpa !== undefined && (
                <p className="text-sm text-gray-500">
                  Transcript CGPA: {parseResult.summary.cgpa}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={clearParseResult}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={importParsedModules}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Import Parsed Modules
              </button>
            </div>
          </div>

          {parseResult.warnings.length > 0 && (
            <div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
              {parseResult.warnings.map((warning) => (
                <p key={warning}>{warning}</p>
              ))}
            </div>
          )}

          <div className="mt-4 max-h-72 overflow-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-160 text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-3 py-2 font-medium">Code</th>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">AU</th>
                  <th className="px-3 py-2 font-medium">Grade</th>
                  <th className="px-3 py-2 font-medium">Semester</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                </tr>
              </thead>

              <tbody>
                {parseResult.modules.map((module) => (
                  <tr
                    key={`${module.code}-${module.semester}`}
                    className="border-t border-gray-100"
                  >
                    <td className="px-3 py-2 font-medium text-gray-900">
                      {module.code}
                    </td>
                    <td className="px-3 py-2 text-gray-700">{module.name}</td>
                    <td className="px-3 py-2 text-gray-700">{module.au}</td>
                    <td className="px-3 py-2 text-gray-700">
                      {module.grade || "No grade"}
                    </td>
                    <td className="px-3 py-2 text-gray-700">
                      {module.semester}
                    </td>
                    <td className="px-3 py-2 text-gray-700">{module.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
