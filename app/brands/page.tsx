//·app/brands/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import BrandsClient from "./BrandsClient";

export const metadata: Metadata = {
  title: "Yacht Brands Directory | Findaly",
  description:
    "Browse yachts for sale by brand. Explore popular yacht builders and jump into live inventory by brand on Findaly.",
};

type BrandAggRow = { brand: string | null; _count: { brand: number } };

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

function titleCaseWords(input: string) {
  return (input || "")
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export default async function BrandsPage() {
  const TAKE = 120;

  const brandAgg = await prisma.listing.groupBy({
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
  });

  const brands = (brandAgg as BrandAggRow[])
    .map((r) => ({
      name: String(r.brand ?? "").trim(),
      slug: slugifyLoose(String(r.brand ?? "")),
      count: Number(r._count.brand ?? 0),
    }))
    .filter((b) => b.name.length > 0 && b.slug.length > 0 && b.count > 0);

  // Fallback (if DB has no brands yet)
  const fallback = [
    "Beneteau",
    "Jeanneau",
    "Lagoon",
    "Sunseeker",
    "Azimut",
    "Princess",
    "Ferretti",
    "Pershing",
    "Bavaria",
    "Fairline",
    "Sanlorenzo",
    "Fountaine Pajot",
  ].map((name) => ({ name, slug: slugifyLoose(name), count: 0 }));

  const list = brands.length ? brands : fallback;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
          Explore
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Yacht brands
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Browse live inventory by builder. Jump straight into high-intent brand pages — and
          use the search to find a specific manufacturer fast.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/buy"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
          >
            Browse all boats →
          </Link>
          <Link
            href="/guides"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
          >
            Read buying guides →
          </Link>
        </div>
      </div>

      {/* Value props */}
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          {
            title: "Fast brand browsing",
            text: "Shortcut into the strongest inventory pages for serious buyer intent.",
          },
          {
            title: "Clean internal linking",
            text: "Brand hubs connect to models, years, countries, and guides over time.",
          },
          {
            title: "Designed for scale",
            text: "As listings grow, this page evolves into a full directory automatically.",
          },
        ].map((x) => (
          <div key={x.title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm font-semibold text-slate-900">{x.title}</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{x.text}</p>
          </div>
        ))}
      </div>

      {/* Directory */}
      <div className="mt-10">
        <BrandsClient brands={list.map((b) => ({ ...b, display: titleCaseWords(b.name) }))} />
      </div>

      {/* Bottom CTA */}
      <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-semibold tracking-tight text-slate-900">
              Want help choosing a brand?
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Tell us your lifestyle and budget — we’ll point you to the right boat type and builders.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/brokers"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
            >
              Find a broker →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
            >
              Contact →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}