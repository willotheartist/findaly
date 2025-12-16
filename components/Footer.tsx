// components/Footer.tsx
import Link from "next/link";
import { Compass, ArrowUpRight } from "lucide-react";

const COLS: Array<{
  title: string;
  links: Array<{ label: string; href: string; external?: boolean }>;
}> = [
  {
    title: "Product",
    links: [
      { label: "Tools", href: "/tools" },
      { label: "Best", href: "/best" },
      { label: "Alternatives", href: "/alternatives" },
      { label: "Use cases", href: "/use-cases" },
      { label: "Submit a tool", href: "/submit" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Sitemap", href: "/sitemap.xml", external: true },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "X (Twitter)", href: "https://x.com", external: true },
      { label: "GitHub", href: "https://github.com", external: true },
      { label: "Email", href: "mailto:hello@findaly.com", external: true },
    ],
  },
];

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const cls =
    "inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
        <ArrowUpRight size={14} className="opacity-60" />
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-white/10 bg-(--bg) text-(--text)">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_2.85fr]">
          {/* Brand (quiet, Notion-ish) */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <Compass size={18} className="text-white/85" />
              </span>
              <span className="text-sm font-semibold tracking-tight text-white/90">
                Findaly
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
              Decision-first software discovery.
            </p>
          </div>

          {/* Columns */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {COLS.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <FooterLink href={l.href} external={l.external}>
                        {l.label}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar (subtle) */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
          <div className="text-sm text-white/45">© {year} Findaly</div>

          <div className="flex items-center gap-4 text-sm">
            <FooterLink href="/submit">Submit</FooterLink>
            <FooterLink href="/tools">Browse</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
