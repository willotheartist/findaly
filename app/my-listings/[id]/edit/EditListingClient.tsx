// app/my-listings/[id]/edit/EditListingClient.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import FormSection from "@/app/add-listing/_components/FormSection";
import Input from "@/app/add-listing/_components/fields/Input";
import Select from "@/app/add-listing/_components/fields/Select";
import TextArea from "@/app/add-listing/_components/fields/TextArea";
import CheckboxGroup from "@/app/add-listing/_components/fields/CheckboxGroup";
import PhotoUploader from "@/app/add-listing/_components/fields/PhotoUploader";

import Step3Details from "@/app/add-listing/_components/steps/Step3Details";
import Step4Features from "@/app/add-listing/_components/steps/Step4Features";
import Step5Location from "@/app/add-listing/_components/steps/Step5Location";

import type { FormData, ListingType } from "@/app/add-listing/_types/listing";
import { initialFormData } from "@/app/add-listing/_types/listing";
import {
  COUNTRIES,
  CURRENCIES,
  CHARTER_INCLUDED_OPTIONS,
} from "@/app/add-listing/_data/options";

import {
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function ensureStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function safeString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function safeBool(v: unknown): boolean {
  return v === true;
}

function isBlobUrl(url: string) {
  return typeof url === "string" && url.startsWith("blob:");
}

function safeRevoke(url: string) {
  if (!isBlobUrl(url)) return;
  try {
    URL.revokeObjectURL(url);
  } catch {}
}

async function uploadSingleFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body: fd });

  const ct = res.headers.get("content-type") || "";
  const raw = await res.text().catch(() => "");
  const data = ct.includes("application/json") ? (JSON.parse(raw || "{}") as { url?: unknown; error?: unknown }) : {};

  if (!res.ok || !data?.url) {
    const msg =
      (typeof data?.error === "string" && data.error) ||
      (raw ? `Upload failed (${res.status}): ${raw.slice(0, 200)}` : `Upload failed (${res.status})`);
    throw new Error(msg);
  }

  return String(data.url);
}

async function uploadMany(files: File[], concurrency = 3): Promise<string[]> {
  const out: string[] = new Array(files.length);
  let idx = 0;

  const workers = new Array(Math.min(concurrency, files.length)).fill(0).map(async () => {
    while (idx < files.length) {
      const my = idx++;
      out[my] = await uploadSingleFile(files[my]);
    }
  });

  await Promise.all(workers);
  return out;
}

