import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Findaly Pricing — List Your Boat | Findaly",
  description: "Simple, transparent pricing for listing boats and yachts on Findaly. Free listings available for private sellers.",
  alternates: { canonical: "/pricing" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Findaly Pricing — List Your Boat | Findaly",
    description: "Simple, transparent pricing for listing boats and yachts on Findaly. Free listings available for private sellers.",
    url: "https://www.findaly.co/pricing",
    siteName: "Findaly",
    type: "website",
    images: [{ url: "https://www.findaly.co/og-findaly.jpg", width: 1200, height: 630, alt: "Findaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Findaly Pricing — List Your Boat | Findaly",
    description: "Simple, transparent pricing for listing boats and yachts on Findaly. Free listings available for private sellers.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
};

// app/pricing/page.tsx
import Link from "next/link";
import {
  BadgeCheck,
  Zap,
  TrendingUp,
  Banknote,
  Crown,
  Shield,
  Sailboat,
  ArrowRight,
} from "lucide-react";
import CheckoutButton from "@/components/kompipay/CheckoutButton";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Findaly Pricing — List Your Boat</h1>
        <p>Simple, transparent pricing for listing boats and yachts on Findaly. Free listings available for private sellers.</p>
        <nav>
          <a href="/">Home</a>
          <a href="/buy">Boats for Sale</a>
          <a href="/buy/sailboats">Sailboats for Sale</a>
          <a href="/buy/motor-yachts">Motor Yachts for Sale</a>
          <a href="/buy/catamarans">Catamarans for Sale</a>
          <a href="/buy/superyachts">Superyachts for Sale</a>
          <a href="/sell">Sell Your Boat</a>
          <a href="/charter">Charter a Boat</a>
          <a href="/brokers">Yacht Brokers</a>
          <a href="/brokers/join">List as a Broker</a>
          <a href="/guides">Buying Guides</a>
          <a href="/guides/buying-a-yacht">Buying a Yacht Guide</a>
          <a href="/guides/catamaran-buying-guide">Catamaran Buying Guide</a>
          <a href="/finance">Yacht Finance</a>
          <a href="/services">Marine Services</a>
          <a href="/destinations">Destinations</a>
          <a href="/pricing">Pricing</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/faq">FAQ</a>
          <a href="/blog">Blog</a>
        </nav>
      </div>
    <div className="mx-auto w-full max-w-6xl px-5 py-10 md:px-10 md:py-16">
      {children}
    </div>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#0a211f]/40">
      {children}
    </p>
  );
}

function FeatureRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-[#0a211f]/40">
        {icon}
      </div>
      <div className="text-[14px] leading-relaxed text-[#0a211f]/70">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PricingPage() {
  return (
    <>
    <main className="min-h-screen bg-[#f5f2eb]">
      <Shell>
        {/* Header */}
        <div className="max-w-3xl">
          <SectionLabel>Pricing</SectionLabel>
          <h1 className="mt-3 text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.12] tracking-tight text-[#0a211f]">
            Free to list. Pay to stand out.
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#0a211f]/60">
            Findaly is free to browse and free to list. Paid upgrades give your
            listing more visibility, trust signals, and priority placement.
          </p>
          <p className="mt-2 text-[13px] text-[#0a211f]/35">
            Payments processed by Wall&nbsp;&amp;&nbsp;Fifth via KompiPay on
            behalf of Findaly.
          </p>
        </div>

        {/* ────────────────────────────────────────────── */}
        {/*  SECTION 1: Listing Upgrades (one-off)        */}
        {/* ────────────────────────────────────────────── */}
        <section className="mt-14">
          <SectionLabel>For sellers</SectionLabel>
          <h2 className="mt-2 text-[22px] font-bold tracking-tight text-[#0a211f]">
            Listing upgrades
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#0a211f]/55">
            Applied per listing from your dashboard or after publishing. Choose
            the visibility level that suits your sale.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {/* Featured Listing */}
            <div className="rounded-2xl border border-[#0a211f]/8 bg-[#0a211f]/2 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff86c]/60">
                  <BadgeCheck className="h-5 w-5 text-[#0a211f]" />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#0a211f]">
                    Featured Listing
                  </div>
                  <div className="text-[12px] text-[#0a211f]/45">
                    Maximum exposure
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <FeatureRow icon={<TrendingUp className="h-4 w-4" />}>
                  Pinned to top of search results
                </FeatureRow>
                <FeatureRow icon={<Crown className="h-4 w-4" />}>
                  Homepage &ldquo;Featured&rdquo; carousel
                </FeatureRow>
                <FeatureRow icon={<BadgeCheck className="h-4 w-4" />}>
                  Featured badge on listing card
                </FeatureRow>
              </div>

              <div className="mt-6 space-y-2.5">
                <div className="flex items-center justify-between rounded-lg border border-[#0a211f]/8 bg-white/60 px-4 py-3">
                  <div>
                    <div className="text-[14px] font-bold text-[#0a211f]">
                      14 days
                    </div>
                    <div className="text-[12px] text-[#0a211f]/45">
                      Quick sale push
                    </div>
                  </div>
                  <div className="text-[18px] font-bold text-[#0a211f]">
                    £49
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#0a211f]/8 bg-white/60 px-4 py-3">
                  <div>
                    <div className="text-[14px] font-bold text-[#0a211f]">
                      30 days
                    </div>
                    <div className="text-[12px] text-[#0a211f]/45">
                      Full month coverage
                    </div>
                  </div>
                  <div className="text-[18px] font-bold text-[#0a211f]">
                    £79
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-[12px] text-[#0a211f]/40">
                Applied from your listing dashboard
              </p>
            </div>

            {/* Boost */}
            <div className="rounded-2xl border border-[#0a211f]/8 bg-[#0a211f]/2 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a211f]/8">
                  <Zap className="h-5 w-5 text-[#0a211f]" />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#0a211f]">
                    Boost
                  </div>
                  <div className="text-[12px] text-[#0a211f]/45">
                    Ranking lift
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <FeatureRow icon={<TrendingUp className="h-4 w-4" />}>
                  Higher position in search results
                </FeatureRow>
                <FeatureRow icon={<Zap className="h-4 w-4" />}>
                  Boost badge visible to buyers
                </FeatureRow>
                <FeatureRow icon={<Sailboat className="h-4 w-4" />}>
                  Great for fresh urgency on older listings
                </FeatureRow>
              </div>

              <div className="mt-6 space-y-2.5">
                <div className="flex items-center justify-between rounded-lg border border-[#0a211f]/8 bg-white/60 px-4 py-3">
                  <div>
                    <div className="text-[14px] font-bold text-[#0a211f]">
                      7 days
                    </div>
                    <div className="text-[12px] text-[#0a211f]/45">
                      Short burst
                    </div>
                  </div>
                  <div className="text-[18px] font-bold text-[#0a211f]">
                    £19
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#0a211f]/8 bg-white/60 px-4 py-3">
                  <div>
                    <div className="text-[14px] font-bold text-[#0a211f]">
                      14 days
                    </div>
                    <div className="text-[12px] text-[#0a211f]/45">
                      Sustained lift
                    </div>
                  </div>
                  <div className="text-[18px] font-bold text-[#0a211f]">
                    £29
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-[12px] text-[#0a211f]/40">
                Applied from your listing dashboard
              </p>
            </div>

            {/* Finance Priority */}
            <div className="rounded-2xl border border-[#0a211f]/8 bg-[#0a211f]/2 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a211f]/8">
                  <Banknote className="h-5 w-5 text-[#0a211f]" />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#0a211f]">
                    Finance Priority
                  </div>
                  <div className="text-[12px] text-[#0a211f]/45">
                    Reach finance-ready buyers
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <FeatureRow icon={<Banknote className="h-4 w-4" />}>
                  &ldquo;Finance Ready&rdquo; badge on your listing
                </FeatureRow>
                <FeatureRow icon={<TrendingUp className="h-4 w-4" />}>
                  Higher ranking in finance filter results
                </FeatureRow>
                <FeatureRow icon={<Shield className="h-4 w-4" />}>
                  Shown in finance landing page sections
                </FeatureRow>
              </div>

              <div className="mt-6 space-y-2.5">
                <div className="flex items-center justify-between rounded-lg border border-[#0a211f]/8 bg-white/60 px-4 py-3">
                  <div>
                    <div className="text-[14px] font-bold text-[#0a211f]">
                      14 days
                    </div>
                  </div>
                  <div className="text-[18px] font-bold text-[#0a211f]">
                    £29
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#0a211f]/8 bg-white/60 px-4 py-3">
                  <div>
                    <div className="text-[14px] font-bold text-[#0a211f]">
                      30 days
                    </div>
                  </div>
                  <div className="text-[18px] font-bold text-[#0a211f]">
                    £49
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-[12px] text-[#0a211f]/40">
                Applied from your listing dashboard
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/add-listing"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#fff86c] px-5 py-3 text-[14px] font-bold text-[#0a211f] transition-all hover:bg-[#f5ee5a] active:scale-[0.98]"
            >
              <Sailboat className="h-4 w-4" />
              List your boat — free
            </Link>
            <Link
              href="/my-listings"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#0a211f]/16 bg-[#0a211f]/3 px-5 py-3 text-[14px] font-semibold text-[#0a211f] transition-all hover:bg-[#0a211f]/6"
            >
              Manage my listings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* ────────────────────────────────────────────── */}
        {/*  SECTION 2: Broker Plans (recurring)           */}
        {/* ────────────────────────────────────────────── */}
        <section className="mt-16">
          <SectionLabel>For brokers &amp; professionals</SectionLabel>
          <h2 className="mt-2 text-[22px] font-bold tracking-tight text-[#0a211f]">
            Broker plans
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#0a211f]/55">
            Boost trust, get priority directory placement, and unlock
            professional tools to grow your brokerage on Findaly.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {/* Free tier */}
            <div className="rounded-2xl border border-[#0a211f]/8 bg-[#0a211f]/2 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[18px] font-bold text-[#0a211f]">
                    Free
                  </div>
                  <div className="text-[13px] text-[#0a211f]/50">
                    Get started on Findaly
                  </div>
                </div>
                <div className="text-[28px] font-bold tracking-tight text-[#0a211f]">
                  £0
                  <span className="text-[13px] font-semibold text-[#0a211f]/40">
                    /mo
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <FeatureRow icon={<Sailboat className="h-4 w-4" />}>
                  Basic broker profile
                </FeatureRow>
                <FeatureRow icon={<Sailboat className="h-4 w-4" />}>
                  Standard listings
                </FeatureRow>
                <FeatureRow icon={<Sailboat className="h-4 w-4" />}>
                  Receive enquiries and messages
                </FeatureRow>
                <FeatureRow icon={<Sailboat className="h-4 w-4" />}>
                  Profile page with contact info
                </FeatureRow>
              </div>

              <div className="mt-6">
                <Link
                  href="/signup"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#0a211f]/16 bg-[#0a211f]/3 px-4 py-2.5 text-[14px] font-semibold text-[#0a211f] transition-all hover:bg-[#0a211f]/6"
                >
                  Create free account
                </Link>
              </div>
            </div>

            {/* Broker Pro */}
            <div className="relative rounded-2xl border-2 border-[#0a211f] bg-[#0a211f] p-6 text-white">
              <div className="absolute -top-3 right-6">
                <span className="rounded-full bg-[#fff86c] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0a211f]">
                  Recommended
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[18px] font-bold text-white">
                    Broker Pro
                  </div>
                  <div className="text-[13px] text-white/50">
                    Professional growth toolkit
                  </div>
                </div>
                <div className="text-[28px] font-bold tracking-tight text-[#fff86c]">
                  £99
                  <span className="text-[13px] font-semibold text-[#fff86c]/60">
                    /mo
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <FeatureRow icon={<BadgeCheck className="h-4 w-4 text-[#fff86c]/50" />}>
                  <span className="text-white/70">
                    Verified badge on profile and all listings
                  </span>
                </FeatureRow>
                <FeatureRow icon={<Crown className="h-4 w-4 text-[#fff86c]/50" />}>
                  <span className="text-white/70">
                    Priority placement in broker directory
                  </span>
                </FeatureRow>
                <FeatureRow icon={<TrendingUp className="h-4 w-4 text-[#fff86c]/50" />}>
                  <span className="text-white/70">
                    Ranking boost on all your listings
                  </span>
                </FeatureRow>
                <FeatureRow icon={<Zap className="h-4 w-4 text-[#fff86c]/50" />}>
                  <span className="text-white/70">
                    20% discount on Featured and Boost upgrades
                  </span>
                </FeatureRow>
                <FeatureRow icon={<Shield className="h-4 w-4 text-[#fff86c]/50" />}>
                  <span className="text-white/70">
                    Analytics dashboard &amp; priority support (rolling out)
                  </span>
                </FeatureRow>
              </div>

              <div className="mt-6">
                <CheckoutButton productKey="BROKER_PRO_MONTHLY" variant="primary">
                  Start Broker Pro — £99/mo
                </CheckoutButton>
              </div>

              <p className="mt-3 text-center text-[12px] text-white/30">
                Cancel anytime. Billed monthly.
              </p>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────── */}
        {/*  SECTION 3: FAQ                                */}
        {/* ────────────────────────────────────────────── */}
        <section className="mt-16">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-2 text-[22px] font-bold tracking-tight text-[#0a211f]">
            Common questions
          </h2>

          <div className="mt-6 space-y-3">
            {[
              {
                q: "Do I need to pay to list?",
                a: "No — listings are completely free. Paid upgrades are optional and improve visibility and performance.",
              },
              {
                q: "How do I apply an upgrade to my listing?",
                a: "After publishing, go to My Listings and click the upgrade options on any listing card. You can also upgrade right after publishing from the success screen.",
              },
              {
                q: "Who processes payments?",
                a: "Payments are processed by Wall & Fifth via KompiPay on behalf of Findaly. Your card details are handled securely by Stripe.",
              },
              {
                q: "When does an upgrade activate?",
                a: "Upgrades activate when Findaly receives a confirmed payment webhook. The redirect success page is not used as proof of payment.",
              },
              {
                q: "Can I cancel Broker Pro?",
                a: "Yes — you can cancel anytime. Your Pro features will remain active until the end of your current billing period.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-[#0a211f]/8 bg-[#0a211f]/2 p-5"
              >
                <div className="text-[14px] font-bold text-[#0a211f]">
                  {faq.q}
                </div>
                <div className="mt-2 text-[14px] leading-relaxed text-[#0a211f]/55">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Breadcrumb footer */}
        <div className="mt-14 border-t border-[#0a211f]/10 pt-6 text-[13px] text-[#0a211f]/40">
          <Link
            href="/"
            className="transition-colors hover:text-[#0a211f]/65"
          >
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#0a211f]/65">Pricing</span>
        </div>
      </Shell>
    </main>
    </>
  );
}