// app/tools/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  DollarSign,
  ExternalLink,
  Layers,
  Plug,
  Sparkles,
} from "lucide-react";

import { prisma } from "@/lib/db";
import { getToolInternalLinks, type LinkItem } from "@/lib/internalLinking/engine";
import { getAlternatives } from "@/lib/decision/alternatives";
import ToolLogo from "@/components/ToolLogo";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

function slugifyCategory(category: string) {
  return category.trim().toLowerCase().replace(/\s+/g, "-");
}

function getDomain(url?: string | null) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function uniqueTop(arr: (string | null | undefined)[], n: number) {
  return Array.from(new Set(arr.map((x) => (x ?? "").trim()).filter(Boolean))).slice(0, n);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = rawSlug ? decodeURIComponent(rawSlug) : "";
  if (!slug) return {};

  const tool = await prisma.tool.findUnique({
    where: { slug },
    include: { primaryCategory: true },
  });
  if (!tool) return {};

  const title = `${tool.name} — pricing, features, and alternatives`;
  const description =
    tool.shortDescription ||
    `Compare ${tool.name} pricing, features, integrations, and alternatives.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug ? decodeURIComponent(rawSlug) : "";
  if (!slug) notFound();

  const result = await getAlternatives(slug);
  if (!result) notFound();

  const { tool, alternatives } = result;

  if (tool.status !== "ACTIVE") notFound();

  const internal = await getToolInternalLinks(slug);

  const categoryName = tool.primaryCategory?.name ?? "Tools";
  const categorySlug = tool.primaryCategory?.slug ?? slugifyCategory(categoryName);
  const categoryHref = `/tools/category/${categorySlug}`;

  const compareTargets = alternatives.slice(0, 3);

  const domain = getDomain(tool.websiteUrl);

  const bestForLinks = (tool.useCases ?? [])
    .slice(0, 6)
    .map((u) => ({
      name: u.name,
      href: `/best/${categorySlug}-tools-for-${u.slug}`,
    }));

  const topAudiences = uniqueTop(tool.targetAudience ?? [], 8);
  const topFeatures = uniqueTop(tool.keyFeatures ?? [], 12);
  const topIntegrations = uniqueTop(tool.integrations ?? [], 18);

  return (
    <main className="min-h-screen bg-(--bg) text-(--text)">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex flex-wrap items-center gap-2 text-xs text-white/60">
          <Link href="/tools" className="hover:text-white">
            Tools
          </Link>
          <span className="text-white/30">/</span>
          <Link href={categoryHref} className="hover:text-white">
            {categoryName}
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-white/80">{tool.name}</span>
        </div>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <div className="flex items-start gap-4">
              {/* ✅ Client component handles onError + fallback */}
              <ToolLogo
                name={tool.name}
                logoUrl={tool.logoUrl}
                websiteUrl={tool.websiteUrl}
              />

              <div className="min-w-0">
                <h1 className="text-4xl font-semibold tracking-tight">{tool.name}</h1>

                <p className="mt-3 max-w-2xl text-base text-white/65">
                  {tool.shortDescription ||
                    `Compare ${tool.name} pricing, features, integrations, and alternatives.`}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75">
                    <Layers size={14} />
                    {categoryName}
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75">
                    <DollarSign size={14} />
                    {String(tool.pricingModel)}
                  </span>

                  {tool.startingPrice ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75">
                      <BadgeCheck size={14} />
                      {tool.startingPrice}
                    </span>
                  ) : null}

                  {domain ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75">
                      <ExternalLink size={14} />
                      {domain}
                    </span>
                  ) : null}
                </div>

                {compareTargets.length ? (
                  <div className="mt-5 flex flex-wrap gap-2 text-xs">
                    {compareTargets.map((t) => (
                      <Link
                        key={t.id}
                        href={`/compare/${tool.slug}-vs-${t.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75 hover:border-white/20 hover:text-white"
                      >
                        <Sparkles size={14} />
                        Compare vs {t.name}
                        <ArrowUpRight size={14} className="opacity-60" />
                      </Link>
                    ))}
                  </div>
                ) : null}

                {/* Explore more (internal links) */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                    Explore more
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {internal.category.map((x: LinkItem) => (
                      <Link
                        key={x.href}
                        href={x.href}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75 hover:border-white/20 hover:text-white"
                      >
                        <Layers size={14} />
                        {x.label}
                        <ArrowUpRight size={14} className="opacity-60" />
                      </Link>
                    ))}

                    {internal.alternatives.slice(0, 6).map((x: LinkItem) => (
                      <Link
                        key={x.href}
                        href={x.href}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75 hover:border-white/20 hover:text-white"
                      >
                        <Sparkles size={14} />
                        {x.label}
                        <ArrowUpRight size={14} className="opacity-60" />
                      </Link>
                    ))}

                    {internal.comparisons.map((x: LinkItem) => (
                      <Link
                        key={x.href}
                        href={x.href}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75 hover:border-white/20 hover:text-white"
                      >
                        <Sparkles size={14} />
                        {x.label}
                        <ArrowUpRight size={14} className="opacity-60" />
                      </Link>
                    ))}

                    {internal.best.map((x: LinkItem) => (
                      <Link
                        key={x.href}
                        href={x.href}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75 hover:border-white/20 hover:text-white"
                      >
                        <Boxes size={14} />
                        {x.label}
                        <ArrowUpRight size={14} className="opacity-60" />
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-10 space-y-10">
              <section>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                  Overview
                </p>
                <div className="mt-3 max-w-3xl space-y-4 text-sm leading-relaxed text-white/80">
                  {tool.longDescription ? (
                    <p className="whitespace-pre-line">{tool.longDescription}</p>
                  ) : (
                    <p className="text-white/65">
                      We’re still adding a full breakdown for {tool.name}. For now, use the feature
                      and integration lists below, then jump to alternatives.
                    </p>
                  )}
                </div>
              </section>

              {bestForLinks.length || topAudiences.length ? (
                <section>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                    Best for
                  </p>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                    {bestForLinks.length ? (
                      <div className="flex flex-wrap gap-2 text-xs">
                        {bestForLinks.map((b) => (
                          <Link
                            key={b.href}
                            href={b.href}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75 hover:border-white/20 hover:text-white"
                          >
                            <Sparkles size={14} />
                            {b.name}
                            <ArrowUpRight size={14} className="opacity-60" />
                          </Link>
                        ))}
                      </div>
                    ) : null}

                    {topAudiences.length ? (
                      <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        {topAudiences.map((a) => (
                          <span
                            key={a}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {!bestForLinks.length && !topAudiences.length ? (
                      <p className="text-sm text-white/65">TBD</p>
                    ) : null}
                  </div>
                </section>
              ) : null}

              <section>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                  Key features
                </p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                  {topFeatures.length ? (
                    <ul className="grid gap-3 text-sm text-white/80 sm:grid-cols-2">
                      {topFeatures.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/40" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-white/65">TBD</p>
                  )}
                </div>
              </section>

              <section>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                  Integrations
                </p>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                  {topIntegrations.length ? (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {topIntegrations.map((i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75"
                        >
                          <Plug size={14} />
                          {i}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/65">TBD</p>
                  )}
                </div>
              </section>

              {alternatives.length ? (
                <section>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                    Alternatives
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {alternatives.slice(0, 6).map((t) => (
                      <Link
                        key={t.id}
                        href={`/tools/${t.slug}`}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-white/90">{t.name}</div>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">
                            {String(t.pricingModel)}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-white/65">{t.shortDescription}</p>

                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/60">
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                            Compare →
                          </span>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                            View profile →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4 text-sm">
                    <Link
                      href={`/alternatives/${tool.slug}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/85 hover:border-white/20 hover:text-white"
                    >
                      See all {tool.name} alternatives <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </section>
              ) : null}
            </div>
          </div>

          <aside className="lg:sticky lg:top-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                Quick facts
              </p>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/65">Category</span>
                  <Link href={categoryHref} className="text-white/85 hover:text-white">
                    {categoryName}
                  </Link>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/65">Pricing</span>
                  <span className="text-white/85">{String(tool.pricingModel)}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/65">Starting</span>
                  <span className="text-white/85">{tool.startingPrice ?? "—"}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/65">Integrations</span>
                  <span className="text-white/85">{(tool.integrations ?? []).length || "—"}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/65">Features</span>
                  <span className="text-white/85">{(tool.keyFeatures ?? []).length || "—"}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/65">Use cases</span>
                  <span className="text-white/85">{(tool.useCases ?? []).length || "—"}</span>
                </div>
              </div>

              <div className="mt-5 grid gap-2">
                {tool.websiteUrl ? (
                  <a
                    href={tool.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
                  >
                    Visit website <ArrowUpRight size={16} />
                  </a>
                ) : null}

                <Link
                  href={`/alternatives/${tool.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition hover:border-white/20 hover:text-white"
                >
                  See alternatives <Boxes size={16} />
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
