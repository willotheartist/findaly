import Link from "next/link";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-[#FAFAFA]">
      <div className="mx-auto w-full max-w-3xl px-5 py-14 md:px-10">
        {children}
      </div>
    </main>
  );
}

export default function TermsPage() {
  return (
    <Shell>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Terms of Service
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        Replace this with your full terms when ready. This is a practical
        baseline so Findaly looks legitimate and complete.
      </p>

      <div className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-700">
        <section>
          <div className="font-semibold text-slate-900">Marketplace nature</div>
          <p className="mt-2 text-slate-600">
            Findaly is a marketplace platform. Listings are created by users and
            brokers. Findaly does not guarantee availability, condition, or
            accuracy of listings and encourages due diligence.
          </p>
        </section>

        <section>
          <div className="font-semibold text-slate-900">Paid features</div>
          <p className="mt-2 text-slate-600">
            Findaly offers optional paid features (e.g., Featured Listings, Boost
            packages, Broker plans). Activation occurs after payment confirmation
            is received via KompiPay webhook.
          </p>
          <p className="mt-2 text-slate-600">
            Payments are processed by Wall&Fifth via KompiPay on behalf of
            Findaly.
          </p>
        </section>

        <section>
          <div className="font-semibold text-slate-900">Refunds</div>
          <p className="mt-2 text-slate-600">
            If you need a refund, contact{" "}
            <Link className="underline underline-offset-4" href="/contact">
              support
            </Link>{" "}
            with details of your purchase.
          </p>
        </section>
      </div>
    </Shell>
  );
}
