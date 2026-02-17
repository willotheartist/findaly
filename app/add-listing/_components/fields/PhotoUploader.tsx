// app/add-listing/_components/fields/PhotoUploader.tsx
"use client";

import * as React from "react";
import { Camera, ImagePlus, Sailboat, X } from "lucide-react";

type Props = {
  photoUrls: string[];
  max?: number;
  onAddFiles: (files: File[], previewUrls: string[]) => void;
  onRemove: (index: number) => void;
  onReorder?: (nextUrls: string[]) => void;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function PhotoUploader({
  photoUrls,
  max = 30,
  onAddFiles,
  onRemove,
  onReorder,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const dragIndexRef = React.useRef<number | null>(null);
  const [isDropActive, setIsDropActive] = React.useState(false);

  const remaining = Math.max(0, max - (photoUrls?.length ?? 0));

  const openPicker = () => {
    if (!remaining) return;
    inputRef.current?.click();
  };

  const addFiles = (files: File[]) => {
    if (!files.length || !remaining) return;

    const picked = files
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remaining);

    if (!picked.length) return;

    const previews = picked.map((f) => URL.createObjectURL(f));
    onAddFiles(picked, previews);
  };

  const handlePick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const list = e.target.files;
    if (!list || list.length === 0) return;
    addFiles(Array.from(list));
    e.target.value = "";
  };

  const onDragEnter: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropActive(true);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    if (!isDropActive) setIsDropActive(true);
  };

  const onDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const related = e.relatedTarget as Node | null;
    if (related && e.currentTarget.contains(related)) return;
    setIsDropActive(false);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropActive(false);

    const dt = e.dataTransfer;
    if (dt?.files && dt.files.length > 0) {
      addFiles(Array.from(dt.files));
    }
  };

  const onTileDragStart = (index: number) => (e: React.DragEvent) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const onTileDragOver = (overIndex: number) => (e: React.DragEvent) => {
    if (e.dataTransfer?.types?.includes("Files")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragIndexRef.current === null) return;
    if (dragIndexRef.current === overIndex) return;
  };

  const onTileDrop = (dropIndex: number) => (e: React.DragEvent) => {
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      e.preventDefault();
      addFiles(Array.from(e.dataTransfer.files));
      return;
    }

    e.preventDefault();

    const from =
      dragIndexRef.current ?? Number(e.dataTransfer.getData("text/plain"));
    dragIndexRef.current = null;

    if (!onReorder) return;
    if (!Number.isFinite(from)) return;
    if (from === dropIndex) return;

    const next = [...photoUrls];
    const [moved] = next.splice(from, 1);
    next.splice(dropIndex, 0, moved);

    onReorder(next);
  };

  const onTileDragEnd = () => {
    dragIndexRef.current = null;
  };

  return (
    <div>
      <label className="mb-3 block text-[13px] font-medium tracking-wide text-[#555]">
        Photos <span className="text-[#d94059]">*</span>
        <span className="ml-2 font-normal text-[#999]">
          (Up to {max} photos{remaining < max ? ` · ${remaining} remaining` : ""})
        </span>
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handlePick}
      />

      <div
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cx(
          "rounded-2xl border-2 border-dashed p-3 transition-all",
          isDropActive
            ? "border-[#1a7a5c] bg-[#1a7a5c]/[0.04]"
            : "border-transparent"
        )}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {/* Add button */}
          <button
            type="button"
            onClick={openPicker}
            disabled={!remaining}
            className={cx(
              "group flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all",
              remaining
                ? "border-[#e5e5e5] bg-[#f5f5f4] hover:border-[#0a211f] hover:bg-[#0a211f]/[0.03]"
                : "cursor-not-allowed border-[#e5e5e5] bg-[#f5f5f4] opacity-50"
            )}
          >
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-all group-hover:bg-[#0a211f] group-hover:shadow-md">
              <ImagePlus className="h-5 w-5 text-[#999] transition-colors group-hover:text-[#fff86c]" />
            </div>
            <span className="text-[13px] font-medium text-[#555] transition-colors group-hover:text-[#0a211f]">
              Add photos
            </span>
            <span className="mt-0.5 text-[11px] text-[#ccc]">or drop here</span>
          </button>

          {/* Photo tiles */}
          {(photoUrls ?? []).map((url, index) => (
            <div
              key={`${url}-${index}`}
              draggable={Boolean(onReorder)}
              onDragStart={onTileDragStart(index)}
              onDragOver={onTileDragOver(index)}
              onDrop={onTileDrop(index)}
              onDragEnd={onTileDragEnd}
              className={cx(
                "group relative aspect-square overflow-hidden rounded-xl bg-[#f5f5f4]",
                onReorder ? "cursor-move" : ""
              )}
              title={onReorder ? "Drag to reorder" : undefined}
            >
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={`Listing photo ${index + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sailboat className="h-8 w-8 text-[#e5e5e5]" />
                </div>
              )}

              {/* Cover badge */}
              {index === 0 && (
                <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-[#0a211f] px-2 py-0.5 text-[11px] font-semibold text-[#fff86c]">
                  <Camera className="h-3 w-3" />
                  Cover
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                aria-label="Remove photo"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Reorder hint */}
              {Boolean(onReorder) && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent px-2 py-1.5 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Drag to reorder
                </div>
              )}
            </div>
          ))}
        </div>

        {isDropActive && (
          <div className="mt-3 flex items-center justify-center rounded-xl border border-[#1a7a5c]/30 bg-[#1a7a5c]/[0.04] px-4 py-3 text-[13px] text-[#1a7a5c]">
            <ImagePlus className="mr-2 h-4 w-4" />
            Drop images to upload
          </div>
        )}
      </div>

      <p className="mt-3 text-[12px] text-[#999]">
        Tip: High-quality photos get 3× more inquiries. Include interior,
        exterior, engine, and detail shots.
      </p>
    </div>
  );
}