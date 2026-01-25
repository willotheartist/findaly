// app/messages/page.tsx
import { Suspense } from "react";
import MessagesClient from "./MessagesClient";

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <main className="flex h-[calc(100vh-64px)] items-center justify-center bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500" />
        </main>
      }
    >
      <MessagesClient />
    </Suspense>
  );
}
