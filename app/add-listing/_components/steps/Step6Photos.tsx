// app/add-listing/_components/steps/Step6Photos.tsx
"use client";

import * as React from "react";
import FormSection from "../FormSection";
import PhotoUploader from "../fields/PhotoUploader";
import Input from "../fields/Input";
import type { FormData } from "../../_types/listing";

function safeRevoke(url: string) {
  if (!url) return;
  if (!url.startsWith("blob:")) return;
  try {
    URL.revokeObjectURL(url);
  } catch {}
}

export default function Step6Photos({
  formData,
  updateForm,
}: {
  formData: FormData;
  updateForm: (updates: Partial<FormData>) => void;
}) {
  const handleAddFiles = React.useCallback(
    (files: File[], previewUrls: string[]) => {
      updateForm({
        photos: [...(formData.photos ?? []), ...files],
        photoUrls: [...(formData.photoUrls ?? []), ...previewUrls],
      });
    },
    [formData.photos, formData.photoUrls, updateForm]
  );

  const handleRemove = React.useCallback(
    (index: number) => {
      const currentUrls = formData.photoUrls ?? [];
      const urlToRemove = currentUrls[index] || "";

      // IMPORTANT:
      // Step components unmount when navigating wizard steps.
      // If we revoke on unmount, previews break.
      // So we revoke ONLY when user removes a photo (or after successful upload).
      safeRevoke(urlToRemove);

      const nextUrls = currentUrls.filter((_, i) => i !== index);
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
      const currentUrls = formData.photoUrls ?? [];
      const currentFiles = formData.photos ?? [];

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
