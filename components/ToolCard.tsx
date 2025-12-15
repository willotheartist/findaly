import Link from "next/link";
import {
  DollarSign,
  Layers,
  ArrowUpRight,
} from "lucide-react";

type Props = {
  tool: {
    slug: string;
    name: string;
    shortDescription: string;
    primaryCategory: string;
    pricingModel: string;
    startingPrice?: string | null;
  };
  featured?: boolean;
};

export function ToolCard({ tool, featured }: Props) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`
        group rounded-xl border
        ${featured ? "border-white/20" : "border-white/10"}
        bg-[#12141a] p-5
        transition hover:-translate-y-1 hover:border-white/30
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Logo placeholder */}
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-(--surface-2)/10 text-sm font-semibold text-white">
            {tool.name[0]}
          </div>

          <h3 className="font-medium text-white">
            {tool.name}
          </h3>
        </div>

        <ArrowUpRight
          size={16}
          className="text-white/40 transition group-hover:text-white"
        />
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-white/60 line-clamp-2">
        {tool.shortDescription}
      </p>

      {/* Meta */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/50">
        <span className="flex items-center gap-1">
          <Layers size={14} />
          {tool.primaryCategory}
        </span>

        <span className="flex items-center gap-1">
          <DollarSign size={14} />
          {tool.startingPrice ?? tool.pricingModel}
        </span>
      </div>
    </Link>
  );
}
