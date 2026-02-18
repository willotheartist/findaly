// components/seo/PillarRelatedSearches.tsx
import Link from "next/link";

type Item = { label: string; href: string };

export default function PillarRelatedSearches({
  title = "Popular searches",
  subtitle = "Jump into high-intent browsing.",
  items = [],
}: {
  title?: string;
  subtitle?: string;
  items: Item[];
}) {
  if (!items.length) return null;

  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        borderColor: "rgba(10,33,31,0.10)",
        background: "rgba(10,33,31,0.02)",
      }}
    >
      <p
        className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-2"
        style={{ color: "rgba(10,33,31,0.40)" }}
      >
        {title}
      </p>

      <p
        className="text-[13px] leading-relaxed mb-4"
        style={{ color: "rgba(10,33,31,0.55)" }}
      >
        {subtitle}
      </p>

      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <Link
            key={it.href + it.label}
            href={it.href}
            className="inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-[13.5px] font-medium no-underline transition-colors"
            style={{
              borderColor: "rgba(10,33,31,0.10)",
              background: "rgba(10,33,31,0.02)",
              color: "rgba(10,33,31,0.78)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(10,33,31,0.06)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(10,33,31,0.18)";
              (e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(10,33,31,0.92)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(10,33,31,0.02)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(10,33,31,0.10)";
              (e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(10,33,31,0.78)";
            }}
          >
            {it.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
