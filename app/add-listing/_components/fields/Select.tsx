// app/add-listing/_components/fields/Select.tsx
"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

export default function Select({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select...",
  required,
  className = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[] | string[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  return (
    <div className={className}>
      <label className="mb-1.5 block text-[13px] font-medium tracking-wide text-[#555]">
        {label}
        {required && <span className="ml-1 text-[#d94059]">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full appearance-none rounded-lg border border-[#e5e5e5] bg-white px-4 pr-10 text-[14px] text-[#1a1a1a] outline-none transition-all hover:border-[#ccc] focus:border-[#0a211f] focus:ring-2 focus:ring-[#0a211f]/8"
        >
          <option value="">{placeholder}</option>
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
      </div>
    </div>
  );
}