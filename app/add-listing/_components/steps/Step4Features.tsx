//·app/add-listing/_components/steps/Step4Features.tsx
"use client";

import * as React from "react";
import FormSection from "../FormSection";
import CheckboxGroup from "../fields/CheckboxGroup";
import TextArea from "../fields/TextArea";
import { ELECTRONICS_OPTIONS, FEATURE_OPTIONS, SAFETY_OPTIONS } from "../../_data/options";
import type { FormData } from "../../_types/listing";

export default function Step4Features({
  formData,
  updateForm,
}: {
  formData: FormData;
  updateForm: (updates: Partial<FormData>) => void;
}) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <FormSection title="Equipment & Features">
        <CheckboxGroup
          label="Select all that apply"
          options={FEATURE_OPTIONS}
          selected={formData.features}
          onChange={(v) => updateForm({ features: v })}
          columns={3}
        />
      </FormSection>

      <FormSection title="Electronics & Navigation">
        <CheckboxGroup
          label="Select all that apply"
          options={ELECTRONICS_OPTIONS}
          selected={formData.electronics}
          onChange={(v) => updateForm({ electronics: v })}
          columns={3}
        />
      </FormSection>

      <FormSection title="Safety Equipment">
        <CheckboxGroup
          label="Select all that apply"
          options={SAFETY_OPTIONS}
          selected={formData.safetyEquipment}
          onChange={(v) => updateForm({ safetyEquipment: v })}
          columns={3}
        />
      </FormSection>

      <FormSection title="Additional Equipment">
        <TextArea
          label="Other features not listed above"
          name="customFeatures"
          value={formData.customFeatures}
          onChange={(v) => updateForm({ customFeatures: v })}
          placeholder="List any additional equipment, recent upgrades, or special features..."
          rows={3}
        />
      </FormSection>
    </div>
  );
}
