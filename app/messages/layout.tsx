// app/messages/layout.tsx
import type { ReactNode } from "react";

export default function MessagesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Scope fixes to /messages only */}
      <style>{`
        /* Hide footer on /messages so chat can be full-height */
        body footer { display: none !important; }

        /* Prevent page scroll (chat handles its own scrolling) */
        html, body { height: 100%; overflow: hidden; }

        /* Ensure Next root doesn't introduce scrollbars */
        body { overscroll-behavior: none; }
      `}</style>

      {children}
    </>
  );
}