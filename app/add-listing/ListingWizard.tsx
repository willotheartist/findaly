// app/add-listing/ListingWizard.tsx
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Save, Send, X } from "lucide-react";

import StepIndicator from "./_components/StepIndicator";
import SuccessModal from "./_components/SuccessModal";

import Step1TypeSelection from "./_components/steps/Step1TypeSelection";
import Step2Category from "./_components/steps/Step2Category";
import Step3Details from "./_components/steps/Step3Details";
import Step4Features from "./_components/steps/Step4Features";
import Step5Location from "./_components/steps/Step5Location";
import Step6Photos from "./_components/steps/Step6Photos";
import Step7Description from "./_components/steps/Step7Description";
import Step8Seller from "./_components/steps/Step8Seller";
import StepReview from "./_components/steps/StepReview";

import type { FormData, ListingType } from "./_types/listing";
import { initialFormData } from "./_types/listing";

type SubmitResult = {
  slug?: string | null;
  listing?: { slug?: string | null };
  error?: string;
  missing?: string[];
  [key: string]: unknown;
};

type Props = {
  mode?: "create" | "edit";
  initial?: Partial<FormData>;
  submitUrl: string;
  submitMethod?: "POST" | "PATCH";
  onSuccess?: (result: SubmitResult) => void;
};

type PublishStatus = "LIVE" | "DRAFT";

function isBlobOrDataUrl(url: string) {
  return url.startsWith("blob:") || url.startsWith("data:image/");
}

function safeRevoke(url: string) {
  if (!url) return;
  if (!url.startsWith("blob:")) return;
  try {
    URL.revokeObjectURL(url);
  } catch {}
}

function nonEmpty(s: unknown) {
  return typeof s === "string" && s.trim().length > 0;
}

function hasAnyContact(formData: FormData) {
  return nonEmpty(formData.sellerEmail) || nonEmpty(formData.sellerPhone);
}

/**
 * Upload multiple files in a single batch request for efficiency.
 * Falls back to single-file uploads if batch endpoint fails.
 */
async function uploadBatch(files: File[]): Promise<string[]> {
  const fd = new FormData();
  for (const file of files) {
    fd.append("files", file);
  }

  const res = await fetch("/api/uploads", { method: "POST", body: fd });
  const data = (await res.json().catch(() => ({}))) as { urls?: string[]; error?: string };

  if (!res.ok || !data.urls) {
    throw new Error(data.error || "Batch upload failed");
  }

  return data.urls;
}

/**
 * Upload a single file (fallback).
 */
async function uploadSingleFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };

  if (!res.ok || !data.url) {
    throw new Error(data.error || "Failed to upload image");
  }
  return data.url;
}

/**
 * Replace any blob/data preview URLs with real uploaded URLs.
 * Uses batch upload for efficiency, with single-file fallback.
 */
async function uploadPhotosIfNeeded(formData: FormData): Promise<FormData> {
  const urls = Array.isArray(formData.photoUrls) ? formData.photoUrls : [];
  const files = Array.isArray(formData.photos) ? formData.photos : [];

  if (urls.length === 0) return formData;

  // Find indices that need uploading
  const toUpload: { index: number; file: File; blobUrl: string }[] = [];

  for (let i = 0; i < urls.length; i++) {
    const u = urls[i] || "";
    if (typeof u === "string" && isBlobOrDataUrl(u)) {
      const f = files[i];
      if (f instanceof File) {
        toUpload.push({ index: i, file: f, blobUrl: u });
      }
    }
  }

  if (toUpload.length === 0) return formData;

  // Clone urls array for mutation
  const nextUrls = [...urls];

  try {
    // Try batch upload first (more efficient)
    const filesToUpload = toUpload.map((t) => t.file);
    const uploadedUrls = await uploadBatch(filesToUpload);

    // Map uploaded URLs back to their original indices
    for (let i = 0; i < toUpload.length; i++) {
      const { index, blobUrl } = toUpload[i];
      nextUrls[index] = uploadedUrls[i];
      safeRevoke(blobUrl);
    }
  } catch (batchError) {
    console.warn("Batch upload failed, falling back to individual uploads:", batchError);

    // Fallback: upload individually in parallel
    const uploadPromises = toUpload.map(async ({ index, file, blobUrl }) => {
      try {
        const remoteUrl = await uploadSingleFile(file);
        nextUrls[index] = remoteUrl;
        safeRevoke(blobUrl);
      } catch (err) {
        console.error(`Failed to upload file at index ${index}:`, err);
        // Mark as empty string so it gets filtered out
        nextUrls[index] = "";
      }
    });

    await Promise.all(uploadPromises);
  }

  // Filter out any failed uploads (empty strings) or remaining blob URLs
  const cleaned = nextUrls.filter((u) => typeof u === "string" && u && !isBlobOrDataUrl(u));

  return {
    ...formData,
    photoUrls: cleaned,
    photos: [], // Clear File[] after upload
  };
}

