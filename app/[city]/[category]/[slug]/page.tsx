import React from "react";

type ListingPageProps = {
  params: {
    city: string;
    category: string;
    slug: string;
  };
};

export default function ListingPage({ params }: ListingPageProps) {
  const cityName =
    params.city.charAt(0).toUpperCase() + params.city.slice(1).replace(/-/g, " ");
  const prettySlug = params.slug.replace(/-/g, " ");

  return (
    <main className="min-h-screen bg-[#eceae3]">
      <div className="mx-auto max-w-4xl px-6 pb-16 pt-10 md:px-10 md:pt-16">
        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            {params.category} · {cityName}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {prettySlug}
          </h1>

          <p className="mt-3 text-sm text-neutral-700 md:text-base">
            This is a placeholder for a listing detail page. Soon this will be
            populated from the database with photos, services, pricing, opening
            hours and more.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="space-y-4 text-sm text-neutral-700">
              <div className="rounded-2xl bg-[#f5f3ed] p-4">
                <h2 className="text-sm font-semibold text-neutral-900">
                  About this place
                </h2>
                <p className="mt-2 text-sm text-neutral-700">
                  Description, services and highlights will appear here.
                </p>
              </div>

              <div className="rounded-2xl bg-[#f5f3ed] p-4">
                <h2 className="text-sm font-semibold text-neutral-900">
                  Opening hours
                </h2>
                <p className="mt-2 text-sm text-neutral-700">
                  Structured opening hours will be shown here.
                </p>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl bg-[#f5f3ed] p-4">
                <h2 className="text-sm font-semibold text-neutral-900">
                  Contact & location
                </h2>
                <p className="mt-2 text-sm text-neutral-700">
                  Address, website, phone and a small map preview will go here.
                </p>
              </div>

              <div
                id="claim"
                className="rounded-2xl bg-black p-4 text-sm text-white"
              >
                <h2 className="text-sm font-semibold">Own this business?</h2>
                <p className="mt-2 text-sm text-neutral-200">
                  Claim this listing to update details, add photos and see how
                  many people view your profile each week.
                </p>
                <button className="mt-3 w-full rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:shadow-md">
                  Claim this listing
                </button>
                <button className="mt-2 w-full rounded-xl border border-white/40 px-4 py-2 text-sm font-medium text-white/90 transition hover:-translate-y-0.5 hover:bg-white/10">
                  Boost visibility
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
