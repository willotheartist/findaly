import Link from "next/link";
import CheckoutButton from "@/components/kompipay/CheckoutButton";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 md:px-10 md:py-14">
      {children}
    </div>
  );
}

function Card({
  title,
  price,
  subtitle,
  children,
  footer,
  badge,
}: {
  title: string;
  price: string;
  subtitle: string;
  badge?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">
              {title}
            </h3>
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
          </div>
          {badge ? (
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              {badge}
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex items-end gap-2">
          <div className="text-3xl font-semibold tracking-tight text-slate-900">
            {price}
          </div>
          <div className="pb-1 text-sm text-slate-500">EUR</div>
        </div>

        <div className="mt-6 space-y-3 text-sm text-slate-700">{children}</div>
      </div>

      <div className="border-t border-slate-200 p-6">{footer}</div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <div className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
      <div>{children}</div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <main className="bg-[#FAFAFA]">
      <Shell>
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Pricing
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Findaly is free to browse. Sellers can list, and professionals can
            upgrade for visibility, trust, and performance.
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Payments are processed by Wall&Fifth via KompiPay on behalf of
            Findaly.
          </p>
        </div>

        {/* Brokers */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                For Brokers & Professionals
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Boost trust and convert more leads with verified status and pro
                tools.
              </p>
            </div>
            <Link
              href="/brokers"
              className="text-sm font-semibold text-slate-900 underline underline-offset-4 hover:text-slate-700"
            >
              Explore brokers →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card
              title="Verified Broker"
              subtitle="Trust badge + ranking priority"
              price="49 / month"
              badge="Recommended"
              footer={
                <CheckoutButton productKey="VERIFIED_BROKER_MONTHLY">
                  Start Verified Broker
                </CheckoutButton>
              }
            >
              <Bullet>Verified badge on profile and listings</Bullet>
              <Bullet>Priority placement in broker directory</Bullet>
              <Bullet>Improves trust and enquiry rate</Bullet>
              <Bullet>Cancel anytime</Bullet>
            </Card>

            <Card
              title="Broker Pro"
              subtitle="Pro tools + verified included"
              price="99 / month"
              badge="Best value"
              footer={
                <CheckoutButton productKey="BROKER_PRO_MONTHLY">
                  Start Broker Pro
                </CheckoutButton>
              }
            >
              <Bullet>Unlimited listings</Bullet>
              <Bullet>Verified badge included</Bullet>
              <Bullet>Discounts on Featured & Boost upgrades</Bullet>
              <Bullet>Analytics + priority support (rolling out)</Bullet>
            </Card>
          </div>
        </section>

        {/* Sellers */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            For Private Sellers
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-3xl">
            Listing is free. Upgrades like Featured and Boost are purchased from
            your listing page or your dashboard — so the upgrade can be applied
            to a specific boat.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold text-slate-900">
                Featured Listing
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Pin to the top + homepage visibility.
              </div>
              <div className="mt-4 text-sm text-slate-900">
                €49 / 14 days • €79 / 30 days
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold text-slate-900">
                Boost Packages
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Temporary ranking lift.
              </div>
              <div className="mt-4 text-sm text-slate-900">
                €29 / 7 days • €49 / 14 days • €89 / 30 days
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold text-slate-900">
                Finance Priority
              </div>
              <div className="mt-2 text-sm text-slate-600">
                “Finance Ready” badge + finance filter priority.
              </div>
              <div className="mt-4 text-sm text-slate-900">€29 / 30 days</div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/add-listing"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              List your boat
            </Link>
            <Link
              href="/my-listings"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Manage my listings
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            FAQ
          </h2>

          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold text-slate-900">
                Do I need to pay to list?
              </div>
              <div className="mt-2 text-sm text-slate-600">
                No — listings are free. Paid upgrades improve visibility and
                performance.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold text-slate-900">
                Who processes payments?
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Payments are processed by Wall&Fifth via KompiPay on behalf of
                Findaly.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold text-slate-900">
                When does an upgrade activate?
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Upgrades activate when Findaly receives a KompiPay webhook
                confirming payment. (Redirect success pages are not used as
                proof.)
              </div>
            </div>
          </div>
        </section>
      </Shell>
    </main>
  );
}
