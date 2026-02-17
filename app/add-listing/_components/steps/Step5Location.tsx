// app/add-listing/_components/steps/Step5Location.tsx
"use client";

import * as React from "react";
import FormSection from "../FormSection";
import Input from "../fields/Input";
import Select from "../fields/Select";
import { COUNTRIES, CURRENCIES, TAX_STATUSES } from "../../_data/options";
import type { FormData, ListingType } from "../../_types/listing";

function onlyDigits(s: string) {
  return (s || "").replace(/[^\d]/g, "");
}

function formatThousands(rawDigits: string) {
  const d = onlyDigits(rawDigits);
  if (!d) return "";
  return d.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* ─── Styled radio ─── */
function RadioOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <span
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          checked ? "border-[#0a211f]" : "border-[#ccc]"
        }`}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-[#0a211f]" />}
      </span>
      <span className="text-[14px] text-[#555]">{label}</span>
    </label>
  );
}

export default function Step5Location({
  listingType,
  formData,
  updateForm,
}: {
  listingType: ListingType;
  formData: FormData;
  updateForm: (updates: Partial<FormData>) => void;
}) {
  const priceDisplay = formatThousands(formData.price);

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
              <label className="mb-2.5 block text-[13px] font-medium tracking-wide text-[#555]">
                Currently lying
              </label>
              <div className="flex gap-5">
                <RadioOption
                  label="Afloat"
                  checked={formData.lying === "afloat"}
                  onChange={() => updateForm({ lying: "afloat" })}
                />
                <RadioOption
                  label="Ashore"
                  checked={formData.lying === "ashore"}
                  onChange={() => updateForm({ lying: "ashore" })}
                />
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
              value={priceDisplay}
              onChange={(v) => updateForm({ price: onlyDigits(v) })}
              placeholder="590,000"
              required
            />
            <Select
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={(v) => updateForm({ currency: v })}
              options={CURRENCIES.map((c) => ({
                value: c.code,
                label: `${c.symbol} ${c.label}`,
              }))}
            />
          </div>

          {listingType === "charter" && (
            <Select
              label="Price Period"
              name="charterPricePeriod"
              value={formData.charterPricePeriod}
              onChange={(v) =>
                updateForm({
                  charterPricePeriod: v as FormData["charterPricePeriod"],
                })
              }
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
                <label className="mb-2.5 block text-[13px] font-medium tracking-wide text-[#555]">
                  Price type
                </label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { id: "fixed", label: "Fixed price" },
                    { id: "negotiable", label: "Negotiable" },
                    { id: "poa", label: "POA (Price on application)" },
                  ].map((opt) => (
                    <RadioOption
                      key={opt.id}
                      label={opt.label}
                      checked={formData.priceType === opt.id}
                      onChange={() =>
                        updateForm({
                          priceType: opt.id as FormData["priceType"],
                        })
                      }
                    />
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