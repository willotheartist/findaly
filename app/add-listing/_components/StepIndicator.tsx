// app/add-listing/_components/StepIndicator.tsx
"use client";

import * as React from "react";
import { Check } from "lucide-react";

export default function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: {
  steps: { id: number; label: string }[];
  currentStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <nav aria-label="Progress" className="w-full">
      {/* Desktop: Compact text breadcrumb */}
      <div className="hidden md:block">
        <div className="flex items-center gap-1">
          {steps.map((step, i) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isClickable = currentStep > step.id;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] transition-all ${
                    isCurrent
                      ? "bg-[#0a211f] font-medium text-[#fff86c]"
                      : isCompleted
                      ? "cursor-pointer font-medium text-[#1a7a5c] hover:bg-[#1a7a5c]/[0.06]"
                      : "cursor-default text-[#ccc]"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    <span
                      className={`text-[11px] tabular-nums ${
                        isCurrent ? "text-[#fff86c]/60" : ""
                      }`}
                    >
                      {step.id}
                    </span>
                  )}
                  {step.label}
                </button>

                {i < steps.length - 1 && (
                  <span className="text-[#e5e5e5] select-none">/</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Mobile: Compact bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0a211f] text-[12px] font-semibold text-[#fff86c]">
              {currentStep}
            </span>
            <div>
              <p className="text-[14px] font-medium text-[#1a1a1a]">
                {steps.find((s) => s.id === currentStep)?.label}
              </p>
            </div>
          </div>

          {/* Mini progress bar */}
          <div className="flex items-center gap-1">
            {steps.map((step) => (
              <span
                key={step.id}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentStep === step.id
                    ? "w-5 bg-[#0a211f]"
                    : currentStep > step.id
                    ? "w-1.5 bg-[#1a7a5c]"
                    : "w-1.5 bg-[#e5e5e5]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}