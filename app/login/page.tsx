import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in — findaly",
  description: "Log in to manage saved tools and claimed listings (coming soon).",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-(--color-bg)">
      <div className="mx-auto max-w-md px-6 py-12">
        <div className="text-xs text-(--color-text-muted)">
          <Link href="/tools" className="underline underline-offset-2">Tools</Link>
          <span className="mx-1">/</span>
          <span>Log in</span>
        </div>

        <h1 className="mt-3 text-3xl font-semibold">Log in</h1>
        <p className="mt-2 text-sm text-(--color-text-muted)">
          Auth is coming next. For now, this is a placeholder so navigation never 404s.
        </p>

        <div className="mt-6 rounded-2xl border border-black/5 bg-(--color-surface) p-5 text-sm">
          <p className="text-(--color-text-muted)">Want early access?</p>
          <Link href="/signup" className="mt-3 inline-block underline underline-offset-2">
            Create an account →
          </Link>
        </div>
      </div>
    </main>
  );
}
