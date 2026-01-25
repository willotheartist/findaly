"use client";

import * as React from "react";
import { Camera, Check, MapPin, Sailboat, Star } from "lucide-react";
import { BOAT_CATEGORIES, CURRENCIES, LISTING_TYPES } from "../../_data/options";
import type { FormData } from "../../_types/listing";

export default function StepReview({ formData }: { formData: FormData }) {
  const currency = CURRENCIES.find((c) => c.code === formData.currency);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-start gap-3">
          <Check className="mt-0.5 h-5 w-5 text-emerald-600" />
          <div>
            <div className="font-semibold text-emerald-900">Ready to publish!</div>
            <div className="text-sm text-emerald-700">
              Review your listing below, then click &quot;Publish&quot; to make it live.
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="relative aspect-video bg-linear-to-br from-slate-100 to-slate-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <Sailboat className="h-20 w-20 text-slate-200" />
          </div>

          <div className="absolute left-4 top-4">
            {formData.featured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-sm font-semibold text-white">
                <Star className="h-3.5 w-3.5" />
                Featured
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-sm text-white">
            <Camera className="h-4 w-4" />
            {formData.photoUrls.length} photos
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-xl font-bold text-slate-900">
            {formData.title || `${formData.brand} ${formData.model}`}
          </h2>

          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4" />
            {formData.location}, {formData.country}
          </div>

          <div className="mt-4 text-2xl font-bold text-[#ff6a00]">
            {formData.priceType === "poa"
              ? "POA"
              : `${currency?.symbol}${parseInt(formData.price || "0", 10).toLocaleString()}`}
            {formData.listingType === "charter" && formData.price && (
              <span className="text-base font-normal text-slate-500">/{formData.charterPricePeriod}</span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-4">
            <div>
              <div className="text-slate-500">Year</div>
              <div className="font-medium text-slate-900">{formData.year || "—"}</div>
            </div>
            <div>
              <div className="text-slate-500">Length</div>
              <div className="font-medium text-slate-900">{formData.lengthFt ? `${formData.lengthFt} ft` : "—"}</div>
            </div>
            <div>
              <div className="text-slate-500">Cabins</div>
              <div className="font-medium text-slate-900">{formData.cabins || "—"}</div>
            </div>
            <div>
              <div className="text-slate-500">Engine</div>
              <div className="font-medium text-slate-900">{formData.engineHours ? `${formData.engineHours} hrs` : "—"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 font-semibold text-slate-900">Listing Summary</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Type</dt>
            <dd className="font-medium text-slate-900">
              {LISTING_TYPES.find((t) => t.id === formData.listingType)?.title}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-slate-500">Category</dt>
            <dd className="font-medium text-slate-900">
              {BOAT_CATEGORIES.find((c) => c.id === formData.boatCategory)?.label}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-slate-500">Features</dt>
            <dd className="font-medium text-slate-900">
              {formData.features.length + formData.electronics.length} selected
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-slate-500">Photos</dt>
            <dd className="font-medium text-slate-900">{formData.photoUrls.length} uploaded</dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-slate-500">Seller</dt>
            <dd className="font-medium text-slate-900">
              {formData.sellerType === "professional" ? formData.sellerCompany : formData.sellerName}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
