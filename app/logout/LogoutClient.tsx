// app/logout/LogoutClient.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, LogOut, AlertTriangle } from "lucide-react";

export default function LogoutClient() {
  const [state, setState] = React.useState<"working" | "error">("working");

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        // IMPORTANT:
        // credentials: "include" ensures cookies are sent so the server can clear the session cookie.
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
        }).catch(() => null);

        if (cancelled) return;

        // Hard redirect to force server components + middleware to see cleared cookie immediately.
        window.location.assign("/");
      } catch {
        if (cancelled) return;
        setState("error");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-[calc(100vh-0px)] w-full bg-white">
      <section className="relative w-full overflow-hidden bg-linear-to-br from-slate-50 via-white to-orange-50/40">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-[#ff6a00]/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
            <div className="border-b border-slate-100 bg-linear-to-b from-white to-slate-50/60 p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80">
                  {state === "working" ? (
                    <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-rose-600" />
                  )}
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">
                    {state === "working" ? "Logging out" : "Logout problem"}
                  </div>
                  <div className="mt-0.5 text-sm text-slate-600">
                    {state === "working"
                      ? "Please wait…"
                      : "We couldn’t complete logout. Try again."}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-7">
              {state === "working" ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  Clearing your session…
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff6a00] px-5 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
                  >
                    <LogOut className="h-4 w-4" />
                    Try again
                  </button>

                  <Link
                    href="/"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 no-underline hover:bg-slate-50"
                  >
                    Go home
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
