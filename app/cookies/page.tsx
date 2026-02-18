function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-[#FAFAFA]">
      <div className="mx-auto w-full max-w-3xl px-5 py-14 md:px-10">
        {children}
      </div>
    </main>
  );
}

export default function CookiesPage() {
  return (
    <Shell>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Cookie Policy
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        Findaly uses essential cookies for login sessions and basic site
        functionality. Replace this with your full cookie policy when ready.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-700">
        <div className="font-semibold text-slate-900">Essential cookies</div>
        <p className="mt-2 text-slate-600">
          Used for authentication, security, and remembering your preferences.
        </p>

        <div className="mt-6 font-semibold text-slate-900">Analytics</div>
        <p className="mt-2 text-slate-600">
          If enabled, analytics cookies help us understand usage and improve the
          product.
        </p>
      </div>
    </Shell>
  );
}
