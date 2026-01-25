// app/add-listing/ListingWizard.tsx
"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Save, Send } from "lucide-react";

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
  [key: string]: unknown;
};

type Props = {
  mode?: "create" | "edit";
  initial?: Partial<FormData>;
  submitUrl: string; // "/api/listings" or `/api/listings/${id}`
  submitMethod?: "POST" | "PATCH";
  onSuccess?: (result: SubmitResult) => void; // called after successful submit
};

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

  const updateForm = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(submitUrl, {
        method: submitMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: SubmitResult = await response.json().catch(() => ({} as SubmitResult));

      if (!response.ok) {
        if (response.status === 401) {
          const currentPath = encodeURIComponent(window.location.pathname);
          window.location.href = `/login?redirect=${currentPath}&message=Please log in to publish your listing`;
          return;
        }
        throw new Error((typeof data.error === "string" ? data.error : null) || "Failed to save listing");
      }

      const slug = data.slug ?? data.listing?.slug ?? null;

      setSubmittedListingSlug(slug);
      setShowSuccessModal(true);

      onSuccess?.(data);
    } catch (error) {
      console.error("Error submitting listing:", error);
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewListing = () => {
    if (!submittedListingSlug) return;
    window.location.href = `/buy/${submittedListingSlug}`;
  };

  const handleCreateAnother = () => {
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
          return <Step2Category listingType={formData.listingType} formData={formData} updateForm={updateForm} />;
        case 3:
          return <Step5Location listingType={formData.listingType} formData={formData} updateForm={updateForm} />;
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
          return <Step2Category listingType={formData.listingType} formData={formData} updateForm={updateForm} />;
        case 3:
          return <Step3Details listingType={formData.listingType} formData={formData} updateForm={updateForm} />;
        case 4:
          return <Step5Location listingType={formData.listingType} formData={formData} updateForm={updateForm} />;
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
        return <Step2Category listingType={formData.listingType} formData={formData} updateForm={updateForm} />;
      case 3:
        return <Step3Details listingType={formData.listingType} formData={formData} updateForm={updateForm} />;
      case 4:
        return <Step4Features formData={formData} updateForm={updateForm} />;
      case 5:
        return <Step5Location listingType={formData.listingType} formData={formData} updateForm={updateForm} />;
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

  return (
    <main className="min-h-screen w-full bg-slate-50">
      <SuccessModal
        isOpen={showSuccessModal}
        listingTitle={formData.title || `${formData.brand} ${formData.model}`.trim()}
        listingType={formData.listingType}
        onViewListing={handleViewListing}
        onCreateAnother={mode === "create" ? handleCreateAnother : handleGoHome}
        onGoHome={handleGoHome}
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                {mode === "edit" ? "Edit listing" : "Add listing"}
              </h1>
              <p className="text-sm text-slate-600">Complete the steps to publish.</p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "edit" ? (
              <Save className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {mode === "edit" ? "Save changes" : "Publish"}
          </button>
        </div>

        <StepIndicator steps={steps} currentStep={currentStep} onStepClick={goToStep} />

        {submitError ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {submitError}
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">{renderStep()}</div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={isFirstStep}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            onClick={nextStep}
            disabled={isLastStep || !canProceed()}
            className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
