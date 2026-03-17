// app/services/yacht-finance/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/site";
import type { Prisma } from "@prisma/client";

const P = {
  dark: "#0a211f",
  accent: "#fff86c",
  text: "#1a1a1a",
  faint: "#f5f5f4",
  white: "#fff",
  green: "#1a7a5c",
} as const;

const CATEGORY = "Yacht Finance";

type ProviderListing = {
  id: string;
  serviceName: string | null;
  serviceDescription: string | null;
  description: string | null;
  location: string | null;
  country: string | null;
  featured: boolean;
  serviceAreas: Prisma.JsonValue;
  profile: {
    slug: string;
    name: string;
    isVerified: boolean;
    location: string | null;
    about: string | null;
    companyLogoUrl: string | null;
    avatarUrl: string | null;
  };
};

function jsonLd(obj: Record<string, unknown>) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
    />
  );
}

function toStringArray(value: Prisma.JsonValue): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-1 text-xs"
      style={{
        backgroundColor: "rgba(0,0,0,.03)",
        border: "1px solid rgba(0,0,0,.10)",
        color: "rgba(0,0,0,.70)",
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

function ProviderCard({ item }: { item: ProviderListing }) {
  const name = item.serviceName || item.profile.name;
  const desc = item.serviceDescription || item.description || item.profile.about || "";
  const logoUrl = item.profile.companyLogoUrl || item.profile.avatarUrl || null;

  const areas = toStringArray(item.serviceAreas).slice(0, 6);
  const profileHref = `/profile/${item.profile.slug}`;

  return (
    <div
      className="flex gap-5 overflow-hidden rounded-2xl border bg-white p-5 transition-all hover:shadow-lg"
      style={{ borderColor: "rgba(0,0,0,.10)" }}
    >
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl"
        style={{ backgroundColor: P.faint, border: "1px solid rgba(0,0,0,.08)" }}
      >
        {logoUrl ? (
          <img src={logoUrl} alt={name} className="h-10 w-10 rounded-lg object-cover" />
        ) : (
          <div className="h-10 w-10 rounded-lg" style={{ backgroundColor: "rgba(0,0,0,.08)" }} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={profileHref} className="no-underline">
              <div className="line-clamp-1 text-base" style={{ color: P.text, fontWeight: 650 }}>
                {name}
              </div>
            </Link>

            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
              <span
                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
                style={{
                  backgroundColor: "rgba(0,0,0,.04)",
                  border: "1px solid rgba(0,0,0,.10)",
                  color: P.text,
                  fontWeight: 500,
                }}
              >
                {CATEGORY}
              </span>

              {item.profile.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs" style={{ color: P.green, fontWeight: 650 }}>
                  ● Verified
                </span>
              )}

              {item.featured && (
                <span
                  className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
                  style={{ backgroundColor: P.accent, color: P.dark, fontWeight: 700 }}
                >
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>

        {areas.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {areas.map((p, idx) => (
              <Pill key={`${p}-${idx}`}>{p}</Pill>
            ))}
          </div>
        )}

        {desc ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed" style={{ color: "rgba(0,0,0,.55)" }}>
            {desc}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
            {(item.location || item.profile.location || "Mediterranean") + (item.country ? ` · ${item.country}` : "")}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`${profileHref}#contact`}
              className="inline-flex items-center rounded-md px-3 py-1.5 text-xs no-underline"
              style={{ backgroundColor: P.dark, color: P.accent, fontWeight: 700 }}
            >
              Enquire
            </Link>
            <Link
              href={profileHref}
              className="inline-flex items-center rounded-md px-3 py-1.5 text-xs no-underline"
              style={{
                backgroundColor: P.faint,
                border: "1px solid rgba(0,0,0,.10)",
                color: P.text,
                fontWeight: 600,
              }}
            >
              View profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Yacht Finance | Marine Services Directory | Findaly",
  description:
    "Find yacht finance providers across the Mediterranean. Compare lenders, brokers, and specialists — then enquire directly.",
  alternates: { canonical: "/services/yacht-finance" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Yacht Finance | Marine Services Directory | Findaly",
    description:
      "Find yacht finance providers across the Mediterranean. Compare lenders, brokers, and specialists — then enquire directly.",
    url: "/services/yacht-finance",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yacht Finance Services | Findaly",
    description: "Find yacht finance and marine loan providers on Findaly.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
};

export default async function YachtFinancePillarPage() {
  const where: Prisma.ListingWhereInput = {
    kind: "SERVICES",
    status: "LIVE",
    serviceCategory: { equals: CATEGORY, mode: "insensitive" },
  };

  const [total, featured, latest] = await Promise.all([
    prisma.listing.count({ where }),
    prisma.listing.findMany({
      where: { ...where, featured: true },
      take: 12,
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        serviceName: true,
        serviceDescription: true,
        description: true,
        location: true,
        country: true,
        featured: true,
        serviceAreas: true,
        profile: {
          select: {
            slug: true,
            name: true,
            isVerified: true,
            location: true,
            about: true,
            companyLogoUrl: true,
            avatarUrl: true,
          },
        },
      },
    }),
    prisma.listing.findMany({
      where,
      take: 18,
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        serviceName: true,
        serviceDescription: true,
        description: true,
        location: true,
        country: true,
        featured: true,
        serviceAreas: true,
        profile: {
          select: {
            slug: true,
            name: true,
            isVerified: true,
            location: true,
            about: true,
            companyLogoUrl: true,
            avatarUrl: true,
          },
        },
      },
    }),
  ]);

  const combined: ProviderListing[] = [
    ...(featured as ProviderListing[]),
    ...((latest as ProviderListing[]).filter((l) => !(featured as ProviderListing[]).some((f) => f.id === l.id))),
  ].slice(0, 24);

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I finance a used yacht?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Often yes, depending on age, valuation, documentation, and condition. Lenders may require a recent survey and clear ownership history.",
        },
      },
      {
        "@type": "Question",
        name: "What do lenders usually look at for yacht financing?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Common factors include buyer profile, deposit size, yacht valuation, age/spec, cruising area, and supporting documents such as surveys, registration, and compliance.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need insurance to get finance approved?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Usually, yes. Marine insurance is often a condition of financing, especially before completion and delivery.",
        },
      },
    ],
  };

  const directoryHref = `/services?category=${encodeURIComponent(CATEGORY)}`;
  const topCountries = ["France", "Italy", "Spain", "Greece", "Croatia", "Turkey", "Malta", "Monaco"];
  void getSiteUrl(); // ensures env is loaded similarly across pages

  return (
    <main className="min-h-screen w-full" style={{ backgroundColor: P.faint }}>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Yacht Finance — Marine Finance on Findaly</h1>
        <p>Find yacht finance and marine loan providers on Findaly.</p>
        <nav>
          <a href="/">Home</a>
          <a href="/buy">Boats for Sale</a>
          <a href="/buy/sailboats">Sailboats for Sale</a>
          <a href="/buy/motor-yachts">Motor Yachts for Sale</a>
          <a href="/buy/catamarans">Catamarans for Sale</a>
          <a href="/sell">Sell Your Boat</a>
          <a href="/brokers">Brokers</a>
          <a href="/guides">Buying Guides</a>
          <a href="/finance">Yacht Finance</a>
          <a href="/services">Marine Services</a>
          <a href="/destinations">Destinations</a>
          <a href="/about">About</a>
        </nav>
      </div>
      {jsonLd(faq)}

      <section className="w-full border-b" style={{ backgroundColor: P.white, borderColor: "rgba(0,0,0,.08)" }}>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold tracking-[0.16em] uppercase" style={{ color: "rgba(0,0,0,.45)" }}>
              Services • Category
            </div>
            <h1 className="mt-2 text-3xl tracking-tight sm:text-4xl" style={{ color: P.text, fontWeight: 750 }}>
              Yacht finance providers in the Mediterranean
            </h1>
            <p className="mt-3 text-base leading-relaxed" style={{ color: "rgba(0,0,0,.55)" }}>
              Compare yacht finance brokers, lenders, and specialists — then enquire directly.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={directoryHref}
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm no-underline"
                style={{ backgroundColor: P.dark, color: P.accent, fontWeight: 750 }}
              >
                Browse all finance providers ({total})
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm no-underline"
                style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: P.text, fontWeight: 650 }}
              >
                All services
              </Link>
            </div>

            <div className="mt-6">
              <div className="text-sm" style={{ color: "rgba(0,0,0,.55)", fontWeight: 650 }}>
                Popular markets
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {topCountries.map((c) => (
                  <Link
                    key={c}
                    href={`/services?category=${encodeURIComponent(CATEGORY)}&country=${encodeURIComponent(c)}`}
                    className="rounded-full border px-3 py-1.5 text-sm no-underline"
                    style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: "rgba(0,0,0,.70)", fontWeight: 550 }}
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          {combined.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {combined.map((l) => (
                <ProviderCard key={l.id} item={l} />
              ))}
            </div>
          ) : (
            <div
              className="rounded-2xl border-2 border-dashed p-10"
              style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: "rgba(255,255,255,.70)" }}
            >
              <div className="text-lg" style={{ color: P.text, fontWeight: 700 }}>
                No finance providers listed yet
              </div>
              <div className="mt-2 text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
                Seed provider profiles and they’ll appear here automatically.
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}