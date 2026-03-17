// app/brokers/pricing/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Broker Pricing | Findaly",
  description: "Simple, transparent pricing for yacht brokers listing on Findaly. Choose the plan that fits your brokerage.",
  alternates: { canonical: "/brokers/pricing" },
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
    title: "Broker Pricing | Findaly",
    description: "Simple, transparent pricing for yacht brokers listing on Findaly.",
    url: "https://www.findaly.co/brokers/pricing",
    siteName: "Findaly",
    type: "website",
    images: [{ url: "https://www.findaly.co/og-findaly.jpg", width: 1200, height: 630, alt: "Findaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Broker Pricing | Findaly",
    description: "Simple, transparent pricing for yacht brokers listing on Findaly.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
};

import {
  BadgeCheck,
  Crown,
  TrendingUp,
  Zap,
  Shield,
  BarChart3,
  Sailboat,
  ArrowRight,
  Check,
  MessageCircle,
  Users,
} from "lucide-react";
import CheckoutButton from "@/components/kompipay/CheckoutButton";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#0a211f]/40">
      {children}
    </p>
  );
}

function FeatureCheck({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0a211f]/8">
        <Check className="h-3 w-3 text-[#0a211f]/60" />
      </div>
      <div className="text-[14px] leading-relaxed text-[#0a211f]/70">
        {children}
      </div>
    </div>
  );
}

function FeatureCheckLight({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fff86c]/30">
        <Check className="h-3 w-3 text-[#fff86c]" />
      </div>
      <div className="text-[14px] leading-relaxed text-white/70">
        {children}
      </div>
    </div>
  );
}

