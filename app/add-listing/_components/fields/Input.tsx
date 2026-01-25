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
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
            {prefix}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`h-11 w-full rounded-lg border border-slate-200 bg-white text-sm outline-none transition-colors focus:border-[#ff6a00] focus:ring-2 focus:ring-orange-100 ${
            prefix ? "pl-8" : "px-4"
          } ${suffix ? "pr-12" : "pr-4"}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
