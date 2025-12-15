import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
type Props = {
  params: Promise<{ pair: string }>;
};

function decode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function parsePair(pair: string) {
  const decoded = decode(pair || "").trim();
  const parts = decoded.split("-vs-").filter(Boolean);
  if (parts.length !== 2) return null;

  const left = parts[0]?.trim();
  const right = parts[1]?.trim();
  if (!left || !right) return null;

  return { left, right };
}

function slugifyCategory(category: string) {
  return category.trim().toLowerCase().replace(/\s+/g, "-");
}

function prettyPricing(p: unknown) {
  const s = String(p ?? "").toUpperCase();
  if (s === "FREE") return "Free";
  if (s === "FREEMIUM") return "Freemium";
  if (s === "PAID") return "Paid";
  if (s === "ENTERPRISE") return "Enterprise";
  return s || "—";
}

function scorePricing(p: unknown) {
  const s = String(p ?? "").toUpperCase();
  if (s === "FREE") return 1;
  if (s === "FREEMIUM") return 2;
  if (s === "PAID") return 3;
  if (s === "ENTERPRISE") return 4;
  return 999;
}

function uniqueTop(arr: (string | null | undefined)[], n: number) {
  return Array.from(new Set(arr.map((x) => (x ?? "").trim()).filter(Boolean))).slice(0, n);
}

function setIntersection(a: string[], b: string[]) {
  const A = new Set(a.map((x) => x.toLowerCase().trim()).filter(Boolean));
  const B = new Set(b.map((x) => x.toLowerCase().trim()).filter(Boolean));
  const out: string[] = [];
  for (const x of A) if (B.has(x)) out.push(x);
  return out;
}

