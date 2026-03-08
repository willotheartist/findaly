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
  variant?: "primary" | "secondary" | "dark";
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
  variant = "dark",
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
        const e =
          typeof j.error === "string" ? j.error : "Checkout session failed";
        throw new Error(e);
      }

      const checkoutUrl =
        typeof j.checkout_url === "string" ? j.checkout_url : null;
      if (!checkoutUrl) throw new Error("Missing checkout URL from server");

      window.location.href = checkoutUrl;
    } catch (e: unknown) {
      setErr(errorMessage(e) || "Something went wrong");
      setLoading(false);
    }
  }

  const baseClasses =
    "inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses: Record<string, string> = {
    primary:
      "bg-[#fff86c] text-[#0a211f] hover:bg-[#f5ee5a] active:scale-[0.98]",
    secondary:
      "border border-[#0a211f]/16 bg-[#0a211f]/3 text-[#0a211f] hover:bg-[#0a211f]/6 active:scale-[0.98]",
    dark: "bg-[#0a211f] text-[#fff86c] hover:bg-[#0a211f]/90 active:scale-[0.98]",
  };

  return (
    <div className="w-full">
      <button
        onClick={onClick}
        disabled={loading}
        className={className ?? `${baseClasses} ${variantClasses[variant]}`}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Redirecting…
          </>
        ) : (
          children
        )}
      </button>
      {err ? <div className="mt-2 text-xs text-red-600">{err}</div> : null}
    </div>
  );
}