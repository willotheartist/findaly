// components/kompipay/CheckoutButton.tsx
"use client";

import * as React from "react";
import type { ProductKey } from "@prisma/client";
import { KOMPIPAY_AMOUNTS_MINOR, KOMPIPAY_PRICE_KEYS } from "@/lib/kompipay/products";

type Props = {
  productKey: ProductKey;
  listingId?: string;
  quantity?: number; // KompiPay embed endpoint currently assumes quantity=1; kept for API compatibility
  children: React.ReactNode;
  className?: string;
};

function errorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return String(err);
}

function kpOrigin() {
  return (process.env.NEXT_PUBLIC_KOMPIPAY_ORIGIN || "https://kompipay.com")
    .trim()
    .replace(/\/+$/, "");
}

function titleFor(productKey: ProductKey) {
  return `Findaly — ${String(productKey).replace(/_/g, " ")}`;
}

export default function CheckoutButton({
  productKey,
  listingId,
  quantity = 1,
  children,
  className,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function onClick() {
    setErr(null);
    setLoading(true);

    try {
      const publishableKey = process.env.NEXT_PUBLIC_KOMPIPAY_PUBLISHABLE_KEY;
      if (!publishableKey) {
        throw new Error("Missing NEXT_PUBLIC_KOMPIPAY_PUBLISHABLE_KEY (set it in Findaly env vars)");
      }

      const price = KOMPIPAY_AMOUNTS_MINOR[productKey];
      if (!price || !Number.isFinite(price) || price < 1) {
        throw new Error(`Missing/invalid price for ${productKey} in KOMPIPAY_AMOUNTS_MINOR`);
      }

      const res = await fetch(`${kpOrigin()}/api/embed/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publishableKey,
          title: titleFor(productKey),
          currency: "GBP",
          price, // minor units (pennies)
          metadata: {
            source: "findaly",
            productKey,
            listingId: listingId ?? null,
            quantity,
            priceKey: KOMPIPAY_PRICE_KEYS[productKey] ?? null,
          },
        }),
      });

      const json: unknown = await res.json().catch(() => ({}));
      const j =
        typeof json === "object" && json !== null
          ? (json as Record<string, unknown>)
          : {};

      if (!res.ok) {
        const e = typeof j.error === "string" ? j.error : "KompiPay checkout failed";
        throw new Error(e);
      }

      const checkoutUrl = typeof j.checkoutUrl === "string" ? j.checkoutUrl : null;
      if (!checkoutUrl) throw new Error("Missing checkoutUrl from KompiPay");

      window.location.href = checkoutUrl;
    } catch (e: unknown) {
      setErr(errorMessage(e) || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <button
        onClick={onClick}
        disabled={loading}
        className={
          className ??
          "w-full rounded-xl border border-slate-200 bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
        }
      >
        {loading ? "Redirecting…" : children}
      </button>
      {err ? <div className="mt-2 text-xs text-red-600">{err}</div> : null}
    </div>
  );
}
