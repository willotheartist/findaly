import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { PricingModel } from "@prisma/client";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function decode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function parseBestSlug(slug: string) {
  const s = decode(slug || "").trim();
  const marker = "-tools-for-";
  const idx = s.indexOf(marker);
  if (idx === -1) return null;

  const categorySlug = s.slice(0, idx).trim();
  const useCaseSlug = s.slice(idx + marker.length).trim();

  if (!categorySlug || !useCaseSlug) return null;
  return { categorySlug, useCaseSlug };
}

function titleCase(s: string) {
  return (s || "")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}

function uniqueTop(arr: (string | null | undefined)[], n: number) {
  return Array.from(new Set(arr.map((x) => (x ?? "").trim()).filter(Boolean))).slice(0, n);
}

function scoreToolForUseCase(tool: {
  useCases: { slug: string }[];
  targetAudience: string[];
  keyFeatures: string[];
  integrations: string[];
  isFeatured: boolean;
}) {
  let score = 0;
  if (tool.isFeatured) score += 10;
  score += Math.min(tool.useCases.length, 6);
  score += Math.min((tool.keyFeatures ?? []).length, 12) / 3;
  score += Math.min((tool.integrations ?? []).length, 12) / 4;
  score += Math.min((tool.targetAudience ?? []).length, 8) / 4;
  return Math.round(score * 10) / 10;
}

type PricingKey = "free" | "freemium" | "paid" | "enterprise";
const PRICING_OPTIONS: Array<{ key: PricingKey; label: string; value: PricingModel }> = [
  { key: "free", label: "Free", value: PricingModel.FREE },
  { key: "freemium", label: "Freemium", value: PricingModel.FREEMIUM },
  { key: "paid", label: "Paid", value: PricingModel.PAID },
  { key: "enterprise", label: "Enterprise", value: PricingModel.ENTERPRISE },
];

function parsePricingFilter(input: unknown): PricingModel[] | null {
  const raw = Array.isArray(input) ? input.join(",") : String(input ?? "");
  const cleaned = raw
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);

  if (!cleaned.length) return null;

  const mapped = cleaned
    .map((k) => PRICING_OPTIONS.find((p) => p.key === k)?.value)
    .filter(Boolean) as PricingModel[];

  return mapped.length ? Array.from(new Set(mapped)) : null;
}

function clampInt(x: unknown, { min, max, fallback }: { min: number; max: number; fallback: number }) {
  const n = Number(x);
  if (!Number.isFinite(n)) return fallback;
  const i = Math.floor(n);
  return Math.min(max, Math.max(min, i));
}

