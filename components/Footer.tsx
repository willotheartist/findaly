// components/Footer.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-slate-700 no-underline hover:text-slate-900"
    >
      {children}
    </Link>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-semibold text-slate-900">{children}</div>;
}

function slugifyLoose(input: string) {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

type TopAgg = { key: string; count: number };

type BrandRow = { brand: string | null; _count: { brand: number } };
type ModelRow = { model: string | null; _count: { model: number } };
type CountryRow = { country: string | null; _count: { country: number } };
type YearRow = { year: number | null; _count: { year: number } };

function normalizeAgg<Row extends Record<string, unknown>>(
  rows: Row[],
  field: string,
  countGetter: (row: Row) => number
): TopAgg[] {
  return rows
    .map((r) => ({
      key: String((r[field] as unknown) ?? "").trim(),
      count: Number(countGetter(r) ?? 0),
    }))
    .filter((x) => x.key.length > 0 && x.count > 0)
    .sort((a, b) => b.count - a.count);
}

export default async function Footer() {
  const TAKE = 18;

  const [brandAgg, modelAgg, countryAgg, yearAgg] = await Promise.all([
    prisma.listing.groupBy({
      by: ["brand"],
      where: {
        status: "LIVE",
        kind: "VESSEL",
        intent: "SALE",
        brand: { not: null },
      },
      _count: { brand: true },
      orderBy: { _count: { brand: "desc" } },
      take: TAKE,
    }),
    prisma.listing.groupBy({
      by: ["model"],
      where: {
        status: "LIVE",
        kind: "VESSEL",
        intent: "SALE",
        model: { not: null },
      },
      _count: { model: true },
      orderBy: { _count: { model: "desc" } },
      take: TAKE,
    }),
    prisma.listing.groupBy({
      by: ["country"],
      where: {
        status: "LIVE",
        kind: "VESSEL",
        intent: "SALE",
        country: { not: null },
      },
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: TAKE,
    }),
    prisma.listing.groupBy({
      by: ["year"],
      where: {
        status: "LIVE",
        kind: "VESSEL",
        intent: "SALE",
        year: { not: null },
      },
      _count: { year: true },
      orderBy: { _count: { year: "desc" } },
      take: TAKE,
    }),
  ]);

  const topBrands = normalizeAgg<BrandRow>(brandAgg, "brand", (r) => r._count.brand);
  const topModels = normalizeAgg<ModelRow>(modelAgg, "model", (r) => r._count.model);
  const topCountries = normalizeAgg<CountryRow>(countryAgg, "country", (r) => r._count.country);

  const topYears = (yearAgg as YearRow[])
    .map((r) => ({
      year: Number(r.year),
      count: Number(r._count.year ?? 0),
    }))
    .filter((x) => Number.isFinite(x.year) && !Number.isNaN(x.year) && x.count > 0)
    .sort((a, b) => b.year - a.year)
    .slice(0, 12);

  const fallbackBrands = [
    "Beneteau",
    "Jeanneau",
    "Lagoon",
    "Sunseeker",
    "Azimut",
    "Princess",
    "Ferretti",
    "Pershing",
    "Bavaria",
    "Galeon",
    "Fairline",
    "Sanlorenzo",
  ];

  const fallbackCountries = [
    "France",
    "Spain",
    "Italy",
    "Greece",
    "United Kingdom",
    "Turkey",
    "Croatia",
    "United States",
    "United Arab Emirates",
    "Monaco",
    "Netherlands",
    "Germany",
  ];

  const brandsForUI = topBrands.length ? topBrands.map((x) => x.key) : fallbackBrands;
  const modelsForUI = topModels.length ? topModels.map((x) => x.key) : [];
  const countriesForUI = topCountries.length ? topCountries.map((x) => x.key) : fallbackCountries;

  return (
    <footer className="w-full border-t border-slate-200 bg-white">
      {/* ─────────────────────────────────────────────────────────────
          MEGA “EXPLORE FINDALY” (above footer, leboncoin-style)
         ───────────────────────────────────────────────────────────── */}
      <div className="w-full border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
                Explore Findaly
              </div>
              <div className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                Browse popular searches
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                Quick links to high-intent hubs. These help buyers move faster — and help search engines
                discover your strongest inventory pages.
              </p>
            </div>

            <div className="hidden md:block">
              <Link
                href="/buy"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
              >
                Browse all boats →
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-12">
            {/* Brands */}
            <div className="lg:col-span-3">
              <div className="text-sm font-semibold text-slate-900">Popular brands</div>
              <div className="mt-3 grid gap-2">
                {brandsForUI.slice(0, 16).map((b) => (
                  <FooterLink key={b} href={`/buy/brand/${slugifyLoose(b)}`}>
                    {b}
                  </FooterLink>
                ))}
              </div>
              <div className="mt-4">
                <FooterLink href="/buy">All listings →</FooterLink>
              </div>
            </div>

            {/* Models */}
            <div className="lg:col-span-3">
              <div className="text-sm font-semibold text-slate-900">Popular models</div>
              {modelsForUI.length ? (
                <>
                  <div className="mt-3 grid gap-2">
                    {modelsForUI.slice(0, 16).map((m) => (
                      <FooterLink key={m} href={`/buy/model/${slugifyLoose(m)}`}>
                        {m}
                      </FooterLink>
                    ))}
                  </div>
                  <div className="mt-4">
                    <FooterLink href="/buy">Explore models →</FooterLink>
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Models will appear here automatically as inventory grows.
                </p>
              )}
            </div>

            {/* Countries */}
            <div className="lg:col-span-3">
              <div className="text-sm font-semibold text-slate-900">Popular countries</div>
              <div className="mt-3 grid gap-2">
                {countriesForUI.slice(0, 16).map((c) => (
                  <FooterLink key={c} href={`/buy/country/${slugifyLoose(c)}`}>
                    {c}
                  </FooterLink>
                ))}
              </div>
              <div className="mt-4">
                <FooterLink href="/buy">Explore countries →</FooterLink>
              </div>
            </div>

            {/* Years */}
            <div className="lg:col-span-3">
              <div className="text-sm font-semibold text-slate-900">Browse by year</div>
              {topYears.length ? (
                <div className="mt-3 grid gap-2">
                  {topYears.slice(0, 12).map((y) => (
                    <FooterLink key={y.year} href={`/buy/year/${y.year}`}>
                      {y.year}
                    </FooterLink>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Year pages will populate as soon as listings include build years.
                </p>
              )}

              <div className="mt-4">
                <FooterLink href="/buy">Browse by filters →</FooterLink>
              </div>
            </div>
          </div>

          {/* Small mobile CTA */}
          <div className="mt-8 md:hidden">
            <Link
              href="/buy"
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
            >
              Browse all boats →
            </Link>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          EXISTING FOOTER (unchanged)
         ───────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="text-xl font-extrabold tracking-tight text-slate-900">
              findaly
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-700">
              A modern marketplace for yachts — buy, sell, and charter with
              confidence. Built for brokers, brands, and serious buyers.
            </p>

            <div className="mt-8">
              <div className="relative max-w-sm">
                <label className="sr-only" htmlFor="footer-email">
                  Email
                </label>

                <svg
                  className="pointer-events-none absolute -left-2 -top-5 h-16 w-[360px] max-w-[95vw]"
                  viewBox="0 0 360 80"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M28 55 C60 40, 95 62, 128 50 C170 34, 212 66, 252 48 C288 32, 320 55, 346 46"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M44 30 C58 22, 66 22, 78 30"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 40 C14 46, 18 50, 26 52"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="relative flex items-center border border-slate-300 bg-white px-4 py-3">
                  <input
                    id="footer-email"
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Submit email"
                    className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:text-slate-900"
                  >
                    <span className="text-lg leading-none">→</span>
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Get new listings, market drops, and broker insights. No spam.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <FooterHeading>Marketplace</FooterHeading>
                <div className="mt-4 grid gap-2">
                  <FooterLink href="/buy">Buy</FooterLink>
                  <FooterLink href="/sell">Sell</FooterLink>
                  <FooterLink href="/charter">Charter</FooterLink>
                  <FooterLink href="/add-listing">List a yacht</FooterLink>
                  <FooterLink href="/saved-searches">Saved searches</FooterLink>
                  <FooterLink href="/alerts">Price alerts</FooterLink>
                  <FooterLink href="/messages">Messages</FooterLink>
                </div>
              </div>

              <div>
                <FooterHeading>Explore</FooterHeading>
                <div className="mt-4 grid gap-2">
                  <FooterLink href="/destinations">Destinations</FooterLink>
                  <FooterLink href="/brands">Yacht brands</FooterLink>
                  <FooterLink href="/brokers">Brokers</FooterLink>
                  <FooterLink href="/shipyards">Shipyards</FooterLink>
                  <FooterLink href="/services">Services</FooterLink>
                  <FooterLink href="/parts">Parts & equipment</FooterLink>
                  <FooterLink href="/crew-jobs">Crew jobs</FooterLink>
                </div>
              </div>

              <div>
                <FooterHeading>Learn</FooterHeading>
                <div className="mt-4 grid gap-2">
                  <FooterLink href="/guides/buying-a-yacht">Buying guide</FooterLink>
                  <FooterLink href="/guides/selling-a-yacht">Selling guide</FooterLink>
                  <FooterLink href="/guides/charter-guide">Charter guide</FooterLink>
                  <FooterLink href="/guides/survey-inspection">Survey & inspection</FooterLink>
                  <FooterLink href="/guides/finance">Finance & ownership</FooterLink>
                  <FooterLink href="/news">News</FooterLink>
                  <FooterLink href="/reports">Reports</FooterLink>
                </div>
              </div>

              <div>
                <FooterHeading>Company</FooterHeading>
                <div className="mt-4 grid gap-2">
                  <FooterLink href="/about">About</FooterLink>
                  <FooterLink href="/contact">Contact</FooterLink>
                  <FooterLink href="/support">Support</FooterLink>
                  <FooterLink href="/careers">Careers</FooterLink>
                  <FooterLink href="/blog">Blog</FooterLink>
                  <FooterLink href="/faq">FAQ</FooterLink>
                </div>

                <div className="mt-8">
                  <FooterHeading>Socials</FooterHeading>
                  <div className="mt-4 grid gap-2">
                    <FooterLink href="/instagram">Instagram</FooterLink>
                    <FooterLink href="/linkedin">LinkedIn</FooterLink>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-8 border-t border-slate-200 pt-10 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <FooterHeading>For Brokers</FooterHeading>
                <div className="mt-4 grid gap-2">
                  <FooterLink href="/brokers/join">Join as a broker</FooterLink>
                  <FooterLink href="/brokers/dashboard">Broker dashboard</FooterLink>
                  <FooterLink href="/brokers/pricing">Pricing</FooterLink>
                  <FooterLink href="/brokers/faq">Broker FAQ</FooterLink>
                </div>
              </div>

              <div>
                <FooterHeading>Trust & Safety</FooterHeading>
                <div className="mt-4 grid gap-2">
                  <FooterLink href="/verification">Verification</FooterLink>
                  <FooterLink href="/safety">Safety tips</FooterLink>
                  <FooterLink href="/scams">Avoid scams</FooterLink>
                  <FooterLink href="/report">Report a listing</FooterLink>
                </div>
              </div>

              <div>
                <FooterHeading>Legal</FooterHeading>
                <div className="mt-4 grid gap-2">
                  <FooterLink href="/privacy">Privacy Policy</FooterLink>
                  <FooterLink href="/cookies">Cookies</FooterLink>
                  <FooterLink href="/terms">Terms</FooterLink>
                  <FooterLink href="/disclaimer">Disclaimer</FooterLink>
                </div>
              </div>

              <div>
                <FooterHeading>Account</FooterHeading>
                <div className="mt-4 grid gap-2">
                  <FooterLink href="/login">Sign in</FooterLink>
                  <FooterLink href="/signup">Create account</FooterLink>
                  <FooterLink href="/my-listings">My listings</FooterLink>
                  <FooterLink href="/settings">Settings</FooterLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Findaly. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <FooterLink href="/add-listing">List a yacht</FooterLink>
            <FooterLink href="/buy">Browse listings</FooterLink>
            <FooterLink href="/brokers">Find a broker</FooterLink>
            <FooterLink href="/contact">Get in touch</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
