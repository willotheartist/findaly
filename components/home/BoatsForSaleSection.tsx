// components/home/BoatsForSaleSection.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sailboat, Sparkles, Heart, Trash2, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/db";

type Card = {
  title: string;
  href: string;
  meta: string;
  price?: string;
  badge?: string;
  image?: string;
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

function formatMeta(args: {
  lengthFt: number | null;
  year: number | null;
  location: string | null;
  country: string | null;
}) {
  const { lengthFt, year, location, country } = args;

  const a = lengthFt ? `${Math.round(lengthFt)} ft` : "— ft";
  const b = year ? `${year}` : "—";
  const c = location || country || "—";

  return `${a} • ${b} • ${c}`;
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

/** Shared “portal-style” listing card (same look as your homepage cards) */
function ListingCard({ it }: { it: Card }) {
  const splitMeta = (meta: string) => {
    const parts = meta.split("•").map((s) => s.trim()).filter(Boolean);
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
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200/80 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition group-hover:ring-slate-300">
              <Trash2 className="h-4 w-4 text-slate-500" />
            </div>
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200/80 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition group-hover:ring-slate-300">
              <Heart className="h-4 w-4 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="mt-1.5 text-sm text-slate-700">
          {location ? location : <span className="text-slate-500">Location</span>}
        </div>

        <div className="mt-2 text-sm text-slate-500">{specs}</div>

        <div className="mt-3 line-clamp-1 text-[15px] font-medium text-slate-900">
          {it.title}
        </div>
      </div>

      {/* Footer bar */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-[10px] font-semibold text-white">
            F
          </div>
          <div className="truncate text-sm text-slate-500">Findaly</div>
        </div>

        <div className="inline-flex h-9 w-11 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200/80 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition group-hover:ring-slate-300">
          <MessageCircle className="h-4 w-4 text-slate-600" />
        </div>
      </div>
    </Link>
  );
}

function CardRail({ items }: { items: Card[] }) {
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

type FontsReady = Promise<unknown>;
function getFontsReady(): FontsReady | undefined {
  const maybe = document as unknown as { fonts?: { ready?: Promise<unknown> } };
  return maybe.fonts?.ready;
}

export default async function BoatsForSaleSection() {
  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      profile: {
        select: { isVerified: true },
      },
      media: {
        orderBy: { sort: "asc" },
        take: 1,
      },
    },
  });

  const items: Card[] = listings.map((l) => {
    const media0 = l.media?.[0] ?? null;
    const image = media0?.url ?? undefined;

    return {
      title: l.title ?? "Untitled listing",
      href: `/buy/${l.slug}`,
      meta: formatMeta({
        lengthFt: l.lengthFt ?? null,
        year: l.year ?? null,
        location: l.location ?? null,
        country: l.country ?? null,
      }),
      price: formatMoney(l.priceCents ?? null, l.currency ?? null),
      badge: l.profile?.isVerified ? "Verified" : undefined,
      image,
    };
  });

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeader
          title="Boats for sale"
          subtitle="Fresh listings from brokers and private sellers"
          href="/buy"
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
