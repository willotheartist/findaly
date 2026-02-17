// components/home/HomeSplitCtas.tsx
import Link from "next/link";
import Image from "next/image";

type CtaCard = {
  title: string;
  body: string;
  cta: string;
  href: string;
  imageSrc: string;
  imageAlt?: string;
};

export default function HomeSplitCtas({
  items,
}: {
  items?: [CtaCard, CtaCard];
}) {
  const data: [CtaCard, CtaCard] =
    items ??
    [
      {
        title: "Looking for a Charter?",
        body:
          "Browse day charters, weekly charters and crewed options — all in one place.",
        cta: "Book a Charter",
        href: "/charter",
        imageSrc: "/Charter.png",
        imageAlt: "Charter yacht",
      },
      {
        title: "Looking for Holiday Ideas?",
        body:
          "Explore destinations, routes and things to do — then match boats to the plan.",
        cta: "Search for Holidays",
        href: "/destinations",
        imageAlt: "Holiday ideas",
        imageSrc: "/Holiday.png",
      },
    ];

  return (
    <section className="w-full bg-white">
      {/* ⬇️ Reduced width + more breathing room */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {data.map((it) => (
            <div
              key={it.href}
              className="relative overflow-hidden rounded-3xl ring-1 ring-slate-200/70"
              style={{ height: "420px" }} // ⬅️ No more massive vh blocks
            >
              {/* Image */}
              <Image
                src={it.imageSrc}
                alt={it.imageAlt ?? it.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />

              {/* Subtle overlay (lighter than before) */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full px-8">
                  <div className="mx-auto max-w-[520px] text-center">
                    {/* ⬇️ Editorial scale, not hero scale */}
                    <h3 className="font-serif text-[28px] leading-tight tracking-tight text-white sm:text-[32px]">
                      {it.title}
                    </h3>

                    <p className="mx-auto mt-4 text-[14px] leading-relaxed text-white/80">
                      {it.body}
                    </p>

                    <div className="mt-6 flex justify-center">
                      <Link
                        href={it.href}
                        className="inline-flex items-center justify-center rounded-lg bg-[#E9FF63] px-6 py-3 text-[13px] font-medium text-[#0a211f] no-underline transition hover:brightness-105 active:brightness-95"
                      >
                        {it.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Very subtle hover lift */}
              <div className="pointer-events-none absolute inset-0 transition duration-300 group-hover:brightness-[1.02]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
