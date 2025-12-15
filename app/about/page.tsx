import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — findaly",
  description: "Findaly is decision-first software discovery: comparisons, alternatives, and best lists.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-(--color-bg)">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="text-xs text-(--color-text-muted)">
          <Link href="/tools" className="underline underline-offset-2">Tools</Link>
          <span className="mx-1">/</span>
          <span>About</span>
        </div>

        <h1 className="mt-3 text-3xl font-semibold">About findaly</h1>
        <p className="mt-4 text-sm text-(--color-text-muted)">
          Findaly helps you pick software faster. Browse tools by category, compare two options,
          and jump to alternatives or “best for” shortlists.
        </p>

        <div className="mt-8 rounded-2xl border border-black/5 bg-(--color-surface) p-5 text-sm">
          <p className="font-medium">What we’re building next</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-(--color-text-main)">
            <li>More “best” pages: category × use case.</li>
            <li>Claimed listings + verified details.</li>
            <li>Better ranking signals for alternatives + comparisons.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
