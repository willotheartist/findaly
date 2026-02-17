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

type PartialFormUpdate = Partial<FormData>;

export default function Step6Photos({
  formData,
  updateForm,
}: {
  formData: FormData;
  updateForm: (updates: PartialFormUpdate | ((prev: FormData) => PartialFormUpdate)) => void;
}) {
  const handleAddFiles = React.useCallback(
    (files: File[], previewUrls: string[]) => {
      updateForm((prev) => ({
        photos: [...(prev.photos ?? []), ...files],
        photoUrls: [...(prev.photoUrls ?? []), ...previewUrls],
      }));
    },
    [updateForm]
  );

  const handleRemove = React.useCallback(
    (index: number) => {
      const currentUrls = formData.photoUrls ?? [];
      const urlToRemove = currentUrls[index] || "";
      safeRevoke(urlToRemove);

      updateForm((prev) => ({
        photoUrls: (prev.photoUrls ?? []).filter((_, i) => i !== index),
        photos: (prev.photos ?? []).filter((_, i) => i !== index),
      }));
    },
    [formData.photoUrls, updateForm]
  );

  const handleReorder = React.useCallback(
    (nextUrls: string[]) => {
      updateForm((prev) => {
        const currentUrls = prev.photoUrls ?? [];
        const currentFiles = prev.photos ?? [];

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

        return {
          photoUrls: nextUrls,
          photos: nextFiles,
        };
      });
    },
    [updateForm]
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