export default function EditListingClient({
  listingId,
  initial,
}: {
  listingId: string;
  initial?: Partial<FormData>;
}) {
  const router = useRouter();

  const [saving, setSaving] = React.useState(false);
  const [saveOk, setSaveOk] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<FormData>(() => {
    const base = (initial ?? {}) as Partial<FormData>;

    const merged: FormData = {
      ...initialFormData,
      ...base,

      features: ensureStringArray(base.features ?? initialFormData.features),
      electronics: ensureStringArray(base.electronics ?? initialFormData.electronics),
      safetyEquipment: ensureStringArray(
        base.safetyEquipment ?? initialFormData.safetyEquipment
      ),
      charterIncluded: ensureStringArray(
        base.charterIncluded ?? initialFormData.charterIncluded
      ),
      serviceAreas: ensureStringArray(base.serviceAreas ?? initialFormData.serviceAreas),
      photoUrls: ensureStringArray(base.photoUrls ?? initialFormData.photoUrls),

      featured: base.featured === undefined ? initialFormData.featured : safeBool(base.featured),
      urgent: base.urgent === undefined ? initialFormData.urgent : safeBool(base.urgent),
      acceptOffers:
        base.acceptOffers === undefined
          ? initialFormData.acceptOffers
          : safeBool(base.acceptOffers),
    };

    return merged;
  });

  const updateForm = React.useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setSaveOk(false);
    setError(null);
  }, []);

  const listingType = (formData.listingType ?? "sale") as Exclude<ListingType, null>;

  const photoUrls = React.useMemo(
    () => ensureStringArray(formData.photoUrls),
    [formData.photoUrls]
  );

  const handleSave = async () => {
    setSaving(true);
    setSaveOk(false);
    setError(null);

    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const msg = (await res.json().catch(() => ({}))) as { error?: unknown };
        throw new Error(typeof msg.error === "string" ? msg.error : "Failed to save changes");
      }

      setSaveOk(true);
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save changes";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-slate-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            {saveOk && (
              <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 sm:inline-flex">
                <CheckCircle2 className="h-4 w-4" />
                Saved
              </span>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={cx(
                "inline-flex items-center gap-2 rounded-xl bg-[#ff6a00] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110",
                saving && "cursor-not-allowed opacity-80"
              )}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save changes
            </button>
          </div>
        </div>
      </div>

      {/* Content - consistent max-w-4xl */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit listing</h1>
          <p className="mt-1 text-sm text-slate-600">Update your listing details below</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="text-sm font-medium">{error}</div>
          </div>
        )}

        <div className="space-y-6">
          {/* Title */}
          <FormSection title="Title">
            <Input
              label="Listing title"
              name="title"
              value={safeString(formData.title)}
              onChange={(v) => updateForm({ title: v })}
              placeholder="e.g., Sunseeker Predator 57 (2016)"
              required
            />
          </FormSection>

          {/* Listing type */}
          <FormSection title="Listing type">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Type"
                name="listingType"
                value={listingType}
                onChange={(v) => updateForm({ listingType: v as FormData["listingType"] })}
                options={[
                  { value: "sale", label: "For sale (vessel)" },
                  { value: "charter", label: "For charter (vessel)" },
                  { value: "parts", label: "Parts" },
                  { value: "service", label: "Service" },
                ]}
                required
              />

              <Input
                label="Category (optional)"
                name="boatCategory"
                value={safeString(formData.boatCategory)}
                onChange={(v) =>
                  updateForm({ boatCategory: v as unknown as FormData["boatCategory"] })
                }
                placeholder="e.g., Sailing Yacht, Motor Yacht, RIB..."
              />
            </div>
          </FormSection>

          {/* Details - now wrapped in consistent container */}
          <div className="rounded-2xl border border-slate-200 bg-white">
            <Step3Details listingType={listingType as ListingType} formData={formData} updateForm={updateForm} />
          </div>

          {/* Features - consistent container */}
          {(listingType === "sale" || listingType === "charter") && (
            <div className="rounded-2xl border border-slate-200 bg-white">
              <FormSection title="Features & equipment">
                <Step4Features formData={formData} updateForm={updateForm} />
              </FormSection>
            </div>
          )}

          {/* Location - consistent container */}
          <div className="rounded-2xl border border-slate-200 bg-white">
            <Step5Location listingType={listingType as ListingType} formData={formData} updateForm={updateForm} />
          </div>

          {/* Charter inclusions */}
          {listingType === "charter" && (
            <FormSection title="Charter inclusions">
              <CheckboxGroup
                label="What's included?"
                options={CHARTER_INCLUDED_OPTIONS}
                selected={ensureStringArray(formData.charterIncluded)}
                onChange={(v) => updateForm({ charterIncluded: v } as Partial<FormData>)}
                columns={3}
              />
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Select
                  label="Country"
                  name="country"
                  value={safeString(formData.country)}
                  onChange={(v) => updateForm({ country: v })}
                  options={COUNTRIES}
                />
                <Select
                  label="Currency"
                  name="currency"
                  value={safeString(formData.currency)}
                  onChange={(v) => updateForm({ currency: v as FormData["currency"] })}
                  options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.symbol} ${c.label}` }))}
                />
              </div>
            </FormSection>
          )}

          {/* Description */}
          <FormSection title="Description">
            <TextArea
              label="Listing description"
              name="description"
              value={safeString(formData.description)}
              onChange={(v) => updateForm({ description: v })}
              rows={10}
              maxLength={5000}
              placeholder="Write a detailed description. Use paragraphs for readability."
              required
            />
          </FormSection>

          {/* Photos */}
          <FormSection title="Photos">
            <PhotoUploader
              photoUrls={photoUrls}
              max={30}
              onAddFiles={async (files, previewUrls) => {
                setError(null);

                const startIndex = photoUrls.length;
                updateForm({ photoUrls: [...photoUrls, ...previewUrls] });

                try {
                  const uploaded = await uploadMany(files, 3);

                  setFormData((prev) => {
                    const urls = ensureStringArray(prev.photoUrls);
                    const next = [...urls];
                    for (let i = 0; i < uploaded.length; i++) {
                      const preview = next[startIndex + i];
                      next[startIndex + i] = uploaded[i];
                      if (isBlobUrl(preview)) safeRevoke(preview);
                    }
                    return { ...prev, photoUrls: next };
                  });
                } catch (e) {
                  const msg = e instanceof Error ? e.message : "Upload failed";
                  setError(msg);

                  for (const p of previewUrls) safeRevoke(p);

                  setFormData((prev) => {
                    const urls = ensureStringArray(prev.photoUrls);
                    const next = urls.slice(0, startIndex);
                    return { ...prev, photoUrls: next };
                  });
                }
              }}
              onRemove={(index) => {
                const urlToRemove = photoUrls[index];
                if (isBlobUrl(urlToRemove)) safeRevoke(urlToRemove);
                updateForm({ photoUrls: photoUrls.filter((_, i) => i !== index) });
              }}
              onReorder={(nextUrls) => updateForm({ photoUrls: nextUrls })}
            />
          </FormSection>

          {/* Video & Virtual Tour */}
          <FormSection title="Video & Virtual Tour (Optional)">
            <div className="space-y-4">
              <Input
                label="YouTube / Vimeo Video URL"
                name="videoUrl"
                value={safeString(formData.videoUrl)}
                onChange={(v) => updateForm({ videoUrl: v })}
                placeholder="https://youtube.com/watch?v=..."
                hint="Listings with video get more engagement"
              />
              <Input
                label="Virtual Tour URL"
                name="virtualTourUrl"
                value={safeString(formData.virtualTourUrl)}
                onChange={(v) => updateForm({ virtualTourUrl: v })}
                placeholder="https://..."
              />
            </div>
          </FormSection>

          {/* Seller details */}
          <FormSection title="Seller details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Seller type"
                name="sellerType"
                value={safeString(formData.sellerType)}
                onChange={(v) => updateForm({ sellerType: v as FormData["sellerType"] })}
                options={[
                  { value: "private", label: "Private" },
                  { value: "professional", label: "Professional" },
                ]}
              />
              <Input
                label="Seller name"
                name="sellerName"
                value={safeString(formData.sellerName)}
                onChange={(v) => updateForm({ sellerName: v })}
                placeholder="e.g., John Smith"
              />
              <Input
                label="Company (optional)"
                name="sellerCompany"
                value={safeString(formData.sellerCompany)}
                onChange={(v) => updateForm({ sellerCompany: v })}
                placeholder="e.g., Riviera Yachts"
              />
              <Input
                label="Email (optional)"
                name="sellerEmail"
                value={safeString(formData.sellerEmail)}
                onChange={(v) => updateForm({ sellerEmail: v })}
                placeholder="name@email.com"
              />
              <Input
                label="Phone (optional)"
                name="sellerPhone"
                value={safeString(formData.sellerPhone)}
                onChange={(v) => updateForm({ sellerPhone: v })}
                placeholder="+33 ..."
              />
              <Input
                label="Location (optional)"
                name="sellerLocation"
                value={safeString(formData.sellerLocation)}
                onChange={(v) => updateForm({ sellerLocation: v })}
                placeholder="e.g., Cannes"
              />
              <Input
                label="Website (optional)"
                name="sellerWebsite"
                value={safeString(formData.sellerWebsite)}
                onChange={(v) => updateForm({ sellerWebsite: v })}
                placeholder="https://..."
                className="sm:col-span-2"
              />
            </div>
          </FormSection>

          {/* Visibility & options */}
          <FormSection title="Visibility & options">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safeBool(formData.featured)}
                    onChange={(e) => updateForm({ featured: e.target.checked })}
                    className="mt-1 h-4 w-4 accent-[#ff6a00]"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Featured</div>
                    <div className="text-sm text-slate-500">Highlight in search results</div>
                  </div>
                </label>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safeBool(formData.urgent)}
                    onChange={(e) => updateForm({ urgent: e.target.checked })}
                    className="mt-1 h-4 w-4 accent-[#ff6a00]"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Urgent</div>
                    <div className="text-sm text-slate-500">Show urgent badge</div>
                  </div>
                </label>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:col-span-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safeBool(formData.acceptOffers)}
                    onChange={(e) => updateForm({ acceptOffers: e.target.checked })}
                    className="mt-1 h-4 w-4 accent-[#ff6a00]"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Accept offers</div>
                    <div className="text-sm text-slate-500">Open to price negotiations</div>
                  </div>
                </label>
              </div>
            </div>
          </FormSection>

          {/* Save button */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            {saveOk && (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Saved successfully
              </div>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={cx(
                "inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6a00] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110",
                saving && "cursor-not-allowed opacity-80"
              )}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save changes
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}