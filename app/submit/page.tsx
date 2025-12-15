"use client";

import { useState } from "react";
import Link from "next/link";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; id: string }
  | { kind: "error"; message: string };

export default function SubmitPage() {
  const [state, setState] = useState<State>({ kind: "idle" });

  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ kind: "loading" });

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        websiteUrl: websiteUrl || undefined,
        category: category || undefined,
        notes: notes || undefined,
        email: email || undefined,
      }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      setState({ kind: "error", message: json?.error || "Something went wrong" });
      return;
    }

    setState({ kind: "success", id: String(json?.submission?.id ?? "") });
    setName("");
    setWebsiteUrl("");
    setCategory("");
    setNotes("");
    setEmail("");
  }

  return (
    <main className="min-h-screen bg-(--color-bg)">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="text-xs text-(--color-text-muted)">
          <Link href="/" className="underline underline-offset-2">
            Home
          </Link>
          <span className="mx-1">/</span>
          <span>Submit</span>
        </div>

        <h1 className="mt-3 text-3xl font-semibold">Submit a tool</h1>
        <p className="mt-2 text-sm text-(--color-text-muted)">
          Add a tool to Findaly. We’ll review it and publish a draft.
        </p>

        <form onSubmit={onSubmit} className="mt-8 rounded-2xl border border-black/10 bg-(--color-surface) p-6">
          <div className="grid gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium">Tool name *</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none"
                placeholder="e.g. Linear"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Website URL</span>
              <input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none"
                placeholder="https://example.com"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Category</span>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none"
                placeholder="e.g. Project Management"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Notes</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px] rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none"
                placeholder="What does it do? Who is it for? Pricing?"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Email (optional)</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none"
                placeholder="you@company.com"
              />
            </label>

            <button
              type="submit"
              disabled={state.kind === "loading"}
              className="rounded-xl bg-(--color-accent) px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {state.kind === "loading" ? "Submitting…" : "Submit"}
            </button>

            {state.kind === "success" ? (
              <div className="text-sm text-(--color-text-muted)">
                ✅ Submitted! (id: <span className="font-mono">{state.id || "—"}</span>)
              </div>
            ) : null}

            {state.kind === "error" ? (
              <div className="text-sm text-red-400">❌ {state.message}</div>
            ) : null}
          </div>
        </form>
      </div>
    </main>
  );
}
