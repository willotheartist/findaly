import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getCategoryInternalLinks, type LinkItem } from "@/lib/internalLinking/engine";
import { ArrowUpRight, Boxes, Layers, Sparkles } from "lucide-react";
import type { Prisma } from "@prisma/client";

type Props = {
  params: Promise<{ category: string }>;
};

function titleCaseFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function buildCategoryComparisons(tools: Array<{ slug: string; name: string }>) {
  const top = tools.slice(0, 6);
  const links: Array<{ href: string; label: string }> = [];

  const idxPairs: Array<[number, number]> = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];

  for (const [i, j] of idxPairs) {
    const a = top[i];
    const b = top[j];
    if (!a || !b) continue;
    links.push({
      href: `/compare/${a.slug}-vs-${b.slug}`,
      label: `${a.name} vs ${b.name}`,
    });
    if (links.length >= 8) break;
  }

  return links;
}

function topUseCasesFromTools(
  tools: Array<{ useCases: Array<{ id: string; name: string; slug: string }> }>,
  limit = 10,
) {
  const counts = new Map<string, { name: string; slug: string; count: number }>();

  for (const t of tools) {
    for (const u of t.useCases ?? []) {
      const curr = counts.get(u.id);
      if (!curr) counts.set(u.id, { name: u.name, slug: u.slug, count: 1 });
      else curr.count += 1;
    }
  }

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}

