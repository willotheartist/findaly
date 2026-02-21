// app/alerts/page.tsx
import Link from "next/link";
import { Bell, ArrowRight, LogIn, Search } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AlertsPage() {
  const user = await getCurrentUser().catch(() => null);
  const isAuthed = Boolean(user?.id);

  const searches = isAuthed
    ? await prisma.savedSearch.findMany({
        where: { userId: user!.id },
        orderBy: [{ updatedAt: "desc" }],
        select: {
          id: true,
          name: true,
          kind: true,
          replayUrl: true,
          createdAt: true,
          updatedAt: true,
          lastUsedAt: true,
        },
      })
    : [];

  const hasRows = searches.length > 0;

  return (
    <main className="w-full bg-white">
      <section className="relative w-full overflow-hidden bg-linear-to-br from-slate-50 via-white to-amber-50/30">
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="mb-4 text-sm text-slate-600">
            <Link href="/" className="no-underline hover:text-slate-900">
              Home
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="font-semibold text-slate-900">Alerts</span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Alerts
              </h1>
              <div className="mt-2 text-sm text-slate-600">
                {isAuthed
                  ? "Track changes on your saved searches (price drops, new matches, status changes)."
                  : "Sign in to access alerts tied to your saved searches."}
              </div>
            </div>

            <Link
              href="/searches"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff6a00] px-5 py-3 text-sm font-semibold text-white no-underline hover:brightness-110"
            >
              <Search className="h-4 w-4" />
              Saved searches
            </Link>
          </div>

          {/* “Real” but honest: not thin, sets expectation + value */}
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white">
                <Bell className="h-5 w-5 text-amber-700" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900">
                  Alerts are in progress
                </div>
                <div className="mt-1 text-sm text-slate-700">
                  Your saved searches are already stored. Next, we’ll turn them into
                  automated alerts: price drops, newly listed matches, and status updates.
                  For now, you can use your saved searches as one-click “watchlists”.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            {!isAuthed ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <div className="text-lg font-bold text-slate-900">
                  Sign in to view alerts
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Alerts are connected to your saved searches, so they need an account.
                </div>

                <Link
                  href="/login"
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:brightness-110"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
              </div>
            ) : !hasRows ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <div className="text-lg font-bold text-slate-900">
                  No saved searches yet
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Alerts are powered by saved searches. Go to Buy, apply filters, then save.
                </div>

                <Link
                  href="/buy"
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:brightness-110"
                >
                  Browse boats
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {searches.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="truncate text-base font-bold text-slate-900">
                          {s.name}
                        </div>
                        <div className="mt-1 truncate text-sm text-slate-600">
                          {s.replayUrl}
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          Type: <span className="font-semibold text-slate-700">{s.kind}</span>
                          {s.lastUsedAt ? (
                            <>
                              {" "}
                              • Last used:{" "}
                              <span className="font-semibold text-slate-700">
                                {new Date(s.lastUsedAt).toLocaleDateString()}
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        <Link
                          href={s.replayUrl}
                          className="inline-flex items-center gap-2 rounded-2xl bg-[#ff6a00] px-4 py-2.5 text-sm font-semibold text-white no-underline hover:brightness-110"
                        >
                          Open results
                          <ArrowRight className="h-4 w-4" />
                        </Link>

                        <Link
                          href="/searches"
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}