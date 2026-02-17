// app/add-listing/_components/steps/Step8Seller.tsx
"use client";

import * as React from "react";
import { Building2, Star, User, Zap } from "lucide-react";
import FormSection from "../FormSection";
import Input from "../fields/Input";
import type { FormData } from "../../_types/listing";

export default function Step8Seller({
  formData,
  updateForm,
}: {
  formData: FormData;
  updateForm: (updates: Partial<FormData>) => void;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <FormSection title="Seller Type">
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => updateForm({ sellerType: "private" })}
            className={`flex items-center gap-4 rounded-xl border p-5 text-left transition-all ${
              formData.sellerType === "private"
                ? "border-[#0a211f] bg-[#0a211f]/[0.03] ring-1 ring-[#0a211f]/15"
                : "border-[#e5e5e5] hover:border-[#ccc] hover:shadow-sm"
            }`}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all ${
                formData.sellerType === "private"
                  ? "bg-[#0a211f] shadow-sm"
                  : "bg-[#f5f5f4]"
              }`}
            >
              <User
                className={`h-5 w-5 transition-colors ${
                  formData.sellerType === "private" ? "text-[#fff86c]" : "text-[#999]"
                }`}
              />
            </div>
            <div>
              <div className="text-[15px] font-medium text-[#1a1a1a]">Private Seller</div>
              <div className="mt-0.5 text-[13px] text-[#999]">Individual selling their own boat</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateForm({ sellerType: "professional" })}
            className={`flex items-center gap-4 rounded-xl border p-5 text-left transition-all ${
              formData.sellerType === "professional"
                ? "border-[#0a211f] bg-[#0a211f]/[0.03] ring-1 ring-[#0a211f]/15"
                : "border-[#e5e5e5] hover:border-[#ccc] hover:shadow-sm"
            }`}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all ${
                formData.sellerType === "professional"
                  ? "bg-[#0a211f] shadow-sm"
                  : "bg-[#f5f5f4]"
              }`}
            >
              <Building2
                className={`h-5 w-5 transition-colors ${
                  formData.sellerType === "professional" ? "text-[#fff86c]" : "text-[#999]"
                }`}
              />
            </div>
            <div>
              <div className="text-[15px] font-medium text-[#1a1a1a]">Professional</div>
              <div className="mt-0.5 text-[13px] text-[#999]">Broker, dealer, or charter company</div>
            </div>
          </button>
        </div>
      </FormSection>

      <FormSection title="Contact Information">
        <div className="space-y-4">
          {formData.sellerType === "professional" && (
            <Input
              label="Company Name"
              name="sellerCompany"
              value={formData.sellerCompany}
              onChange={(v) => updateForm({ sellerCompany: v })}
              placeholder="e.g., Riviera Boats"
              required
            />
          )}

          <Input
            label="Contact Name"
            name="sellerName"
            value={formData.sellerName}
            onChange={(v) => updateForm({ sellerName: v })}
            placeholder="Your name"
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Email"
              name="sellerEmail"
              value={formData.sellerEmail}
              onChange={(v) => updateForm({ sellerEmail: v })}
              type="email"
              placeholder="email@example.com"
              required
            />

            <div>
              <Input
                label="Phone"
                name="sellerPhone"
                value={formData.sellerPhone}
                onChange={(v) => updateForm({ sellerPhone: v })}
                type="tel"
                placeholder="+33 6 12 34 56 78"
                required
              />

              <label className="mt-2.5 flex cursor-pointer items-center gap-2.5">
                <span
                  className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition-all ${
                    formData.sellerWhatsapp
                      ? "border-[#0a211f] bg-[#0a211f]"
                      : "border-[#ccc]"
                  }`}
                >
                  {formData.sellerWhatsapp && (
                    <svg className="h-3 w-3 text-[#fff86c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={formData.sellerWhatsapp}
                  onChange={(e) => updateForm({ sellerWhatsapp: e.target.checked })}
                  className="sr-only"
                />
                <span className="text-[13px] text-[#555]">Available on WhatsApp</span>
              </label>
            </div>
          </div>

          <Input
            label="Location"
            name="sellerLocation"
            value={formData.sellerLocation}
            onChange={(v) => updateForm({ sellerLocation: v })}
            placeholder="e.g., Cannes, France"
          />

          {formData.sellerType === "professional" && (
            <Input
              label="Website (optional)"
              name="sellerWebsite"
              value={formData.sellerWebsite}
              onChange={(v) => updateForm({ sellerWebsite: v })}
              placeholder="https://www.example.com"
            />
          )}
        </div>
      </FormSection>

      <FormSection title="Listing Options">
        <div className="space-y-3">
          {/* Accept offers */}
          <label className="flex cursor-pointer items-start gap-3.5 rounded-xl border border-[#e5e5e5] p-4 transition-all hover:border-[#ccc]">
            <span
              className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition-all ${
                formData.acceptOffers
                  ? "border-[#0a211f] bg-[#0a211f]"
                  : "border-[#ccc]"
              }`}
            >
              {formData.acceptOffers && (
                <svg className="h-3 w-3 text-[#fff86c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <input
              type="checkbox"
              checked={formData.acceptOffers}
              onChange={(e) => updateForm({ acceptOffers: e.target.checked })}
              className="sr-only"
            />
            <div>
              <div className="text-[14px] font-medium text-[#1a1a1a]">Accept offers</div>
              <div className="mt-0.5 text-[13px] text-[#999]">Allow buyers to submit offers through the platform</div>
            </div>
          </label>

          {/* Featured */}
          <label className="flex cursor-pointer items-start gap-3.5 rounded-xl border border-[#fff86c]/60 bg-[#fff86c]/[0.08] p-4 transition-all hover:bg-[#fff86c]/[0.12]">
            <span
              className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition-all ${
                formData.featured
                  ? "border-[#0a211f] bg-[#0a211f]"
                  : "border-[#ccc]"
              }`}
            >
              {formData.featured && (
                <svg className="h-3 w-3 text-[#fff86c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => updateForm({ featured: e.target.checked })}
              className="sr-only"
            />
            <div>
              <div className="flex items-center gap-2 text-[14px] font-medium text-[#1a1a1a]">
                <Star className="h-4 w-4 text-[#a68307]" />
                Feature this listing
              </div>
              <div className="mt-0.5 text-[13px] text-[#555]">Get 5× more visibility – €49/month</div>
            </div>
          </label>

          {/* Urgent */}
          <label className="flex cursor-pointer items-start gap-3.5 rounded-xl border border-[#d94059]/20 bg-[#d94059]/[0.04] p-4 transition-all hover:bg-[#d94059]/[0.07]">
            <span
              className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition-all ${
                formData.urgent
                  ? "border-[#0a211f] bg-[#0a211f]"
                  : "border-[#ccc]"
              }`}
            >
              {formData.urgent && (
                <svg className="h-3 w-3 text-[#fff86c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <input
              type="checkbox"
              checked={formData.urgent}
              onChange={(e) => updateForm({ urgent: e.target.checked })}
              className="sr-only"
            />
            <div>
              <div className="flex items-center gap-2 text-[14px] font-medium text-[#1a1a1a]">
                <Zap className="h-4 w-4 text-[#d94059]" />
                Mark as urgent
              </div>
              <div className="mt-0.5 text-[13px] text-[#555]">Highlight that you need a quick sale – €19</div>
            </div>
          </label>
        </div>
      </FormSection>
    </div>
  );
}