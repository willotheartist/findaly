import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/components/destinations/destinations.data";

export default function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group block overflow-hidden rounded-md border border-slate-200 bg-white no-underline hover:bg-slate-50"
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={Boolean(destination.featured)}
        />
        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white/90 px-2 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F56462]" />
          {destination.country}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold tracking-tight text-slate-900">
              {destination.name}
            </h3>
            <p className="mt-1 text-sm text-slate-700">{destination.region}</p>
          </div>

          <span className="hidden rounded-md bg-[#E9FF63] px-2 py-1 text-xs font-semibold text-slate-900 sm:inline-flex">
            Explore
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {destination.vibeTags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
