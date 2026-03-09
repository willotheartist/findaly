// app/destinations/[slug]/things-to-do/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import {
  Anchor,
  ArrowRight,
  ExternalLink,
  MapPinned,
  ShipWheel,
  Sparkles,
  Utensils,
  Waves,
} from "lucide-react";

import { getDestinationBySlug } from "../_data";
import { absoluteUrl, truncate } from "@/lib/site";

type LinkLikeItem = {
  title: string;
  description: string;
  href: string;
};

type HighlightLikeItem = {
  title: string;
  description: string;
};

function isLinkLikeItem(value: unknown): value is LinkLikeItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;
  return (
    typeof item.title === "string" &&
    typeof item.description === "string" &&
    typeof item.href === "string"
  );
}

function isHighlightLikeItem(value: unknown): value is HighlightLikeItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;
  return (
    typeof item.title === "string" &&
    typeof item.description === "string"
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getDestinationBySlug(slug);

  if (!data) return { title: "Page Not Found | Findaly" };

  const title = `Things to Do in ${data.title} by Boat | Findaly`;
  const description =
    truncate(
      `Discover things to do in ${data.title}, from marinas and anchor spots to routes, local highlights and practical planning tips for a better yacht trip.`,
      160
    ) ||
    `Discover things to do in ${data.title} by boat.`;

  const ogImage = absoluteUrl(data.heroImage);

  return {
    title,
    description,
    alternates: {
      canonical: `/destinations/${slug}/things-to-do`,
    },
    openGraph: {
      title,
      description,
      url: `/destinations/${slug}/things-to-do`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function DestinationThingsToDoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getDestinationBySlug(slug);

  if (!data) return notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Findaly",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Destinations",
        item: absoluteUrl("/destinations"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.title,
        item: absoluteUrl(`/destinations/${data.slug}`),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `Things to do in ${data.title}`,
        item: absoluteUrl(`/destinations/${data.slug}/things-to-do`),
      },
    ],
  };

  const anchorSpots = data.links.filter((item) =>
    item.title.toLowerCase().includes("anchor")
  );

  const marinas = data.links.filter((item) =>
    item.title.toLowerCase().includes("marina")
  );

  const routeIdeas = data.links.filter(
    (item) =>
      !item.title.toLowerCase().includes("anchor") &&
      !item.title.toLowerCase().includes("marina")
  );

  const marinaItems: Array<LinkLikeItem | HighlightLikeItem> =
    marinas.length > 0 ? marinas : data.internalLinks;

  const anchorItems: Array<LinkLikeItem | HighlightLikeItem> =
    anchorSpots.length > 0 ? anchorSpots : data.highlights;

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-slate-900">
      <Script
        id={`things-faq-${data.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id={`things-breadcrumb-${data.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,100,98,0.08),transparent_32%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.05),transparent_26%)]" />
        <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-18">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <Link href="/destinations" className="no-underline hover:text-slate-900">
                Destinations
              </Link>
              <span>/</span>
              <Link
                href={`/destinations/${data.slug}`}
                className="no-underline hover:text-slate-900"
              >
                {data.title}
              </Link>
              <span>/</span>
              <span className="text-slate-900">Things to do</span>
            </div>

            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Things to do guide
            </span>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Things to do in {data.title}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">
              Planning a yacht trip in {data.title}? Start with the places,
              movements and stops that make the destination worth doing properly
              — from harbours and anchor spots to scenic route ideas, local
              highlights and practical planning notes.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/destinations/${data.slug}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 no-underline transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                Back to {data.title}
              </Link>
              <Link
                href="/charter"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F56462] px-5 py-3 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
              >
                Browse charter
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <ShipWheel className="h-5 w-5 text-[#F56462]" />
              <h2 className="mt-4 text-base font-semibold text-slate-950">
                Best time to explore
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {data.quickFacts.bestTime}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <Sparkles className="h-5 w-5 text-[#F56462]" />
              <h2 className="mt-4 text-base font-semibold text-slate-950">
                Destination feel
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {data.quickFacts.vibe}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <MapPinned className="h-5 w-5 text-[#F56462]" />
              <h2 className="mt-4 text-base font-semibold text-slate-950">
                Trip length that works
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {data.quickFacts.idealStay}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              What actually makes {data.title} worth doing
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700">
              {data.overview}
            </p>
            <p className="mt-5 text-base leading-8 text-slate-700">
              {data.whyItWorks}
            </p>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">
              Best for
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {data.bestFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <h3 className="text-sm font-semibold text-slate-900">
                Getting around
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {data.quickFacts.gettingAround}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section id="itineraries" className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-6">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Route ideas and standout experiences
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">
              These are the kinds of moves, stops and moments that shape a
              better trip on the water.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {data.signatureExperiences.map((item, index) => (
              <article
                key={`${item}-${index}`}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F56462]/10 text-[#F56462]">
                    <Waves className="h-5 w-5" />
                  </div>
                  <p className="text-sm leading-7 text-slate-700">{item}</p>
                </div>
              </article>
            ))}
          </div>

          {routeIdeas.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {routeIdeas.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-3xl border border-slate-200 bg-white p-5 no-underline shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <h3 className="text-base font-semibold text-slate-950 group-hover:text-[#F56462]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section id="marinas" className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Marinas and practical bases
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-700">
                Every destination needs a practical layer. This is where the
                trip becomes easier to operate, provision and structure.
              </p>
            </div>

            <div className="grid gap-4">
              {marinaItems.map((item, index) =>
                isLinkLikeItem(item) ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-3xl border border-slate-200 bg-white p-6 no-underline shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-colors hover:border-slate-300 hover:bg-slate-50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                        <MapPinned className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-950 group-hover:text-[#F56462]">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : isHighlightLikeItem(item) ? (
                  <article
                    key={`${item.title}-${index}`}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                        <MapPinned className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-950">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ) : null
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="anchor-spots" className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4">
              {anchorItems.map((item, index) => {
                if (!isLinkLikeItem(item) && !isHighlightLikeItem(item)) {
                  return null;
                }

                const itemKey = isLinkLikeItem(item)
                  ? item.href
                  : `${item.title}-${index}`;

                return (
                  <article
                    key={itemKey}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F56462]/10 text-[#F56462]">
                        <Anchor className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-950">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Anchor spots and calmer moments
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-700">
                Not every stop should be about logistics or hype. The best yacht
                destinations also need room for quiet water, a swim stop, lunch
                on board, or a slower hour that makes the whole day feel more
                intentional.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Local resources and planning links
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-700">
                Useful official and destination-led resources that help users go
                deeper than a generic summary page.
              </p>
            </div>

            <div className="grid gap-4">
              {data.localResources.map((resource) => (
                <a
                  key={resource.href}
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-3xl border border-slate-200 bg-white p-6 no-underline shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-950 group-hover:text-[#F56462]">
                          {resource.title}
                        </h3>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                          {resource.type}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {resource.description}
                      </p>
                    </div>
                    <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:px-8 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Utensils className="h-4 w-4 text-[#F56462]" />
              Practical tips
            </div>
            <div className="mt-5 grid gap-3">
              {data.localTips.map((tip) => (
                <div
                  key={tip}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700"
                >
                  {tip}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Sparkles className="h-4 w-4 text-[#F56462]" />
              Continue on Findaly
            </div>
            <div className="mt-5 grid gap-3">
              {data.internalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 no-underline transition-colors hover:border-slate-300 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-[#F56462]">
                        {link.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {link.description}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              FAQs about {data.title}
            </h2>

            <div className="mt-6 divide-y divide-slate-200">
              {data.faqs.map((faq) => (
                <div key={faq.question} className="py-5">
                  <h3 className="text-base font-semibold text-slate-900">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}