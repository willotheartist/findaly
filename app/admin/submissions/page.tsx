// app/admin/submissions/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PricingModel, SubmissionStatus } from "@prisma/client";

function slugify(s: string) {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function ensureUniqueToolSlug(base: string) {
  const root = slugify(base) || "tool";
  let slug = root;
  let i = 2;

  while (true) {
    const exists = await prisma.tool.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${root}-${i++}`;
  }
}

/**
 * Wrap the query so TypeScript can infer the "include" shape.
 * This avoids importing Prisma types entirely.
 */
async function getSubmissions() {
  return prisma.submission.findMany({
    include: { tool: { select: { slug: true, name: true, status: true } } },
    orderBy: [{ createdAt: "desc" }],
    take: 200,
  });
}

type SubmissionRow = Awaited<ReturnType<typeof getSubmissions>>[number];

function statusPill(status: SubmissionStatus) {
  const base =
    "inline-flex items-center rounded-full border border-black/10 bg-(--color-surface) px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em]";
  if (status === SubmissionStatus.NEW) return `${base} text-(--color-text-muted)`;
  if (status === SubmissionStatus.REVIEWED) return `${base} text-(--color-text-main)`;
  if (status === SubmissionStatus.APPROVED) return `${base} text-(--color-text-main)`;
  return `${base} text-(--color-text-muted)`; // REJECTED
}

export default async function AdminSubmissionsPage() {
  async function setStatus(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "") as SubmissionStatus;
    if (!id || !status) return;

    await prisma.submission.update({
      where: { id },
      data: { status },
    });
  }

  async function approve(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) return;

    const sub = await prisma.submission.findUnique({
      where: { id },
      include: { tool: { select: { id: true } } },
    });
    if (!sub) return;

    // If already linked, just mark approved
    if (sub.toolId) {
      await prisma.submission.update({
        where: { id },
        data: { status: SubmissionStatus.APPROVED },
      });
      return;
    }

    // category: create if needed (based on submission.category)
    const categoryName = (sub.category ?? "").trim() || "Tools";
    const categorySlug = slugify(categoryName) || "tools";

    const cat = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: { name: categoryName },
      create: { name: categoryName, slug: categorySlug },
    });

    const toolSlug = await ensureUniqueToolSlug(sub.name);

    // Create a DRAFT tool (hidden until you publish it)
    const tool = await prisma.tool.create({
      data: {
        name: sub.name,
        slug: toolSlug,
        shortDescription: (sub.notes ?? "").trim() || `Overview coming soon.`,
        longDescription: null,
        websiteUrl: sub.websiteUrl ?? null,
        logoUrl: null,

        pricingModel: PricingModel.FREEMIUM,
        startingPrice: null,
        pricingNotes: null,

        targetAudience: [],
        keyFeatures: [],
        integrations: [],

        // If your Tool.status is an enum, this still works at runtime.
        // If TS complains in your editor, keep the "as any".
        status: "DRAFT" as any,
        isFeatured: false,

        primaryCategoryId: cat.id,
      },
    });

    await prisma.submission.update({
      where: { id },
      data: { status: SubmissionStatus.APPROVED, toolId: tool.id },
    });
  }

  const submissions = await getSubmissions();

  const newCount = submissions.filter((s) => s.status === SubmissionStatus.NEW).length;
  const reviewedCount = submissions.filter((s) => s.status === SubmissionStatus.REVIEWED).length;
  const approvedCount = submissions.filter((s) => s.status === SubmissionStatus.APPROVED).length;

  return (
    <main className="min-h-screen bg-(--color-bg)">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-xs text-(--color-text-muted)">
          <Link href="/admin" className="underline underline-offset-2">
            Admin
          </Link>
          <span className="mx-1">/</span>
          <span>Submissions</span>
        </div>

        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Submissions</h1>
            <p className="mt-2 text-sm text-(--color-text-muted)">
              Review → Approve creates a Tool <span className="font-medium">draft</span>. Publish it
              from{" "}
              <Link className="underline underline-offset-2" href="/admin/tools">
                Admin → Tools
              </Link>
              .
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="pill">{submissions.length} total</span>
              <span className="pill">{newCount} new</span>
              <span className="pill">{reviewedCount} reviewed</span>
              <span className="pill">{approvedCount} approved</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <Link href="/admin" className="pill underline underline-offset-2">
              Admin home
            </Link>
            <Link href="/admin/tools" className="pill underline underline-offset-2">
              Draft tools →
            </Link>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-(--color-surface)">
          <div className="grid grid-cols-12 gap-3 border-b border-black/10 p-4 text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
            <div className="col-span-2">Status</div>
            <div className="col-span-4">Name</div>
            <div className="col-span-3">Website</div>
            <div className="col-span-1">Cat</div>
            <div className="col-span-2">Actions</div>
          </div>

          {submissions.map((s: SubmissionRow) => {
            const hasTool = Boolean(s.tool);
            const isApproved = s.status === SubmissionStatus.APPROVED;
            const canApprove = !hasTool;

            return (
              <div key={s.id} className="border-b border-black/5 p-4">
                <div className="grid grid-cols-12 gap-3 text-sm">
                  <div className="col-span-2">
                    <span className={statusPill(s.status)}>{s.status}</span>
                  </div>

                  <div className="col-span-4 font-medium text-(--color-text-main)">
                    {s.name}

                    {s.tool ? (
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-(--color-text-muted)">
                        <span className="pill py-0.5! px-2!">Tool</span>
                        <Link
                          className="underline underline-offset-2"
                          href={`/admin/tools/${s.tool.slug}`}
                        >
                          {s.tool.name}
                        </Link>
                        <span className="opacity-70">({String(s.tool.status)})</span>
                        <span className="font-mono opacity-70">/{s.tool.slug}</span>
                        <Link
                          className="pill underline underline-offset-2"
                          href="/admin/tools"
                          title="Go manage drafts"
                        >
                          Open in admin →
                        </Link>
                      </div>
                    ) : null}
                  </div>

                  <div className="col-span-3 text-(--color-text-muted)">
                    {s.websiteUrl ? (
                      <a
                        className="underline underline-offset-2"
                        href={s.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {s.websiteUrl}
                      </a>
                    ) : (
                      "—"
                    )}
                    {s.email ? (
                      <div className="mt-1 text-xs text-(--color-text-muted)">Email: {s.email}</div>
                    ) : null}
                  </div>

                  <div className="col-span-1 text-xs text-(--color-text-muted) line-clamp-2">
                    {s.category ?? "—"}
                  </div>

                  <div className="col-span-2 flex flex-wrap gap-2 text-xs">
                    <form action={setStatus}>
                      <input type="hidden" name="id" value={s.id} />
                      <input type="hidden" name="status" value={SubmissionStatus.REVIEWED} />
                      <button
                        className="rounded-full border border-black/10 px-3 py-1 hover:bg-black/5"
                        type="submit"
                        title="Mark as reviewed"
                      >
                        Review
                      </button>
                    </form>

                    <form action={approve}>
                      <input type="hidden" name="id" value={s.id} />
                      <button
                        className={[
                          "rounded-full border px-3 py-1",
                          canApprove
                            ? "border-black/10 hover:bg-black/5"
                            : "border-black/5 opacity-50 cursor-not-allowed",
                        ].join(" ")}
                        type="submit"
                        disabled={!canApprove}
                        title={canApprove ? "Approve & create a draft tool" : "Already linked to a tool"}
                      >
                        Approve → draft
                      </button>
                    </form>

                    <form action={setStatus}>
                      <input type="hidden" name="id" value={s.id} />
                      <input type="hidden" name="status" value={SubmissionStatus.REJECTED} />
                      <button
                        className="rounded-full border border-black/10 px-3 py-1 hover:bg-black/5"
                        type="submit"
                        title="Reject submission"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                </div>

                {s.notes ? (
                  <div className="mt-3 text-xs text-(--color-text-muted)">Notes: {s.notes}</div>
                ) : null}

                <div className="mt-3 text-xs text-(--color-text-muted)">
                  Created: {new Date(s.createdAt).toLocaleString()}
                  {isApproved && hasTool ? (
                    <span className="opacity-70"> · Next: publish the draft</span>
                  ) : null}
                </div>
              </div>
            );
          })}

          {!submissions.length ? (
            <div className="p-6 text-sm text-(--color-text-muted)">No submissions yet.</div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
