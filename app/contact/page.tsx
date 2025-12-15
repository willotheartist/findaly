import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — findaly",
  description: "Questions or partnerships — contact Findaly.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-(--color-bg)">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="text-xs text-(--color-text-muted)">
          <Link href="/tools" className="underline underline-offset-2">Tools</Link>
          <span className="mx-1">/</span>
          <span>Contact</span>
        </div>

        <h1 className="mt-3 text-3xl font-semibold">Contact</h1>
        <p className="mt-3 text-sm text-(--color-text-muted)">
          For partnerships, corrections, or listing requests, use the submit form or email us.
        </p>

        <div className="mt-6 rounded-2xl border border-black/5 bg-(--color-surface) p-5 text-sm">
          <p>
            Email: <span className="font-medium">hello@findaly.com</span> (replace later)
          </p>
          <p className="mt-2">
            Prefer a form?{" "}
            <Link href="/submit" className="underline underline-offset-2">
              Submit a tool →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
