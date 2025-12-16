"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; id: string; createdAt: string }
  | { kind: "error"; message: string };

type CategoryOption = { name: string; slug: string };

type DuplicateHit =
  | null
  | { tool: { slug: string; name: string; websiteUrl: string | null } };

type Suggestion =
  | null
  | {
      suggestedName?: string;
      hostname?: string;
      normalizedUrl?: string;
    };

function slugify(s: string) {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getHostname(url: string) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function SubmitPage() {
  const [state, setState] = useState<State>({ kind: "idle" });

  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");

  // Categories
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categorySlug, setCategorySlug] = useState<string>("");
  const [categoryOther, setCategoryOther] = useState<string>("");

  // Smart helpers
  const [duplicate, setDuplicate] = useState<DuplicateHit>(null);
  const [suggest, setSuggest] = useState<Suggestion>(null);

  // Debounce refs
  const dupTimer = useRef<number | null>(null);
  const suggestTimer = useRef<number | null>(null);

  const categoryValue = useMemo(() => {
    if (categorySlug === "__other__") return (categoryOther || "").trim();
    const c = categories.find((x) => x.slug === categorySlug);
    return c?.name ?? "";
  }, [categorySlug, categoryOther, categories]);

  const websiteHost = useMemo(() => getHostname(websiteUrl), [websiteUrl]);

  // Fetch categories once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/categories", { method: "GET" });
      if (!res.ok) return;
      const json = (await res.json().catch(() => null)) as { categories?: CategoryOption[] } | null;
      if (cancelled) return;

      const list = (json?.categories ?? []).filter(Boolean);
      setCategories(list);

      // choose a sane default if none
      if (!categorySlug && list.length) setCategorySlug(list[0]!.slug);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autofill from website URL (best effort) + normalize URL
  useEffect(() => {
    if (suggestTimer.current) window.clearTimeout(suggestTimer.current);

    const url = websiteUrl.trim();
    if (!url) {
      setSuggest(null);
      return;
    }

    suggestTimer.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/submissions/suggest?url=${encodeURIComponent(url)}`);
        const json = (await res.json().catch(() => null)) as Suggestion;
        if (!json) return;

        setSuggest(json);

        // Normalize URL in input (only if it changed meaningfully)
        if (json.normalizedUrl && json.normalizedUrl !== websiteUrl) {
          setWebsiteUrl(json.normalizedUrl);
        }

        // If name is empty, apply suggested name
        if (!name.trim() && json.suggestedName) {
          setName(json.suggestedName);
        }

        // If category not chosen (or empty), don’t auto-pick for now (keeps it simple)
      } catch {
        // ignore
      }
    }, 350);

    return () => {
      if (suggestTimer.current) window.clearTimeout(suggestTimer.current);
    };
  }, [websiteUrl]); // intentionally not including name

  // Duplicate detection (by websiteUrl and/or name)
  useEffect(() => {
    if (dupTimer.current) window.clearTimeout(dupTimer.current);

    const n = name.trim();
    const u = websiteUrl.trim();

    if (!n && !u) {
      setDuplicate(null);
      return;
    }

    dupTimer.current = window.setTimeout(async () => {
      try {
        const qs = new URLSearchParams();
        if (n) qs.set("name", n);
        if (u) qs.set("websiteUrl", u);

        const res = await fetch(`/api/tools/duplicate?${qs.toString()}`);
        const json = (await res.json().catch(() => null)) as DuplicateHit;
        setDuplicate(json);
      } catch {
        setDuplicate(null);
      }
    }, 350);

    return () => {
      if (dupTimer.current) window.clearTimeout(dupTimer.current);
    };
  }, [name, websiteUrl]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // If we found a duplicate, don’t hard-block, but strongly nudge.
    setState({ kind: "loading" });

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        websiteUrl: websiteUrl.trim() || undefined,
        category: categoryValue || undefined,
        notes: notes.trim() || undefined,
        email: email.trim() || undefined,
      }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      setState({ kind: "error", message: json?.error || "Something went wrong" });
      return;
    }

    const id = String(json?.submission?.id ?? "");
    setState({ kind: "success", id, createdAt: new Date().toISOString() });

    // Reset form, but keep categories loaded
    setName("");
    setWebsiteUrl("");
    setCategoryOther("");
    if (categories.length) setCategorySlug(categories[0]!.slug);
    setNotes("");
    setEmail("");
    setDuplicate(null);
    setSuggest(null);
  }

  return (
    <main className="min-h-screen bg-(--color-bg)">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-xs text-(--color-text-muted)">
          <Link href="/" className="underline underline-offset-2">
            Home
          </Link>
          <span className="mx-1">/</span>
          <span>Submit</span>
        </div>

        <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Submit a tool</h1>
            <p className="mt-2 max-w-2xl text-sm text-(--color-text-muted)">
              Add a tool to Findaly. We’ll review it and publish a draft listing.
            </p>
          </div>

          <div className="text-xs text-(--color-text-muted)">
            Takes ~30 seconds. No account required.
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-5">
          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="md:col-span-3 rounded-2xl border border-black/10 bg-(--color-surface) p-6"
          >
            <div className="grid gap-4">
              {/* Duplicate warning (soft) */}
              {duplicate?.tool ? (
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4 text-sm">
                  <div className="font-medium">Looks like this tool may already exist.</div>
                  <div className="mt-1 text-(--color-text-muted)">
                    Found:{" "}
                    <Link
                      className="underline underline-offset-2"
                      href={`/tools/${duplicate.tool.slug}`}
                      target="_blank"
                    >
                      {duplicate.tool.name}
                    </Link>
                    {duplicate.tool.websiteUrl ? (
                      <span className="opacity-70"> · {getHostname(duplicate.tool.websiteUrl)}</span>
                    ) : null}
                  </div>
                  <div className="mt-2 text-xs text-(--color-text-muted)">
                    If you’re sure it’s different, you can still submit.
                  </div>
                </div>
              ) : null}

              <label className="grid gap-1">
                <span className="text-sm font-medium">Tool name *</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:border-black/20"
                  placeholder="e.g. Linear"
                />
                {suggest?.suggestedName && !name.trim() ? (
                  <span className="text-xs text-(--color-text-muted)">
                    Suggested from URL: {suggest.suggestedName}
                  </span>
                ) : null}
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-medium">Website URL</span>
                <input
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:border-black/20"
                  placeholder="https://example.com"
                />
                {websiteHost ? (
                  <span className="text-xs text-(--color-text-muted)">
                    We’ll use <span className="font-mono">{websiteHost}</span> to help autofill & detect duplicates.
                  </span>
                ) : null}
              </label>

              <div className="grid gap-2">
                <label className="grid gap-1">
                  <span className="text-sm font-medium">Category</span>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:border-black/20"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                    <option value="__other__">Other…</option>
                  </select>
                </label>

                {categorySlug === "__other__" ? (
                  <label className="grid gap-1">
                    <span className="text-xs text-(--color-text-muted)">Type a category</span>
                    <input
                      value={categoryOther}
                      onChange={(e) => setCategoryOther(e.target.value)}
                      className="rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:border-black/20"
                      placeholder="e.g. Recruiting"
                    />
                  </label>
                ) : null}
              </div>

              <label className="grid gap-1">
                <span className="text-sm font-medium">Notes</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px] rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:border-black/20"
                  placeholder="What does it do? Who is it for? Pricing? Anything we should know."
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-medium">Email (optional)</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:border-black/20"
                  placeholder="you@company.com"
                />
                <span className="text-xs text-(--color-text-muted)">
                  Optional — helps us follow up if something’s unclear.
                </span>
              </label>

              <button
                type="submit"
                disabled={state.kind === "loading"}
                className="rounded-xl bg-(--color-accent) px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
              >
                {state.kind === "loading" ? "Submitting…" : "Submit"}
              </button>

              {/* Legit receipt */}
              {state.kind === "success" ? (
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4 text-sm">
                  <div className="font-medium">Submitted</div>
                  <div className="mt-1 text-(--color-text-muted)">
                    Submission ID: <span className="font-mono">{state.id || "—"}</span>
                  </div>
                  <div className="mt-1 text-(--color-text-muted)">
                    Status: <span className="font-medium">NEW</span> (queued for review)
                  </div>
                  <div className="mt-3 text-xs text-(--color-text-muted)">
                    Next: we’ll review it and create a draft listing.
                  </div>
                </div>
              ) : null}

              {state.kind === "error" ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                  {state.message}
                </div>
              ) : null}
            </div>
          </form>

          {/* Preview */}
          <aside className="md:col-span-2">
            <div className="sticky top-8 rounded-2xl border border-black/10 bg-(--color-surface) p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
                Preview
              </div>

              <div className="mt-4 rounded-2xl border border-black/10 bg-(--color-bg) p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-(--color-text-main)">
                      {name.trim() || "Tool name"}
                    </div>
                    <div className="mt-1 text-sm text-(--color-text-muted)">
                      {websiteHost ? websiteHost : "example.com"}
                    </div>
                  </div>

                  {/* minimal indicator, not pill-heavy */}
                  <div className="text-[11px] text-(--color-text-muted)">{categoryValue || "Category"}</div>
                </div>

                <div className="mt-3 text-sm text-(--color-text-muted) line-clamp-4">
                  {notes.trim() || "A short description will be generated from your notes during review."}
                </div>

                <div className="mt-4 text-xs text-(--color-text-muted)">
                  Draft listing preview — we may edit for clarity.
                </div>
              </div>

              <div className="mt-4 text-xs text-(--color-text-muted)">
                Tip: adding a URL helps us avoid duplicates and speeds up review.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
