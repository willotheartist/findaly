//·components/home/BoatsForSaleSection.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sailboat, Sparkles, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import SaveListingButtonClient from "@/components/listing/SaveListingButtonClient";

type Card = {
  id: string;
  title: string;
  href: string;
  meta: string;
  price?: string;
  badge?: string;
  image?: string;
  sellerName?: string;
};

function formatMoney(priceCents: number | null, currency: string | null) {
  if (!priceCents || !currency) return undefined;
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(priceCents / 100);
  } catch {
    return `${Math.round(priceCents / 100).toLocaleString("en-GB")} ${currency}`;
  }
}

function safeTrim(s: string | null | undefined) {
  return (s || "").trim();
}

function formatMeta(args: {
  lengthM: number | null;
  lengthFt: number | null;
  year: number | null;
  location: string | null;
  country: string | null;
}) {
  const { lengthM, lengthFt, year, location, country } = args;

  const len =
    typeof lengthM === "number" && lengthM > 0
      ? `${lengthM.toFixed(1)}m`
      : typeof lengthFt === "number" && lengthFt > 0
        ? `${Math.round(lengthFt)}ft`
        : null;

  const yr = year && year > 0 ? String(year) : null;
  const loc = safeTrim(location) || safeTrim(country) || null;

  const parts = [len, yr, loc].filter(Boolean) as string[];
  return parts.length ? parts.join(" • ") : "—";
}

function SectionHeader({
  title,
  subtitle,
  href,
  cta = "See all",
}: {
  title: string;
  subtitle?: string;
  href: string;
  cta?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>
        {subtitle ? <p className="mt-1.5 text-base text-slate-500">{subtitle}</p> : null}
      </div>

      <Link
        href={href}
        className="group hidden items-center gap-2 text-sm font-medium text-slate-600 no-underline transition-colors hover:text-slate-900 sm:inline-flex"
      >
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

function ListingCard({ it }: { it: Card }) {
  const splitMeta = (meta: string) => {
    const parts = meta
      .split("•")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length <= 1) return { specs: meta, location: "" };
    return {
      specs: parts.slice(0, -1).join(" • "),
      location: parts[parts.length - 1],
    };
  };

  const { specs, location } = splitMeta(it.meta);

  return (
    <Link
      href={it.href}
      className="group overflow-hidden rounded-2xl bg-white no-underline shadow-sm ring-1 ring-slate-200/70 transition-all duration-300 hover:shadow-md hover:ring-slate-300"
    >
      {/* Image */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
        {it.image ? (
          <Image
            src={it.image}
            alt={it.title}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-slate-100 to-slate-50">
            <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_30%_40%,rgba(0,0,0,0.06),transparent)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sailboat className="h-16 w-16 text-slate-200 transition-transform duration-500 group-hover:scale-110" />
            </div>
          </div>
        )}

        {it.badge ? (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-sm ring-1 ring-black/5">
            <Sparkles className="h-3 w-3 text-[#ff6a00]" />
            {it.badge}
          </div>
        ) : null}
      </div>

      {/* Body */}
      <div className="px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="text-[22px] font-semibold tracking-tight text-slate-900">
            {it.price ?? "POA"}
          </div>

          <div className="flex items-center gap-2">
            <SaveListingButtonClient listingId={it.id} />
          </div>
        </div>

        <div className="mt-1.5 text-sm text-slate-700">
          {location ? location : <span className="text-slate-500">—</span>}
        </div>

        <div className="mt-2 text-sm text-slate-500">{specs && specs !== "—" ? specs : "—"}</div>

        <div className="mt-3 line-clamp-1 text-[15px] font-medium text-slate-900">
          {it.title}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-[10px] font-semibold text-white">
            {it.sellerName ? it.sellerName.trim().slice(0, 1).toUpperCase() : "F"}
          </div>
          <div className="truncate text-sm text-slate-500">{it.sellerName || "Findaly"}</div>
        </div>

        <div className="inline-flex h-9 w-11 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200/80 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition group-hover:ring-slate-300">
          <MessageCircle className="h-4 w-4 text-slate-600" />
        </div>
      </div>
    </Link>
  );
}

function CardRail({ items }: { items: Card[] }) {
  if (!items.length) return null;
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-3">
      {items.map((it) => (
        <div key={it.href} className="min-w-[320px] sm:min-w-0">
          <ListingCard it={it} />
        </div>
      ))}
    </div>
  );
}

export default async function BoatsForSaleSection() {
  const TAKE = 3;

  const listings = await prisma.listing.findMany({
    where: {
      status: "LIVE",
      kind: "VESSEL",
      intent: "SALE",

      // ✅ filter out obvious dummy/test titles
      NOT: [
        { title: { contains: "test", mode: "insensitive" } },
        { title: { contains: "dummy", mode: "insensitive" } },
        { title: { contains: "sample", mode: "insensitive" } },
        { title: { contains: "lorem", mode: "insensitive" } },
      ],

      // ✅ ensure there is at least 1 media item (so featured looks real)
      media: { some: {} },

      // ✅ basic “real listing signals”
      AND: [
        {
          OR: [
            { priceCents: { gt: 0 } },
            { year: { gt: 0 } },
            { lengthM: { gt: 0 } },
            { lengthFt: { gt: 0 } },
            { brand: { not: null } },
            { model: { not: null } },
            { boatCategory: { not: null } },
          ],
        },
      ],
    },

    // ✅ newest first (avoid the earliest dummy content)
    orderBy: [{ createdAt: "desc" }],

    take: TAKE,

    include: {
      profile: { select: { name: true, isVerified: true } },
      media: { orderBy: { sort: "asc" }, take: 1 },
    },
  });

  const items: Card[] = listings.map((l) => {
    const media0 = l.media?.[0] ?? null;
    const image = media0?.url ?? undefined;

    return {
      id: l.id,
      title: l.title || "Untitled listing",
      href: `/buy/${l.slug}`,
      meta: formatMeta({
        lengthM: l.lengthM ?? null,
        lengthFt: l.lengthFt ?? null,
        year: l.year ?? null,
        location: l.location ?? null,
        country: l.country ?? null,
      }),
      price: formatMoney(l.priceCents ?? null, l.currency ?? null),
      badge: l.profile?.isVerified ? "Verified" : undefined,
      image,
      sellerName: l.profile?.name ?? undefined,
    };
  });

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeader
          title="Featured boats for sale"
          subtitle="Hand-picked listings worth a closer look"
          href="/buy"
          cta="View all boats"
        />

        <CardRail items={items} />

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/buy"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 no-underline hover:text-slate-900"
          >
            View all boats <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}