/**
 * Compute required-field missing list + the earliest step to jump to.
 * NOTE: We only enforce this for PUBLISH (LIVE). Saving as draft is always allowed.
 */
function computePublishMissing(formData: FormData): { missing: string[]; firstStep: number } {
  const missing: Array<{ key: string; step: number }> = [];

  const lt = formData.listingType;

  // Step mapping differs per type
  const stepFor = (area:
    | "type"
    | "category"
    | "details"
    | "features"
    | "location"
    | "photos"
    | "description"
    | "contact") => {
    if (lt === "parts") {
      // 1 Type, 2 Details(Category), 3 Location, 4 Photos, 5 Contact, 6 Review
      if (area === "type") return 1;
      if (area === "category") return 2;
      if (area === "details") return 2;
      if (area === "location") return 3;
      if (area === "photos") return 4;
      if (area === "contact") return 5;
      return 6;
    }
    if (lt === "service") {
      // 1 Type, 2 Category, 3 Details, 4 Location, 5 Photos, 6 Contact, 7 Review
      if (area === "type") return 1;
      if (area === "category") return 2;
      if (area === "details") return 3;
      if (area === "location") return 4;
      if (area === "photos") return 5;
      if (area === "contact") return 6;
      return 7;
    }
    // sale/charter
    // 1 Type, 2 Category, 3 Details, 4 Features, 5 Location, 6 Photos, 7 Description, 8 Contact, 9 Review
    if (area === "type") return 1;
    if (area === "category") return 2;
    if (area === "details") return 3;
    if (area === "features") return 4;
    if (area === "location") return 5;
    if (area === "photos") return 6;
    if (area === "description") return 7;
    if (area === "contact") return 8;
    return 9;
  };

  // Common: type must be chosen
  if (!lt) missing.push({ key: "listingType", step: stepFor("type") });

  // Category / primary identifier
  if (lt === "sale" || lt === "charter") {
    if (!formData.boatCategory) missing.push({ key: "boatCategory", step: stepFor("category") });
  }
  if (lt === "service") {
    if (!formData.serviceCategory) missing.push({ key: "serviceCategory", step: stepFor("category") });
    if (!nonEmpty(formData.serviceName)) missing.push({ key: "serviceName", step: stepFor("details") });
  }
  if (lt === "parts") {
    if (!nonEmpty(formData.partsCategory)) missing.push({ key: "partsCategory", step: stepFor("details") });
    if (!nonEmpty(formData.title) && !(nonEmpty(formData.brand) && nonEmpty(formData.model))) {
      missing.push({ key: "title", step: stepFor("details") });
    }
  }

  // Title / brand+model
  if (lt === "sale" || lt === "charter") {
    if (!nonEmpty(formData.title) && !(nonEmpty(formData.brand) && nonEmpty(formData.model))) {
      missing.push({ key: "title", step: stepFor("details") });
    }
    if (!nonEmpty(formData.year)) missing.push({ key: "year", step: stepFor("details") });
  }

  // Location
  if (!nonEmpty(formData.location)) missing.push({ key: "location", step: stepFor("location") });
  if (!nonEmpty(formData.country)) missing.push({ key: "country", step: stepFor("location") });

  // Photos
  if ((formData.photoUrls?.length ?? 0) < 1) missing.push({ key: "photos", step: stepFor("photos") });

  // Description (for vessels we want something meaningful)
  if (lt === "sale" || lt === "charter") {
    if (!nonEmpty(formData.description)) missing.push({ key: "description", step: stepFor("description") });
  }

  // Pricing
  const priceType = formData.priceType;
  const isPOA = priceType === "poa";
  const hasPrice =
    nonEmpty(formData.price) || nonEmpty(formData.charterBasePrice);

  if (lt === "sale" || lt === "parts") {
    if (!isPOA && !nonEmpty(formData.price)) missing.push({ key: "price", step: stepFor("details") });
  }

  if (lt === "charter") {
    if (!isPOA && !hasPrice) missing.push({ key: "charterBasePrice", step: stepFor("details") });
    if (!nonEmpty(formData.charterPricePeriod)) missing.push({ key: "charterPricePeriod", step: stepFor("details") });
  }

  // Contact (seller)
  if (!formData.sellerType) missing.push({ key: "sellerType", step: stepFor("contact") });

  if (formData.sellerType === "professional") {
    if (!nonEmpty(formData.sellerCompany)) missing.push({ key: "sellerCompany", step: stepFor("contact") });
  } else if (formData.sellerType === "private") {
    if (!nonEmpty(formData.sellerName)) missing.push({ key: "sellerName", step: stepFor("contact") });
  }

  if (!hasAnyContact(formData)) missing.push({ key: "sellerContact", step: stepFor("contact") });

  const firstStep = missing.reduce((min, m) => Math.min(min, m.step), Infinity);
  return { missing: missing.map((m) => m.key), firstStep: Number.isFinite(firstStep) ? firstStep : 1 };
}

