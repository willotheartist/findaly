import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const ITEMS = [
  { label: "Things to do in Monaco", href: "/destinations/monaco/things-to-do", showArrow: true },
  { label: "Things to do in Nice", href: "/destinations/nice/things-to-do" },
  { label: "Things to do in Cannes", href: "/destinations/cannes/things-to-do" },
  { label: "Things to do in Antibes", href: "/destinations/antibes/things-to-do" },
  { label: "Things to do in Saint-Tropez", href: "/destinations/saint-tropez/things-to-do" },

  { label: "Things to do in Sanremo", href: "/destinations/sanremo/things-to-do" },
  { label: "Things to do in Genoa", href: "/destinations/genoa/things-to-do" },
  { label: "Things to do in Portofino", href: "/destinations/portofino/things-to-do" },
  { label: "Things to do in La Spezia", href: "/destinations/la-spezia/things-to-do" },
  { label: "Things to do in Naples", href: "/destinations/naples/things-to-do" },

  { label: "Things to do in Valencia", href: "/destinations/valencia/things-to-do" },
  { label: "Things to do in Barcelona", href: "/destinations/barcelona/things-to-do" },
  { label: "Things to do in Palma", href: "/destinations/palma/things-to-do" },
  { label: "Things to do in Ibiza", href: "/destinations/ibiza/things-to-do" },
  { label: "Things to do in Mahón", href: "/destinations/mahon/things-to-do" },

  { label: "Things to do in Split", href: "/destinations/split/things-to-do" },
  { label: "Things to do in Dubrovnik", href: "/destinations/dubrovnik/things-to-do" },
  { label: "Things to do in Hvar", href: "/destinations/hvar/things-to-do" },
  { label: "Things to do in Kotor", href: "/destinations/kotor/things-to-do" },
  { label: "Things to do in Corfu", href: "/destinations/corfu/things-to-do" },
];

export default function ThingsToDo() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Match homepage SectionHeader style */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Things to do
            </h2>
            <p className="mt-1.5 text-base text-slate-500">
              Popular ports and destinations to explore
            </p>
          </div>

          <Link
            href="/destinations"
            className="group hidden items-center gap-2 text-sm font-medium text-slate-600 no-underline transition-colors hover:text-slate-900 sm:inline-flex"
          >
            See all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Pills grid (your lime + pink styling) */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {ITEMS.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="
                inline-flex
                h-[46px]
                items-center
                justify-center
                rounded-lg
                bg-[#E9FF63]
                px-4
                text-[14px]
                font-medium
                text-[#FF4D8A]
                transition
                hover:-translate-y-px
                active:translate-y-0
              "
            >
              <span className="inline-flex items-center gap-2">
                {item.label}
                {item.showArrow ? (
                  <ArrowUpRight className="h-4 w-4 text-[#FF4D8A]" />
                ) : null}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile CTA (matches your existing pattern) */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 no-underline hover:text-slate-900"
          >
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
