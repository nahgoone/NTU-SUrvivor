// app/components/moduleManager/ModuleTypeSelect.tsx

import { useState } from "react";
import { MODULE_TYPES, type ModuleType } from "../../models/module";
import { getModuleTypeStyle } from "../../utils/moduleStyles";

type ModuleTypeSelectProps = {
  value: ModuleType;
  onChange: (type: ModuleType) => void;
};

export default function ModuleTypeSelect({
  value,
  onChange,
}: ModuleTypeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedStyle = getModuleTypeStyle(value);

  function handleSelect(type: ModuleType) {
    onChange(type);
    setIsOpen(false);
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex min-w-28 items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none transition hover:bg-gray-50 focus:border-blue-500"
      >
        <span className="inline-flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${selectedStyle.dot}`} />
          {value}
        </span>

        <span className="text-xs text-gray-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 z-30 mt-2 w-36 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {MODULE_TYPES.map((type) => {
            const style = getModuleTypeStyle(type);
            const isSelected = value === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => handleSelect(type)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium transition hover:bg-gray-50 ${
                  isSelected ? style.softBg : "bg-white"
                } ${style.text}`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                {type}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
