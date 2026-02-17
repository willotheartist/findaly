// app/add-listing/_components/fields/CheckboxGroup.tsx
"use client";

import * as React from "react";
import { Check } from "lucide-react";

export default function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
  columns = 2,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  columns?: number;
}) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div>
      <label className="mb-3 block text-[13px] font-medium tracking-wide text-[#555]">
        {label}
      </label>
      <div
        className={`grid gap-2 ${
          columns === 2 ? "sm:grid-cols-2" : columns === 3 ? "sm:grid-cols-3" : ""
        }`}
      >
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-[14px] transition-all ${
                isSelected
                  ? "border-[#0a211f] bg-[#0a211f]/[0.03] text-[#1a1a1a]"
                  : "border-[#e5e5e5] text-[#555] hover:border-[#ccc] hover:bg-[#f5f5f4]/50"
              }`}
            >
              <div
                className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition-all ${
                  isSelected
                    ? "border-[#0a211f] bg-[#0a211f]"
                    : "border-[#ccc]"
                }`}
              >
                {isSelected && <Check className="h-3 w-3 text-[#fff86c]" />}
              </div>
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}