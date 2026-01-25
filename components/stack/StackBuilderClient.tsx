"use client";

import { useMemo, useState } from "react";
import { questions } from "@/data/stack/questions";
import StackLoading from "@/components/stack/StackLoading";
import StackResults from "@/components/stack/StackResults";

type Answers = Record<string, string>;

export default function StackBuilderClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(false);

  const isComplete = step >= questions.length;
  const current = questions[Math.min(step, questions.length - 1)];

  const progress = useMemo(() => {
    const total = questions.length;
    const currentStep = Math.min(step, total);
    return { total, currentStep, pct: Math.round((currentStep / total) * 100) };
  }, [step]);

  function handlePick(value: string) {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);

    const lastQuestion = step === questions.length - 1;
    if (lastQuestion) {
      setLoading(true);
      // keep this ~1.5–3s even if instant; feels intentional
      setTimeout(() => {
        setLoading(false);
        setStep(step + 1);
      }, 1800);
      return;
    }

    setStep(step + 1);
  }

  function goBack() {
    if (loading) return;
    if (step <= 0) return;
    setStep(step - 1);
  }

  if (loading) return <StackLoading />;

  if (isComplete) return <StackResults answers={answers} />;

  const selectedValue = answers[current.id];

  // --- styling: "Findaly" dark-glass buttons ---
  const btnBase =
    "w-full rounded-2xl px-6 py-5 text-base sm:text-lg font-medium transition " +
    "border backdrop-blur-md text-left " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 " +
    "active:scale-[0.99]";

  const btnUnselected =
    "bg-white/[0.04] border-white/15 text-white/90 " +
    "hover:bg-white/[0.08] hover:border-white/25 hover:-translate-y-[1px]";

  // Selected state: solid light surface + dark text (no white-on-white)
  const btnSelected =
    "bg-white text-slate-900 border-white " +
    "shadow-[0_12px_40px_rgba(0,0,0,0.35)]";

  return (
    <div className="w-full max-w-2xl px-6 py-10 sm:py-14">
      {/* Top bar */}
      <div className="mb-10 flex items-center justify-between">
        <button
          onClick={goBack}
          disabled={step === 0}
          className={[
            "text-sm transition",
            step === 0 ? "opacity-30 cursor-not-allowed" : "opacity-80 hover:opacity-100",
          ].join(" ")}
        >
          ← Back
        </button>

        <div className="text-sm opacity-70">
          Step {progress.currentStep + 1} / {progress.total}
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
          {current.title}
        </h1>
        {current.hint ? (
          <p className="mt-4 text-sm sm:text-base text-white/70">{current.hint}</p>
        ) : null}
      </div>

      {/* Options */}
      <div className="space-y-4">
        {current.options.map((opt) => {
          const isSelected = selectedValue === opt.value;

          return (
            <button
              key={opt.value}
              onClick={() => handlePick(opt.value)}
              className={[
                btnBase,
                isSelected ? btnSelected : btnUnselected,
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-4">
                <span>{opt.label}</span>
                <span
                  className={[
                    "text-xs rounded-full px-2.5 py-1 border",
                    isSelected
                      ? "border-slate-300 text-slate-700"
                      : "border-white/15 text-white/60",
                  ].join(" ")}
                >
                  {isSelected ? "Selected" : "Pick"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-10">
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-white/40 transition-all"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
