//·app/add-listing/_components/steps/Step6Photos.tsx

"use client";

import * as React from "react";
import FormSection from "../FormSection";
import PhotoUploader from "../fields/PhotoUploader";
import Input from "../fields/Input";
import type { FormData } from "../../_types/listing";

export default function Step6Photos({
  formData,
  updateForm,
}: {
  formData: FormData;
  updateForm: (updates: Partial<FormData>) => void;
}) {
  const addPhoto = () => {
    updateForm({ photoUrls: [...formData.photoUrls, "placeholder"] });
  };

  const removePhoto = (index: number) => {
    updateForm({ photoUrls: formData.photoUrls.filter((_, i) => i !== index) });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <FormSection title="Photos">
        <PhotoUploader photos={formData.photoUrls} onAdd={addPhoto} onRemove={removePhoto} />
      </FormSection>

      <FormSection title="Video & Virtual Tour (Optional)">
        <div className="space-y-4">
          <Input
            label="YouTube / Vimeo Video URL"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={(v) => updateForm({ videoUrl: v })}
            placeholder="https://youtube.com/watch?v=..."
            hint="Listings with video get 40% more engagement"
          />
          <Input
            label="Virtual Tour URL"
            name="virtualTourUrl"
            value={formData.virtualTourUrl}
            onChange={(v) => updateForm({ virtualTourUrl: v })}
            placeholder="https://..."
          />
        </div>
      </FormSection>
    </div>
  );
}
