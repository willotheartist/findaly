// app/login/LoginClient.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Lock, Mail } from "lucide-react";

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function safeNext(input: string | null | undefined) {
  const fallback = "/my-listings";

  if (!input) return fallback;

  let v = input;
  try {
    v = decodeURIComponent(input);
  } catch {
    // ignore decode errors
  }

  // Only allow internal paths. Block http(s):// and protocol-relative //.
  if (!v.startsWith("/") || v.startsWith("//")) return fallback;

  return v;
}

export default function LoginClient() {
  const sp = useSearchParams();

  // accept both next and redirect
  const next = safeNext(sp.get("next") || sp.get("redirect"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prettyError = useMemo(() => {
    if (!error) return null;
    if (error === "INVALID_CREDENTIALS") return "Email or password is incorrect.";
    if (error === "EMAIL_REQUIRED") return "Enter your email.";
    if (error === "PASSWORD_REQUIRED") return "Enter your password.";
    return "Couldn’t sign in. Try again.";
  }, [error]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      const data: unknown = await res.json().catch(() => ({} as unknown));

      if (!res.ok) {
        const err =
          typeof data === "object" && data !== null && "error" in data
            ? String((data as { error?: unknown }).error ?? "SIGNIN_FAILED")
            : "SIGNIN_FAILED";
        setError(err);
        setLoading(false);
        return;
      }

      // Hard redirect so middleware + server components see cookie immediately.
      window.location.assign(next);
    } catch {
      setError("NETWORK_ERROR");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-0px)] w-full bg-white">
      <section className="relative w-full overflow-hidden bg-linear-to-br from-slate-50 via-white to-orange-50/40">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-[#ff6a00]/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-3xl" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="login-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
            <div className="border-b border-slate-100 bg-linear-to-b from-white to-slate-50/60 p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80">
                  <Lock className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">Sign in</div>
                  <div className="mt-0.5 text-sm text-slate-600">Manage your account.</div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-7">
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-900">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-900">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    onClick={() => alert("Reset flow later")}
                    className="text-sm font-semibold text-slate-900 hover:text-[#ff6a00]"
                  >
                    Forgot?
                  </button>
                </div>

                {prettyError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {prettyError}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className={cx(
                    "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff6a00] px-5 py-3 text-sm font-semibold text-white transition-all hover:brightness-110",
                    loading && "opacity-70"
                  )}
                >
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="pt-1 text-center text-sm text-slate-600">
                  No account?{" "}
                  <Link href="/signup" className="font-semibold text-slate-900 no-underline hover:text-[#ff6a00]">
                    Create one
                  </Link>
                </div>

                <div className="pt-2 text-center text-xs text-slate-500">
                  <Link href="/terms" className="font-semibold text-slate-700 hover:text-slate-900">
                    Terms
                  </Link>{" "}
                  ·{" "}
                  <Link href="/privacy" className="font-semibold text-slate-700 hover:text-slate-900">
                    Privacy
                  </Link>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-slate-600">
            <Link href="/upgrade" className="font-semibold text-slate-900 no-underline hover:text-[#ff6a00]">
              View plans
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
