// components/destinations/DestinationLinkCard.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DestinationLinkCard({
  title,
  description,
  href,
  badge,
  emoji,
}: {
  title: string;
  description: string;
  href: string;
  badge?: string;
  emoji?: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-slate-200 bg-white p-5 no-underline transition-all duration-200 hover:border-slate-300 hover:shadow-sm sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header with emoji and badge */}
          <div className="flex items-center gap-3 mb-2">
            {emoji && (
              <span className="text-xl shrink-0" role="img">
                {emoji}
              </span>
            )}
            <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#F56462] transition-colors">
              {title}
            </h3>
            {badge && (
              <span className="inline-flex items-center rounded-md bg-[#E9FF63] px-2 py-0.5 text-xs font-semibold text-slate-800">
                {badge}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-slate-600">{description}</p>
        </div>

        {/* Arrow indicator */}
        <div className="shrink-0 mt-1">
          <ArrowRight className="h-5 w-5 text-slate-400 transition-all group-hover:text-slate-600 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}