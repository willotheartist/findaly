import type { DestinationPageData } from "@/app/destinations/[slug]/_data";
import {
  Banknote,
  CalendarRange,
  CarFront,
  Clock3,
  Sparkles,
} from "lucide-react";

function budgetLabel(budget: DestinationPageData["quickFacts"]["budget"]) {
  if (budget === "€") return "Lower spend";
  if (budget === "€€") return "Mid-range";
  return "Premium";
}

const items = [
  {
    key: "bestTime",
    label: "Best time to go",
    icon: CalendarRange,
  },
  {
    key: "idealStay",
    label: "Ideal trip length",
    icon: Clock3,
  },
  {
    key: "budget",
    label: "Budget feel",
    icon: Banknote,
  },
  {
    key: "vibe",
    label: "Overall vibe",
    icon: Sparkles,
  },
  {
    key: "gettingAround",
    label: "Getting around",
    icon: CarFront,
  },
] as const;

export default function DestinationQuickFacts({
  data,
}: {
  data: DestinationPageData;
}) {
  return (
    <section className="py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Quick facts
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Planning {data.title} at a glance
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {items.map(({ key, label, icon: Icon }) => {
            const raw =
              key === "budget"
                ? `${data.quickFacts.budget} · ${budgetLabel(data.quickFacts.budget)}`
                : data.quickFacts[key];

            return (
              <div
                key={key}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {label}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-900">{raw}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
