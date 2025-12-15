import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getAlternatives } from "@/lib/decision/alternatives";
import { getAlternativesInternalLinks, type LinkItem } from "@/lib/internalLinking/engine";
import { ArrowUpRight, Sparkles, Boxes } from "lucide-react";

type AlternativesPageProps = {
  params: Promise<{ slug: string }>;
};

function slugifyCategorySlug(slugOrName: string) {
  return slugOrName.trim().toLowerCase().replace(/\s+/g, "-");
}

function isCheaper(pricingModel: string) {
  const p = String(pricingModel ?? "").toUpperCase();
  return p === "FREE" || p === "FREEMIUM";
}

function initials(name: string) {
  const words = (name || "").split(" ").filter(Boolean);
  const a = words[0]?.[0] ?? "T";
  const b = words[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function MiniLogo({ name }: { name: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-white/85">
      {initials(name)}
    </div>
  );
}

function ChipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 transition hover:border-white/20 hover:bg-white/7 hover:text-white no-underline"
    >
      {children}
    </Link>
  );
}

function ToolCard({
  href,
  name,
  description,
  pricingModel,
  startingPrice,
  badge,
}: {
  href: string;
  name: string;
  description: string;
  pricingModel: string;
  startingPrice?: string | null;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/7 no-underline"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <MiniLogo name={name} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold text-white">{name}</h3>

              {badge ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                  {badge}
                </span>
              ) : null}

              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                {pricingModel}
              </span>

              {startingPrice ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                  {startingPrice}
                </span>
              ) : null}
            </div>

            <p className="mt-2 line-clamp-2 text-sm text-white/60">{description}</p>
          </div>
        </div>

        <div className="shrink-0 pt-1 text-sm font-medium text-white/60 transition group-hover:text-white">
          View <span className="opacity-70">→</span>
        </div>
      </div>
    </Link>
  );
}

