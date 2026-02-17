// app/add-listing/_components/steps/Step2Category.tsx
"use client";

import FormSection from "../FormSection";
import Input from "../fields/Input";
import Select from "../fields/Select";
import { BOAT_CATEGORIES, CHARTER_TYPES, SERVICE_CATEGORIES } from "../../_data/options";
import type { BoatCategory, CharterType, FormData, ListingType, ServiceCategory } from "../../_types/listing";

export default function Step2Category({
  listingType,
  formData,
  updateForm,
}: {
  listingType: ListingType;
  formData: FormData;
  updateForm: (updates: Partial<FormData>) => void;
}) {
  if (listingType === "sale" || listingType === "charter") {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-[28px] font-normal tracking-[-0.02em] text-[#1a1a1a]">
            {listingType === "sale" ? "What type of boat?" : "What are you offering for charter?"}
          </h1>
          <p className="mt-2 text-[15px] text-[#999]">
            Select the category that best describes your vessel
          </p>
          <div className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-[#1a7a5c]" />
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {BOAT_CATEGORIES.map((cat) => {
            const isSelected = formData.boatCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => updateForm({ boatCategory: cat.id as BoatCategory })}
                className={`flex flex-col items-center rounded-xl border p-4 transition-all ${
                  isSelected
                    ? "border-[#0a211f] bg-[#0a211f]/3 ring-1 ring-[#0a211f]/15"
                    : "border-[#e5e5e5] bg-white hover:border-[#ccc] hover:shadow-sm"
                }`}
              >
                <span className="mb-2.5 text-3xl">{cat.icon}</span>
                <span
                  className={`text-center text-[13px] font-medium transition-colors ${
                    isSelected ? "text-[#0a211f]" : "text-[#555]"
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {listingType === "charter" && (
          <div className="mt-10">
            <h3 className="mb-1 text-[17px] font-medium tracking-[-0.01em] text-[#1a1a1a]">
              Charter type
            </h3>
            <div className="mb-4 h-0.5 w-8 rounded-full bg-[#1a7a5c]" />
            <div className="grid gap-3 sm:grid-cols-2">
              {CHARTER_TYPES.map((type) => {
                const isSelected = formData.charterType === type.id;

                return (
                  <button
                    key={type.id}
                    onClick={() => updateForm({ charterType: type.id as CharterType })}
                    className={`flex flex-col items-start rounded-xl border p-5 text-left transition-all ${
                      isSelected
                        ? "border-[#0a211f] bg-[#0a211f]/3 ring-1 ring-[#0a211f]/15"
                        : "border-[#e5e5e5] bg-white hover:border-[#ccc] hover:shadow-sm"
                    }`}
                  >
                    <span
                      className={`font-medium transition-colors ${
                        isSelected ? "text-[#0a211f]" : "text-[#1a1a1a]"
                      }`}
                    >
                      {type.label}
                    </span>
                    <span className="mt-1.5 text-[13px] leading-relaxed text-[#999]">
                      {type.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (listingType === "service") {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-[28px] font-normal tracking-[-0.02em] text-[#1a1a1a]">
            What service do you offer?
          </h1>
          <p className="mt-2 text-[15px] text-[#999]">
            Select your professional category
          </p>
          <div className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-[#1a7a5c]" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = formData.serviceCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => updateForm({ serviceCategory: cat.id as ServiceCategory })}
                className={`flex items-center gap-3.5 rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-[#0a211f] bg-[#0a211f]/3 ring-1 ring-[#0a211f]/15"
                    : "border-[#e5e5e5] bg-white hover:border-[#ccc] hover:shadow-sm"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
                    isSelected
                      ? "bg-[#0a211f] shadow-sm"
                      : "bg-[#f5f5f4]"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      isSelected ? "text-[#fff86c]" : "text-[#999]"
                    }`}
                  />
                </div>
                <span
                  className={`text-[14px] font-medium transition-colors ${
                    isSelected ? "text-[#0a211f]" : "text-[#1a1a1a]"
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (listingType === "parts") {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-[28px] font-normal tracking-[-0.02em] text-[#1a1a1a]">
            Parts &amp; Equipment
          </h1>
          <p className="mt-2 text-[15px] text-[#999]">
            Tell us about what you&apos;re selling
          </p>
          <div className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-[#1a7a5c]" />
        </div>

        <FormSection title="Item Details">
          <div className="space-y-4">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={(v) => updateForm({ title: v })}
              placeholder="e.g., Raymarine Axiom 9 Chartplotter"
              required
            />
            <Select
              label="Category"
              name="partsCategory"
              value={formData.partsCategory}
              onChange={(v) => updateForm({ partsCategory: v })}
              options={[
                "Electronics & Navigation",
                "Engine Parts",
                "Deck Hardware",
                "Sails & Rigging",
                "Anchoring & Mooring",
                "Plumbing & Pumps",
                "Electrical",
                "Safety Equipment",
                "Interior",
                "Other",
              ]}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Condition"
                name="partsCondition"
                value={formData.partsCondition}
                onChange={(v) => updateForm({ partsCondition: v as FormData["partsCondition"] })}
                options={[
                  { value: "new", label: "New" },
                  { value: "used", label: "Used" },
                  { value: "refurbished", label: "Refurbished" },
                ]}
                required
              />
              <Input
                label="Compatible with"
                name="partsCompatibility"
                value={formData.partsCompatibility}
                onChange={(v) => updateForm({ partsCompatibility: v })}
                placeholder="e.g., Most Beneteau 40-50ft"
              />
            </div>
          </div>
        </FormSection>
      </div>
    );
  }

  return null;
}