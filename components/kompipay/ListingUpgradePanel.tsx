// components/kompipay/ListingUpgradePanel.tsx
"use client";

import * as React from "react";
import {
  BadgeCheck,
  Zap,
  Banknote,
  X,
  Crown,
  ChevronRight,
} from "lucide-react";
import CheckoutButton from "@/components/kompipay/CheckoutButton";

type UpgradeOption = {
  productKey:
    | "FEATURED_LISTING_14D"
    | "FEATURED_LISTING_30D"
    | "BOOST_7D"
    | "BOOST_14D"
    | "FINANCE_PRIORITY_14D"
    | "FINANCE_PRIORITY_30D";
  label: string;
  price: string;
  perDay: string;
  popular?: boolean;
};

type UpgradeGroup = {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  options: UpgradeOption[];
};

const UPGRADE_GROUPS: UpgradeGroup[] = [
  {
    key: "featured",
    title: "Featured",
    subtitle: "Top of search, homepage carousel, featured badge",
    icon: <Crown className="h-[18px] w-[18px]" />,
    options: [
      {
        productKey: "FEATURED_LISTING_14D",
        label: "14 days",
        price: "£49",
        perDay: "£3.50/day",
      },
      {
        productKey: "FEATURED_LISTING_30D",
        label: "30 days",
        price: "£79",
        perDay: "£2.63/day",
        popular: true,
      },
    ],
  },
  {
    key: "boost",
    title: "Boost",
    subtitle: "Higher ranking in search results, boost badge",
    icon: <Zap className="h-[18px] w-[18px]" />,
    options: [
      {
        productKey: "BOOST_7D",
        label: "7 days",
        price: "£19",
        perDay: "£2.71/day",
      },
      {
        productKey: "BOOST_14D",
        label: "14 days",
        price: "£29",
        perDay: "£2.07/day",
        popular: true,
      },
    ],
  },
  {
    key: "finance",
    title: "Finance Priority",
    subtitle: "Finance-ready badge, priority in finance filters",
    icon: <Banknote className="h-[18px] w-[18px]" />,
    options: [
      {
        productKey: "FINANCE_PRIORITY_14D",
        label: "14 days",
        price: "£29",
        perDay: "£2.07/day",
      },
      {
        productKey: "FINANCE_PRIORITY_30D",
        label: "30 days",
        price: "£49",
        perDay: "£1.63/day",
        popular: true,
      },
    ],
  },
];

export default function ListingUpgradePanel({
  listingId,
  listingTitle,
  isOpen,
  onClose,
}: {
  listingId: string;
  listingTitle: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [expandedGroup, setExpandedGroup] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) setExpandedGroup(null);
  }, [isOpen]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal — slides up on mobile, centered on desktop */}
      <div
        className="relative w-full max-w-[440px] overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl"
        style={{
          animation: "upPanelIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "0 -4px 40px rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.04)",
        }}
      >
        <style>{`
          @keyframes upPanelIn {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-[#e5e5e5] px-5 py-4">
          <div className="min-w-0">
            <h3 className="text-[16px] font-semibold text-[#1a1a1a]">
              Upgrade listing
            </h3>
            <p className="mt-0.5 truncate text-[13px] text-[#999]">
              {listingTitle || "Untitled listing"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#999] transition-colors hover:bg-[#f5f5f4] hover:text-[#555]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Content ── */}
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="px-5 py-4">
            {UPGRADE_GROUPS.map((group, gi) => {
              const isExpanded = expandedGroup === group.key;

              return (
                <div key={group.key} className={gi > 0 ? "mt-2" : ""}>
                  {/* Group row */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedGroup(isExpanded ? null : group.key)
                    }
                    className="flex w-full items-center gap-3.5 rounded-xl px-3.5 py-3.5 text-left transition-colors hover:bg-[#f5f5f4]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0a211f] text-[#fff86c]">
                      {group.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-semibold text-[#1a1a1a]">
                        {group.title}
                      </div>
                      <div className="mt-0.5 text-[12px] leading-snug text-[#999]">
                        {group.subtitle}
                      </div>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 shrink-0 text-[#ccc] transition-transform duration-200 ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {/* Expanded options */}
                  {isExpanded && (
                    <div className="mt-1 space-y-2 pb-2 pl-3.5 pr-3.5">
                      {group.options.map((opt) => (
                        <div
                          key={opt.productKey}
                          className={`relative rounded-xl border bg-white transition-all ${
                            opt.popular
                              ? "border-[#0a211f] ring-1 ring-[#0a211f]/5"
                              : "border-[#e5e5e5]"
                          }`}
                        >
                          {/* Popular tag */}
                          {opt.popular && (
                            <div className="absolute -top-2.5 left-4">
                              <span className="rounded-md bg-[#0a211f] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#fff86c]">
                                Best value
                              </span>
                            </div>
                          )}

                          <div className={`px-4 ${opt.popular ? "pt-4" : "pt-3.5"} pb-3.5`}>
                            {/* Price row */}
                            <div className="flex items-baseline justify-between">
                              <div>
                                <span className="text-[15px] font-semibold text-[#1a1a1a]">
                                  {opt.label}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[18px] font-semibold text-[#1a1a1a]">
                                  {opt.price}
                                </span>
                                <span className="ml-1.5 text-[11px] text-[#999]">
                                  {opt.perDay}
                                </span>
                              </div>
                            </div>

                            {/* Buy button */}
                            <div className="mt-3">
                              <CheckoutButton
                                productKey={opt.productKey}
                                listingId={listingId}
                                className={`inline-flex w-full items-center justify-center rounded-lg py-2.5 text-[13px] font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                                  opt.popular
                                    ? "bg-[#0a211f] text-[#fff86c] hover:bg-[#0a211f]/90"
                                    : "border border-[#e5e5e5] bg-white text-[#1a1a1a] hover:bg-[#f5f5f4]"
                                }`}
                              >
                                {opt.popular ? "Upgrade" : "Upgrade"} — {opt.price}
                              </CheckoutButton>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Divider between groups (not after last) */}
                  {gi < UPGRADE_GROUPS.length - 1 && !isExpanded && (
                    <div className="mx-3.5 border-b border-[#f0f0f0]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="border-t border-[#f0f0f0] px-5 py-3.5">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#0a211f]" />
              <span className="text-[11px] text-[#999]">
                Activates instantly on confirmed payment via KompiPay
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}