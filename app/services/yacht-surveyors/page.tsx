// app/services/yacht-surveyors/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";

const P = {
  dark: "#0a211f",
  accent: "#fff86c",
  text: "#1a1a1a",
  faint: "#f5f5f4",
  white: "#fff",
  green: "#1a7a5c",
} as const;

const CATEGORY = "Yacht Surveyor";

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

  const areas = toStringArray(item.serviceAreas);
  const pills = areas.slice(0, 6);

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

            <div className="mt-0.5 flex items-center gap-2 text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
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

        {pills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {pills.map((p, idx) => (
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
            {(item.location || item.profile.location || "Mediterranean") +
              (item.country ? ` · ${item.country}` : "")}
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
  title: "Yacht Surveyors | Marine Services Directory | Findaly",
  description:
    "Find trusted yacht surveyors across the Mediterranean. Compare providers by location, coverage, and services — then enquire directly.",
  alternates: { canonical: "/services/yacht-surveyors" },
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
    title: "Yacht Surveyors | Marine Services Directory | Findaly",
    description:
      "Find trusted yacht surveyors across the Mediterranean. Compare providers by location, coverage, and services — then enquire directly.",
    url: "/services/yacht-surveyors",
    images: [{ url: absoluteUrl("/hero-pros.jpg") }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yacht Surveyors | Marine Services Directory | Findaly",
    description:
      "Find trusted yacht surveyors across the Mediterranean. Compare providers by location, coverage, and services — then enquire directly.",
    images: [absoluteUrl("/hero-pros.jpg")],
  },
};

export default async function YachtSurveyorsPillarPage() {
  const where: Prisma.ListingWhereInput = {
    kind: "SERVICES",
    status: "LIVE",
    serviceCategory: { equals: CATEGORY, mode: "insensitive" },
  };

  const selectProvider = {
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
  } satisfies Prisma.ListingSelect;

  const [total, featured, latest] = await Promise.all([
    prisma.listing.count({ where }),
    prisma.listing.findMany({
      where: { ...where, featured: true },
      take: 12,
      orderBy: [{ createdAt: "desc" }],
      select: selectProvider,
    }),
    prisma.listing.findMany({
      where,
      take: 18,
      orderBy: [{ createdAt: "desc" }],
      select: selectProvider,
    }),
  ]);

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do I need a survey before buying a yacht?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "In most cases, yes. A pre-purchase survey helps uncover structural, mechanical, and moisture issues before you commit, and can strengthen negotiation.",
        },
      },
      {
        "@type": "Question",
        name: "What does a yacht survey typically include?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "A survey usually covers hull, deck, systems, safety equipment, and documentation. Scope varies by vessel type and survey level.",
        },
      },
      {
        "@type": "Question",
        name: "How do I choose the right surveyor in the Mediterranean?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Choose based on location coverage, experience with your boat type, reputation, and whether they can coordinate haul-outs and sea trials.",
        },
      },
      {
        "@type": "Question",
        name: "Can a survey help reduce the purchase price?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Often, yes. Findings can justify repairs, price reductions, or seller commitments — especially when the survey is well-documented and specific.",
        },
      },
      {
        "@type": "Question",
        name: "Can I contact surveyors directly on Findaly?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Each provider profile includes direct contact options so you can enquire, request availability, and compare approaches.",
        },
      },
    ],
  };

  const directoryHref = `/services?category=${encodeURIComponent(CATEGORY)}`;
  const topCountries = ["France", "Italy", "Spain", "Greece", "Croatia", "Turkey", "Malta", "Monaco"];

  const featuredTyped = featured as unknown as ProviderListing[];
  const latestTyped = latest as unknown as ProviderListing[];

  const combined: ProviderListing[] = [
    ...featuredTyped,
    ...latestTyped.filter((l) => !featuredTyped.some((f) => f.id === l.id)),
  ].slice(0, 24);

  return (
    <main className="min-h-screen w-full" style={{ backgroundColor: P.faint }}>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Yacht Surveyors Directory — Find Marine Surveyors</h1>
        <p>Find trusted yacht surveyors across the Mediterranean on Findaly.</p>
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
              Yacht surveyors in the Mediterranean
            </h1>
            <p className="mt-3 text-base leading-relaxed" style={{ color: "rgba(0,0,0,.55)" }}>
              Browse trusted yacht surveyors and marine survey firms — compare coverage areas and experience, then enquire directly.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={directoryHref}
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm no-underline"
                style={{ backgroundColor: P.dark, color: P.accent, fontWeight: 750 }}
              >
                Browse all surveyors ({total})
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm no-underline"
                style={{
                  borderColor: "rgba(0,0,0,.14)",
                  backgroundColor: P.white,
                  color: P.text,
                  fontWeight: 650,
                }}
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
                    style={{
                      borderColor: "rgba(0,0,0,.14)",
                      backgroundColor: P.white,
                      color: "rgba(0,0,0,.70)",
                      fontWeight: 550,
                    }}
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
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm" style={{ color: "rgba(0,0,0,.55)", fontWeight: 650 }}>
                Recommended providers
              </div>
              <div className="mt-1 text-sm" style={{ color: "rgba(0,0,0,.45)" }}>
                Featured first, then newest.
              </div>
            </div>
            <Link
              href={directoryHref}
              className="hidden sm:inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm no-underline"
              style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: P.text, fontWeight: 650 }}
            >
              View all →
            </Link>
          </div>

          {combined.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {combined.map((l) => (
                <ProviderCard key={l.id} item={l} />
              ))}
            </div>
          ) : (
            <div
              className="mt-6 rounded-2xl border-2 border-dashed p-10"
              style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: "rgba(255,255,255,.70)" }}
            >
              <div className="text-lg" style={{ color: P.text, fontWeight: 700 }}>
                No surveyors listed yet
              </div>
              <div className="mt-2 text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
                As you seed provider profiles, they’ll appear here automatically.
              </div>
              <div className="mt-5">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm no-underline"
                  style={{ backgroundColor: P.dark, color: P.accent, fontWeight: 750 }}
                >
                  Browse services
                </Link>
              </div>
            </div>
          )}

          <div
            className="mt-10 rounded-2xl border p-8"
            style={{ borderColor: "rgba(0,0,0,.08)", backgroundColor: P.white }}
          >
            <h2 className="text-lg" style={{ color: P.text, fontWeight: 750 }}>
              What a yacht survey helps you avoid
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(0,0,0,.55)" }}>
              Surveys surface expensive truths early: moisture ingress, structural fatigue, neglected maintenance, undocumented modifications, and safety issues.
              They also help you plan remediation costs and negotiate from evidence — especially in cross-border transactions.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={`/services?category=${encodeURIComponent("Marine Lawyer")}`}
                className="rounded-full border px-3 py-1.5 text-sm no-underline"
                style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: "rgba(0,0,0,.70)", fontWeight: 600 }}
              >
                Marine lawyers
              </Link>
              <Link
                href={`/services?category=${encodeURIComponent("Marine Insurance")}`}
                className="rounded-full border px-3 py-1.5 text-sm no-underline"
                style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: "rgba(0,0,0,.70)", fontWeight: 600 }}
              >
                Marine insurance
              </Link>
              <Link
                href={`/services?category=${encodeURIComponent("Yacht Finance")}`}
                className="rounded-full border px-3 py-1.5 text-sm no-underline"
                style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: "rgba(0,0,0,.70)", fontWeight: 600 }}
              >
                Yacht finance
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}