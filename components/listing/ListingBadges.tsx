// components/listing/ListingBadges.tsx
"use client";

import { Sparkles, Zap, Banknote, Shield } from "lucide-react";

type BadgeType = "featured" | "boosted" | "financeReady" | "verified";

const BADGE_CONFIG: Record<
  BadgeType,
  { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
> = {
  featured: {
    label: "Featured",
    icon: <Sparkles className="h-3 w-3" />,
    bg: "rgba(255,248,108,0.95)",
    text: "#0a211f",
    border: "rgba(10,33,31,0.08)",
  },
  boosted: {
    label: "Promoted",
    icon: <Zap className="h-3 w-3" />,
    bg: "rgba(255,255,255,0.95)",
    text: "#1a1a1a",
    border: "rgba(0,0,0,0.10)",
  },
  financeReady: {
    label: "Finance Ready",
    icon: <Banknote className="h-3 w-3" />,
    bg: "rgba(255,255,255,0.95)",
    text: "#10b981",
    border: "rgba(16,185,129,0.20)",
  },
  verified: {
    label: "Verified",
    icon: <Shield className="h-3 w-3" />,
    bg: "rgba(255,255,255,0.95)",
    text: "#1a7a5c",
    border: "rgba(26,122,92,0.15)",
  },
};

/**
 * Renders a single badge pill. Use inside image overlays or card headers.
 */
export function ListingBadge({ type }: { type: BadgeType }) {
  const c = BADGE_CONFIG[type];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold backdrop-blur-sm"
      style={{
        backgroundColor: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
      }}
    >
      {c.icon}
      {c.label}
    </span>
  );
}

/**
 * Renders all applicable badges for a listing.
 * Priority: Featured > Boosted > Finance Ready. Verified shows alongside.
 */
export function ListingBadgeStack({
  featured,
  boosted,
  financeReady,
  verified,
  maxBadges = 2,
}: {
  featured?: boolean;
  boosted?: boolean;
  financeReady?: boolean;
  verified?: boolean;
  maxBadges?: number;
}) {
  const badges: BadgeType[] = [];

  if (featured) badges.push("featured");
  if (boosted && !featured) badges.push("boosted");
  if (financeReady) badges.push("financeReady");
  if (verified && badges.length < maxBadges) badges.push("verified");

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      {badges.slice(0, maxBadges).map((type) => (
        <ListingBadge key={type} type={type} />
      ))}
    </div>
  );
}