// app/add-listing/_components/fields/Input.tsx
"use client";

import * as React from "react";

export default function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  suffix,
  prefix,
  required,
  hint,
  className = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  suffix?: string;
  prefix?: string;
  required?: boolean;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-[#555]">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#999]">
            {prefix}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`h-11 w-full rounded-lg border border-[#e5e5e5] bg-white text-sm text-[#1a1a1a] outline-none transition-colors placeholder:text-[#ccc] focus:border-[#1a7a5c] focus:ring-2 focus:ring-[#1a7a5c]/10 ${
            prefix ? "pl-8" : "px-4"
          } ${suffix ? "pr-12" : "pr-4"}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#999]">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-[#999]">{hint}</p>}
    </div>
  );
}