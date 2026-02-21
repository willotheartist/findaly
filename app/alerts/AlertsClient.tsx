"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Bell, LogIn, Trash2 } from "lucide-react";

type AlertRow = {
  id: string;
  name: string;
  kind: string;
  replayUrl: string;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string | null;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}

export default function AlertsClient() {
  const [loading, setLoading] = useState(true);
  const [unauth, setUnauth] = useState(false);
  const [rows, setRows] = useState<AlertRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load(signal?: AbortSignal) {
    setLoading(true);
    setError(null);
    setUnauth(false);

    const res = await fetch("/api/searches?kind=ALERT", {
      method: "GET",
      signal,
    }).catch((e) => {
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
    const obj = isRecord(data) ? data : {};

    if (!res.ok) {
      setError(String(obj.error ?? "FAILED_TO_LOAD"));
      setRows([]);
      setLoading(false);
      return;
    }

    const itemsRaw = obj.searches;
    const items = Array.isArray(itemsRaw) ? (itemsRaw as AlertRow[]) : [];
    setRows(items);
    setLoading(false);
  }

  useEffect(() => {
    const controller = new AbortController();
    const t = window.setTimeout(() => void load(controller.signal), 0);

    return () => {
      window.clearTimeout(t);
      controller.abort();
    };
  }, []);

  const hasRows = rows.length > 0;

  const emptyState = useMemo(() => {
    if (unauth) {
      return {
        title: "Sign in to view alerts",
        desc: "Alerts are tied to your account so they work across devices.",
        ctaHref: "/login",
        ctaLabel: "Sign in",
        ctaIcon: LogIn,
      };
    }
    return {
      title: "No alerts yet",
      desc: "Create alerts from the Buy page by saving a search as an alert.",
      ctaHref: "/buy",
      ctaLabel: "Browse boats",
      ctaIcon: ArrowRight,
    };
  }, [unauth]);

  async function onDelete(id: string) {
    const ok = confirm("Delete this alert?");
    if (!ok) return;

    const res = await fetch(`/api/searches/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data: unknown = await res.json().catch(() => ({}));
      const obj = isRecord(data) ? data : {};
      alert(String(obj.error ?? "DELETE_FAILED"));
      return;
    }

    setRows((prev) => prev.filter((r) => r.id !== id));
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
            <span className="font-semibold text-slate-900">Alerts</span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Alerts
              </h1>
              <div className="mt-2 text-sm text-slate-600">
                {unauth
                  ? "Sign in to access your alerts."
                  : hasRows
                    ? `${rows.length} alert${rows.length === 1 ? "" : "s"}`
                    : "Create alerts from saved searches to get notified about new listings."}
              </div>
            </div>

            <Link
              href="/buy"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff6a00] px-5 py-3 text-sm font-semibold text-white no-underline hover:brightness-110"
            >
              <Bell className="h-4 w-4" />
              Create an alert
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
                <div className="text-lg font-bold text-slate-900">
                  {emptyState.title}
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {emptyState.desc}
                </div>

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
                  <div
                    key={r.id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="truncate text-base font-bold text-slate-900">
                          {r.name}
                        </div>
                        <div className="mt-1 truncate text-sm text-slate-600">
                          {r.replayUrl}
                        </div>
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
                          onClick={() => onDelete(r.id)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-300"
                        >
                          <Trash2 className="h-4 w-4 text-slate-500" />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-slate-500">
                      Updated{" "}
                      {new Date(r.updatedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
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