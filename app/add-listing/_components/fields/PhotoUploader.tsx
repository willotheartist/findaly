"use client";

import * as React from "react";
import { Camera, Sailboat, X } from "lucide-react";

export default function PhotoUploader({
  photos,
  onAdd,
  onRemove,
}: {
  photos: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  // Mock photos for demo
  const mockPhotos = Array(photos.length || 0).fill(null);

  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-slate-700">
        Photos <span className="text-rose-500">*</span>
        <span className="ml-2 font-normal text-slate-500">(Add up to 30 photos)</span>
      </label>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {/* Upload button */}
        <button
          type="button"
          onClick={onAdd}
          className="group flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all hover:border-[#ff6a00] hover:bg-orange-50"
        >
          <Camera className="mb-2 h-8 w-8 text-slate-400 group-hover:text-[#ff6a00]" />
          <span className="text-sm font-medium text-slate-600 group-hover:text-[#ff6a00]">
            Add photos
          </span>
        </button>

        {/* Uploaded photos */}
        {mockPhotos.map((_, index) => (
          <div key={index} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <Sailboat className="h-8 w-8 text-slate-300" />
            </div>

            {index === 0 && (
              <div className="absolute left-2 top-2 rounded bg-[#ff6a00] px-2 py-0.5 text-xs font-semibold text-white">
                Cover
              </div>
            )}

            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Tip: High-quality photos get 3x more inquiries. Include interior, exterior, engine, and detail shots.
      </p>
    </div>
  );
}
