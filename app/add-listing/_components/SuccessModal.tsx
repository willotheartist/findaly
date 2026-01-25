"use client";

import * as React from "react";
import { Check, Eye, Info, Plus, Sailboat, Ship } from "lucide-react";
import type { ListingType } from "../_types/listing";

export default function SuccessModal({
  isOpen,
  listingTitle,
  listingType,
  onViewListing,
  onCreateAnother,
  onGoHome,
}: {
  isOpen: boolean;
  listingTitle: string;
  listingType: ListingType;
  onViewListing: () => void;
  onCreateAnother: () => void;
  onGoHome: () => void;
}) {
  if (!isOpen) return null;

  const typeLabels: Record<Exclude<ListingType, null>, string> = {
    sale: "boat listing",
    charter: "charter listing",
    service: "service listing",
    parts: "parts listing",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md animate-in zoom-in-95 fade-in duration-300">
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Success header */}
          <div className="relative bg-linear-to-br from-emerald-500 to-emerald-600 px-6 py-10 text-center">
            {/* Confetti-like decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -left-4 top-4 h-16 w-16 rotate-12 rounded-full bg-white/10" />
              <div className="absolute -right-6 top-8 h-20 w-20 -rotate-12 rounded-full bg-white/10" />
              <div className="absolute bottom-4 left-1/4 h-8 w-8 rotate-45 rounded-lg bg-white/10" />
              <div className="absolute bottom-6 right-1/4 h-6 w-6 rounded-full bg-white/10" />
            </div>

            <div className="relative">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
                <Check className="h-10 w-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">Listing Published!</h2>
              <p className="mt-2 text-emerald-100">
                Your {listingType ? typeLabels[listingType] : "listing"} is now live
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6 rounded-xl bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Sailboat className="h-5 w-5 text-slate-600" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{listingTitle || "Your listing"}</p>
                  <p className="mt-0.5 text-sm text-slate-500">Published just now</p>
                </div>
              </div>
            </div>

            <div className="mb-6 flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50 p-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
              <div className="text-sm text-sky-800">
                <p className="font-medium">What happens next?</p>
                <p className="mt-1 text-sky-700">
                  Your listing is now visible to thousands of potential buyers. You&apos;ll receive email notifications when someone sends an inquiry.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={onViewListing}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff6a00] py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110"
              >
                <Eye className="h-4 w-4" />
                View your listing
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onCreateAnother}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4" />
                  Create another
                </button>
                <button
                  onClick={onGoHome}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  <Ship className="h-4 w-4" />
                  Go to homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
