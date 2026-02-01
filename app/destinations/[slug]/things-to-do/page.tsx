import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDestinationBySlug } from "../_data";

export default async function ThingsToDoStub({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getDestinationBySlug(slug);
  if (!data) return notFound();

  return (
    <main className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Things to do in {data.title}
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Stub page — next we’ll build the full editorial list + filters like your Airbnb vibe cards.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200/70">
          <div className="text-sm text-slate-700">
            Next steps:
            <ul className="mt-3 list-disc pl-5">
              <li>Filters: time, budget, vibe</li>
              <li>Card list with images + durations</li>
              <li>“If you only have half a day” group</li>
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/destinations/${data.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 no-underline shadow-sm ring-1 ring-slate-200/70 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              Back to {data.title}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 no-underline shadow-sm ring-1 ring-slate-200/70 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              Browse destinations
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
