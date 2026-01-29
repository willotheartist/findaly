// app/logout/LogoutClient.tsx
"use client";

import * as React from "react";

export default function LogoutClient() {
  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {
        // ignore network errors; we still redirect
      } finally {
        if (!cancelled) window.location.assign("/");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen w-full bg-white">
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="text-lg font-semibold text-slate-900">Signing out…</div>
        <div className="mt-2 text-sm text-slate-600">Just a moment.</div>
      </div>
    </main>
  );
}
