// app/add-listing/_components/fields/PhotoUploader.tsx
"use client";

import * as React from "react";
import { Camera, Sailboat, X } from "lucide-react";

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

    // NOTE: Do not revoke object URLs here (wizard/edit can rerender).
    // Parent replaces blob URLs with uploaded URLs after upload completes.
    const previews = picked.map((f) => URL.createObjectURL(f));

    onAddFiles(picked, previews);
  };

  const handlePick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const list = e.target.files;
    if (!list || list.length === 0) return;
    addFiles(Array.from(list));
    e.target.value = "";
  };

  // Drop zone handlers
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

  // Reorder handlers
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
    // If user drops files onto a tile, treat as add
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
      <label className="mb-3 block text-sm font-medium text-slate-700">
        Photos <span className="text-rose-500">*</span>
        <span className="ml-2 font-normal text-slate-500">
          (Add up to {max} photos{remaining ? ` · ${remaining} remaining` : ""})
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
            ? "border-[#ff6a00] bg-orange-50/60"
            : "border-transparent"
        )}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          <button
            type="button"
            onClick={openPicker}
            disabled={!remaining}
            className={cx(
              "group flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all",
              remaining
                ? "border-slate-300 bg-slate-50 hover:border-[#ff6a00] hover:bg-orange-50"
                : "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
            )}
          >
            <Camera className="mb-2 h-8 w-8 text-slate-400 group-hover:text-[#ff6a00]" />
            <span className="text-sm font-medium text-slate-600 group-hover:text-[#ff6a00]">
              Add photos
            </span>
            <span className="mt-1 text-[11px] text-slate-400">or drop here</span>
          </button>

          {(photoUrls ?? []).map((url, index) => (
            <div
              key={`${url}-${index}`}
              draggable={Boolean(onReorder)}
              onDragStart={onTileDragStart(index)}
              onDragOver={onTileDragOver(index)}
              onDrop={onTileDrop(index)}
              onDragEnd={onTileDragEnd}
              className={cx(
                "group relative aspect-square overflow-hidden rounded-xl bg-slate-100",
                onReorder ? "cursor-move" : ""
              )}
              title={onReorder ? "Drag to reorder" : undefined}
            >
              {url ? (
                // ✅ Always use <img> so remote domains can never break tiles
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={`Listing photo ${index + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sailboat className="h-8 w-8 text-slate-300" />
                </div>
              )}

              {index === 0 && (
                <div className="absolute left-2 top-2 rounded bg-[#ff6a00] px-2 py-0.5 text-xs font-semibold text-white">
                  Cover
                </div>
              )}

              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove photo"
              >
                <X className="h-4 w-4" />
              </button>

              {Boolean(onReorder) && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/30 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Drag to reorder
                </div>
              )}
            </div>
          ))}
        </div>

        {isDropActive && (
          <div className="mt-3 rounded-xl border border-[#ff6a00]/30 bg-white/70 px-4 py-3 text-sm text-slate-700 backdrop-blur-sm">
            Drop images to upload
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Tip: High-quality photos get 3x more inquiries. Include interior,
        exterior, engine, and detail shots.
      </p>
    </div>
  );
}