export default function BrokersPricingPage() {
  return (
    <main className="min-h-screen bg-[#f5f2eb]">
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Broker Pricing — List Your Inventory on Findaly</h1>
        <p>Simple, transparent pricing for yacht brokers listing on Findaly. Choose the plan that fits your brokerage.</p>
        <nav>
          <a href="/">Home</a>
          <a href="/brokers">Brokers</a>
          <a href="/brokers/join">Join as a Broker</a>
          <a href="/pricing">Pricing</a>
          <a href="/about">About</a>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-10">
        {/* Header */}
        <SectionLabel>For brokers</SectionLabel>
        <h1 className="mt-3 text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.12] tracking-tight text-[#0a211f]">
          Grow your brokerage on Findaly
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-[#0a211f]/60">
          List for free. Upgrade to Pro for verified trust signals, priority
          placement, and professional tools that help you close more deals.
        </p>

        {/* Plans grid */}
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {/* Free plan */}
          <div className="rounded-2xl border border-[#0a211f]/8 bg-[#0a211f]/2 p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0a211f]/8">
                <Sailboat className="h-5 w-5 text-[#0a211f]/50" />
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#0a211f]">Free</div>
                <div className="text-[13px] text-[#0a211f]/45">
                  Get started on Findaly
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-end gap-1">
              <div className="text-[36px] font-bold tracking-tight text-[#0a211f]">
                £0
              </div>
              <div className="mb-1.5 text-[14px] font-semibold text-[#0a211f]/35">
                /month
              </div>
            </div>

            <div className="mt-8 space-y-3.5">
              <FeatureCheck>Public broker profile with contact info</FeatureCheck>
              <FeatureCheck>Standard listings (unlimited)</FeatureCheck>
              <FeatureCheck>Receive buyer enquiries and messages</FeatureCheck>
              <FeatureCheck>Appear in broker directory</FeatureCheck>
              <FeatureCheck>Basic profile page</FeatureCheck>
            </div>

            <div className="mt-8">
              <Link
                href="/signup"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#0a211f]/16 bg-[#0a211f]/3 px-4 py-3 text-[14px] font-semibold text-[#0a211f] transition-all hover:bg-[#0a211f]/6 active:scale-[0.98]"
              >
                Create free account
              </Link>
            </div>
          </div>

          {/* Broker Pro */}
          <div className="relative rounded-2xl border-2 border-[#0a211f] bg-[#0a211f] p-7 text-white">
            <div className="absolute -top-3 right-6">
              <span className="rounded-full bg-[#fff86c] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0a211f]">
                Recommended
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff86c]/15">
                <Crown className="h-5 w-5 text-[#fff86c]" />
              </div>
              <div>
                <div className="text-[18px] font-bold text-white">
                  Broker Pro
                </div>
                <div className="text-[13px] text-white/45">
                  Professional growth toolkit
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-end gap-1">
              <div className="text-[36px] font-bold tracking-tight text-[#fff86c]">
                £99
              </div>
              <div className="mb-1.5 text-[14px] font-semibold text-[#fff86c]/50">
                /month
              </div>
            </div>

            <div className="mt-8 space-y-3.5">
              <FeatureCheckLight>
                <strong className="text-white">Verified badge</strong> on
                profile and all listings
              </FeatureCheckLight>
              <FeatureCheckLight>
                <strong className="text-white">Priority placement</strong> in
                broker directory and search
              </FeatureCheckLight>
              <FeatureCheckLight>
                <strong className="text-white">Ranking boost</strong> applied
                to all your listings
              </FeatureCheckLight>
              <FeatureCheckLight>
                <strong className="text-white">20% discount</strong> on
                Featured and Boost upgrades
              </FeatureCheckLight>
              <FeatureCheckLight>
                <strong className="text-white">Analytics dashboard</strong>{" "}
                &amp; priority support (rolling out)
              </FeatureCheckLight>
              <FeatureCheckLight>
                <strong className="text-white">Branded profile</strong> with
                logo, website, and company info
              </FeatureCheckLight>
            </div>

            <div className="mt-8">
              <CheckoutButton productKey="BROKER_PRO_MONTHLY" variant="primary">
                Start Broker Pro — £99/mo
              </CheckoutButton>
            </div>

            <p className="mt-3 text-center text-[12px] text-white/25">
              Cancel anytime. Billed monthly via KompiPay.
            </p>
          </div>
        </div>

        {/* Why Pro section */}
        <section className="mt-16">
          <SectionLabel>Why upgrade</SectionLabel>
          <h2 className="mt-2 text-[22px] font-bold tracking-tight text-[#0a211f]">
            What Broker Pro does for your business
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <BadgeCheck className="h-5 w-5" />,
                title: "Instant trust",
                desc: "The verified badge signals to buyers that your brokerage is legitimate and trustworthy. Higher enquiry conversion from day one.",
              },
              {
                icon: <TrendingUp className="h-5 w-5" />,
                title: "More visibility",
                desc: "Your listings rank higher in search results. Your profile appears first in the broker directory. More eyes, more leads.",
              },
              {
                icon: <Zap className="h-5 w-5" />,
                title: "Cheaper upgrades",
                desc: "20% off Featured Listings and Boost packages. If you regularly promote listings, Pro pays for itself.",
              },
              {
                icon: <BarChart3 className="h-5 w-5" />,
                title: "Analytics (coming)",
                desc: "See which listings get views, which get enquiries, and where your traffic comes from. Data-driven selling.",
              },
              {
                icon: <MessageCircle className="h-5 w-5" />,
                title: "Priority support",
                desc: "Skip the queue. Direct access to the Findaly team for listing issues, account questions, or feature requests.",
              },
              {
                icon: <Users className="h-5 w-5" />,
                title: "Professional presence",
                desc: "Branded profile with your logo, website link, and company description. Look the part.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#0a211f]/8 bg-[#0a211f]/2 p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a211f]/8 text-[#0a211f]/50">
                  {item.icon}
                </div>
                <div className="mt-4 text-[15px] font-bold text-[#0a211f]">
                  {item.title}
                </div>
                <div className="mt-2 text-[13px] leading-relaxed text-[#0a211f]/50">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-2 text-[22px] font-bold tracking-tight text-[#0a211f]">
            Questions about Broker Pro
          </h2>

          <div className="mt-6 space-y-3">
            {[
              {
                q: "Can I try Findaly before upgrading?",
                a: "Absolutely. Create a free account, list your fleet, and upgrade when you see the value. No pressure.",
              },
              {
                q: "What happens if I cancel?",
                a: "Your Pro features remain active until the end of your billing period. After that, your account reverts to Free. Your listings stay live.",
              },
              {
                q: "Is there a contract or commitment?",
                a: "No. Broker Pro is month-to-month. Cancel anytime from your settings page.",
              },
              {
                q: "How does the Featured discount work?",
                a: "As a Pro subscriber, Featured Listings and Boost packages are 20% cheaper at checkout. The discount is applied automatically.",
              },
              {
                q: "Who processes payments?",
                a: "Payments are processed by Wall & Fifth via KompiPay (Stripe-backed). Your card details are handled securely.",
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

        {/* CTA */}
        <section className="mt-16 rounded-2xl border-2 border-[#0a211f] bg-[#0a211f] p-8 text-center md:p-12">
          <h2 className="text-[24px] font-bold tracking-tight text-white md:text-[28px]">
            Ready to grow your brokerage?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] text-white/50">
            Join the brokers already using Findaly Pro to reach more buyers,
            build trust, and close more deals.
          </p>
          <div className="mx-auto mt-8 max-w-xs">
            <CheckoutButton productKey="BROKER_PRO_MONTHLY" variant="primary">
              Start Broker Pro — £99/mo
            </CheckoutButton>
          </div>
          <p className="mt-4 text-[12px] text-white/25">
            Cancel anytime · No contract · Billed monthly
          </p>
        </section>

        {/* Links */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4 text-[13px]">
            <Link
              href="/brokers"
              className="font-semibold text-[#0a211f] transition-colors hover:text-[#0a211f]/70"
            >
              Browse brokers
            </Link>
            <Link
              href="/brokers/join"
              className="font-semibold text-[#0a211f] transition-colors hover:text-[#0a211f]/70"
            >
              Join as a broker
            </Link>
            <Link
              href="/brokers/faq"
              className="font-semibold text-[#0a211f] transition-colors hover:text-[#0a211f]/70"
            >
              FAQ
            </Link>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0a211f]/50 transition-colors hover:text-[#0a211f]/70"
          >
            Need help? Contact us
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Breadcrumb */}
        <div className="mt-10 border-t border-[#0a211f]/10 pt-6 text-[13px] text-[#0a211f]/40">
          <Link href="/" className="transition-colors hover:text-[#0a211f]/65">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/brokers"
            className="transition-colors hover:text-[#0a211f]/65"
          >
            Brokers
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#0a211f]/65">Pricing</span>
        </div>
      </div>
    </main>
  );
}