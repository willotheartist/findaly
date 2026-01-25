"use client";

import * as React from "react";
import FormSection from "../FormSection";
import Input from "../fields/Input";
import TextArea from "../fields/TextArea";
import type { FormData } from "../../_types/listing";

export default function Step7Description({
  formData,
  updateForm,
}: {
  formData: FormData;
  updateForm: (updates: Partial<FormData>) => void;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <FormSection title="Listing Title">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={(v) => updateForm({ title: v })}
          placeholder="e.g., Sunseeker Predator 50 - Low Hours, Immaculate Condition"
          required
          hint="A good title includes brand, model, year, and key selling point"
        />
      </FormSection>

      <FormSection title="Description">
        <TextArea
          label="Full Description"
          name="description"
          value={formData.description}
          onChange={(v) => updateForm({ description: v })}
          placeholder="Describe your boat in detail. Include condition, history, recent maintenance, what makes it special, and why someone should buy/charter it..."
          rows={10}
          required
          maxLength={5000}
          hint="Detailed descriptions help buyers make decisions and reduce time-wasters"
        />
      </FormSection>

      <FormSection title="Recent Works & Upgrades (Optional)">
        <TextArea
          label="Recent maintenance, upgrades, or refits"
          name="recentWorks"
          value={formData.recentWorks}
          onChange={(v) => updateForm({ recentWorks: v })}
          placeholder="- New antifoul (2024)&#10;- Engine service at 400hrs&#10;- New electronics installed..."
          rows={5}
        />
      </FormSection>
    </div>
  );
}
