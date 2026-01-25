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
      <label className="mb-3 block text-sm font-medium text-slate-700">{label}</label>
      <div
        className={`grid gap-2 ${
          columns === 2 ? "sm:grid-cols-2" : columns === 3 ? "sm:grid-cols-3" : ""
        }`}
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-all ${
              selected.includes(option)
                ? "border-[#ff6a00] bg-orange-50 text-[#ff6a00]"
                : "border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border ${
                selected.includes(option) ? "border-[#ff6a00] bg-[#ff6a00]" : "border-slate-300"
              }`}
            >
              {selected.includes(option) && <Check className="h-3 w-3 text-white" />}
            </div>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
