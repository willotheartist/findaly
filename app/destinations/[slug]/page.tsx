import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import {
  ArrowRight,
  ExternalLink,
  Globe,
  Link2,
  Map,
  Sparkles,
} from "lucide-react";

import {
  getDestinationBySlug,
  getRelatedDestinations,
} from "./_data";
import DestinationSlugHero from "@/components/destinations/DestinationSlugHero";
import DestinationQuickFacts from "@/components/destinations/DestinationQuickFacts";
import DestinationHighlights from "@/components/destinations/DestinationHighlights";
import { absoluteUrl, truncate } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getDestinationBySlug(slug);

  if (!data) {
    return { title: "Destination Not Found | Findaly" };
  }

  const title = `${data.title} Yacht Destination Guide | Findaly`;
  const description =
    truncate(
      `${data.subtitle} Explore when to go, why it works, what to do, and how ${data.title} fits a yacht charter or ownership journey.`,
      160
    ) ||
    `Explore ${data.title}: when to go, why it works, what to do, and how it fits a yacht charter or ownership journey.`;

  const ogImage = absoluteUrl(data.heroImage || "/hero-charter.jpg");

  return {
    title,
    description,
    alternates: {
      canonical: `/destinations/${slug}`,
    },
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
    keywords: [
      `${data.title} yacht guide`,
      `${data.title} yacht destination`,
      `${data.title} charter guide`,
      `${data.title} boating guide`,
      `${data.title} marinas`,
      `${data.title} things to do`,
    ],
    openGraph: {
      type: "article",
      title,
      description,
      url: `/destinations/${slug}`,
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

export default async function DestinationSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getDestinationBySlug(slug);

  if (!data) return notFound();

  const related = getRelatedDestinations(slug, 3);

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
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelGuide",
    name: `${data.title} Yacht Destination Guide`,
    headline: `${data.title} Yacht Destination Guide`,
    description: data.subtitle,
    url: absoluteUrl(`/destinations/${data.slug}`),
    image: absoluteUrl(data.heroImage),
    about: [data.title, data.country, data.region, "Yacht charter", "Boating"],
    provider: {
      "@type": "Organization",
      name: "Findaly",
      url: absoluteUrl("/"),
    },
  };

  return (
    <main className="w-full bg-[#FAFAFA] text-slate-900">
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>{data.title} — Yacht Charter and Sailing Destination</h1>
        <p>Discover {data.title} as a sailing and yacht charter destination. Find marinas, anchorages and charter options on Findaly.</p>
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
      <Script
        id={`destination-faq-${data.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id={`destination-breadcrumb-${data.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id={`destination-travelguide-${data.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <DestinationSlugHero data={data} />

      <DestinationQuickFacts data={data} />

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Why {data.title} works
            </span>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {data.title} as a yacht destination
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-700">
              {data.overview}
            </p>

            <p className="mt-5 text-base leading-8 text-slate-700">
              {data.whyItWorks}
            </p>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Sparkles className="h-4 w-4 text-[#F56462]" />
              Best for
            </div>

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
              <p className="text-sm font-semibold text-slate-900">
                Budget feel
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {data.quickFacts.budget} · {data.quickFacts.vibe}
              </p>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <p className="text-sm font-semibold text-slate-900">
                Getting around
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {data.quickFacts.gettingAround}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <DestinationHighlights data={data} />

      <section className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-5 lg:grid-cols-3">
            {data.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-3xl border border-slate-200 bg-white p-6 no-underline shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  {link.emoji ? <span className="text-lg">{link.emoji}</span> : null}
                  <span>{link.title}</span>
                  {link.badge ? (
                    <span className="rounded-full bg-[#F56462]/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.14em] text-[#F56462]">
                      {link.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {link.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:text-[#F56462]">
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Map className="h-4 w-4 text-[#F56462]" />
                Signature experiences in {data.title}
              </div>
              <div className="mt-5 grid gap-3">
                {data.signatureExperiences.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Globe className="h-4 w-4 text-[#F56462]" />
                Local planning resources
              </div>
              <div className="mt-5 grid gap-3">
                {data.localResources.map((resource) => (
                  <a
                    key={resource.href}
                    href={resource.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 no-underline transition-colors hover:border-slate-300 hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-[#F56462]">
                            {resource.title}
                          </h3>
                          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                            {resource.type}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {resource.description}
                        </p>
                      </div>
                      <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Link2 className="h-4 w-4 text-[#F56462]" />
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
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Practical tips for {data.title}
              </h2>
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
          </div>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Frequently asked questions about {data.title}
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

      {related.length > 0 ? (
        <section className="pb-12 sm:pb-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Related destinations
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                Keep exploring nearby moods, alternative route ideas and other
                destination clusters that fit the same kind of trip.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/destinations/${item.slug}`}
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 no-underline transition-colors hover:border-slate-300 hover:bg-white"
                  >
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#F56462]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {item.region}, {item.country}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.subtitle}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="w-full pb-16 sm:pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,100,98,0.18),transparent_35%),linear-gradient(to_bottom_right,rgba(255,255,255,0.04),transparent_45%)]" />

            <div className="relative px-8 py-12 sm:px-12 sm:py-16">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl">
                  <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Ready to turn destination research into action?
                  </h2>
                  <p className="mt-3 text-base leading-8 text-white/70">
                    Browse charter opportunities, compare boats, or keep
                    exploring Findaly’s destination network.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/charter"
                    className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-white px-6 py-3.5 text-[15px] font-semibold text-slate-900 no-underline transition-opacity hover:opacity-90"
                  >
                    Browse charter
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/destinations"
                    className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/15 px-6 py-3.5 text-[15px] font-semibold text-white no-underline transition-colors hover:bg-white/5"
                  >
                    All destinations
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
