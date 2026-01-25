"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { LISTING_TYPES } from "../../_data/options";
import type { ListingType } from "../../_types/listing";

export default function Step1TypeSelection({
  selected,
  onSelect,
}: {
  selected: ListingType;
  onSelect: (type: ListingType) => void;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">What would you like to list?</h1>
        <p className="mt-2 text-slate-600">Choose the type of listing you want to create</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {LISTING_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = selected === type.id;

          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`group relative flex flex-col items-start rounded-2xl border-2 p-6 text-left transition-all ${
                isSelected
                  ? "border-[#ff6a00] bg-orange-50 ring-4 ring-orange-100"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg"
              }`}
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${type.color} text-white`}>
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{type.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{type.description}</p>
              {isSelected && (
                <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#ff6a00] text-white">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
