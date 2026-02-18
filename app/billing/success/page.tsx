import Link from "next/link";

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ productKey?: string }>;
}) {
  const sp = await searchParams;
  const productKey = sp?.productKey;

  return (
    <main className="bg-[#FAFAFA]">
      <div className="mx-auto w-full max-w-2xl px-5 py-16 md:px-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Payment received
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Thanks — your purchase is being confirmed. Upgrades activate when
            Findaly receives confirmation from KompiPay (via webhook).
          </p>

          {productKey ? (
            <p className="mt-3 text-xs text-slate-500">
              Product: <span className="font-mono">{productKey}</span>
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/my-listings"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Go to my listings
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Back to pricing
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            Payments are processed by Wall&Fifth via KompiPay on behalf of
            Findaly.
          </p>
        </div>
      </div>
    </main>
  );
}
