// components/listing/SaveListingButtonClient.tsx
"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  listingId: string;
  className?: string;
};

function cn(...xs: Array<string | undefined | false | null>) {
  return xs.filter(Boolean).join(" ");
}

export default function SaveListingButtonClient({ listingId, className }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [saved, setSaved] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [showAuth, setShowAuth] = React.useState(false);

  async function toggleSaved() {
    if (busy) return;
    setBusy(true);

    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });

      if (res.status === 401) {
        setShowAuth(true);
        return;
      }

      if (!res.ok) return;

      const data: unknown = await res.json().catch(() => ({}));
      const obj = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
      const nextSaved = typeof obj.saved === "boolean" ? obj.saved : !saved;

      setSaved(nextSaved);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  function goAuth(mode: "login" | "signup") {
    const next = encodeURIComponent(pathname || "/");
    router.push(mode === "login" ? `/login?next=${next}` : `/signup?next=${next}`);
  }

  return (
    <>
      <button
        type="button"
        aria-label={saved ? "Unsave listing" : "Save listing"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void toggleSaved();
        }}
        disabled={busy}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200/80",
          "shadow-[0_1px_0_rgba(15,23,42,0.04)] transition hover:ring-slate-300",
          busy && "opacity-70",
          className
        )}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition",
            saved ? "fill-[#ff3b30] text-[#ff3b30]" : "text-slate-600"
          )}
        />
      </button>

      {showAuth ? (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowAuth(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-base font-semibold text-slate-900">
              Save boats to your shortlist
            </div>
            <div className="mt-1.5 text-sm text-slate-600">
              Create an account or sign in to save listings and view them later in your Saved page.
            </div>

            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={() => goAuth("login")}
                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => goAuth("signup")}
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Create account
              </button>

              <button
                type="button"
                onClick={() => setShowAuth(false)}
                className="mt-1 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}