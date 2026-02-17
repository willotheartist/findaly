// components/seo/SeoLinkBlock.tsx
import Link from "next/link";

export type SeoLinkItem = {
  label: string;
  href: string;
  hint?: string;
};

export default function SeoLinkBlock({
  title,
  subtitle,
  items,
  max = 12,
}: {
  title: string;
  subtitle?: string;
  items: SeoLinkItem[];
  max?: number;
}) {
  const data = (items || []).filter(Boolean).slice(0, max);

  if (!data.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
      <div className="flex flex-col gap-1">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {subtitle ? <div className="text-sm text-slate-500">{subtitle}</div> : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {data.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="group rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
            title={it.hint || it.label}
          >
            {it.label}
            <span className="ml-1 text-slate-300 transition group-hover:text-slate-500">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
