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

export default function PrivacyPage() {
  return (
    <Shell>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        This is a plain-English privacy policy for Findaly. Replace or extend
        with your full legal text when ready.
      </p>

      <div className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-700">
        <section>
          <div className="font-semibold text-slate-900">Data we collect</div>
          <p className="mt-2 text-slate-600">
            Account details, listings you create, messages you send, and basic
            usage analytics used to improve the platform.
          </p>
        </section>

        <section>
          <div className="font-semibold text-slate-900">
            Payments & billing
          </div>
          <p className="mt-2 text-slate-600">
            Payments are processed by Wall&Fifth via KompiPay on behalf of
            Findaly. Findaly receives confirmation of payment and metadata needed
            to activate features (for example: which listing is featured, plan
            status, and expiry dates).
          </p>
        </section>

        <section>
          <div className="font-semibold text-slate-900">Contact</div>
          <p className="mt-2 text-slate-600">
            For privacy questions, contact us via the{" "}
            <Link className="underline underline-offset-4" href="/contact">
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </Shell>
  );
}
