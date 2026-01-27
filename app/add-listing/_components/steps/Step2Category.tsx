//·app/add-listing/_components/steps/Step2Category.tsx
"use client";

import * as React from "react";
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
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            {listingType === "sale" ? "What type of boat?" : "What are you offering for charter?"}
          </h1>
          <p className="mt-2 text-slate-600">Select the category that best describes your vessel</p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {BOAT_CATEGORIES.map((cat) => {
            const isSelected = formData.boatCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => updateForm({ boatCategory: cat.id as BoatCategory })}
                className={`flex flex-col items-center rounded-xl border-2 p-4 transition-all ${
                  isSelected ? "border-[#ff6a00] bg-orange-50" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className="mb-2 text-3xl">{cat.icon}</span>
                <span className="text-center text-sm font-medium text-slate-900">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {listingType === "charter" && (
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Charter type</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {CHARTER_TYPES.map((type) => {
                const isSelected = formData.charterType === type.id;

                return (
                  <button
                    key={type.id}
                    onClick={() => updateForm({ charterType: type.id as CharterType })}
                    className={`flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all ${
                      isSelected ? "border-[#ff6a00] bg-orange-50" : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className="font-semibold text-slate-900">{type.label}</span>
                    <span className="mt-1 text-sm text-slate-500">{type.description}</span>
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
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">What service do you offer?</h1>
          <p className="mt-2 text-slate-600">Select your professional category</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = formData.serviceCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => updateForm({ serviceCategory: cat.id as ServiceCategory })}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                  isSelected ? "border-[#ff6a00] bg-orange-50" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    isSelected ? "bg-[#ff6a00] text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-slate-900">{cat.label}</span>
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
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Parts &amp; Equipment</h1>
          <p className="mt-2 text-slate-600">Tell us about what you&apos;re selling</p>
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
