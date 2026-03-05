// app/explore/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600; // crawl-friendly cache (1h)

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Explore Boats for Sale | Findaly",
  description:
    "Browse the latest boats for sale on Findaly. Explore listings, brands, models, and countries — updated regularly.",
  alternates: { canonical: "/explore" },
  openGraph: {
    title: "Explore Boats for Sale | Findaly",
    description:
      "Browse the latest boats for sale on Findaly. Explore listings, brands, models, and countries — updated regularly.",
    url: `${siteUrl}/explore`,
    siteName: "Findaly",
    type: "website",
  },
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-6 md:px-10 max-w-[1200px] mx-auto py-10">
      <h2 className="text-[20px] md:text-[22px] font-semibold tracking-[-0.02em]">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Pill({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-[13px] hover:bg-white transition"
    >
      {children}
    </Link>
  );
}

function listingLabel(l: any) {
  const fallback =
    `${l.brand ?? ""} ${l.model ?? ""}`.trim() || l.slug || "View listing";
  // Fix: don’t mix ?? with || in one expression; be explicit.
  return (l.title ?? fallback) || fallback;
}

function listingMeta(l: any) {
  const bits: string[] = [];
  if (l.year) bits.push(String(l.year));
  if (l.country) bits.push(String(l.country));
  if (l.brand || l.model) bits.push(`${l.brand ?? ""} ${l.model ?? ""}`.trim());
  return bits.join(" · ");
}

export default async function ExplorePage() {
  // Latest listings (HTML crawl targets)
  const listings = await prisma.listing.findMany({
    where: {} as any,
    select: {
      id: true,
      slug: true,
      title: true,
      year: true as any,
      brand: true as any,
      model: true as any,
      country: true as any,
    } as any,
    orderBy: { createdAt: "desc" } as any,
    take: 300,
  });

  // Simple facets for crawl paths (adjust field names if yours differ)
  const brands = await prisma.listing.groupBy({
    by: ["brand"] as any,
    where: { brand: { not: null } } as any,
    _count: { brand: true } as any,
    orderBy: { _count: { brand: "desc" } } as any,
    take: 60,
  });

  const models = await prisma.listing.groupBy({
    by: ["model"] as any,
    where: { model: { not: null } } as any,
    _count: { model: true } as any,
    orderBy: { _count: { model: "desc" } } as any,
    take: 60,
  });

  const countries = await prisma.listing.groupBy({
    by: ["country"] as any,
    where: { country: { not: null } } as any,
    _count: { country: true } as any,
    orderBy: { _count: { country: "desc" } } as any,
    take: 50,
  });

  return (
    <main className="pt-24">
      <header className="px-6 md:px-10 max-w-[1200px] mx-auto">
        <div className="rounded-3xl border border-black/10 bg-white/60 p-6 md:p-10">
          <h1 className="text-[28px] md:text-[38px] leading-[1.05] font-semibold tracking-[-0.03em]">
            Explore Findaly
          </h1>
          <p className="mt-3 text-[14px] md:text-[15px] text-black/70 max-w-[70ch]">
            A crawl-friendly directory of real listing URLs, plus the most
            browsed brands, models, and countries.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Pill href="/buy">Browse all boats</Pill>
            <Pill href="/brands">Browse brands</Pill>
            <Pill href="/guides">Read guides</Pill>
          </div>
        </div>
      </header>

      <Section title="Latest listings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {listings.map((l: any) => (
            <Link
              key={l.id}
              href={`/buy/${l.slug}`}
              className="rounded-2xl border border-black/10 bg-white/60 p-4 hover:bg-white transition"
            >
              <div className="text-[14px] font-medium">{listingLabel(l)}</div>
              <div className="mt-1 text-[12px] text-black/65">
                {listingMeta(l)}
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Top brands">
        <div className="flex flex-wrap gap-2">
          {brands.map((b: any) =>
            b.brand ? (
              <Pill
                key={b.brand}
                href={`/buy/brand/${encodeURIComponent(b.brand)}`}
              >
                {b.brand}{" "}
                <span className="ml-2 text-black/50">({b._count.brand})</span>
              </Pill>
            ) : null
          )}
        </div>
      </Section>

      <Section title="Top models">
        <div className="flex flex-wrap gap-2">
          {models.map((m: any) =>
            m.model ? (
              <Pill
                key={m.model}
                href={`/buy/model/${encodeURIComponent(m.model)}`}
              >
                {m.model}{" "}
                <span className="ml-2 text-black/50">({m._count.model})</span>
              </Pill>
            ) : null
          )}
        </div>
      </Section>

      <Section title="Top countries">
        <div className="flex flex-wrap gap-2">
          {countries.map((c: any) =>
            c.country ? (
              <Pill
                key={c.country}
                href={`/buy/country/${encodeURIComponent(c.country)}`}
              >
                {c.country}{" "}
                <span className="ml-2 text-black/50">({c._count.country})</span>
              </Pill>
            ) : null
          )}
        </div>
      </Section>

      <div className="h-14" />
    </main>
  );
}