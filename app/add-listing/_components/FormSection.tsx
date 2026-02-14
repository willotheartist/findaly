// app/add-listing/_components/FormSection.tsx
"use client";

import * as React from "react";

export default function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-[#1a1a1a]">{title}</h3>
        {description && <p className="mt-1 text-sm text-[#999]">{description}</p>}
      </div>
      {children}
    </div>
  );
}