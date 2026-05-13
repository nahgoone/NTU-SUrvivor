// app/components/dashboard/DegreeRequirementsEditor.tsx

import { MODULE_TYPES, type ModuleType } from "../../models/module";
import {
  requirementsMatchTotalAUs,
  type DegreeRequirements,
} from "../../models/degree";

type DegreeRequirementsEditorProps = {
  degreeRequirements: DegreeRequirements;
  updateTotalAUs: (totalAUs: number) => void;
  updateTypeRequirement: (type: ModuleType, requiredAUs: number) => void;
  updateTotalSUAUs: (totalSUAUs: number) => void;
  updateRestrictedSUAUs: (restrictedSUAUs: number) => void;
};

export default function DegreeRequirementsEditor({
  degreeRequirements,
  updateTotalAUs,
  updateTypeRequirement,
  updateTotalSUAUs,
  updateRestrictedSUAUs,
}: DegreeRequirementsEditorProps) {
  const requirementsDoNotMatch = !requirementsMatchTotalAUs(degreeRequirements);

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900">
          Degree Requirements
        </h2>

        <p className="text-sm text-gray-500">
          Set your total AU requirement and the required AUs for each module
          type.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Total AUs</span>

          <input
            type="number"
            min="0"
            value={degreeRequirements.totalAUs}
            onChange={(event) => updateTotalAUs(Number(event.target.value))}
            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </label>

        {MODULE_TYPES.map((type) => (
          <label key={type} className="block">
            <span className="text-sm font-medium text-gray-700">
              {type} AUs
            </span>

            <input
              type="number"
              min="0"
              value={degreeRequirements.byType[type]}
              onChange={(event) =>
                updateTypeRequirement(type, Number(event.target.value))
              }
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </label>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Total S/U AUs
          </span>

          <input
            type="number"
            min="0"
            value={degreeRequirements.suPolicy.totalSUAUs}
            onChange={(event) => updateTotalSUAUs(Number(event.target.value))}
            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Restricted S/U AUs
          </span>

          <input
            type="number"
            min="0"
            value={degreeRequirements.suPolicy.restrictedSUAUs}
            onChange={(event) =>
              updateRestrictedSUAUs(Number(event.target.value))
            }
            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </label>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        Only {degreeRequirements.suPolicy.restrictedSUAUs} AUs of S/U can be
        used for Core, MPE, or ICC modules. S/U MPE modules are counted towards
        BDE AUs.
      </p>

      {requirementsDoNotMatch && (
        <p className="mt-3 text-sm text-amber-700">
          Note: your module type requirements do not add up to your total AU
          requirement.
        </p>
      )}
    </div>
  );
}
