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
          <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-slate-200" />
          
          {/* Progress line filled */}
          <div 
            className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-[#ff6a00] transition-all duration-500 ease-out"
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
                        ? "border-[#ff6a00] bg-[#ff6a00] text-white shadow-lg shadow-orange-200"
                        : isCompleted
                        ? "border-emerald-500 bg-emerald-500 text-white group-hover:border-emerald-600 group-hover:bg-emerald-600"
                        : "border-slate-200 bg-white text-slate-400"
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
                        ? "text-[#ff6a00]"
                        : isCompleted
                        ? "text-slate-700 group-hover:text-emerald-600"
                        : "text-slate-400"
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
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-white border border-slate-200 p-3">
          {/* Current step info */}
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff6a00] text-sm font-bold text-white">
              {currentStep}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {steps.find((s) => s.id === currentStep)?.label}
              </p>
              <p className="text-xs text-slate-500">
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
                    ? "w-6 bg-[#ff6a00]"
                    : currentStep > step.id
                    ? "w-2 bg-emerald-500"
                    : "w-2 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}