function HorizontalCards({
  title,
  subtitle,
  items,
  icon,
}: {
  title: string;
  subtitle?: string;
  items: Array<{ href: string; label: string; meta?: string }>;
  icon?: React.ReactNode;
}) {
  if (!items?.length) return null;

  return (
    <section className="mt-10 md:mt-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
              {title}
            </p>
            {subtitle ? (
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-white md:text-xl">
                {subtitle}
              </h2>
            ) : null}
          </div>
        </div>

        <div className="mt-5 -mx-6 px-6">
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {items.map((x) => (
              <Link
                key={x.href}
                href={x.href}
                className="snap-start shrink-0 w-[320px] md:w-[360px] rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/7 no-underline"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{x.label}</div>
                    {x.meta ? <div className="mt-2 text-xs text-white/55">{x.meta}</div> : null}
                  </div>

                  <div className="shrink-0 rounded-full border border-white/10 bg-white/5 p-2 text-white/70">
                    {icon ?? <ArrowUpRight size={16} className="opacity-80" />}
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] px-4 py-3 text-sm font-medium text-white/75">
                  Open →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> },
): Promise<Metadata> {
  const { category } = await params;
  const categorySlug = category ? decodeURIComponent(category) : "";
  const categoryName = titleCaseFromSlug(categorySlug || "Tools");

  return {
    title: `${categoryName} tools — best software in ${categoryName}`,
    description: `Browse the best ${categoryName} tools. Compare pricing, features, and find the right option fast.`,
    openGraph: { title: `${categoryName} tools`, type: "website" },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: rawCategory } = await params;

  const categorySlug = rawCategory ? decodeURIComponent(rawCategory) : "";
  if (!categorySlug) notFound();

  const cat = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });
  if (!cat) notFound();

  const internal = await getCategoryInternalLinks(categorySlug);

  // Prisma enum export is weird in your build, so type it via Prisma input type
  const ACTIVE_STATUS = "ACTIVE" as unknown as Prisma.ToolWhereInput["status"];

  const tools = await prisma.tool.findMany({
    where: {
      status: ACTIVE_STATUS,
      primaryCategoryId: cat.id,
    },
    include: { useCases: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });

  if (!tools.length) notFound();

  const compareLinks = buildCategoryComparisons(tools.map((t) => ({ slug: t.slug, name: t.name })));
  const topUseCases = topUseCasesFromTools(tools, 10);

  const bestLinks = topUseCases.map((u) => ({
    href: `/best/${cat.slug}-tools-for-${u.slug}`,
    label: `${cat.name} tools for ${u.name}`,
    meta: `${u.count} tools match`,
  }));

  const exploreLinks: Array<{ href: string; label: string; meta?: string }> = [
    ...(internal?.best ?? []).slice(0, 6).map((x: LinkItem) => ({
      href: x.href,
      label: x.label,
      meta: "Best list",
    })),
    ...(internal?.useCases ?? []).slice(0, 6).map((x: LinkItem) => ({
      href: x.href,
      label: x.label,
      meta: "Use case",
    })),
    ...(internal?.comparisons ?? []).slice(0, 6).map((x: LinkItem) => ({
      href: x.href,
      label: x.label,
      meta: "Comparison",
    })),
    ...(internal?.alternatives ?? []).slice(0, 6).map((x: LinkItem) => ({
      href: x.href,
      label: x.label,
      meta: "Alternatives",
    })),
  ].slice(0, 10);

  return (
    <main className="min-h-screen bg-(--bg) text-(--text)">
      <div className="pointer-events-none absolute left-0 right-0 top-0 -z-10 h-[760px] bg-[radial-gradient(1000px_380px_at_50%_0%,rgba(255,255,255,0.10),rgba(0,0,0,0))]" />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-20">
        <div className="text-xs text-white/50">
          <Link href="/tools" className="text-white/60 hover:text-white no-underline">
            Tools
          </Link>
          <span className="mx-1">/</span>
          <span className="text-white/70">{cat.name}</span>
        </div>

        <section className="mt-6 text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <Layers size={14} className="opacity-80" />
            Category
          </p>

          <h1 className="mx-auto mt-7 max-w-4xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {cat.name} tools
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
            Browse {tools.length} tools in {cat.name}. Compare pricing, key features, and shortlist fast.
          </p>

          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="text-xs text-white/55">
                {tools.length} tools • {topUseCases.length} common use cases • Compare & alternatives included
              </div>

              <div className="flex gap-2">
                <Link
                  href="/compare"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-transparent px-4 py-2 text-sm font-medium text-white/85 transition hover:border-white/25 hover:text-white no-underline"
                >
                  Compare <Boxes size={16} className="opacity-80" />
                </Link>

                <Link
                  href="/best"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-[rgba(255,255,255,0.08)] px-4 py-2 text-sm font-medium text-white transition hover:border-white/25 hover:bg-[rgba(255,255,255,0.10)] no-underline"
                >
                  Browse best lists <ArrowUpRight size={16} className="opacity-70" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <HorizontalCards
          title="Explore more"
          subtitle="Shortcuts to keep you moving"
          items={exploreLinks}
          icon={<Sparkles size={16} className="opacity-80" />}
        />

        <HorizontalCards
          title={`Best ${cat.name} tools`}
          subtitle="By use case"
          items={bestLinks}
          icon={<ArrowUpRight size={16} className="opacity-80" />}
        />

        <HorizontalCards
          title={`Popular comparisons`}
          subtitle={`In ${cat.name}`}
          items={compareLinks.map((x) => ({ href: x.href, label: x.label, meta: "Compare finalists" }))}
          icon={<Boxes size={16} className="opacity-80" />}
        />

        <section className="mt-12 md:mt-14">
          <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 md:p-6">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                  Tools
                </p>
                <h2 className="mt-2 text-lg font-semibold tracking-tight text-white md:text-xl">
                  All {cat.name} tools
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {tools.map((t) => (
                <Link
                  key={t.id}
                  href={`/tools/${t.slug}`}
                  className="group block rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/15 hover:bg-white/7 no-underline"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold tracking-tight text-white">
                        {t.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/60 line-clamp-3">
                        {t.shortDescription}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70">
                        {String(t.pricingModel)}
                      </div>
                      {t.startingPrice ? (
                        <div className="mt-2 text-xs text-white/55">{t.startingPrice}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70">
                      {cat.name}
                    </span>

                    {(t.keyFeatures ?? []).slice(0, 2).map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between text-xs text-white/55">
                    <span className="transition group-hover:text-white/70">View tool</span>
                    <span className="transition group-hover:text-white/70">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-white/45">
          © {new Date().getFullYear()} Findaly. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
