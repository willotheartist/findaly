//·app/add-listing/_components/steps/Step5Location.tsx
"use client";

import * as React from "react";
import FormSection from "../FormSection";
import Input from "../fields/Input";
import Select from "../fields/Select";
import { COUNTRIES, CURRENCIES, TAX_STATUSES } from "../../_data/options";
import type { FormData, ListingType } from "../../_types/listing";

export default function Step5Location({
  listingType,
  formData,
  updateForm,
}: {
  listingType: ListingType;
  formData: FormData;
  updateForm: (updates: Partial<FormData>) => void;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <FormSection title="Location">
        <div className="space-y-4">
          <Select
            label="Country"
            name="country"
            value={formData.country}
            onChange={(v) => updateForm({ country: v })}
            options={COUNTRIES}
            required
          />
          <Input
            label="City / Area"
            name="location"
            value={formData.location}
            onChange={(v) => updateForm({ location: v })}
            placeholder="e.g., Cannes"
            required
          />
          <Input
            label="Marina / Port (optional)"
            name="marina"
            value={formData.marina}
            onChange={(v) => updateForm({ marina: v })}
            placeholder="e.g., Port Pierre Canto"
          />

          {(listingType === "sale" || listingType === "charter") && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Currently lying</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="lying"
                    checked={formData.lying === "afloat"}
                    onChange={() => updateForm({ lying: "afloat" })}
                    className="h-4 w-4 text-[#ff6a00] focus:ring-[#ff6a00]"
                  />
                  <span className="text-sm text-slate-700">Afloat</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="lying"
                    checked={formData.lying === "ashore"}
                    onChange={() => updateForm({ lying: "ashore" })}
                    className="h-4 w-4 text-[#ff6a00] focus:ring-[#ff6a00]"
                  />
                  <span className="text-sm text-slate-700">Ashore</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </FormSection>

      <FormSection title="Price">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={listingType === "charter" ? "Base Price" : "Asking Price"}
              name="price"
              value={formData.price}
              onChange={(v) => updateForm({ price: v })}
              placeholder="590000"
              required
            />
            <Select
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={(v) => updateForm({ currency: v })}
              options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.symbol} ${c.label}` }))}
            />
          </div>

          {listingType === "charter" && (
            <Select
              label="Price Period"
              name="charterPricePeriod"
              value={formData.charterPricePeriod}
              onChange={(v) => updateForm({ charterPricePeriod: v as FormData["charterPricePeriod"] })}
              options={[
                { value: "hour", label: "Per Hour" },
                { value: "day", label: "Per Day" },
                { value: "week", label: "Per Week" },
              ]}
            />
          )}

          {listingType === "sale" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Price type</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: "fixed", label: "Fixed price" },
                    { id: "negotiable", label: "Negotiable" },
                    { id: "poa", label: "POA (Price on application)" },
                  ].map((opt) => (
                    <label key={opt.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="priceType"
                        checked={formData.priceType === opt.id}
                        onChange={() => updateForm({ priceType: opt.id as FormData["priceType"] })}
                        className="h-4 w-4 text-[#ff6a00] focus:ring-[#ff6a00]"
                      />
                      <span className="text-sm text-slate-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Select
                label="Tax Status"
                name="taxStatus"
                value={formData.taxStatus}
                onChange={(v) => updateForm({ taxStatus: v })}
                options={TAX_STATUSES}
              />
            </>
          )}
        </div>
      </FormSection>
    </div>
  );
}
