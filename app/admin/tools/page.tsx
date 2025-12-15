import Link from "next/link";
import { prisma } from "@/lib/db";

function pillClass(variant: "muted" | "accent" | "warn" = "muted") {
  const base =
    "inline-flex items-center rounded-full border border-black/10 bg-(--color-surface) px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em]";
  if (variant === "accent") return `${base} text-(--color-text-main)`;
  if (variant === "warn") return `${base} text-(--color-text-muted)`;
  return `${base} text-(--color-text-muted)`;
}

export default async function AdminToolsPage() {
  async function publish(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.tool.update({
      where: { id },
      data: { status: "ACTIVE" },
    });
  }

  async function unpublish(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.tool.update({
      where: { id },
      data: { status: "DRAFT" },
    });
  }

  async function toggleFeatured(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    const next = String(formData.get("next") ?? "");
    if (!id) return;

    await prisma.tool.update({
      where: { id },
      data: { isFeatured: next === "1" },
    });
  }

  const drafts = await prisma.tool.findMany({
    where: { status: "DRAFT" },
    orderBy: [{ updatedAt: "desc" }],
    take: 200,
    include: { primaryCategory: true },
  });

  const active = await prisma.tool.findMany({
    where: { status: "ACTIVE" },
    orderBy: [{ updatedAt: "desc" }],
    take: 200,
    include: { primaryCategory: true },
  });

  const featuredCount = active.filter((t) => t.isFeatured).length;

  return (
    <main className="min-h-screen bg-(--color-bg)">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-xs text-(--color-text-muted)">
          <Link href="/admin" className="underline underline-offset-2">
            Admin
          </Link>
          <span className="mx-1">/</span>
          <span>Tools</span>
        </div>

        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Tools</h1>
            <p className="mt-2 text-sm text-(--color-text-muted)">
              Drafts are hidden from the public directory until published.
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="pill">{drafts.length} drafts</span>
              <span className="pill">{active.length} active</span>
              <span className="pill">{featuredCount} featured</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <Link href="/admin/submissions" className="pill underline underline-offset-2">
              Submissions →
            </Link>
            <Link href="/tools" className="pill underline underline-offset-2">
              Public directory →
            </Link>
          </div>
        </div>

        {/* Drafts */}
        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
            Draft tools ({drafts.length})
          </h2>

          <div className="mt-3 overflow-hidden rounded-2xl border border-black/10 bg-(--color-surface)">
            <div className="grid grid-cols-12 gap-3 border-b border-black/10 p-4 text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
              <div className="col-span-4">Name</div>
              <div className="col-span-3">Category</div>
              <div className="col-span-3">Slug</div>
              <div className="col-span-2">Actions</div>
            </div>

            {drafts.map((t) => (
              <div key={t.id} className="border-b border-black/5 p-4">
                <div className="grid grid-cols-12 gap-3 text-sm">
                  <div className="col-span-4 font-medium text-(--color-text-main)">
                    {t.name} <span className={pillClass("warn")}>draft</span>
                  </div>

                  <div className="col-span-3 text-(--color-text-muted)">
                    {t.primaryCategory?.name ?? "—"}
                  </div>

                  <div className="col-span-3 font-mono text-xs text-(--color-text-muted)">
                    /{t.slug}
                  </div>

                  <div className="col-span-2 flex flex-wrap gap-2 text-xs">
                    <Link
                      href={`/admin/tools/`}
                      className="rounded-full border border-black/10 px-3 py-1 hover:bg-black/5"
                    >
                      Preview
                    </Link>

                    <form action={publish}>
                      <input type="hidden" name="id" value={t.id} />
                      <button
                        className="rounded-full border border-black/10 px-3 py-1 hover:bg-black/5"
                        type="submit"
                        title="Publish (make visible on /tools)"
                      >
                        Publish
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}

            {!drafts.length ? (
              <div className="p-6 text-sm text-(--color-text-muted)">No draft tools right now.</div>
            ) : null}
          </div>
        </section>

        {/* Active */}
        <section className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
            Active tools ({active.length})
          </h2>

          <div className="mt-3 overflow-hidden rounded-2xl border border-black/10 bg-(--color-surface)">
            <div className="grid grid-cols-12 gap-3 border-b border-black/10 p-4 text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
              <div className="col-span-4">Name</div>
              <div className="col-span-3">Category</div>
              <div className="col-span-3">Slug</div>
              <div className="col-span-2">Actions</div>
            </div>

            {active.map((t) => (
              <div key={t.id} className="border-b border-black/5 p-4">
                <div className="grid grid-cols-12 gap-3 text-sm">
                  <div className="col-span-4 font-medium text-(--color-text-main)">
                    {t.name}{" "}
                    {t.isFeatured ? (
                      <span className={pillClass("accent")}>featured</span>
                    ) : (
                      <span className={pillClass("muted")}>active</span>
                    )}
                  </div>

                  <div className="col-span-3 text-(--color-text-muted)">
                    {t.primaryCategory?.name ?? "—"}
                  </div>

                  <div className="col-span-3 font-mono text-xs text-(--color-text-muted)">
                    /{t.slug}
                  </div>

                  <div className="col-span-2 flex flex-wrap gap-2 text-xs">
                    <Link
                      href={`/admin/tools/`}
                      className="rounded-full border border-black/10 px-3 py-1 hover:bg-black/5"
                    >
                      View
                    </Link>

                    <form action={toggleFeatured}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="next" value={t.isFeatured ? "0" : "1"} />
                      <button
                        className="rounded-full border border-black/10 px-3 py-1 hover:bg-black/5"
                        type="submit"
                        title={t.isFeatured ? "Remove from featured" : "Mark as featured"}
                      >
                        {t.isFeatured ? "Unfeature" : "Feature"}
                      </button>
                    </form>

                    <form action={unpublish}>
                      <input type="hidden" name="id" value={t.id} />
                      <button
                        className="rounded-full border border-black/10 px-3 py-1 hover:bg-black/5"
                        type="submit"
                        title="Unpublish (move back to draft)"
                      >
                        Unpublish
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}

            {!active.length ? (
              <div className="p-6 text-sm text-(--color-text-muted)">No active tools yet.</div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
