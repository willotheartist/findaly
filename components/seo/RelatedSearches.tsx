// components/seo/RelatedSearches.tsx
import Link from "next/link";

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

function PillLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-[13.5px] font-medium no-underline transition-colors"
      style={{
        borderColor: "rgba(10,33,31,0.10)",
        background: "rgba(10,33,31,0.02)",
        color: "rgba(10,33,31,0.75)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(10,33,31,0.06)";
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(10,33,31,0.18)";
        (e.currentTarget as HTMLAnchorElement).style.color = "rgba(10,33,31,0.9)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(10,33,31,0.02)";
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(10,33,31,0.10)";
        (e.currentTarget as HTMLAnchorElement).style.color = "rgba(10,33,31,0.75)";
      }}
    >
      {children}
    </Link>
  );
}

function Panel({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        borderColor: "rgba(10,33,31,0.10)",
        background: "rgba(10,33,31,0.02)",
      }}
    >
      <div
        className="text-[13px] font-semibold tracking-tight"
        style={{ color: "#0a211f" }}
      >
        {title}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">{children}</div>

      {footer ? (
        <div
          className="mt-3 text-[12px] leading-relaxed"
          style={{ color: "rgba(10,33,31,0.45)" }}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}

type Kind = "brand" | "model" | "country" | "year";

const mustString = (v: unknown): v is string => typeof v === "string" && v.length > 0;

export default function RelatedSearches(props: {
  kind: Kind;

  // brand hub
  brandDisplay?: string;
  brandSlug?: string;

  // model hub
  modelDisplay?: string;
  modelSlug?: string;

  // country hub
  countryDisplay?: string;
  countrySlug?: string;

  // year hub
  year?: number;

  // shared lists
  brands?: string[];
  models?: string[];
  countries?: string[];
  years?: number[];

  maxPills?: number;
}) {
  const {
    kind,
    brandDisplay,
    brandSlug,
    modelDisplay,
    modelSlug,
    countryDisplay,
    countrySlug,
    year,
    brands = [],
    models = [],
    countries = [],
    years = [],
    maxPills = 10,
  } = props;

  const hasAny =
    brands.length > 0 || models.length > 0 || countries.length > 0 || years.length > 0;

  if (!hasAny && kind !== "year") return null;

  // BRAND HUB
  if (kind === "brand") {
    if (!mustString(brandDisplay) || !mustString(brandSlug)) return null;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {models.length ? (
          <Panel title="Popular models" footer={`Explore ${brandDisplay} by model.`}>
            {models.slice(0, maxPills).map((m) => (
              <PillLink key={m} href={`/buy/brand/${brandSlug}/model/${slugifyLoose(m)}`}>
                {brandDisplay} {m}
              </PillLink>
            ))}
          </Panel>
        ) : null}

        {countries.length ? (
          <Panel title="Top countries" footer="Refine by location for faster shortlists.">
            {countries.slice(0, maxPills).map((c) => (
              <PillLink key={c} href={`/buy/brand/${brandSlug}/country/${slugifyLoose(c)}`}>
                {c}
              </PillLink>
            ))}
          </Panel>
        ) : null}

        {years.length ? (
          <Panel title="Browse by year" footer="Compare generations, specs, and pricing.">
            {years.slice(0, Math.min(12, maxPills)).map((y) => (
              <PillLink key={y} href={`/buy/brand/${brandSlug}/year/${y}`}>
                {y}
              </PillLink>
            ))}
          </Panel>
        ) : null}
      </div>
    );
  }

  // MODEL HUB
  if (kind === "model") {
    if (!mustString(modelDisplay) || !mustString(modelSlug)) return null;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {brands.length ? (
          <Panel title="Top brands" footer="Brand+model hubs (highest intent).">
            {brands.slice(0, maxPills).map((b) => (
              <PillLink key={b} href={`/buy/brand/${slugifyLoose(b)}/model/${modelSlug}`}>
                {b}
              </PillLink>
            ))}
          </Panel>
        ) : null}

        {countries.length ? (
          <Panel title="Top countries" footer="Refine by location for faster shortlists.">
            {countries.slice(0, maxPills).map((c) => (
              <PillLink key={c} href={`/buy/model/${modelSlug}/country/${slugifyLoose(c)}`}>
                {c}
              </PillLink>
            ))}
          </Panel>
        ) : null}

        {years.length ? (
          <Panel title="Browse by year" footer="Compare generations, specs, and pricing.">
            {years.slice(0, Math.min(12, maxPills)).map((y) => (
              <PillLink key={y} href={`/buy/model/${modelSlug}/year/${y}`}>
                {y}
              </PillLink>
            ))}
          </Panel>
        ) : null}
      </div>
    );
  }

  // COUNTRY HUB
  if (kind === "country") {
    if (!mustString(countryDisplay) || !mustString(countrySlug)) return null;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {brands.length ? (
          <Panel title="Popular brands" footer={`Explore brand hubs inside ${countryDisplay}.`}>
            {brands.slice(0, maxPills).map((b) => (
              <PillLink key={b} href={`/buy/brand/${slugifyLoose(b)}/country/${countrySlug}`}>
                {b}
              </PillLink>
            ))}
          </Panel>
        ) : null}

        {models.length ? (
          <Panel title="Popular models" footer={`Explore model hubs inside ${countryDisplay}.`}>
            {models.slice(0, maxPills).map((m) => (
              <PillLink key={m} href={`/buy/model/${slugifyLoose(m)}/country/${countrySlug}`}>
                {m}
              </PillLink>
            ))}
          </Panel>
        ) : null}

        {years.length ? (
          <Panel title="Browse by year" footer="High-intent filters for location-specific searches.">
            {years.slice(0, Math.min(12, maxPills)).map((y) => (
              <PillLink key={y} href={`/buy/country/${countrySlug}/year/${y}`}>
                {y}
              </PillLink>
            ))}
          </Panel>
        ) : null}
      </div>
    );
  }

  // YEAR HUB
  if (kind === "year") {
    if (typeof year !== "number" || Number.isNaN(year)) return null;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {brands.length ? (
          <Panel title="Popular brands" footer={`Browse ${year} listings by brand.`}>
            {brands.slice(0, maxPills).map((b) => (
              <PillLink key={b} href={`/buy/year/${year}/brand/${slugifyLoose(b)}`}>
                {b}
              </PillLink>
            ))}
          </Panel>
        ) : null}

        {models.length ? (
          <Panel title="Popular models" footer={`Browse ${year} listings by model.`}>
            {models.slice(0, maxPills).map((m) => (
              <PillLink key={m} href={`/buy/year/${year}/model/${slugifyLoose(m)}`}>
                {m}
              </PillLink>
            ))}
          </Panel>
        ) : null}

        {countries.length ? (
          <Panel title="Top countries" footer={`Browse ${year} listings by location.`}>
            {countries.slice(0, maxPills).map((c) => (
              <PillLink key={c} href={`/buy/year/${year}/country/${slugifyLoose(c)}`}>
                {c}
              </PillLink>
            ))}
          </Panel>
        ) : null}
      </div>
    );
  }

  return null;
}
