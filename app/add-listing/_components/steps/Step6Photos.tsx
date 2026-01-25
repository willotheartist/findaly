// app/add-listing/_components/steps/Step6Photos.tsx
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
  const handleAddFiles = React.useCallback(
    (files: File[], previewUrls: string[]) => {
      // Persist both:
      // - photos (File[]) for eventual upload
      // - photoUrls (string[]) for previews + already-uploaded URLs
      updateForm({
        photos: [...(formData.photos ?? []), ...files],
        photoUrls: [...(formData.photoUrls ?? []), ...previewUrls],
      });
    },
    [formData.photos, formData.photoUrls, updateForm]
  );

  const handleRemove = React.useCallback(
    (index: number) => {
      const nextUrls = (formData.photoUrls ?? []).filter((_, i) => i !== index);
      const nextFiles = (formData.photos ?? []).filter((_, i) => i !== index);

      updateForm({
        photoUrls: nextUrls,
        photos: nextFiles,
      });
    },
    [formData.photoUrls, formData.photos, updateForm]
  );

  const handleReorder = React.useCallback(
    (nextUrls: string[]) => {
      // Reorder photos[] to match the new photoUrls order.
      // Works because we always keep photos[] and photoUrls[] aligned by index.
      const currentUrls = formData.photoUrls ?? [];
      const currentFiles = formData.photos ?? [];

      // Build a mapping from old index -> new index using URL identity.
      // Note: if duplicate URLs exist, this uses first match; avoid duplicates in practice.
      const usedOld = new Set<number>();
      const nextFiles: File[] = [];

      for (const url of nextUrls) {
        let foundOld = -1;
        for (let i = 0; i < currentUrls.length; i++) {
          if (usedOld.has(i)) continue;
          if (currentUrls[i] === url) {
            foundOld = i;
            break;
          }
        }

        if (foundOld >= 0) {
          usedOld.add(foundOld);
          nextFiles.push(currentFiles[foundOld]);
        } else {
          // If a URL doesn't exist in currentUrls, we can't map a File for it.
          // Keep array alignment by pushing a "gap" only if the file existed.
          // In real usage this shouldn't happen unless someone injects URLs externally.
          // We'll just skip a file entry here.
        }
      }

      updateForm({
        photoUrls: nextUrls,
        photos: nextFiles,
      });
    },
    [formData.photoUrls, formData.photos, updateForm]
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <FormSection title="Photos">
        <PhotoUploader
          photoUrls={formData.photoUrls ?? []}
          onAddFiles={handleAddFiles}
          onRemove={handleRemove}
          onReorder={handleReorder}
          max={30}
        />
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
