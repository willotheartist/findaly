// app/upgrade/page.tsx
import Link from "next/link";
import {
  BadgeCheck,
  Zap,
  TrendingUp,
  Banknote,
  Crown,
  Shield,
  ArrowRight,
  Sailboat,
  Check,
} from "lucide-react";
import CheckoutButton from "@/components/kompipay/CheckoutButton";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#0a211f]/40">
      {children}
    </p>
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

export default function UpgradePage() {
  return (
    <main className="min-h-screen bg-[#f5f2eb]">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-10">
        {/* Header */}
        <SectionLabel>Upgrade</SectionLabel>
        <h1 className="mt-3 text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.12] tracking-tight text-[#0a211f]">
          Get more from Findaly
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-[#0a211f]/60">
          Whether you are a private seller looking to boost a single listing or a
          broker growing your business, there is an upgrade for you.
        </p>

        {/* ── Broker Pro hero card ── */}
        <section className="mt-12">
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#0a211f] bg-[#0a211f] p-7 md:p-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#fff86c]/5 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#fff86c]/5 blur-3xl" />

            <div className="relative">
              <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div className="max-w-lg">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#fff86c]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#fff86c]">
                    <Crown className="h-3.5 w-3.5" />
                    Recommended for brokers
                  </div>

                  <h2 className="mt-4 text-[28px] font-bold tracking-tight text-white md:text-[32px]">
                    Broker Pro
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/50">
                    Professional growth toolkit. Verified badge, priority
                    placement, ranking boost, and discounted listing upgrades.
                  </p>

                  <div className="mt-6 flex items-end gap-1">
                    <div className="text-[40px] font-bold tracking-tight text-[#fff86c]">
                      £99
                    </div>
                    <div className="mb-2 text-[14px] font-semibold text-[#fff86c]/50">
                      /month
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <FeatureCheckLight>
                      <strong className="text-white">Verified badge</strong> on
                      profile and all your listings
                    </FeatureCheckLight>
                    <FeatureCheckLight>
                      <strong className="text-white">Priority placement</strong>{" "}
                      in broker directory and search results
                    </FeatureCheckLight>
                    <FeatureCheckLight>
                      <strong className="text-white">Ranking boost</strong>{" "}
                      applied across all your listings
                    </FeatureCheckLight>
                    <FeatureCheckLight>
                      <strong className="text-white">20% discount</strong> on
                      Featured and Boost upgrades
                    </FeatureCheckLight>
                    <FeatureCheckLight>
                      <strong className="text-white">Analytics</strong> and
                      priority support (rolling out)
                    </FeatureCheckLight>
                  </div>

                  <div className="mt-8 max-w-xs">
                    <CheckoutButton
                      productKey="BROKER_PRO_MONTHLY"
                      variant="primary"
                    >
                      Start Broker Pro — £99/mo
                    </CheckoutButton>
                  </div>
                  <p className="mt-3 text-[12px] text-white/25">
                    Cancel anytime. Billed monthly.
                  </p>
                </div>

                <div className="hidden w-px self-stretch bg-white/10 md:block" />

                <div className="shrink-0 md:w-56">
                  <div className="text-[13px] font-semibold text-white/30">
                    Also available
                  </div>
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-[14px] font-bold text-white">Free</div>
                    <div className="mt-1 text-[12px] text-white/40">
                      Basic profile, standard listings, receive enquiries
                    </div>
                    <Link
                      href="/signup"
                      className="mt-3 inline-flex text-[13px] font-semibold text-[#fff86c] no-underline transition-colors hover:text-[#fff86c]/80"
                    >
                      Create free account
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Listing upgrades ── */}
        <section className="mt-14">
          <SectionLabel>For all sellers</SectionLabel>
          <h2 className="mt-2 text-[22px] font-bold tracking-tight text-[#0a211f]">
            Listing upgrades
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#0a211f]/55">
            One-off purchases applied to individual listings. Buy from your
            listing dashboard or right after publishing.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Featured */}
            <div className="rounded-2xl border border-[#0a211f]/8 bg-[#0a211f]/2 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff86c]/60">
                  <BadgeCheck className="h-5 w-5 text-[#0a211f]" />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#0a211f]">Featured Listing</div>
                  <div className="text-[12px] text-[#0a211f]/45">Maximum exposure</div>
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <FeatureCheck>Pinned to top of search results</FeatureCheck>
                <FeatureCheck>Homepage &ldquo;Featured&rdquo; carousel</FeatureCheck>
                <FeatureCheck>Featured badge on listing card</FeatureCheck>
              </div>
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-[#0a211f]/6 bg-white/60 px-4 py-3">
                  <span className="text-[13px] font-bold text-[#0a211f]">14 days</span>
                  <span className="text-[16px] font-bold text-[#0a211f]">£49</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#0a211f]/6 bg-white/60 px-4 py-3">
                  <span className="text-[13px] font-bold text-[#0a211f]">30 days</span>
                  <span className="text-[16px] font-bold text-[#0a211f]">£79</span>
                </div>
              </div>
            </div>

            {/* Boost */}
            <div className="rounded-2xl border border-[#0a211f]/8 bg-[#0a211f]/2 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a211f]/8">
                  <Zap className="h-5 w-5 text-[#0a211f]" />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#0a211f]">Boost</div>
                  <div className="text-[12px] text-[#0a211f]/45">Ranking lift</div>
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <FeatureCheck>Higher position in search results</FeatureCheck>
                <FeatureCheck>Boost badge visible to buyers</FeatureCheck>
                <FeatureCheck>Great for refreshing older listings</FeatureCheck>
              </div>
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-[#0a211f]/6 bg-white/60 px-4 py-3">
                  <span className="text-[13px] font-bold text-[#0a211f]">7 days</span>
                  <span className="text-[16px] font-bold text-[#0a211f]">£19</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#0a211f]/6 bg-white/60 px-4 py-3">
                  <span className="text-[13px] font-bold text-[#0a211f]">14 days</span>
                  <span className="text-[16px] font-bold text-[#0a211f]">£29</span>
                </div>
              </div>
            </div>

            {/* Finance Priority */}
            <div className="rounded-2xl border border-[#0a211f]/8 bg-[#0a211f]/2 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a211f]/8">
                  <Banknote className="h-5 w-5 text-[#0a211f]" />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#0a211f]">Finance Priority</div>
                  <div className="text-[12px] text-[#0a211f]/45">Reach finance-ready buyers</div>
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <FeatureCheck>&ldquo;Finance Ready&rdquo; badge on listing</FeatureCheck>
                <FeatureCheck>Higher ranking in finance filters</FeatureCheck>
                <FeatureCheck>Shown in finance landing sections</FeatureCheck>
              </div>
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-[#0a211f]/6 bg-white/60 px-4 py-3">
                  <span className="text-[13px] font-bold text-[#0a211f]">14 days</span>
                  <span className="text-[16px] font-bold text-[#0a211f]">£29</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#0a211f]/6 bg-white/60 px-4 py-3">
                  <span className="text-[13px] font-bold text-[#0a211f]">30 days</span>
                  <span className="text-[16px] font-bold text-[#0a211f]">£49</span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-[13px] text-[#0a211f]/35">
            Listing upgrades are applied from{" "}
            <Link href="/my-listings" className="font-semibold text-[#0a211f]/50 no-underline transition-colors hover:text-[#0a211f]/70">
              My Listings
            </Link>{" "}
            or right after publishing. They attach to a specific listing.
          </p>
        </section>

        {/* ── How it works ── */}
        <section className="mt-14">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mt-2 text-[22px] font-bold tracking-tight text-[#0a211f]">
            Simple and transparent
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { step: "1", title: "List for free", desc: "Create a listing at no cost. Photos, description, contact info, enquiries — all free." },
              { step: "2", title: "Upgrade when ready", desc: "Choose Featured, Boost, or Finance Priority from your dashboard. One-time payment, instant activation." },
              { step: "3", title: "Get more leads", desc: "Upgraded listings rank higher, show trust badges, and reach more serious buyers." },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-[#0a211f]/8 bg-[#0a211f]/2 p-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a211f] text-[13px] font-bold text-[#fff86c]">
                  {item.step}
                </div>
                <div className="mt-3 text-[15px] font-bold text-[#0a211f]">{item.title}</div>
                <div className="mt-2 text-[13px] leading-relaxed text-[#0a211f]/50">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Links */}
        <div className="mt-14 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4 text-[13px]">
            <Link href="/pricing" className="font-semibold text-[#0a211f] no-underline transition-colors hover:text-[#0a211f]/70">Full pricing details</Link>
            <Link href="/brokers/pricing" className="font-semibold text-[#0a211f] no-underline transition-colors hover:text-[#0a211f]/70">Broker plans</Link>
            <Link href="/my-listings" className="font-semibold text-[#0a211f] no-underline transition-colors hover:text-[#0a211f]/70">My listings</Link>
          </div>
          <Link href="/contact" className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0a211f]/50 no-underline transition-colors hover:text-[#0a211f]/70">
            Need help? Contact us <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-10 border-t border-[#0a211f]/10 pt-6 text-[13px] text-[#0a211f]/40">
          <Link href="/" className="transition-colors hover:text-[#0a211f]/65">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#0a211f]/65">Upgrade</span>
        </div>
      </div>
    </main>
  );
}