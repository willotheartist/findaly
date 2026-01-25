//·app/add-listing/_components/StepIndicator.tsx
"use client";

import * as React from "react";
import { Check, ChevronRight } from "lucide-react";

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
    <div className="hidden md:block">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isCurrent
                    ? "bg-[#ff6a00] text-white"
                    : isCompleted
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-slate-100 text-slate-400"
                } ${isClickable ? "cursor-pointer" : "cursor-default"}`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
                    {step.id}
                  </span>
                )}
                <span className="hidden lg:inline">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <ChevronRight className="mx-1 h-4 w-4 text-slate-300" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
