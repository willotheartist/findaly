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
      <label className="mb-1.5 block text-sm font-medium text-[#555]">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-lg border border-[#e5e5e5] bg-white px-4 pr-10 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#1a7a5c] focus:ring-2 focus:ring-[#1a7a5c]/10"
        >
          <option value="">{placeholder}</option>
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
      </div>
    </div>
  );
}