function Section({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">{kicker}</p>
      <h2 className="mt-2 text-lg font-semibold tracking-tight text-white md:text-xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SidebarBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
        {title}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = rawSlug ? decodeURIComponent(rawSlug) : "";
  if (!slug) return { title: "Alternatives not found" };

  const tool = await prisma.tool.findUnique({
    where: { slug },
    include: { primaryCategory: true },
  });
  if (!tool) return { title: "Alternatives not found" };

  const categoryName = tool.primaryCategory?.name ?? "this category";
  const title = `${tool.name} alternatives — best options in ${categoryName}`;
  const description = `Compare the best ${tool.name} alternatives by pricing, strengths, and who they’re best for.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function AlternativesPage({ params }: AlternativesPageProps) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug ? decodeURIComponent(rawSlug) : "";
  if (!slug) notFound();

  const result = await getAlternatives(slug);
  if (!result) notFound();

  const { tool, alternatives } = result;

  // Optional: hide inactive tools
  if (tool.status !== "ACTIVE") notFound();

  const internal = await getAlternativesInternalLinks(slug);

  const categoryName = tool.primaryCategory?.name ?? "Tools";
  const categorySlug =
    tool.primaryCategory?.slug ?? slugifyCategorySlug(tool.primaryCategory?.name ?? "tools");
  const categoryHref = `/tools/category/${categorySlug}`;

  // Best pages for this tool’s use cases (top few)
  const bestLinks = (tool.useCases ?? [])
    .slice(0, 6)
    .map((uc) => ({
      href: `/best/${categorySlug}-tools-for-${uc.slug}`,
      label: `Best ${categoryName} tools for ${uc.name}`,
      ucHref: `/use-cases/${uc.slug}`,
      ucLabel: uc.name,
    }))
    .slice(0, 4);

  const featured = alternatives.filter((t) => t.isFeatured).slice(0, 6);
  const cheaper = alternatives.filter((t) => isCheaper(String(t.pricingModel))).slice(0, 6);
  const rest = alternatives.filter(
    (t) => !featured.some((f) => f.id === t.id) && !cheaper.some((c) => c.id === t.id),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${tool.name} alternatives`,
    itemListElement: alternatives.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: `/tools/${t.slug}`,
    })),
  };

  return (
    <main className="min-h-screen bg-(--bg) text-(--text)">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pointer-events-none absolute left-0 right-0 top-0 -z-10 h-[560px] bg-[radial-gradient(1000px_380px_at_50%_0%,rgba(255,255,255,0.10),rgba(0,0,0,0))]" />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-12 md:pt-16">
        {/* Breadcrumb */}
        <div className="text-xs text-white/55">
          <Link href="/tools" className="hover:text-white no-underline">
            Tools
          </Link>
          <span className="mx-2 text-white/25">/</span>
          <Link href={categoryHref} className="hover:text-white no-underline">
            {categoryName}
          </Link>
          <span className="mx-2 text-white/25">/</span>
          <Link href={`/tools/${tool.slug}`} className="hover:text-white no-underline">
            {tool.name}
          </Link>
          <span className="mx-2 text-white/25">/</span>
          <span className="text-white/80">Alternatives</span>
        </div>

        {/* HERO */}
        <div className="mt-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <Sparkles size={14} className="opacity-80" />
            Alternatives
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {tool.name} alternatives
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
            Similar tools to {tool.name} in {categoryName}. Compare options, open a few comparisons, then shortlist.
          </p>

          {/* Quick actions */}
          <div className="mt-6 flex flex-wrap gap-2">
            <ChipLink href={`/tools/${tool.slug}`}>
              View {tool.name} <ArrowUpRight size={14} className="opacity-70" />
            </ChipLink>

            <ChipLink href={categoryHref}>
              Browse {categoryName} <ArrowUpRight size={14} className="opacity-70" />
            </ChipLink>

            {alternatives.slice(0, 3).map((a) => (
              <ChipLink key={a.id} href={`/compare/${tool.slug}-vs-${a.slug}`}>
                <Boxes size={14} className="opacity-75" />
                Compare vs {a.name}
              </ChipLink>
            ))}
          </div>
        </div>

        {/* Layout */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* LEFT: Results */}
          <div className="min-w-0">
            <Section kicker="Closest matches" title="Top alternatives">
              <div className="grid gap-4">
                {featured.length ? (
                  featured.map((t) => (
                    <ToolCard
                      key={t.id}
                      href={`/tools/${t.slug}`}
                      name={t.name}
                      description={t.shortDescription}
                      pricingModel={String(t.pricingModel)}
                      startingPrice={t.startingPrice ?? null}
                      badge="Featured"
                    />
                  ))
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
                    No featured alternatives yet.
                  </div>
                )}
              </div>
            </Section>

            {cheaper.length ? (
              <Section kicker="Budget friendly" title="Cheaper options">
                <div className="grid gap-4 md:grid-cols-2">
                  {cheaper.map((t) => (
                    <ToolCard
                      key={t.id}
                      href={`/tools/${t.slug}`}
                      name={t.name}
                      description={t.shortDescription}
                      pricingModel={String(t.pricingModel)}
                      startingPrice={t.startingPrice ?? null}
                      badge="Cheaper"
                    />
                  ))}
                </div>
              </Section>
            ) : null}

            {rest.length ? (
              <Section kicker="More choices" title="More alternatives">
                <div className="grid gap-4 md:grid-cols-2">
                  {rest.slice(0, 12).map((t) => (
                    <ToolCard
                      key={t.id}
                      href={`/tools/${t.slug}`}
                      name={t.name}
                      description={t.shortDescription}
                      pricingModel={String(t.pricingModel)}
                      startingPrice={t.startingPrice ?? null}
                    />
                  ))}
                </div>

                {rest.length > 12 ? (
                  <div className="mt-4 text-xs text-white/45">
                    Showing 12 of {rest.length} — open a few comparisons to narrow down quickly.
                  </div>
                ) : null}
              </Section>
            ) : null}

            {/* Why switch (clean + compact) */}
            <Section kicker="Decision help" title="Why people switch">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <ul className="grid gap-2 text-sm text-white/65 md:grid-cols-2">
                  <li>• Simpler workflow with fewer features.</li>
                  <li>• Stronger collaboration or permissions.</li>
                  <li>• Cheaper pricing as they scale.</li>
                  <li>• Better integrations for their stack.</li>
                  <li>• A tool that’s “best for” a specific use case.</li>
                </ul>
              </div>
            </Section>
          </div>

          {/* RIGHT: Sidebar */}
          <aside className="space-y-4">
            <SidebarBlock title="Related decision paths">
              <div className="flex flex-wrap gap-2">
                {internal.primary.map((x: LinkItem) => (
                  <ChipLink key={x.href} href={x.href}>
                    {x.label}
                  </ChipLink>
                ))}
                {internal.topAlternatives.slice(0, 6).map((x: LinkItem) => (
                  <ChipLink key={x.href} href={x.href}>
                    {x.label}
                  </ChipLink>
                ))}
                {internal.comparisons.slice(0, 5).map((x: LinkItem) => (
                  <ChipLink key={x.href} href={x.href}>
                    {x.label}
                  </ChipLink>
                ))}

                <ChipLink href="/best">Browse best pages</ChipLink>
                <ChipLink href="/use-cases">Browse use cases</ChipLink>
              </div>

              <div className="mt-4 text-xs text-white/50">
                Tip: shortlist 2–3 tools, open comparisons, then check alternatives for each finalist.
              </div>
            </SidebarBlock>

            {bestLinks.length ? (
              <SidebarBlock title="Best for">
                <div className="space-y-2">
                  {bestLinks.map((b) => (
                    <Link
                      key={b.href}
                      href={b.href}
                      className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.06)] px-4 py-3 text-sm text-white/75 transition hover:border-white/20 hover:bg-white/7 hover:text-white no-underline"
                    >
                      <span className="min-w-0 truncate">{b.label}</span>
                      <ArrowUpRight size={16} className="shrink-0 opacity-60 transition group-hover:opacity-80" />
                    </Link>
                  ))}

                  {bestLinks.map((b) => (
                    <Link
                      key={b.ucHref}
                      href={b.ucHref}
                      className="text-xs text-white/55 hover:text-white no-underline"
                    >
                      Browse use case: <span className="text-white/70">{b.ucLabel}</span> →
                    </Link>
                  ))}
                </div>
              </SidebarBlock>
            ) : null}
          </aside>
        </div>

        <footer className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-white/45">
          © {new Date().getFullYear()} Findaly. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