function buildHref(basePath: string, qp: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(qp)) {
    if (!v) continue;
    params.set(k, v);
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug: raw } = await params;
  const parsed = parseBestSlug(raw);
  if (!parsed) return { title: "Best tools" };

  const { categorySlug, useCaseSlug } = parsed;

  const [category, useCase] = await Promise.all([
    prisma.category.findUnique({ where: { slug: categorySlug } }),
    prisma.useCase.findUnique({ where: { slug: useCaseSlug } }),
  ]);

  const categoryName = category?.name ?? titleCase(categorySlug);
  const useCaseName = useCase?.name ?? titleCase(useCaseSlug);

  const title = `Best ${categoryName} tools for ${useCaseName} (2025)`;
  const description = `Compare the top ${categoryName} tools for ${useCaseName}: pricing models, key features, integrations, and alternatives.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function BestPage({ params, searchParams }: Props) {
  const { slug: raw } = await params;
  const parsed = parseBestSlug(raw);
  if (!parsed) notFound();

  const sp = (await searchParams) ?? {};
  const { categorySlug, useCaseSlug } = parsed;

  const [category, useCase] = await Promise.all([
    prisma.category.findUnique({ where: { slug: categorySlug } }),
    prisma.useCase.findUnique({ where: { slug: useCaseSlug } }),
  ]);

  if (!category || !useCase) notFound();

  const pricingIn = parsePricingFilter(sp.pricing);
  const page = clampInt(sp.page, { min: 1, max: 200, fallback: 1 });
  const perPage = 12;
  const skip = (page - 1) * perPage;

  const ACTIVE_STATUS = "ACTIVE" as unknown as Prisma.ToolWhereInput["status"];

  const where: Prisma.ToolWhereInput = {
    status: ACTIVE_STATUS,
    primaryCategoryId: category.id,
    useCases: { some: { id: useCase.id } },
    ...(pricingIn ? { pricingModel: { in: pricingIn } } : {}),
  };

  const [total, tools] = await Promise.all([
    prisma.tool.count({ where }),
    prisma.tool.findMany({
      where,
      include: { useCases: true },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
      skip,
      take: perPage,
    }),
  ]);

  if (!tools.length) notFound();

  const ranked = tools
    .map((t) => ({
      ...t,
      _score: scoreToolForUseCase({
        useCases: t.useCases,
        targetAudience: t.targetAudience ?? [],
        keyFeatures: t.keyFeatures ?? [],
        integrations: t.integrations ?? [],
        isFeatured: t.isFeatured,
      }),
    }))
    .sort((a, b) => b._score - a._score || (a.name > b.name ? 1 : -1));

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const comparePairs: Array<{ a: { slug: string; name: string }; b: { slug: string; name: string } }> = [];
  for (let i = 0; i < Math.min(ranked.length, 6) - 1; i++) {
    const a = ranked[i]!;
    const b = ranked[i + 1]!;
    comparePairs.push({ a, b });
    if (comparePairs.length >= 6) break;
  }

  const basePath = `/best/${category.slug}-tools-for-${useCase.slug}`;
  const pricingParam =
    pricingIn && pricingIn.length
      ? PRICING_OPTIONS.filter((p) => pricingIn.includes(p.value)).map((p) => p.key).join(",")
      : undefined;

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best ${category.name} tools for ${useCase.name}`,
    itemListElement: ranked.map((t, i) => ({
      "@type": "ListItem",
      position: skip + i + 1,
      name: t.name,
      url: `/tools/${t.slug}`,
    })),
  };

  const faqs = [
    {
      q: `What are the best ${category.name} tools for ${useCase.name}?`,
      a: `This page ranks active ${category.name} tools tagged for ${useCase.name}, using pricing, feature completeness, integrations, audience fit, and featured signals.`,
    },
    {
      q: "How do I choose the right tool quickly?",
      a: "Start with pricing model, then scan the standout feature and integrations. If you’re unsure, open 2–3 comparisons from the quick links and check alternatives for each finalist.",
    },
    {
      q: "Are these tools sorted by reviews?",
      a: "Not yet. The current order is a decision-first heuristic. Later we can add user ratings, verified listings, and curated rankings per use case.",
    },
  ];

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="min-h-screen bg-(--color-bg)">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-xs text-(--color-text-muted)">
          <Link href="/tools" className="underline underline-offset-2">
            Tools
          </Link>
          <span className="mx-1">/</span>
          <Link href={`/tools/category/${category.slug}`} className="underline underline-offset-2">
            {category.name}
          </Link>
          <span className="mx-1">/</span>
          <span>Best for {useCase.name}</span>
        </div>

        <h1 className="mt-3 text-3xl font-semibold">
          Best {category.name} tools for {useCase.name}
        </h1>

        <p className="mt-2 max-w-3xl text-sm text-(--color-text-muted)">
          Decision-first shortlist: pricing model, key features, integrations, and fast paths to comparisons and alternatives.
        </p>

        <section className="mt-6 rounded-2xl border border-black/5 bg-(--color-surface) p-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
            Filter by pricing
          </h2>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link
              href={buildHref(basePath, { page: "1" })}
              className="rounded-full border border-black/10 bg-(--color-surface) px-3 py-1 underline underline-offset-2"
            >
              All
            </Link>

            {PRICING_OPTIONS.map((p) => {
              const active = pricingIn?.includes(p.value) ?? false;

              const currentKeys = (pricingParam ?? "")
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean);

              const nextKeys = active
                ? currentKeys.filter((k) => k !== p.key)
                : Array.from(new Set([...currentKeys, p.key]));

              const nextPricing = nextKeys.length ? nextKeys.join(",") : undefined;

              return (
                <Link
                  key={p.key}
                  href={buildHref(basePath, { pricing: nextPricing, page: "1" })}
                  className={[
                    "rounded-full border px-3 py-1 underline underline-offset-2",
                    active ? "border-black/25 bg-black/5" : "border-black/10 bg-(--color-surface)",
                  ].join(" ")}
                >
                  {p.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-3 text-xs text-(--color-text-muted)">
            Showing <span className="font-medium text-(--color-text-main)">{total}</span> tools
            {pricingIn?.length ? " (filtered)" : ""}.
          </div>
        </section>

        {comparePairs.length ? (
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            {comparePairs.map((p) => (
              <Link
                key={`${p.a.slug}-${p.b.slug}`}
                href={`/compare/${p.a.slug}-vs-${p.b.slug}`}
                className="rounded-full border border-black/10 bg-(--color-surface) px-3 py-1 underline underline-offset-2"
              >
                {p.a.name} vs {p.b.name}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {ranked.map((t, idx) => {
            const bestFor = uniqueTop(t.targetAudience ?? [], 2).join(" & ");
            const topFeature = uniqueTop(t.keyFeatures ?? [], 1)[0];
            const topIntegrations = uniqueTop(t.integrations ?? [], 3);

            const topTool = ranked[0];
            const neighbor = ranked[idx + 1] ?? ranked[idx - 1] ?? null;

            const compareTargets = [
              topTool && topTool.slug !== t.slug ? topTool : null,
              neighbor && neighbor.slug !== t.slug ? neighbor : null,
            ].filter(Boolean) as Array<{ slug: string; name: string }>;

            return (
              <div key={t.id} className="rounded-2xl border border-black/5 bg-(--color-surface) p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold">
                      <Link href={`/tools/${t.slug}`} className="underline underline-offset-2">
                        {t.name}
                      </Link>
                    </h2>
                    <p className="mt-2 text-sm text-(--color-text-muted)">{t.shortDescription}</p>
                  </div>

                  <span className="shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-(--color-text-muted)">
                    {String(t.pricingModel)}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex flex-wrap gap-2">
                    {bestFor ? (
                      <span className="rounded-full border border-black/10 bg-(--color-surface) px-3 py-1 text-xs">
                        Best for: {bestFor}
                      </span>
                    ) : null}

                    {topFeature ? (
                      <span className="rounded-full border border-black/10 bg-(--color-surface) px-3 py-1 text-xs">
                        Standout: {topFeature}
                      </span>
                    ) : null}

                    {t.startingPrice ? (
                      <span className="rounded-full border border-black/10 bg-(--color-surface) px-3 py-1 text-xs">
                        Starting: {t.startingPrice}
                      </span>
                    ) : null}
                  </div>

                  {topIntegrations.length ? (
                    <div className="text-xs text-(--color-text-muted)">
                      Integrations: {topIntegrations.join(", ")}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {compareTargets.map((ct) => (
                    <Link
                      key={`${t.slug}-vs-${ct.slug}`}
                      href={`/compare/${t.slug}-vs-${ct.slug}`}
                      className="rounded-full border border-black/10 bg-(--color-surface) px-3 py-1 underline underline-offset-2"
                    >
                      Compare vs {ct.name}
                    </Link>
                  ))}

                  <Link
                    href={`/alternatives/${t.slug}`}
                    className="rounded-full border border-black/10 bg-(--color-surface) px-3 py-1 underline underline-offset-2"
                  >
                    Alternatives
                  </Link>

                  <Link
                    href={`/tools/${t.slug}`}
                    className="rounded-full border border-black/10 bg-(--color-surface) px-3 py-1 underline underline-offset-2"
                  >
                    Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 ? (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="text-(--color-text-muted)">
              Page <span className="font-medium text-(--color-text-main)">{page}</span> of{" "}
              <span className="font-medium text-(--color-text-main)">{totalPages}</span>
            </div>

            <div className="flex gap-2">
              {page > 1 ? (
                <Link
                  href={buildHref(basePath, { pricing: pricingParam, page: String(page - 1) })}
                  className="rounded-xl border border-black/10 bg-(--color-surface) px-4 py-2 underline underline-offset-2"
                >
                  ← Prev
                </Link>
              ) : null}

              {page < totalPages ? (
                <Link
                  href={buildHref(basePath, { pricing: pricingParam, page: String(page + 1) })}
                  className="rounded-xl border border-black/10 bg-(--color-surface) px-4 py-2 underline underline-offset-2"
                >
                  Next →
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}

        <section className="mt-12 rounded-2xl border border-black/5 bg-(--color-surface) p-5">
          <h2 className="text-sm font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4 text-sm">
            {faqs.map((f) => (
              <div key={f.q}>
                <div className="font-medium">{f.q}</div>
                <div className="mt-1 text-(--color-text-muted)">{f.a}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 text-sm">
          <Link href={`/tools/category/${category.slug}`} className="underline underline-offset-2">
            Browse all {category.name} tools →
          </Link>
        </div>
      </div>
    </main>
  );
}
