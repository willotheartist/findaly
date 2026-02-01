// components/destinations/DestinationHighlights.tsx
import DestinationLinkCard from "@/components/destinations/DestinationLinkCard";
import type { DestinationPageData } from "@/app/destinations/[slug]/_data";

function HighlightItem({
  title,
  description,
  emoji,
}: {
  title: string;
  description: string;
  emoji?: string;
}) {
  return (
    <div className="flex gap-4">
      {emoji && (
        <span className="text-2xl shrink-0 mt-0.5" role="img">
          {emoji}
        </span>
      )}
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function DestinationHighlights({
  data,
}: {
  data: DestinationPageData;
}) {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column: Where to start */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Where to start
              </h2>
              <p className="mt-2 text-base text-slate-500">
                Jump into planning with these guides
              </p>
            </div>

            <div className="space-y-4">
              {data.links.map((link) => (
                <DestinationLinkCard
                  key={link.href}
                  title={link.title}
                  description={link.description}
                  href={link.href}
                  badge={link.badge}
                  emoji={link.emoji}
                />
              ))}
            </div>
          </div>

          {/* Right column: Why you'll love it + Tips */}
          <div className="space-y-12">
            {/* Highlights */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Why you&apos;ll love it
                </h2>
                <p className="mt-2 text-base text-slate-500">
                  What makes {data.title} special
                </p>
              </div>

              <div className="space-y-6">
                {data.highlights.map((highlight, idx) => (
                  <HighlightItem
                    key={`${highlight.title}-${idx}`}
                    title={highlight.title}
                    description={highlight.description}
                    emoji={highlight.emoji}
                  />
                ))}
              </div>
            </div>

            {/* Tips */}
            {data.tips && data.tips.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg" role="img" aria-label="lightbulb">
                    💡
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">
                    Local tips
                  </h3>
                </div>

                <ul className="space-y-3">
                  {data.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-slate-700"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#F56462]" />
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}