// app/add-listing/_components/steps/Step1TypeSelection.tsx
`use client`;

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
      <div className="mb-10 text-center">
        <h1 className="text-[28px] font-normal tracking-[-0.02em] text-[#1a1a1a]">
          What would you like to list?
        </h1>
        <p className="mt-2 text-[15px] text-[#999]">
          Choose the type of listing you want to create
        </p>
        <div className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-[#1a7a5c]" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {LISTING_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = selected === type.id;

          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`group relative flex flex-col items-start rounded-2xl border p-6 text-left transition-all ${
                isSelected
                  ? "border-[#0a211f] bg-[#0a211f]/2 ring-1 ring-[#0a211f]/20"
                  : "border-[#e5e5e5] bg-white hover:border-[#ccc] hover:shadow-sm"
              }`}
            >
              {/* Icon */}
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full transition-all ${
                  isSelected
                    ? "bg-[#0a211f] shadow-lg shadow-[#0a211f]/15"
                    : "bg-[#f5f5f4] group-hover:bg-[#0a211f]/6"
                }`}
              >
                <Icon
                  className={`h-6 w-6 transition-colors ${
                    isSelected ? "text-[#fff86c]" : "text-[#999] group-hover:text-[#555]"
                  }`}
                />
              </div>

              {/* Text */}
              <h3 className="text-[17px] font-medium tracking-[-0.01em] text-[#1a1a1a]">
                {type.title}
              </h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[#999]">
                {type.description}
              </p>

              {/* Check indicator */}
              {isSelected && (
                <div className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-[#0a211f]">
                  <Check className="h-4 w-4 text-[#fff86c]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}