// app/add-listing/_components/SuccessModal.tsx
"use client";

import * as React from "react";
import {
  Check,
  Eye,
  Plus,
  Sailboat,
  Ship,
  BadgeCheck,
  Zap,
  Banknote,
  ArrowRight,
  X,
} from "lucide-react";
import type { ListingType } from "../_types/listing";
import CheckoutButton from "@/components/kompipay/CheckoutButton";

type UpsellOption = {
  productKey: "FEATURED_LISTING_14D" | "FEATURED_LISTING_30D" | "BOOST_7D" | "BOOST_14D" | "FINANCE_PRIORITY_14D" | "FINANCE_PRIORITY_30D";
  label: string;
  price: string;
  duration: string;
  icon: React.ReactNode;
  description: string;
};

const UPSELLS: UpsellOption[] = [
  {
    productKey: "FEATURED_LISTING_14D",
    label: "Featured",
    price: "£49",
    duration: "14 days",
    icon: <BadgeCheck className="h-4 w-4" />,
    description: "Top of search + homepage carousel",
  },
  {
    productKey: "FEATURED_LISTING_30D",
    label: "Featured",
    price: "£79",
    duration: "30 days",
    icon: <BadgeCheck className="h-4 w-4" />,
    description: "Full month of premium visibility",
  },
  {
    productKey: "BOOST_7D",
    label: "Boost",
    price: "£19",
    duration: "7 days",
    icon: <Zap className="h-4 w-4" />,
    description: "Quick ranking lift in search",
  },
  {
    productKey: "BOOST_14D",
    label: "Boost",
    price: "£29",
    duration: "14 days",
    icon: <Zap className="h-4 w-4" />,
    description: "Sustained ranking lift",
  },
];

export default function SuccessModal({
  isOpen,
  listingTitle,
  listingType,
  listingId,
  onViewListing,
  onCreateAnother,
  onGoHome,
}: {
  isOpen: boolean;
  listingTitle: string;
  listingType: ListingType;
  listingId?: string;
  onViewListing: () => void;
  onCreateAnother: () => void;
  onGoHome: () => void;
}) {
  const [showUpsells, setShowUpsells] = React.useState(false);

  // Reset upsell view when modal opens
  React.useEffect(() => {
    if (isOpen) setShowUpsells(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const typeLabels: Record<Exclude<ListingType, null>, string> = {
    sale: "boat listing",
    charter: "charter listing",
    service: "service listing",
    parts: "parts listing",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0a211f]/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-lg animate-in zoom-in-95 fade-in duration-300">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Success header */}
          <div className="relative bg-[#0a211f] px-6 py-8 text-center">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -left-4 top-4 h-16 w-16 rotate-12 rounded-full bg-white/5" />
              <div className="absolute -right-6 top-8 h-20 w-20 -rotate-12 rounded-full bg-white/5" />
              <div className="absolute bottom-4 left-1/4 h-8 w-8 rotate-45 rounded-lg bg-[#fff86c]/10" />
            </div>

            <div className="relative">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff86c] shadow-lg shadow-[#fff86c]/20">
                <Check className="h-8 w-8 text-[#0a211f]" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Listing Published!
              </h2>
              <p className="mt-2 text-white/50">
                Your{" "}
                {listingType ? typeLabels[listingType] : "listing"} is now
                live on Findaly
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Listing summary */}
            <div className="rounded-xl border border-[#0a211f]/8 bg-[#0a211f]/3 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Sailboat className="h-5 w-5 text-[#0a211f]/50" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold text-[#0a211f]">
                    {listingTitle || "Your listing"}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#0a211f]/40">
                    Published just now
                  </p>
                </div>
              </div>
            </div>

            {/* Upsell section */}
            {!showUpsells ? (
              <>
                {/* Upsell teaser */}
                {listingId && (
                  <button
                    type="button"
                    onClick={() => setShowUpsells(true)}
                    className="mt-4 flex w-full items-center gap-3 rounded-xl border border-[#fff86c]/40 bg-[#fff86c]/10 p-4 text-left transition-all hover:bg-[#fff86c]/20"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fff86c]">
                      <Zap className="h-5 w-5 text-[#0a211f]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold text-[#0a211f]">
                        Make your listing stand out
                      </p>
                      <p className="mt-0.5 text-[12px] text-[#0a211f]/50">
                        Feature it, boost ranking, or reach finance-ready
                        buyers
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#0a211f]/40" />
                  </button>
                )}

                {/* Action buttons */}
                <div className="mt-5 space-y-3">
                  <button
                    onClick={onViewListing}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0a211f] py-3.5 text-[14px] font-semibold text-[#fff86c] transition-all hover:bg-[#0a211f]/90 active:scale-[0.98]"
                  >
                    <Eye className="h-4 w-4" />
                    View your listing
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={onCreateAnother}
                      className="flex items-center justify-center gap-2 rounded-lg border border-[#0a211f]/12 bg-[#0a211f]/3 py-3 text-[13px] font-semibold text-[#0a211f]/70 transition-all hover:bg-[#0a211f]/6"
                    >
                      <Plus className="h-4 w-4" />
                      Create another
                    </button>
                    <button
                      onClick={onGoHome}
                      className="flex items-center justify-center gap-2 rounded-lg border border-[#0a211f]/12 bg-[#0a211f]/3 py-3 text-[13px] font-semibold text-[#0a211f]/70 transition-all hover:bg-[#0a211f]/6"
                    >
                      <Ship className="h-4 w-4" />
                      Homepage
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Expanded upsell options */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-bold text-[#0a211f]">
                      Upgrade this listing
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowUpsells(false)}
                      className="rounded-lg p-1 text-[#0a211f]/40 transition-colors hover:bg-[#0a211f]/5 hover:text-[#0a211f]/60"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-[12px] text-[#0a211f]/45">
                    Choose an upgrade to apply to this listing now.
                  </p>

                  <div className="mt-4 space-y-2.5">
                    {UPSELLS.map((u) => (
                      <div
                        key={u.productKey}
                        className="rounded-xl border border-[#0a211f]/8 bg-[#0a211f]/2 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a211f]/8 text-[#0a211f]/60">
                              {u.icon}
                            </div>
                            <div>
                              <div className="text-[13px] font-bold text-[#0a211f]">
                                {u.label}{" "}
                                <span className="font-normal text-[#0a211f]/45">
                                  · {u.duration}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#0a211f]/40">
                                {u.description}
                              </div>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <div className="text-[16px] font-bold text-[#0a211f]">
                              {u.price}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <CheckoutButton
                            productKey={u.productKey}
                            listingId={listingId}
                            variant="dark"
                          >
                            Upgrade — {u.price}
                          </CheckoutButton>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowUpsells(false)}
                    className="mt-4 w-full text-center text-[13px] font-semibold text-[#0a211f]/40 transition-colors hover:text-[#0a211f]/60"
                  >
                    Skip for now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}