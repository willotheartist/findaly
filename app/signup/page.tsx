import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up — findaly",
  description: "Create an account to save tools and claim listings (coming soon).",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-(--color-bg)">
      <div className="mx-auto max-w-md px-6 py-12">
        <div className="text-xs text-(--color-text-muted)">
          <Link href="/tools" className="underline underline-offset-2">Tools</Link>
          <span className="mx-1">/</span>
          <span>Sign up</span>
        </div>

        <h1 className="mt-3 text-3xl font-semibold">Sign up</h1>
        <p className="mt-2 text-sm text-(--color-text-muted)">
          Accounts are coming soon. This placeholder keeps nav + SEO clean.
        </p>

        <div className="mt-6 rounded-2xl border border-black/5 bg-(--color-surface) p-5 text-sm">
          <p className="text-(--color-text-muted)">
            For now, the best way to get listed is:
          </p>
          <Link href="/submit" className="mt-3 inline-block underline underline-offset-2">
            Submit a tool →
          </Link>
        </div>
      </div>
    </main>
  );
}
