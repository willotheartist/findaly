// components/kompipay/CheckoutButton.tsx
"use client";

import * as React from "react";
import type { ProductKey } from "@prisma/client";

type Props = {
  productKey: ProductKey;
  listingId?: string;
  quantity?: number;
  children: React.ReactNode;
  className?: string;
};

function errorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return String(err);
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
      const res = await fetch("/api/kompipay/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productKey, listingId, quantity }),
      });

      const json: unknown = await res.json().catch(() => ({}));

      const j =
        typeof json === "object" && json !== null
          ? (json as Record<string, unknown>)
          : {};

      if (!res.ok) {
        const e = typeof j.error === "string" ? j.error : "Checkout failed";
        throw new Error(e);
      }

      const checkoutUrl = typeof j.checkout_url === "string" ? j.checkout_url : null;
      if (!checkoutUrl) throw new Error("Missing checkout_url");

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