async function getToolsBySlugs(slugA: string, slugB: string) {
  const [a, b] = await Promise.all([
    prisma.tool.findUnique({
      where: { slug: slugA },
      include: { primaryCategory: true, useCases: true },
    }),
    prisma.tool.findUnique({
      where: { slug: slugB },
      include: { primaryCategory: true, useCases: true },
    }),
  ]);
  return { a, b };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return { title: "Compare tools" };

  const { a, b } = await getToolsBySlugs(parsed.left, parsed.right);
  if (!a || !b) return { title: "Compare tools" };

  const title = `${a.name} vs ${b.name} — pricing, features & best for`;
  const description = `Compare ${a.name} vs ${b.name}: pricing model, starting price, key features, integrations, and who each tool is best for.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function ComparePage({ params }: Props) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();

  const { a: toolA, b: toolB } = await getToolsBySlugs(parsed.left, parsed.right);
  if (!toolA || !toolB) notFound();

  // Optional: hide inactive tools from comparisons
  if (toolA.status !== "ACTIVE" || toolB.status !== "ACTIVE") notFound();
  const categoryName = toolA.primaryCategory?.name ?? "Tools";
  const categorySlug =
    toolA.primaryCategory?.slug ?? slugifyCategory(toolA.primaryCategory?.name ?? "Tools");
  const categoryHref = `/tools/category/${categorySlug}`;

  const sameCategory = toolA.primaryCategoryId === toolB.primaryCategoryId;

  const pricingWinner =
    scorePricing(toolA.pricingModel) < scorePricing(toolB.pricingModel)
      ? toolA
      : scorePricing(toolB.pricingModel) < scorePricing(toolA.pricingModel)
        ? toolB
        : null;

  const aBestFor = uniqueTop(toolA.targetAudience ?? [], 2).join(" & ") || "teams";
  const bBestFor = uniqueTop(toolB.targetAudience ?? [], 2).join(" & ") || "teams";

  const aTopFeature = uniqueTop(toolA.keyFeatures ?? [], 1)[0] || "core workflows";
  const bTopFeature = uniqueTop(toolB.keyFeatures ?? [], 1)[0] || "core workflows";

  const commonIntegrations = setIntersection(toolA.integrations ?? [], toolB.integrations ?? []);
  const commonUseCases = setIntersection(
    (toolA.useCases ?? []).map((u) => u.name),
    (toolB.useCases ?? []).map((u) => u.name),
  );

  // Shared use-case slugs for /best links
  const commonUseCaseSlugs = setIntersection(
    (toolA.useCases ?? []).map((u) => u.slug),
    (toolB.useCases ?? []).map((u) => u.slug),
  ).slice(0, 4);

  const bestLinks: Array<{ href: string; label: string }> = [];
  for (const ucSlug of commonUseCaseSlugs) {
    const uc = (toolA.useCases ?? []).find((u) => u.slug === ucSlug);
    const ucName = uc?.name ?? ucSlug;
    // Use the category slug (normalized) from relation if possible
    const catSlugA = toolA.primaryCategory?.slug ?? categorySlug;
    bestLinks.push({
      href: `/best/${catSlugA}-tools-for-${ucSlug}`,
      label: `Best ${categoryName} tools for ${ucName}`,
    });
    if (bestLinks.length >= 4) break;
  }

  const related = await prisma.tool.findMany({
    where: {
      status: "ACTIVE",
      primaryCategoryId: toolA.primaryCategoryId,
      NOT: { slug: { in: [toolA.slug, toolB.slug] } },
    },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    take: 10,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${toolA.name} vs ${toolB.name}`,
    about: [
      { "@type": "SoftwareApplication", name: toolA.name },
      { "@type": "SoftwareApplication", name: toolB.name },
    ],
  };

  const rows: Array<{ label: string; a: string; b: string }> = [
    { label: "Category", a: categoryName, b: toolB.primaryCategory?.name ?? "Tools" },
    {
      label: "Pricing model",
      a: prettyPricing(toolA.pricingModel),
      b: prettyPricing(toolB.pricingModel),
    },
    { label: "Starting price", a: toolA.startingPrice ?? "—", b: toolB.startingPrice ?? "—" },
    {
      label: "Key features",
      a: uniqueTop(toolA.keyFeatures ?? [], 6).join(", ") || "—",
      b: uniqueTop(toolB.keyFeatures ?? [], 6).join(", ") || "—",
    },
    {
      label: "Integrations",
      a: uniqueTop(toolA.integrations ?? [], 6).join(", ") || "—",
      b: uniqueTop(toolB.integrations ?? [], 6).join(", ") || "—",
    },
    {
      label: "Best for",
      a: uniqueTop(toolA.targetAudience ?? [], 6).join(", ") || "—",
      b: uniqueTop(toolB.targetAudience ?? [], 6).join(", ") || "—",
    },
  ];

  return (
    <main className="min-h-screen bg-(--color-bg)">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-xs text-(--color-text-muted)">
          <Link href="/tools" className="underline underline-offset-2">
            Tools
          </Link>
          <span className="mx-1">/</span>
          {sameCategory ? (
            <>
              <Link href={categoryHref} className="underline underline-offset-2">
                {categoryName}
              </Link>
              <span className="mx-1">/</span>
            </>
          ) : null}
          <span>Compare</span>
        </div>

        <h1 className="mt-3 text-3xl font-semibold">
          {toolA.name} vs {toolB.name}
        </h1>

        <p className="mt-2 max-w-3xl text-sm text-(--color-text-muted)">
          Decision-first comparison: pricing, features, integrations, and who each tool is best for.
        </p>

        {commonUseCases.length || commonIntegrations.length ? (
          <div className="mt-4 text-xs text-(--color-text-muted)">
            {commonUseCases.length ? (
              <span>
                Common use cases:{" "}
                <span className="text-(--color-text-main)">
                  {commonUseCases.slice(0, 4).join(", ")}
                </span>
              </span>
            ) : null}
            {commonUseCases.length && commonIntegrations.length ? <span> · </span> : null}
            {commonIntegrations.length ? (
              <span>
                Shared integrations:{" "}
                <span className="text-(--color-text-main)">
                  {commonIntegrations.slice(0, 4).join(", ")}
                </span>
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/5 bg-(--color-surface) p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
              Best for
            </p>
            <p className="mt-2 text-sm text-(--color-text-main)">
              <span className="font-medium">{toolA.name}</span>: {aBestFor} who want{" "}
              <span className="font-medium">{aTopFeature}</span>.
            </p>
            <p className="mt-2 text-sm text-(--color-text-main)">
              <span className="font-medium">{toolB.name}</span>: {bBestFor} who want{" "}
              <span className="font-medium">{bTopFeature}</span>.
            </p>
          </div>

          <div className="rounded-2xl border border-black/5 bg-(--color-surface) p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
              Pricing
            </p>
            <div className="mt-2 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-(--color-text-muted)">{toolA.name}</span>
                <span className="font-medium">{prettyPricing(toolA.pricingModel)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-(--color-text-muted)">{toolB.name}</span>
                <span className="font-medium">{prettyPricing(toolB.pricingModel)}</span>
              </div>
              <div className="border-t border-black/5 pt-3 text-xs text-(--color-text-muted)">
                Winner:{" "}
                <span className="font-medium text-(--color-text-main)">
                  {pricingWinner ? pricingWinner.name : "Tie"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-(--color-surface) p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
              Jump to
            </p>
            <div className="mt-3 grid gap-2 text-sm">
              <Link
                href={`/tools/${toolA.slug}`}
                className="rounded-xl border border-black/10 bg-(--color-surface) px-4 py-2 text-center font-medium"
              >
                {toolA.name} profile
              </Link>
              <Link
                href={`/tools/${toolB.slug}`}
                className="rounded-xl border border-black/10 bg-(--color-surface) px-4 py-2 text-center font-medium"
              >
                {toolB.name} profile
              </Link>
              <Link
                href={`/alternatives/${toolA.slug}`}
                className="rounded-xl border border-black/10 bg-(--color-surface) px-4 py-2 text-center font-medium"
              >
                {toolA.name} alternatives
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-(--color-surface)">
          <div className="grid grid-cols-3 border-b border-black/10 bg-(--color-surface) p-4 text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
            <div>Criteria</div>
            <div>{toolA.name}</div>
            <div>{toolB.name}</div>
          </div>

          {rows.map((r) => (
            <div key={r.label} className="grid grid-cols-3 gap-4 border-b border-black/5 p-4 text-sm">
              <div className="text-(--color-text-muted)">{r.label}</div>
              <div className="text-(--color-text-main)">{r.a}</div>
              <div className="text-(--color-text-main)">{r.b}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/5 bg-(--color-surface) p-5">
            <h2 className="text-sm font-semibold">Choose {toolA.name} if…</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-(--color-text-main)">
              <li>You’re in {categoryName} and want {aTopFeature.toLowerCase()} first.</li>
              <li>
                You fit “best for” like:{" "}
                {uniqueTop(toolA.targetAudience ?? [], 3).join(", ") || "teams"}.
              </li>
              <li>
                You care about integrations like:{" "}
                {uniqueTop(toolA.integrations ?? [], 3).join(", ") || "common tools"}.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-black/5 bg-(--color-surface) p-5">
            <h2 className="text-sm font-semibold">Choose {toolB.name} if…</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-(--color-text-main)">
              <li>
                You’re in {toolB.primaryCategory?.name ?? "Tools"} and want{" "}
                {bTopFeature.toLowerCase()} first.
              </li>
              <li>
                You fit “best for” like:{" "}
                {uniqueTop(toolB.targetAudience ?? [], 3).join(", ") || "teams"}.
              </li>
              <li>
                You care about integrations like:{" "}
                {uniqueTop(toolB.integrations ?? [], 3).join(", ") || "common tools"}.
              </li>
            </ul>
          </div>
        </div>

        {/* NEW: internal linking flywheel */}
        <section className="mt-10 rounded-2xl border border-black/5 bg-(--color-surface) p-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
            Related decision paths
          </h2>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link
              href={`/alternatives/${toolA.slug}`}
              className="rounded-full border border-black/10 bg-(--color-surface) px-3 py-1 underline underline-offset-2"
            >
              {toolA.name} alternatives
            </Link>
            <Link
              href={`/alternatives/${toolB.slug}`}
              className="rounded-full border border-black/10 bg-(--color-surface) px-3 py-1 underline underline-offset-2"
            >
              {toolB.name} alternatives
            </Link>

            <Link
              href={`/tools/category/${categorySlug}`}
              className="rounded-full border border-black/10 bg-(--color-surface) px-3 py-1 underline underline-offset-2"
            >
              Browse {categoryName}
            </Link>

            {bestLinks.map((b) => (
              <Link
                key={b.href}
                href={b.href}
                className="rounded-full border border-black/10 bg-(--color-surface) px-3 py-1 underline underline-offset-2"
              >
                {b.label}
              </Link>
            ))}
          </div>

          <div className="mt-3 text-xs text-(--color-text-muted)">
            Tip: open 2–3 compares, then check alternatives for your finalists.
          </div>
        </section>

        {related.length ? (
          <div className="mt-10">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
              More comparisons in {categoryName}
            </h2>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {related.slice(0, 8).map((t) => (
                <Link
                  key={t.id}
                  href={`/compare/${toolA.slug}-vs-${t.slug}`}
                  className="rounded-full border border-black/10 bg-(--color-surface) px-3 py-1 underline underline-offset-2"
                >
                  {toolA.name} vs {t.name}
                </Link>
              ))}
            </div>

            <div className="mt-4 text-sm">
              <Link href={categoryHref} className="underline underline-offset-2">
                Browse all {categoryName} tools →
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
