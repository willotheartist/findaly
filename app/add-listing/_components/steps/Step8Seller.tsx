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
            className={`flex items-center gap-4 rounded-xl border-2 p-5 text-left transition-all ${
              formData.sellerType === "private"
                ? "border-[#ff6a00] bg-orange-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <User className="h-8 w-8 text-slate-600" />
            <div>
              <div className="font-semibold text-slate-900">Private Seller</div>
              <div className="text-sm text-slate-500">Individual selling their own boat</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateForm({ sellerType: "professional" })}
            className={`flex items-center gap-4 rounded-xl border-2 p-5 text-left transition-all ${
              formData.sellerType === "professional"
                ? "border-[#ff6a00] bg-orange-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <Building2 className="h-8 w-8 text-slate-600" />
            <div>
              <div className="font-semibold text-slate-900">Professional</div>
              <div className="text-sm text-slate-500">Broker, dealer, or charter company</div>
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

              <label className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.sellerWhatsapp}
                  onChange={(e) => updateForm({ sellerWhatsapp: e.target.checked })}
                  className="h-4 w-4 rounded text-[#ff6a00] focus:ring-[#ff6a00]"
                />
                <span className="text-sm text-slate-600">Available on WhatsApp</span>
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
          <label className="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
            <input
              type="checkbox"
              checked={formData.acceptOffers}
              onChange={(e) => updateForm({ acceptOffers: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded text-[#ff6a00] focus:ring-[#ff6a00]"
            />
            <div>
              <div className="font-medium text-slate-900">Accept offers</div>
              <div className="text-sm text-slate-500">Allow buyers to submit offers through the platform</div>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => updateForm({ featured: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded text-[#ff6a00] focus:ring-[#ff6a00]"
            />
            <div>
              <div className="flex items-center gap-2 font-medium text-slate-900">
                <Star className="h-4 w-4 text-amber-500" />
                Feature this listing
              </div>
              <div className="text-sm text-slate-600">Get 5x more visibility – €49/month</div>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4">
            <input
              type="checkbox"
              checked={formData.urgent}
              onChange={(e) => updateForm({ urgent: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded text-[#ff6a00] focus:ring-[#ff6a00]"
            />
            <div>
              <div className="flex items-center gap-2 font-medium text-slate-900">
                <Zap className="h-4 w-4 text-rose-500" />
                Mark as urgent
              </div>
              <div className="text-sm text-slate-600">Highlight that you need a quick sale – €19</div>
            </div>
          </label>
        </div>
      </FormSection>
    </div>
  );
}
