"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

export type TocItem = { id: string; label: string };
export type StatItem = { value: string; label: string };
export type Cta = { href: string; label: string };
export type ExploreLink = { href: string; label: string; emoji?: string };
export type Faq = { q: string; a: string };
export type Crumb = { href?: string; label: string };

function useTocTracker(toc: TocItem[]) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const ids = toc.map((t) => t.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId((visible[0].target as HTMLElement).id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  return activeId;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#0a211f]/10 bg-[#0a211f]/[0.02] px-3 py-1 text-[13px] font-medium text-[#0a211f]/70">
      {children}
    </span>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-2 text-[15.5px] leading-relaxed text-[#0a211f]/70">
      {items.map((t) => (
        <li key={t} className="flex gap-3">
          <span className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#fff86c]" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="section-label">{children}</p>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="section-heading">{children}</h2>;
}

export type PillarShellProps = {
  kicker: string;
  title: React.ReactNode;
  description: string;

  heroImage: string;
  heroAlt: string;

  primaryCta: Cta;
  secondaryCta?: Cta;

  pills?: string[];
  stats?: StatItem[];

  toc: TocItem[];

  asideCta?: {
    imageSrc: string;
    imageAlt: string;
    title: string;
    body: string;
    button: Cta;
  };

  explore?: ExploreLink[];

  children: React.ReactNode;

  faqs?: Faq[];
  openFaqDefault?: number | null;

  bottomCta?: {
    kicker?: string;
    title: React.ReactNode;
    body: string;
    primary: Cta;
    secondary?: Cta;
  };

  related?: ExploreLink[];

  breadcrumbs?: Crumb[];
};

export default function PillarShell({
  kicker,
  title,
  description,
  heroImage,
  heroAlt,
  primaryCta,
  secondaryCta,
  pills = [],
  stats = [],
  toc,
  asideCta,
  explore = [],
  children,
  faqs,
  openFaqDefault = null,
  bottomCta,
  related = [],
  breadcrumbs = [],
}: PillarShellProps) {
  const activeId = useTocTracker(toc);
  const [openFaq, setOpenFaq] = useState<number | null>(openFaqDefault);

  const hasStats = stats.length > 0;
  const hasAside = asideCta || explore.length > 0;

  const styleBlock = useMemo(
    () => `
      .pillar-page { background-color: #f5f2eb; color: #1a1a1a; }
      .article-body p { font-size: 17px; line-height: 1.78; color: rgba(10,33,31,0.72); margin-bottom: 1.55rem; }
      .article-body strong { color: #0a211f; font-weight: 650; }
      .article-body a.inline-link { color: #0a211f; text-decoration: underline; text-underline-offset: 3px; }
      .section-label { font-size: 12px; font-weight: 650; letter-spacing: 0.18em; text-transform: uppercase; color: #0a211f; opacity: 0.42; margin-bottom: 0.75rem; }
      .section-heading { font-size: clamp(28px, 3.5vw, 42px); line-height: 1.1; letter-spacing: -0.02em; color: #0a211f; margin-bottom: 1.75rem; font-weight: 750; }
      .pull-quote { font-size: clamp(22px, 2.8vw, 32px); line-height: 1.42; color: #0a211f; border-left: 3px solid #fff86c; padding-left: 1.5rem; margin: 2.5rem 0; font-style: italic; opacity: 0.9; }
      .toc-link { display: block; padding: 6px 0; font-size: 13.5px; color: rgba(10,33,31,0.35); transition: color 0.2s; text-decoration: none; }
      .toc-link:hover { color: rgba(10,33,31,0.72); }
      .toc-link-active { color: #0a211f !important; font-weight: 650; }
      .toc-link-active::before { content: '—'; margin-right: 8px; color: #fff86c; }
      .stat-card { padding: 28px 24px; background: rgba(10,33,31,0.04); border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.08); }
      .callout { padding: 22px 22px; border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.10); background: rgba(10,33,31,0.02); }
      .table { width: 100%; border-collapse: separate; border-spacing: 0; overflow: hidden; border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.10); background: rgba(255,255,255,0.65); }
      .table th { text-align: left; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(10,33,31,0.55); padding: 14px 16px; border-bottom: 1px solid rgba(10,33,31,0.08); background: rgba(10,33,31,0.02); }
      .table td { padding: 14px 16px; vertical-align: top; border-bottom: 1px solid rgba(10,33,31,0.06); color: rgba(10,33,31,0.72); font-size: 14.5px; line-height: 1.6; }
      .table tr:last-child td { border-bottom: none; }
      .faq-item { border-bottom: 1px solid rgba(10,33,31,0.08); }
      .faq-question { width: 100%; text-align: left; padding: 20px 0; font-size: 16px; font-weight: 650; color: #0a211f; display: flex; justify-content: space-between; align-items: center; background: none; border: none; cursor: pointer; gap: 16px; }
      .faq-answer { font-size: 15px; line-height: 1.7; color: rgba(10,33,31,0.66); padding-bottom: 20px; }
      .pillar-link { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.1); font-size: 14px; font-weight: 650; color: #0a211f; text-decoration: none; transition: all 0.2s; background: rgba(10,33,31,0.02); }
      .pillar-link:hover { background: rgba(10,33,31,0.06); border-color: rgba(10,33,31,0.2); }
    `,
    []
  );

  return (
    <>
      <style>{styleBlock}</style>

      <div className="pillar-page min-h-screen pb-0">
        {/* HERO */}
        <div className="relative h-[72vh] min-h-[560px] w-full overflow-hidden">
          <Image src={heroImage} alt={heroAlt} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a211f]/70 via-[#0a211f]/30 to-[#f5f2eb]" />

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.p
              className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#fff86c] mb-4"
              variants={fadeUp}
            >
              {kicker}
            </motion.p>

            <motion.h1
              className="text-[clamp(36px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-4xl"
              variants={fadeUp}
            >
              {title}
            </motion.h1>

            <motion.p
              className="mt-6 text-[17px] text-white/70 max-w-2xl leading-relaxed"
              variants={fadeUp}
            >
              {description}
            </motion.p>

            <motion.div className="mt-8 flex gap-3 flex-wrap justify-center" variants={fadeUp}>
              <Link
                href={primaryCta.href}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] transition-opacity hover:opacity-90"
              >
                {primaryCta.label}
              </Link>

              {secondaryCta ? (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
                >
                  {secondaryCta.label}
                </Link>
              ) : null}
            </motion.div>

            {pills.length ? (
              <motion.div className="mt-7 flex flex-wrap gap-2 justify-center" variants={fadeUp}>
                {pills.map((p) => (
                  <Pill key={p}>{p}</Pill>
                ))}
              </motion.div>
            ) : null}
          </motion.div>
        </div>

        {/* STATS */}
        {hasStats ? (
          <motion.div
            className="mx-auto max-w-6xl px-6 -mt-2 relative z-10"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((s) => (
                <motion.div key={s.label} className="stat-card" variants={fadeUp}>
                  <div className="text-[22px] font-bold tracking-tight text-[#0a211f]">{s.value}</div>
                  <div className="mt-2 text-[13px] leading-snug text-[#0a211f]/50">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}

        {/* BODY */}
        <div className="mx-auto mt-20 max-w-6xl px-6">
          <div className={`grid grid-cols-1 gap-12 lg:gap-16 ${hasAside ? "lg:grid-cols-[280px_1fr]" : ""}`}>
            {/* ASIDE */}
            {hasAside ? (
              <aside className="hidden lg:block">
                <div className="sticky top-28 space-y-5">
                  <div className="rounded-2xl border border-[#0a211f]/8 bg-[#0a211f]/3 p-6">
                    <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-4">
                      On this page
                    </p>
                    <nav>
                      {toc.map((s) => (
                        <a
                          key={s.id}
                          href={`#${s.id}`}
                          className={`toc-link ${activeId === s.id ? "toc-link-active" : ""}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                          }}
                        >
                          {s.label}
                        </a>
                      ))}
                    </nav>
                  </div>

                  {asideCta ? (
                    <div className="overflow-hidden rounded-2xl border border-[#0a211f]/10">
                      <div className="relative h-44">
                        <Image src={asideCta.imageSrc} alt={asideCta.imageAlt} fill sizes="280px" className="object-cover" />
                      </div>
                      <div className="bg-[#0a211f] p-5">
                        <p className="text-[15px] font-semibold text-white">{asideCta.title}</p>
                        <p className="mt-1.5 text-[13px] text-white/50 leading-relaxed">{asideCta.body}</p>
                        <Link
                          href={asideCta.button.href}
                          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#fff86c] text-[13.5px] font-semibold text-[#0a211f]"
                        >
                          {asideCta.button.label}
                        </Link>
                      </div>
                    </div>
                  ) : null}

                  {explore.length ? (
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-3">
                        Explore Findaly
                      </p>
                      {explore.map((l) => (
                        <Link key={l.href} href={l.href} className="pillar-link">
                          <span>{l.emoji ?? "↗"}</span> {l.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </aside>
            ) : null}

            {/* ARTICLE */}
            <article className="article-body min-w-0">{children}</article>
          </div>
        </div>

        {/* FAQ */}
        {faqs?.length ? (
          <div className="mx-auto mt-16 max-w-6xl px-6">
            <section id="faq" className="scroll-mt-28">
              <SectionLabel>FAQ</SectionLabel>
              <SectionHeading>Questions buyers ask (answered properly).</SectionHeading>
              <div className="mt-2 border-t border-[#0a211f]/8">
                {faqs.map((faq, i) => (
                  <div key={i} className="faq-item">
                    <button
                      className="faq-question"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                    >
                      <span>{faq.q}</span>
                      <span className="text-[#0a211f]/30 text-xl shrink-0">{openFaq === i ? "−" : "+"}</span>
                    </button>
                    {openFaq === i ? <p className="faq-answer">{faq.a}</p> : null}
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {/* Bottom CTA */}
        {bottomCta ? (
          <div className="mx-auto mt-16 max-w-6xl px-6">
            <div className="rounded-2xl bg-[#0a211f] p-10 md:p-14 text-center">
              {bottomCta.kicker ? (
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#fff86c]/70 mb-4">
                  {bottomCta.kicker}
                </p>
              ) : null}
              <h3 className="text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.1] text-white tracking-tight">
                {bottomCta.title}
              </h3>
              <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">{bottomCta.body}</p>
              <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                <Link
                  href={bottomCta.primary.href}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
                >
                  {bottomCta.primary.label}
                </Link>
                {bottomCta.secondary ? (
                  <Link
                    href={bottomCta.secondary.href}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                  >
                    {bottomCta.secondary.label}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* Related */}
        {related.length ? (
          <div className="mx-auto mt-16 max-w-6xl px-6">
            <div className="rounded-2xl border border-[#0a211f]/10 bg-white/50 p-6">
              <p className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/45 mb-2">
                Related reading
              </p>
              <div className="flex flex-wrap gap-2">
                {related.map((l) => (
                  <Link key={l.href} className="pillar-link" href={l.href}>
                    <span>{l.emoji ?? "↗"}</span> {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* Breadcrumbs */}
        {breadcrumbs.length ? (
          <div className="mx-auto mt-16 max-w-6xl px-6 pb-20">
            <div className="border-t border-[#0a211f]/8 pt-6">
              <nav className="flex items-center gap-2 text-[13px] text-[#0a211f]/35 flex-wrap">
                {breadcrumbs.map((c, i) => (
                  <span key={`${c.label}-${i}`} className="inline-flex items-center gap-2">
                    {c.href ? (
                      <Link href={c.href} className="hover:text-[#0a211f]/60 transition-colors">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="text-[#0a211f]/60">{c.label}</span>
                    )}
                    {i < breadcrumbs.length - 1 ? <span>/</span> : null}
                  </span>
                ))}
              </nav>
            </div>
          </div>
        ) : (
          <div className="pb-20" />
        )}
      </div>
    </>
  );
}

export { BulletList, SectionLabel, SectionHeading };