export default function ListingWizard({
  mode = "create",
  initial,
  submitUrl,
  submitMethod = "POST",
  onSuccess,
}: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    ...(initial ?? {}),
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedListingSlug, setSubmittedListingSlug] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Unfinished modal state
  const [showUnfinishedModal, setShowUnfinishedModal] = useState(false);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);
  const [missingJumpStep, setMissingJumpStep] = useState<number>(1);

  /**
   * Update form with either a partial object or a functional updater.
   */
  const updateForm = useCallback(
    (updates: Partial<FormData> | ((prev: FormData) => Partial<FormData>)) => {
      setFormData((prev) => {
        const partial = typeof updates === "function" ? updates(prev) : updates;
        return { ...prev, ...partial };
      });
    },
    []
  );

  const steps = useMemo(() => {
    const baseSteps = [
      { id: 1, label: "Type" },
      { id: 2, label: "Category" },
    ];

    if (formData.listingType === "service") {
      return [
        ...baseSteps,
        { id: 3, label: "Details" },
        { id: 4, label: "Location" },
        { id: 5, label: "Photos" },
        { id: 6, label: "Contact" },
        { id: 7, label: "Review" },
      ];
    }

    if (formData.listingType === "parts") {
      return [
        { id: 1, label: "Type" },
        { id: 2, label: "Details" },
        { id: 3, label: "Location" },
        { id: 4, label: "Photos" },
        { id: 5, label: "Contact" },
        { id: 6, label: "Review" },
      ];
    }

    return [
      ...baseSteps,
      { id: 3, label: "Details" },
      { id: 4, label: "Features" },
      { id: 5, label: "Location" },
      { id: 6, label: "Photos" },
      { id: 7, label: "Description" },
      { id: 8, label: "Contact" },
      { id: 9, label: "Review" },
    ];
  }, [formData.listingType]);

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const didAutoJump = useRef(false);
  useEffect(() => {
    if (mode !== "edit") return;
    if (didAutoJump.current) return;
    if (!formData.listingType) return;

    didAutoJump.current = true;
    setCurrentStep(totalSteps);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [mode, formData.listingType, totalSteps]);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return !!formData.listingType;
      case 2:
        if (formData.listingType === "sale" || formData.listingType === "charter") {
          return !!formData.boatCategory;
        }
        if (formData.listingType === "service") {
          return !!formData.serviceCategory;
        }
        return true;
      default:
        return true;
    }
  }, [currentStep, formData.listingType, formData.boatCategory, formData.serviceCategory]);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToStep = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const jumpToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (desiredStatus?: PublishStatus) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const uploaded = await uploadPhotosIfNeeded(formData);

      // Update local state with uploaded URLs
      if (
        uploaded.photoUrls !== formData.photoUrls ||
        (uploaded.photos?.length ?? 0) !== (formData.photos?.length ?? 0)
      ) {
        setFormData(uploaded);
      }

      const payload = desiredStatus ? { ...uploaded, status: desiredStatus } : uploaded;

      const response = await fetch(submitUrl, {
        method: submitMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: SubmitResult = await response.json().catch(() => ({} as SubmitResult));

      if (!response.ok) {
        if (response.status === 401) {
          const currentPath = encodeURIComponent(window.location.pathname);
          window.location.href = `/login?redirect=${currentPath}&message=Please log in to publish your listing`;
          return;
        }

        // If API returns missing fields, we can show the same modal
        if ((data.error || "").toString().includes("LISTING_INCOMPLETE") && Array.isArray(data.missing)) {
          setMissingKeys(data.missing);
          const computed = computePublishMissing(formData);
          setMissingJumpStep(computed.firstStep);
          setShowUnfinishedModal(true);
          return;
        }

        throw new Error(data.error || "Failed to save listing");
      }

      const slug = data.slug ?? data.listing?.slug ?? null;

      setSubmittedListingSlug(slug);
      setShowSuccessModal(true);

      onSuccess?.(data);
    } catch (error) {
      console.error("Error submitting listing:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestPublish = async () => {
    // Only enforce required fields when publishing (create flow).
    // Edit mode "Save" can remain permissive.
    if (mode === "create") {
      const check = computePublishMissing(formData);
      if (check.missing.length > 0) {
        setMissingKeys(check.missing);
        setMissingJumpStep(check.firstStep);
        setShowUnfinishedModal(true);
        return;
      }
      await handleSubmit("LIVE");
      return;
    }

    // Edit mode -> treat as save (or publish if your edit endpoint supports it).
    await handleSubmit();
  };

  const saveAsDraft = async () => {
    setShowUnfinishedModal(false);
    // Draft should always be allowed
    await handleSubmit("DRAFT");
  };

  const handleViewListing = () => {
    if (!submittedListingSlug) return;
    window.location.href = `/buy/${submittedListingSlug}`;
  };

  const handleCreateAnother = () => {
    // Revoke any leftover blob URLs before reset
    const urls = Array.isArray(formData.photoUrls) ? formData.photoUrls : [];
    for (const u of urls) safeRevoke(String(u || ""));

    setFormData(initialFormData);
    setCurrentStep(1);
    setShowSuccessModal(false);
    setSubmittedListingSlug(null);
    setSubmitError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const renderStep = () => {
    if (formData.listingType === "parts") {
      switch (currentStep) {
        case 1:
          return (
            <Step1TypeSelection
              selected={formData.listingType}
              onSelect={(t: ListingType) => updateForm({ listingType: t })}
            />
          );
        case 2:
          return (
            <Step2Category
              listingType={formData.listingType}
              formData={formData}
              updateForm={updateForm}
            />
          );
        case 3:
          return (
            <Step5Location
              listingType={formData.listingType}
              formData={formData}
              updateForm={updateForm}
            />
          );
        case 4:
          return <Step6Photos formData={formData} updateForm={updateForm} />;
        case 5:
          return <Step8Seller formData={formData} updateForm={updateForm} />;
        case 6:
          return <StepReview formData={formData} />;
        default:
          return null;
      }
    }

    if (formData.listingType === "service") {
      switch (currentStep) {
        case 1:
          return (
            <Step1TypeSelection
              selected={formData.listingType}
              onSelect={(t: ListingType) => updateForm({ listingType: t })}
            />
          );
        case 2:
          return (
            <Step2Category
              listingType={formData.listingType}
              formData={formData}
              updateForm={updateForm}
            />
          );
        case 3:
          return (
            <Step3Details
              listingType={formData.listingType}
              formData={formData}
              updateForm={updateForm}
            />
          );
        case 4:
          return (
            <Step5Location
              listingType={formData.listingType}
              formData={formData}
              updateForm={updateForm}
            />
          );
        case 5:
          return <Step6Photos formData={formData} updateForm={updateForm} />;
        case 6:
          return <Step8Seller formData={formData} updateForm={updateForm} />;
        case 7:
          return <StepReview formData={formData} />;
        default:
          return null;
      }
    }

    switch (currentStep) {
      case 1:
        return (
          <Step1TypeSelection
            selected={formData.listingType}
            onSelect={(t: ListingType) => updateForm({ listingType: t })}
          />
        );
      case 2:
        return (
          <Step2Category
            listingType={formData.listingType}
            formData={formData}
            updateForm={updateForm}
          />
        );
      case 3:
        return (
          <Step3Details
            listingType={formData.listingType}
            formData={formData}
            updateForm={updateForm}
          />
        );
      case 4:
        return <Step4Features formData={formData} updateForm={updateForm} />;
      case 5:
        return (
          <Step5Location
            listingType={formData.listingType}
            formData={formData}
            updateForm={updateForm}
          />
        );
      case 6:
        return <Step6Photos formData={formData} updateForm={updateForm} />;
      case 7:
        return <Step7Description formData={formData} updateForm={updateForm} />;
      case 8:
        return <Step8Seller formData={formData} updateForm={updateForm} />;
      case 9:
        return <StepReview formData={formData} />;
      default:
        return null;
    }
  };

  const missingLabel = (k: string) => {
    switch (k) {
      case "listingType":
        return "Choose listing type";
      case "boatCategory":
        return "Choose a boat category";
      case "serviceCategory":
        return "Choose a service category";
      case "serviceName":
        return "Add service name";
      case "partsCategory":
        return "Choose parts category";
      case "title":
        return "Add a title (or brand + model)";
      case "year":
        return "Add year";
      case "location":
        return "Add location";
      case "country":
        return "Add country";
      case "photos":
        return "Upload at least 1 photo";
      case "description":
        return "Add description";
      case "price":
        return "Add price (or set POA)";
      case "charterBasePrice":
        return "Add charter price (or set POA)";
      case "charterPricePeriod":
        return "Select price period";
      case "sellerType":
        return "Select seller type";
      case "sellerCompany":
        return "Add company name";
      case "sellerName":
        return "Add seller name";
      case "sellerContact":
        return "Add email or phone";
      default:
        return k;
    }
  };

  return (
    <>
      <SuccessModal
        isOpen={showSuccessModal}
        listingTitle={formData.title || `${formData.brand} ${formData.model}`.trim()}
        listingType={formData.listingType}
        onViewListing={handleViewListing}
        onCreateAnother={mode === "create" ? handleCreateAnother : handleGoHome}
        onGoHome={handleGoHome}
      />

      {/* Unfinished modal */}
      {showUnfinishedModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="text-lg font-semibold text-slate-900">Unfinished listing</div>
              <div className="mt-1 text-sm text-slate-600">
                This listing is missing required details. You can keep it as a draft, or continue editing.
              </div>
            </div>

            <div className="px-6 py-5">
              {missingKeys.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <div className="font-medium">Missing required fields:</div>
                  <ul className="mt-2 list-disc pl-5 text-amber-800">
                    {missingKeys.slice(0, 8).map((k) => (
                      <li key={k}>{missingLabel(k)}</li>
                    ))}
                    {missingKeys.length > 8 && <li>…and {missingKeys.length - 8} more</li>}
                  </ul>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => {
                    setShowUnfinishedModal(false);
                    jumpToStep(missingJumpStep || 1);
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Continue editing
                </button>

                <button
                  onClick={saveAsDraft}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  Save as draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main layout */}
      <main className="flex min-h-screen flex-col bg-slate-50">
        {/* Top header bar */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                aria-label="Back to home"
              >
                <X className="h-4 w-4" />
              </Link>
              <div>
                <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
                  {mode === "edit" ? "Edit listing" : "Create listing"}
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block">
                  {steps.find((s) => s.id === currentStep)?.label} · Step {currentStep} of {totalSteps}
                </p>
              </div>
            </div>

            {/* Quick publish button (desktop) */}
            <button
              onClick={requestPublish}
              disabled={isSubmitting}
              className="hidden items-center gap-2 rounded-full bg-[#ff6a00] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e55f00] hover:shadow-md disabled:opacity-60 sm:inline-flex"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === "edit" ? (
                <Save className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {mode === "edit" ? "Save" : "Publish"}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 pb-24">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
            <div className="mb-6 sm:mb-8">
              <StepIndicator steps={steps} currentStep={currentStep} onStepClick={goToStep} />
            </div>

            {submitError && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <p className="font-medium">Something went wrong</p>
                <p className="mt-1 text-red-600">{submitError}</p>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              {renderStep()}
            </div>
          </div>
        </div>

        {/* Sticky bottom navigation bar */}
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-lg">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
            <button
              onClick={prevStep}
              disabled={isFirstStep}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all sm:px-5 ${
                isFirstStep
                  ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-1 sm:hidden">
              {steps.map((step) => (
                <span
                  key={step.id}
                  className={`h-1.5 rounded-full transition-all ${
                    currentStep === step.id
                      ? "w-4 bg-[#ff6a00]"
                      : currentStep > step.id
                      ? "w-1.5 bg-emerald-500"
                      : "w-1.5 bg-slate-200"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              {isLastStep ? (
                <button
                  onClick={requestPublish}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-full bg-[#ff6a00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e55f00] hover:shadow-md disabled:opacity-60 sm:px-6"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : mode === "edit" ? (
                    <Save className="h-4 w-4" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {mode === "edit" ? "Save changes" : "Publish listing"}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all sm:px-6 ${
                    canProceed()
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
