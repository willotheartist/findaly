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
      <label className="mb-1.5 block text-[13px] font-medium tracking-wide text-[#555]">
        {label}
        {required && <span className="ml-1 text-[#d94059]">*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#999]">
            {prefix}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`h-12 w-full rounded-lg border border-[#e5e5e5] bg-white text-[14px] text-[#1a1a1a] outline-none transition-all placeholder:text-[#ccc] hover:border-[#ccc] focus:border-[#0a211f] focus:ring-2 focus:ring-[#0a211f]/8 ${
            prefix ? "pl-8" : "px-4"
          } ${suffix ? "pr-14" : "pr-4"}`}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-medium text-[#999]">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="mt-1.5 text-[12px] text-[#999]">{hint}</p>}
    </div>
  );
}