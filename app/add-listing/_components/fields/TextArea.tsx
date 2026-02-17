// app/add-listing/_components/fields/TextArea.tsx
"use client";

import * as React from "react";

export default function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  required,
  hint,
  maxLength,
  className = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  hint?: string;
  maxLength?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[13px] font-medium tracking-wide text-[#555]">
        {label}
        {required && <span className="ml-1 text-[#d94059]">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full resize-none rounded-lg border border-[#e5e5e5] bg-white p-4 text-[14px] text-[#1a1a1a] outline-none transition-all placeholder:text-[#ccc] hover:border-[#ccc] focus:border-[#0a211f] focus:ring-2 focus:ring-[#0a211f]/8"
      />
      <div className="mt-1.5 flex justify-between text-[12px] text-[#999]">
        <span>{hint}</span>
        {maxLength && (
          <span>
            {value.length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}