import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminToken } from "@/lib/admin/session";

const ADMIN_COOKIE = "findaly_admin";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; err?: string }>;
}) {
  const { next, err } = await searchParams;

  async function login(formData: FormData) {
    "use server";

    const password = String(formData.get("password") ?? "");
    const adminPassword = process.env.ADMIN_PASSWORD || "";
    const secret = process.env.ADMIN_SECRET || "";

    if (!adminPassword || !secret) {
      redirect("/admin/login?err=missing");
    }

    if (password !== adminPassword) {
      redirect(`/admin/login?err=1${next ? `&next=${encodeURIComponent(next)}` : ""}`);
    }

    const token = await createAdminToken(secret, 60 * 60 * 24 * 14);
    const cookieStore = await cookies();

    cookieStore.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    redirect(next && next.startsWith("/admin") ? next : "/admin/submissions");
  }

  return (
    <main className="min-h-screen">
      <div className="container-app py-12">
        <div className="mx-auto max-w-lg card p-7 md:p-10">
          <p className="section-kicker">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm muted">Enter your admin password to access submissions.</p>

          {err ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
              <div className="font-medium text-(--color-text-main)">Can’t sign in</div>
              <div className="mt-1 muted">
                {err === "missing"
                  ? "Set ADMIN_PASSWORD and ADMIN_SECRET in your .env.local, then restart the dev server."
                  : "Wrong password. Try again."}
              </div>
            </div>
          ) : null}

          <form action={login} className="mt-6 space-y-3">
            <label className="block text-sm">
              <div className="mb-2 muted">Admin password</div>
              <input
                name="password"
                type="password"
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--color-text-main) outline-none focus:border-white/20"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-(--color-accent) px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(124,92,255,0.25)] hover:brightness-110"
            >
              Sign in
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <Link className="muted underline underline-offset-2" href="/tools">
                ← Back to site
              </Link>
              <span className="muted">/admin</span>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
