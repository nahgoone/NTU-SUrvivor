// app/components/moduleManager/ModuleTypeSelect.tsx

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MODULE_TYPES, type ModuleType } from "../../models/module";
import { getModuleTypeStyle } from "../../utils/moduleStyles";

type ModuleTypeSelectProps = {
  value: ModuleType;
  onChange: (type: ModuleType) => void;
};

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

export default function ModuleTypeSelect({
  value,
  onChange,
}: ModuleTypeSelectProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<DropdownPosition | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const selectedStyle = getModuleTypeStyle(value);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    updateDropdownPosition();

    function handleScrollOrResize() {
      updateDropdownPosition();
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        buttonRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  function updateDropdownPosition() {
    const button = buttonRef.current;

    if (!button) return;

    const rect = button.getBoundingClientRect();

    setPosition({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }

  function handleToggle() {
    setIsOpen((current) => !current);
  }

  function handleSelect(type: ModuleType) {
    onChange(type);
    setIsOpen(false);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="inline-flex min-w-28 items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none transition hover:bg-gray-50 focus:border-blue-500"
      >
        <span className="inline-flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${selectedStyle.dot}`} />
          {value}
        </span>

        <span
          className={`text-xs text-gray-400 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {isMounted &&
        isOpen &&
        position &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              minWidth: position.width,
            }}
            className="z-9999 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
          >
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

                  <span className="flex-1">{type}</span>

                  {isSelected && (
                    <span className="text-xs font-semibold">✓</span>
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
