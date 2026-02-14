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
      {/* Desktop: Horizontal step bar */}
      <div className="hidden md:block">
        <div className="relative flex items-center justify-between">
          {/* Progress line background */}
          <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-[#e5e5e5]" />
          
          {/* Progress line filled */}
          <div 
            className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-[#0a211f] transition-all duration-500 ease-out"
            style={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
            }}
          />

          {/* Steps */}
          <div className="relative flex w-full items-center justify-between">
            {steps.map((step) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isClickable = currentStep > step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={`group flex flex-col items-center gap-2 ${
                    isClickable ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  {/* Circle */}
                  <span
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 ${
                      isCurrent
                        ? "border-[#0a211f] bg-[#0a211f] text-[#fff86c] shadow-lg shadow-[#0a211f]/20"
                        : isCompleted
                        ? "border-[#1a7a5c] bg-[#1a7a5c] text-white group-hover:border-[#15674d] group-hover:bg-[#15674d]"
                        : "border-[#e5e5e5] bg-white text-[#ccc]"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" strokeWidth={2.5} />
                    ) : (
                      step.id
                    )}
                  </span>

                  {/* Label */}
                  <span
                    className={`text-xs font-medium transition-colors ${
                      isCurrent
                        ? "text-[#0a211f]"
                        : isCompleted
                        ? "text-[#555] group-hover:text-[#1a7a5c]"
                        : "text-[#ccc]"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Compact pill indicator */}
      <div className="md:hidden">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-white border border-[#e5e5e5] p-3">
          {/* Current step info */}
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0a211f] text-sm font-bold text-[#fff86c]">
              {currentStep}
            </span>
            <div>
              <p className="text-sm font-semibold text-[#1a1a1a]">
                {steps.find((s) => s.id === currentStep)?.label}
              </p>
              <p className="text-xs text-[#999]">
                Step {currentStep} of {steps.length}
              </p>
            </div>
          </div>

          {/* Mini progress dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((step) => (
              <span
                key={step.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep === step.id
                    ? "w-6 bg-[#0a211f]"
                    : currentStep > step.id
                    ? "w-2 bg-[#1a7a5c]"
                    : "w-2 bg-[#e5e5e5]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}