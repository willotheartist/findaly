"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ToolLite = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  pricingModel: unknown;
  isFeatured: boolean;
  primaryCategory: { name: string; slug: string } | null;
};

function normalize(s: string) {
  return (s || "").trim().toLowerCase();
}

function scoreMatch(name: string, q: string) {
  const n = normalize(name);
  if (!q) return 0;
  if (n === q) return 100;
  if (n.startsWith(q)) return 80;
  if (n.includes(q)) return 60;
  return 0;
}

export default function AlternativesSearch({ tools }: { tools: ToolLite[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const results = useMemo(() => {
    const qq = normalize(q);
    if (!qq) return [];

    const ranked = tools
      .map((t) => ({
        t,
        s: scoreMatch(t.name, qq),
      }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || a.t.name.localeCompare(b.t.name))
      .slice(0, 12)
      .map((x) => x.t);

    return ranked;
  }, [tools, q]);

  function goTo(slug: string) {
    router.push(`/alternatives/${slug}`);
  }

  function onSubmit() {
    const qq = normalize(q);
    if (!qq) return;

    const exact = tools.find((t) => normalize(t.name) === qq || normalize(t.slug) === qq);
    if (exact) return goTo(exact.slug);

    if (results[0]) return goTo(results[0].slug);
  }

  return (
    <div className="rounded-3xl border border-black/5 bg-(--color-surface) p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActiveIdx(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit();
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIdx((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIdx((i) => Math.max(i - 1, 0));
            }
          }}
          placeholder="Search a tool… (e.g. ClickUp, Notion, Figma)"
          className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-black/20"
        />

        <button
          type="button"
          onClick={onSubmit}
          className="h-12 rounded-2xl border border-black/10 bg-black px-5 text-sm font-medium text-white transition hover:bg-black/90"
        >
          Find alternatives
        </button>
      </div>

      {q && results.length ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">
          {results.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => goTo(t.slug)}
              className={[
                "flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm transition",
                idx !== 0 ? "border-t border-black/10" : "",
                idx === activeIdx ? "bg-black/5" : "bg-white hover:bg-black/3",
              ].join(" ")}
            >
              <div className="min-w-0">
                <div className="font-semibold">{t.name}</div>
                <div className="mt-1 text-xs text-neutral-600 line-clamp-2">{t.shortDescription}</div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                  {t.primaryCategory?.name ?? "Tools"} · {String(t.pricingModel)}
                </div>
              </div>
              <div className="shrink-0 text-xs text-neutral-500">→</div>
            </button>
          ))}
        </div>
      ) : q ? (
        <div className="mt-4 text-sm text-(--color-text-muted)">
          No matches yet. Try a different spelling.
        </div>
      ) : (
        <div className="mt-4 text-sm text-(--color-text-muted)">
          Start typing to see suggestions.
        </div>
      )}
    </div>
  );
}
