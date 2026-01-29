// components/LogoutButtonClient.tsx
"use client";

import * as React from "react";

export default function LogoutButtonClient({ className }: { className: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } catch {
          // ignore
        } finally {
          window.location.assign("/");
        }
      }}
    >
      Log out
    </button>
  );
}
