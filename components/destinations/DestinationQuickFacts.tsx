// components/destinations/DestinationQuickFacts.tsx
import type { DestinationPageData } from "@/app/destinations/[slug]/_data";

function FactItem({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 ${!isLast ? "border-b border-slate-200 pb-5 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-8" : ""}`}
    >
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-[15px] font-medium text-slate-900">{value}</span>
    </div>
  );
}

export default function DestinationQuickFacts({
  data,
}: {
  data: DestinationPageData;
}) {
  const q = data.quickFacts;

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Section header */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            At a glance
          </h2>
          <p className="mt-2 text-base text-slate-500">
            The essentials before you start planning
          </p>
        </div>

        {/* Facts grid - horizontal on desktop, stacked on mobile */}
        <div className="grid gap-5 sm:grid-cols-5 sm:gap-0">
          <FactItem label="Best time" value={q.bestTime} />
          <FactItem label="Ideal stay" value={q.idealStay} />
          <FactItem label="Budget" value={q.budget} />
          <FactItem label="Vibe" value={q.vibe} />
          <FactItem label="Getting around" value={q.gettingAround} isLast />
        </div>
      </div>
    </section>
  );
}