// app/page.tsx

import Dashboard from "./components/dashboard";
import ModuleManager from "./components/moduleManager";
import ImportExportButtons from "./components/ImportExportButtons";
import BackendTestButton from "./components/BackendTestButton";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <Dashboard />
        <BackendTestButton />
        <ModuleManager />
        <ImportExportButtons />
      </div>
    </main>
  );
}
