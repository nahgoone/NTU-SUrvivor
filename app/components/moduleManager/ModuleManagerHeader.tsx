type ModuleManagerHeaderProps = {
  showAddForm: boolean;
  onToggleAddForm: () => void;
  onClearAllModules: () => void;
  hasModules: boolean;
};

export default function ModuleManagerHeader({
  showAddForm,
  onToggleAddForm,
  onClearAllModules,
  hasModules,
}: ModuleManagerHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Modules</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add, edit, remove, filter, and organise your saved modules here.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onClearAllModules}
          disabled={!hasModules}
          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear All
        </button>
        <button
          type="button"
          onClick={onToggleAddForm}
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          {showAddForm ? "Cancel" : "Add Module"}
        </button>
      </div>
    </div>
  );
}
