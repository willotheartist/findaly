// app/searches/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Trash2, Pencil, Search, LogIn } from "lucide-react";

type SavedSearch = {
  id: string;
  name: string;
  kind: string;
  replayUrl: string;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string | null;
};

export default function SearchesPage() {
  const [loading, setLoading] = useState(true);
  const [unauth, setUnauth] = useState(false);
  const [rows, setRows] = useState<SavedSearch[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  async function load(signal?: AbortSignal) {
    setLoading(true);
    setError(null);
    setUnauth(false);

    const res = await fetch("/api/searches?kind=BUY", { method: "GET", signal }).catch((e) => {
      // If aborted, just exit quietly
      if (e instanceof DOMException && e.name === "AbortError") return null;
      throw e;
    });

    if (!res) return;

    if (res.status === 401) {
      setUnauth(true);
      setRows([]);
      setLoading(false);
      return;
    }

    const data: unknown = await res.json().catch(() => ({}));
    const obj = (data && typeof data === "object") ? (data as Record<string, unknown>) : {};

    if (!res.ok) {
      setError(String(obj?.error ?? "FAILED_TO_LOAD"));
      setRows([]);
      setLoading(false);
      return;
    }

    const searches = Array.isArray(obj?.searches) ? (obj.searches as SavedSearch[]) : [];
    setRows(searches);
    setLoading(false);
  }

  useEffect(() => {
    const controller = new AbortController();

    // Avoid calling setState synchronously inside effect body per lint rule
    const t = window.setTimeout(() => {
      void load(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(t);
      controller.abort();
    };
  }, []);

  const hasRows = rows.length > 0;

  const emptyState = useMemo(() => {
    if (unauth) {
      return {
        title: "Sign in to view saved searches",
        desc: "Saved searches are tied to your account, so they work across devices.",
        ctaHref: "/login",
        ctaLabel: "Sign in",
        ctaIcon: LogIn,
      };
    }
    return {
      title: "No saved searches yet",
      desc: "Go to Buy, apply filters, then hit “Save search”.",
      ctaHref: "/buy",
      ctaLabel: "Browse boats",
      ctaIcon: ArrowRight,
    };
  }, [unauth]);

  async function onDelete(id: string) {
    const ok = confirm("Delete this saved search?");
    if (!ok) return;

    const res = await fetch(`/api/searches/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) {
      const data: unknown = await res.json().catch(() => ({}));
      const obj = (data && typeof data === "object") ? (data as Record<string, unknown>) : {};
      alert(String(obj?.error ?? "DELETE_FAILED"));
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function startRename(r: SavedSearch) {
    setRenamingId(r.id);
    setRenameValue(r.name);
  }

  async function commitRename() {
    if (!renamingId) return;
    const name = renameValue.trim();
    if (!name) return alert("Name required");

    const res = await fetch(`/api/searches/${encodeURIComponent(renamingId)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const data: unknown = await res.json().catch(() => ({}));
      const obj = (data && typeof data === "object") ? (data as Record<string, unknown>) : {};
      alert(String(obj?.error ?? "RENAME_FAILED"));
      return;
    }

    setRows((prev) => prev.map((r) => (r.id === renamingId ? { ...r, name } : r)));
    setRenamingId(null);
    setRenameValue("");
  }

  return (
    <main className="w-full bg-white">
      <section className="relative w-full overflow-hidden bg-linear-to-br from-slate-50 via-white to-orange-50/30">
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="mb-4 text-sm text-slate-600">
            <Link href="/" className="no-underline hover:text-slate-900">
              Home
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="font-semibold text-slate-900">Searches</span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Saved searches</h1>
              <div className="mt-2 text-sm text-slate-600">
                {unauth
                  ? "Sign in to access your saved searches."
                  : hasRows
                    ? `${rows.length} saved search${rows.length === 1 ? "" : "es"}`
                    : "Save searches from the Buy page to get back to them fast."}
              </div>
            </div>

            <Link
              href="/buy"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff6a00] px-5 py-3 text-sm font-semibold text-white no-underline hover:brightness-110"
            >
              <Search className="h-4 w-4" />
              Go to Buy
            </Link>
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                Loading…
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-700">
                {error}
              </div>
            ) : !hasRows ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <div className="text-lg font-bold text-slate-900">{emptyState.title}</div>
                <div className="mt-2 text-sm text-slate-600">{emptyState.desc}</div>

                <Link
                  href={emptyState.ctaHref}
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:brightness-110"
                >
                  <emptyState.ctaIcon className="h-4 w-4" />
                  {emptyState.ctaLabel}
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {rows.map((r) => (
                  <div key={r.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="truncate text-base font-bold text-slate-900">{r.name}</div>
                        <div className="mt-1 truncate text-sm text-slate-600">{r.replayUrl}</div>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        <Link
                          href={r.replayUrl}
                          className="inline-flex items-center gap-2 rounded-2xl bg-[#ff6a00] px-4 py-2.5 text-sm font-semibold text-white no-underline hover:brightness-110"
                        >
                          Open
                          <ArrowRight className="h-4 w-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => startRename(r)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-300"
                        >
                          <Pencil className="h-4 w-4 text-slate-500" />
                          Rename
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(r.id)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-300"
                        >
                          <Trash2 className="h-4 w-4 text-slate-500" />
                          Delete
                        </button>
                      </div>
                    </div>

                    {renamingId === r.id ? (
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <input
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-slate-300"
                          placeholder="Saved search name"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setRenamingId(null);
                              setRenameValue("");
                            }}
                            className="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 hover:border-slate-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={commitRename}
                            className="h-12 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white hover:brightness-110"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
