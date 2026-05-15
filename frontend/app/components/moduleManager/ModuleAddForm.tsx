import type { FormEvent } from "react";
import { GRADES, MODULE_TYPES } from "../../models/module";
import type { ModuleForm } from "../../types/moduleManager.types";

type ModuleAddFormProps = {
  form: ModuleForm;
  formError: string;
  onFormChange: (field: keyof ModuleForm, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function ModuleAddForm({
  form,
  formError,
  onFormChange,
  onSubmit,
}: ModuleAddFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4"
    >
      <div className="mb-3">
        <h3 className="text-base font-semibold text-gray-900">
          Add New Module
        </h3>
        <p className="text-sm text-gray-500">
          Leave grade blank if the module is not completed yet.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <input
          value={form.code}
          onChange={(event) => onFormChange("code", event.target.value)}
          placeholder="Code, e.g. SC2006"
          className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        />

        <input
          value={form.name}
          onChange={(event) => onFormChange("name", event.target.value)}
          placeholder="Module name"
          className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        />

        <input
          value={form.au}
          onChange={(event) => onFormChange("au", event.target.value)}
          placeholder="AU"
          type="number"
          min="1"
          className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        />

        <select
          value={form.type}
          onChange={(event) => onFormChange("type", event.target.value)}
          className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          {MODULE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={form.grade}
          onChange={(event) => onFormChange("grade", event.target.value)}
          className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          {GRADES.map((grade) => (
            <option key={grade || "empty"} value={grade}>
              {grade || "No grade yet"}
            </option>
          ))}
        </select>

        <input
          value={form.semester}
          onChange={(event) => onFormChange("semester", event.target.value)}
          placeholder="Semester, e.g. Y2S2"
          className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {formError && (
        <p className="mt-3 text-sm font-medium text-red-600">{formError}</p>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Save Module
        </button>
      </div>
    </form>
  );
}
