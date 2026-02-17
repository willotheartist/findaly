// app/add-listing/_components/steps/StepReview.tsx
"use client";

import * as React from "react";
import { Camera, Check, MapPin, Sailboat, Star } from "lucide-react";
import { BOAT_CATEGORIES, CURRENCIES, LISTING_TYPES } from "../../_data/options";
import type { FormData } from "../../_types/listing";

export default function StepReview({ formData }: { formData: FormData }) {
  const currency = CURRENCIES.find((c) => c.code === formData.currency);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Ready banner */}
      <div className="rounded-2xl border border-[#1a7a5c]/20 bg-[#1a7a5c]/[0.04] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a7a5c]">
            <Check className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-[15px] font-medium text-[#0a211f]">Ready to publish!</div>
            <div className="mt-0.5 text-[14px] text-[#555]">
              Review your listing below, then click &quot;Publish&quot; to make it live.
            </div>
          </div>
        </div>
      </div>

      {/* Preview card */}
      <div className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
        {/* Image area */}
        <div className="relative aspect-video bg-gradient-to-br from-[#f5f5f4] to-[#e5e5e5]">
          {(formData.photoUrls?.length ?? 0) > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={formData.photoUrls[0]}
              alt="Listing preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Sailboat className="h-20 w-20 text-[#e5e5e5]" />
            </div>
          )}

          {formData.featured && (
            <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-md bg-[#0a211f] px-3 py-1 text-[12px] font-semibold text-[#fff86c]">
              <Star className="h-3.5 w-3.5" />
              Featured
            </div>
          )}

          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-[12px] text-white backdrop-blur-sm">
            <Camera className="h-3.5 w-3.5" />
            {formData.photoUrls.length} photos
          </div>
        </div>

        {/* Details */}
        <div className="p-6">
          <h2 className="text-[22px] font-normal tracking-[-0.02em] text-[#1a1a1a]">
            {formData.title || `${formData.brand} ${formData.model}`}
          </h2>

          <div className="mt-2.5 flex items-center gap-2 text-[14px] text-[#999]">
            <MapPin className="h-4 w-4" />
            {formData.location}, {formData.country}
          </div>

          {/* Price */}
          <div className="mt-4">
            <span className="text-[28px] font-light tracking-[-0.02em] text-[#1a1a1a]">
              {formData.priceType === "poa"
                ? "POA"
                : `${currency?.symbol}${parseInt(formData.price || "0", 10).toLocaleString()}`}
            </span>
            {formData.listingType === "charter" && formData.price && (
              <span className="ml-1 text-[15px] text-[#999]">/{formData.charterPricePeriod}</span>
            )}
          </div>
          <div className="mt-2 h-[2px] w-10 rounded-full bg-[#1a7a5c]" />

          {/* Quick specs */}
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#f5f5f4] pt-5 sm:grid-cols-4">
            {[
              { label: "Year", value: formData.year || "—" },
              { label: "Length", value: formData.lengthFt ? `${formData.lengthFt} ft` : "—" },
              { label: "Cabins", value: formData.cabins || "—" },
              { label: "Engine", value: formData.engineHours ? `${formData.engineHours} hrs` : "—" },
            ].map((spec) => (
              <div key={spec.label}>
                <div className="text-[12px] tracking-wide text-[#999]">{spec.label}</div>
                <div className="mt-0.5 text-[15px] font-medium text-[#1a1a1a]">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
        <h3 className="text-[17px] font-medium tracking-[-0.01em] text-[#1a1a1a]">
          Listing Summary
        </h3>
        <div className="mt-2 h-[2px] w-8 rounded-full bg-[#1a7a5c]" />

        <dl className="mt-5 space-y-3.5 text-[14px]">
          {[
            {
              label: "Type",
              value: LISTING_TYPES.find((t) => t.id === formData.listingType)?.title,
            },
            {
              label: "Category",
              value: BOAT_CATEGORIES.find((c) => c.id === formData.boatCategory)?.label,
            },
            {
              label: "Features",
              value: `${formData.features.length + formData.electronics.length} selected`,
            },
            {
              label: "Photos",
              value: `${formData.photoUrls.length} uploaded`,
            },
            {
              label: "Seller",
              value:
                formData.sellerType === "professional"
                  ? formData.sellerCompany
                  : formData.sellerName,
            },
          ].map((item) => (
            <div key={item.label} className="flex justify-between">
              <dt className="text-[#999]">{item.label}</dt>
              <dd className="font-medium text-[#1a1a1a]">{item.value || "—"}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}