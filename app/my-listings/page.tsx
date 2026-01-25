// app/my-listings/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentProfile } from "@/lib/auth/profile";

function fmtPrice(currency: string, cents: number | null) {
  if (!cents || cents <= 0) return "Price on request";
  const val = (cents / 100).toLocaleString();
  return `${currency} ${val}`;
}

export default async function MyListingsPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirect=%2Fmy-listings");

  const listings = await prisma.listing.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      currency: true,
      priceCents: true,
      kind: true,
      intent: true,
      status: true,
      featured: true,
      updatedAt: true,
    },
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My listings</h1>
          <p className="mt-1 text-sm text-slate-600">Edit, pause, or update your listings.</p>
        </div>

        <Link
          href="/add-listing"
          className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
        >
          Add listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <p className="text-slate-700">You don’t have any listings yet.</p>
          <Link
            href="/add-listing"
            className="mt-4 inline-flex items-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="divide-y divide-slate-200">
            {listings.map((l) => (
              <div
                key={l.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{l.title}</p>

                    {l.featured ? (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                        Featured
                      </span>
                    ) : null}

                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {l.status}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                    <span>{fmtPrice(l.currency, l.priceCents)}</span>
                    <span className="text-slate-300">•</span>
                    <span>
                      {l.kind} / {l.intent}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>Updated {new Date(l.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/buy/${l.slug}`}
                    className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
                  >
                    View
                  </Link>
                  <Link
                    href={`/my-listings/${l.id}/edit`}
                    className="inline-flex items-center rounded-xl bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-90"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
