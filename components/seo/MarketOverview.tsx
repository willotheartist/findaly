// components/seo/MarketOverview.tsx
import type { MarketStats } from "@/lib/seo/marketStats";

function fmtMoneyFromCentsEUR(cents: number | null | undefined) {
  if (!cents || cents <= 0) return "—";
  const v = cents / 100;
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return `${Math.round(v).toLocaleString()} EUR`;
  }
}

function fmtNumber(n: number | null | undefined, suffix = "") {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  if (!Number.isFinite(n)) return "—";
  const rounded = Math.round(n);
  return `${rounded.toLocaleString()}${suffix}`;
}

function fmtAvgLength(stats: MarketStats) {
  const m = stats.avgLengthM;
  const ft = stats.avgLengthFt;

  if (typeof m === "number" && m > 0) return fmtNumber(m, "m");
  if (typeof ft === "number" && ft > 0) return fmtNumber(ft, "ft");
  return "—";
}

export default function MarketOverview({
  stats,
  eyebrow = "Live listings",
  compact = false,
}: {
  stats: MarketStats;
  eyebrow?: string;
  compact?: boolean;
}) {
  const hasPriceRange = Boolean(stats.minPriceCents && stats.maxPriceCents);

  return (
    <div
      className={[
        "rounded-2xl border border-slate-200/80 bg-white",
        compact ? "p-4" : "p-5",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-900">
          Market overview
        </div>
        <div className="text-xs font-semibold tracking-[0.14em] uppercase text-slate-500">
          {eyebrow}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Avg price */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="text-xs font-semibold tracking-[0.14em] uppercase text-slate-500">
            Average price
          </div>
          <div className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
            {fmtMoneyFromCentsEUR(stats.avgPriceCents)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {stats.pricedCount > 0
              ? `Based on ${stats.pricedCount.toLocaleString()} priced listings`
              : "Based on priced listings"}
          </div>
        </div>

        {/* Price range */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="text-xs font-semibold tracking-[0.14em] uppercase text-slate-500">
            Price range
          </div>
          <div className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
            {hasPriceRange
              ? `${fmtMoneyFromCentsEUR(stats.minPriceCents)} – ${fmtMoneyFromCentsEUR(
                  stats.maxPriceCents
                )}`
              : "—"}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Min–max of priced listings
          </div>
        </div>

        {/* Avg length */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="text-xs font-semibold tracking-[0.14em] uppercase text-slate-500">
            Average length
          </div>
          <div className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
            {fmtAvgLength(stats)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Uses metres when available
          </div>
        </div>

        {/* Countries */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="text-xs font-semibold tracking-[0.14em] uppercase text-slate-500">
            Countries listed
          </div>
          <div className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
            {fmtNumber(stats.countriesListed)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Distinct listing countries
          </div>
        </div>
      </div>
    </div>
  );
}
