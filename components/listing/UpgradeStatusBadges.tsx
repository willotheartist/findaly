// components/listing/UpgradeStatusBadges.tsx
"use client";

import { Sparkles, Zap, Banknote, Clock } from "lucide-react";

function daysLeft(until: string | null | undefined): number | null {
  if (!until) return null;
  const end = new Date(until);
  if (isNaN(end.getTime())) return null;
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}

function formatDaysLeft(days: number): string {
  if (days === 1) return "1 day left";
  if (days <= 7) return `${days} days left`;
  if (days <= 30) return `${Math.floor(days / 7)}w left`;
  return `${Math.floor(days / 30)}mo left`;
}

type UpgradeStatus = {
  featured?: boolean;
  featuredUntil?: string | null;
  boostLevel?: number;
  boostUntil?: string | null;
  financePriority?: boolean;
  financePriorityUntil?: string | null;
};

/**
 * Shows active upgrade status badges on My Listings cards.
 * Only renders if at least one upgrade is active.
 */
export default function UpgradeStatusBadges({ status }: { status: UpgradeStatus }) {
  const featuredDays = status.featured ? daysLeft(status.featuredUntil) : null;
  const boostDays = (status.boostLevel ?? 0) > 0 ? daysLeft(status.boostUntil) : null;
  const financeDays = status.financePriority ? daysLeft(status.financePriorityUntil) : null;

  const hasAny = featuredDays || boostDays || financeDays;
  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {featuredDays && (
        <span className="inline-flex items-center gap-1 rounded-md bg-[#fff86c]/30 px-2 py-0.5 text-[10px] font-semibold text-[#0a211f]">
          <Sparkles className="h-2.5 w-2.5" />
          Featured &middot; {formatDaysLeft(featuredDays)}
        </span>
      )}
      {boostDays && (
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
          <Zap className="h-2.5 w-2.5" />
          Boosted &middot; {formatDaysLeft(boostDays)}
        </span>
      )}
      {financeDays && (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          <Banknote className="h-2.5 w-2.5" />
          Finance &middot; {formatDaysLeft(financeDays)}
        </span>
      )}
    </div>
  );
}