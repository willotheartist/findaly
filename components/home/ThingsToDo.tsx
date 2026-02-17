// components/home/ThingsToDo.tsx
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass } from "lucide-react";

type Item = {
  city: string;
  country: string;
  href: string;
  featured?: boolean;
};

const ITEMS: Item[] = [
  { city: "Monaco", country: "Monaco", href: "/destinations/monaco/things-to-do", featured: true },
  { city: "Nice", country: "France", href: "/destinations/nice/things-to-do" },
  { city: "Cannes", country: "France", href: "/destinations/cannes/things-to-do" },
  { city: "Antibes", country: "France", href: "/destinations/antibes/things-to-do" },
  { city: "Saint-Tropez", country: "France", href: "/destinations/saint-tropez/things-to-do" },

  { city: "Sanremo", country: "Italy", href: "/destinations/sanremo/things-to-do" },
  { city: "Genoa", country: "Italy", href: "/destinations/genoa/things-to-do" },
  { city: "Portofino", country: "Italy", href: "/destinations/portofino/things-to-do" },
  { city: "La Spezia", country: "Italy", href: "/destinations/la-spezia/things-to-do" },
  { city: "Naples", country: "Italy", href: "/destinations/naples/things-to-do" },

  { city: "Valencia", country: "Spain", href: "/destinations/valencia/things-to-do" },
  { city: "Barcelona", country: "Spain", href: "/destinations/barcelona/things-to-do" },
  { city: "Palma", country: "Spain", href: "/destinations/palma/things-to-do" },
  { city: "Ibiza", country: "Spain", href: "/destinations/ibiza/things-to-do" },
  { city: "Mahón", country: "Spain", href: "/destinations/mahon/things-to-do" },

  { city: "Split", country: "Croatia", href: "/destinations/split/things-to-do" },
  { city: "Dubrovnik", country: "Croatia", href: "/destinations/dubrovnik/things-to-do" },
  { city: "Hvar", country: "Croatia", href: "/destinations/hvar/things-to-do" },
  { city: "Kotor", country: "Montenegro", href: "/destinations/kotor/things-to-do" },
  { city: "Corfu", country: "Greece", href: "/destinations/corfu/things-to-do" },
];

export default function ThingsToDo() {
  const featured = ITEMS.find((x) => x.featured) ?? ITEMS[0];

  // ✅ only show 7 on the right (reduce vertical space)
  const rest = ITEMS.filter((x) => x.href !== featured.href).slice(0, 7);

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 text-[13px] font-medium tracking-wide text-[#999]">
              <Compass className="h-3.5 w-3.5" />
              Editorial guides
            </div>
            <h2 className="mt-3 text-[32px] font-normal tracking-[-0.025em] text-[#1a1a1a] sm:text-[38px]">
              Things to do
            </h2>
            <div className="mt-3 h-[2px] w-12 rounded-full bg-[#1a7a5c]" />
            <p className="mt-4 text-[15px] leading-relaxed text-[#999]">
              Curated port guides: anchorages, marinas, beach clubs, routes and local picks.
            </p>
          </div>

          <Link
            href="/destinations"
            className="group hidden items-center gap-2 text-[14px] font-medium text-[#555] no-underline transition-colors hover:text-[#1a1a1a] sm:inline-flex"
          >
            See all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Layout */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Featured card */}
          <Link
            href={featured.href}
            className="group relative overflow-hidden rounded-2xl no-underline lg:col-span-5"
            // ✅ flat Findaly lime background, no gradient, no glow
            style={{ backgroundColor: "#E9FF63" }}
          >
            <div className="relative flex min-h-[300px] flex-col justify-between p-8 sm:min-h-[320px] sm:p-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-md bg-black/[0.06] px-3 py-1 text-[12px] font-medium text-[#0a211f]/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0a211f]" />
                  Featured guide
                </div>

                <div className="mt-6 text-[44px] font-light leading-[1] tracking-[-0.03em] text-[#0a211f] sm:text-[52px]">
                  {featured.city}
                </div>
                <div className="mt-2 text-[14px] text-[#0a211f]/55">{featured.country}</div>

                <p className="mt-6 max-w-[44ch] text-[14px] leading-[1.7] text-[#0a211f]/65">
                  A quick, editorial route through the essentials — best marinas, anchorages,
                  beach clubs and day itineraries.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-[14px] font-medium text-[#0a211f]/70 transition-colors group-hover:text-[#0a211f]">
                  Explore the guide
                </span>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0a211f] text-[#E9FF63] transition-transform group-hover:scale-105">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </div>
          </Link>

          {/* List */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
              {/* List header */}
              <div className="border-b border-[#f5f5f4] px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-[#1a1a1a]">
                    Popular right now
                  </span>
                  <span className="text-[12px] text-[#ccc]">
                    {ITEMS.length} guides
                  </span>
                </div>
              </div>

              {/* Rows (7 only) */}
              <div className="divide-y divide-[#f5f5f4]">
                {rest.map((it) => (
                  <Link
                    key={it.href}
                    href={it.href}
                    className="group flex items-center justify-between gap-4 px-6 py-4 no-underline transition-colors hover:bg-[#f5f5f4]/50"
                  >
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[15px] font-medium text-[#1a1a1a]">
                          {it.city}
                        </span>
                        <span className="text-[13px] text-[#ccc]">
                          {it.country}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[12px] text-[#999]">
                        Marinas · Anchorages · Beach clubs · Routes
                      </div>
                    </div>

                    <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e5e5e5] bg-white text-[#ccc] transition-all group-hover:border-[#0a211f] group-hover:bg-[#0a211f] group-hover:text-[#E9FF63]">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="border-t border-[#f5f5f4] px-6 py-4 sm:hidden">
                <Link
                  href="/destinations"
                  className="inline-flex items-center gap-2 text-[14px] font-medium text-[#555] no-underline hover:text-[#1a1a1a]"
                >
                  See all guides <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop CTA */}
        <div className="mt-10 hidden justify-center sm:flex">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 rounded-lg border border-[#e5e5e5] bg-white px-6 py-3 text-[14px] font-medium text-[#555] no-underline transition-all hover:border-[#ccc] hover:text-[#1a1a1a]"
          >
            Browse all destination guides
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
