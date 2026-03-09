import type { DestinationPageData } from "@/app/destinations/[slug]/_data";

export default function DestinationHighlights({
  data,
}: {
  data: DestinationPageData;
}) {
  return (
    <section className="pb-12 sm:pb-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Highlights
            </span>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Why people choose {data.title}
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-700">
              The best yacht destinations are not just beautiful. They make route
              planning easier, create better days on the water, and give you
              enough variety ashore that the whole trip feels complete.
            </p>
          </div>

          <div className="grid gap-4">
            {data.highlights.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F56462]/10 text-xl">
                    <span aria-hidden="true">{item.emoji ?? "✦"}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
