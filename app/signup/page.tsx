//·app/signup/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Mail, Lock, User, Shield } from "lucide-react";

type AccountType =
  | "PRIVATE"
  | "BROKER"
  | "DEALER"
  | "SHIPYARD"
  | "SERVICE_PRO"
  | "CREW"
  | "EMPLOYER";

const ACCOUNT_TYPES: { id: AccountType; label: string; accent: string }[] = [
  { id: "PRIVATE", label: "Private", accent: "#0ea5e9" },
  { id: "BROKER", label: "Broker", accent: "#ff6a00" },
  { id: "DEALER", label: "Dealer", accent: "#10b981" },
  { id: "SHIPYARD", label: "Shipyard", accent: "#8b5cf6" },
  { id: "SERVICE_PRO", label: "Service", accent: "#f59e0b" },
  { id: "CREW", label: "Crew", accent: "#22c55e" },
  { id: "EMPLOYER", label: "Employer", accent: "#64748b" },
];

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

export default function SignupPage() {
  const [accountType, setAccountType] = useState<AccountType>("PRIVATE");
  const accent = useMemo(
    () => ACCOUNT_TYPES.find((a) => a.id === accountType)?.accent ?? "#0ea5e9",
    [accountType]
  );

  const [profileName, setProfileName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ accountType, profileName, email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(String(data?.error ?? "SIGNUP_FAILED"));
        setLoading(false);
        return;
      }

      const slug = data?.profileSlug ? String(data.profileSlug) : null;

      // Redirect to your public profile (avoid settings until it's wired)
      if (slug) window.location.href = "/profile/" + encodeURIComponent(slug);
      else window.location.href = "/profile";
    } catch {
      setError("NETWORK_ERROR");
      setLoading(false);
    }
  };

  return (
    <main className="w-full bg-white">
      <section className="relative w-full overflow-hidden bg-linear-to-br from-slate-50 via-white to-orange-50/30">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full opacity-25 blur-3xl"
            style={{ backgroundColor: accent }}
          />
          <div className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-3xl" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="signup-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#signup-grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-4 text-sm text-slate-600">
            <Link href="/" className="no-underline hover:text-slate-900">
              Home
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="font-semibold text-slate-900">Create account</span>
          </div>

          <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Create account
                  </h1>
                  <div className="mt-2 text-sm text-slate-600">Profile + listings.</div>
                </div>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200/80">
                  <Shield className="h-5 w-5 text-slate-400" />
                </div>
              </div>

              <form onSubmit={onSubmit} className="mt-6 grid gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-900">
                    Account type
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value as AccountType)}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                  >
                    {ACCOUNT_TYPES.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-900">
                    Profile name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                      placeholder="William M"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-900">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                      placeholder="you@company.com"
                      inputMode="email"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-900">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                {error ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className={cx(
                    "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white transition",
                    loading && "opacity-70"
                  )}
                  style={{ backgroundColor: accent }}
                >
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-slate-900 no-underline hover:text-slate-900">
                    Sign in
                  </Link>
                </div>

                <div className="mt-1 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <BadgeCheck className="h-3.5 w-3.5 text-slate-400" />
                  Verification later (paid plans).
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
