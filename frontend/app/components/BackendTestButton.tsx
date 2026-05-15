"use client";

import { calculateGpaWithBackend } from "../services/backendAPI";
import { useModuleStore } from "../stores/useModuleStore";

export default function BackendTestButton() {
  const modules = useModuleStore((state) => state.modules);

  async function handleTestBackend() {
    try {
      const result = await calculateGpaWithBackend(modules);
      console.log("Backend GPA result:", result);
    } catch (error) {
      console.error("Backend request failed:", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleTestBackend}
      className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white"
    >
      Test Backend GPA
    </button>
  );
}
