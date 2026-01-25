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
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full resize-none rounded-lg border border-slate-200 bg-white p-4 text-sm outline-none transition-colors focus:border-[#ff6a00] focus:ring-2 focus:ring-orange-100"
      />
      <div className="mt-1 flex justify-between text-xs text-slate-500">
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
