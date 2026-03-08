// components/kompipay/ListingUpgradePanel.tsx
"use client";

import * as React from "react";
import { BadgeCheck, Zap, Banknote, X, ChevronDown } from "lucide-react";
import CheckoutButton from "@/components/kompipay/CheckoutButton";

type UpgradeOption = {
  productKey: "FEATURED_LISTING_14D" | "FEATURED_LISTING_30D" | "BOOST_7D" | "BOOST_14D" | "FINANCE_PRIORITY_14D" | "FINANCE_PRIORITY_30D";
  label: string;
  price: string;
  duration: string;
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
    title: "Feature this listing",
    subtitle: "Top of search + homepage visibility",
    icon: <BadgeCheck className="h-4 w-4" />,
    options: [
      { productKey: "FEATURED_LISTING_14D", label: "14 days", price: "£49", duration: "14d" },
      { productKey: "FEATURED_LISTING_30D", label: "30 days", price: "£79", duration: "30d" },
    ],
  },
  {
    key: "boost",
    title: "Boost visibility",
    subtitle: "Higher ranking in search results",
    icon: <Zap className="h-4 w-4" />,
    options: [
      { productKey: "BOOST_7D", label: "7 days", price: "£19", duration: "7d" },
      { productKey: "BOOST_14D", label: "14 days", price: "£29", duration: "14d" },
    ],
  },
  {
    key: "finance",
    title: "Finance Priority",
    subtitle: "Reach finance-ready buyers",
    icon: <Banknote className="h-4 w-4" />,
    options: [
      { productKey: "FINANCE_PRIORITY_14D", label: "14 days", price: "£29", duration: "14d" },
      { productKey: "FINANCE_PRIORITY_30D", label: "30 days", price: "£49", duration: "30d" },
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative w-full max-w-md animate-in zoom-in-95 fade-in duration-200">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-[#0a211f]/8 p-5">
            <div>
              <h3 className="text-[16px] font-bold text-[#0a211f]">
                Upgrade listing
              </h3>
              <p className="mt-1 line-clamp-1 text-[13px] text-[#0a211f]/45">
                {listingTitle || "Untitled listing"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#0a211f]/30 transition-colors hover:bg-[#0a211f]/5 hover:text-[#0a211f]/60"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Upgrade groups */}
          <div className="max-h-[70vh] overflow-y-auto p-5">
            <div className="space-y-3">
              {UPGRADE_GROUPS.map((group) => {
                const isExpanded = expandedGroup === group.key;

                return (
                  <div
                    key={group.key}
                    className="rounded-xl border border-[#0a211f]/8 bg-[#0a211f]/2 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedGroup(isExpanded ? null : group.key)
                      }
                      className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-[#0a211f]/4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0a211f]/8 text-[#0a211f]/60">
                        {group.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-bold text-[#0a211f]">
                          {group.title}
                        </div>
                        <div className="text-[12px] text-[#0a211f]/40">
                          {group.subtitle}
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[#0a211f]/30 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="border-t border-[#0a211f]/6 p-4 pt-3">
                        <div className="space-y-2.5">
                          {group.options.map((opt) => (
                            <div
                              key={opt.productKey}
                              className="flex items-center justify-between gap-3 rounded-lg border border-[#0a211f]/6 bg-white/60 p-3"
                            >
                              <div>
                                <div className="text-[13px] font-bold text-[#0a211f]">
                                  {opt.label}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-[15px] font-bold text-[#0a211f]">
                                  {opt.price}
                                </div>
                                <div className="w-[100px]">
                                  <CheckoutButton
                                    productKey={opt.productKey}
                                    listingId={listingId}
                                    variant="dark"
                                    className="inline-flex w-full items-center justify-center rounded-lg bg-[#0a211f] px-3 py-2 text-[12px] font-semibold text-[#fff86c] transition-all hover:bg-[#0a211f]/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Buy
                                  </CheckoutButton>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-center text-[11px] text-[#0a211f]/30">
              Upgrades activate on confirmed payment via KompiPay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}