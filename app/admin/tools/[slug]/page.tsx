import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PricingModel, PricingPeriod } from "@prisma/client";

type Props = { params: Promise<{ slug: string }> };

function normalizeList(s: string) {
  return Array.from(
    new Set(
      (s || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    ),
  );
}

export default async function AdminToolEditorPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug ? decodeURIComponent(rawSlug) : "";
  if (!slug) notFound();

  const tool = await prisma.tool.findUnique({
    where: { slug },
    include: { primaryCategory: true },
  });
  if (!tool) notFound();

  const categories = await prisma.category.findMany({ orderBy: [{ name: "asc" }] });

  async function save(formData: FormData) {
    "use server";

    const id = String(formData.get("id") ?? "");
    if (!id) return;

    const name = String(formData.get("name") ?? "").trim();
    const shortDescription = String(formData.get("shortDescription") ?? "").trim();
    const websiteUrl = String(formData.get("websiteUrl") ?? "").trim() || null;

    const pricingModel = String(formData.get("pricingModel") ?? "FREEMIUM") as PricingModel;
    const startingPrice = String(formData.get("startingPrice") ?? "").trim() || null;
    const pricingNotes = String(formData.get("pricingNotes") ?? "").trim() || null;

    const startingPriceCentsRaw = String(formData.get("startingPriceCents") ?? "").trim();
    const startingPriceCents =
      startingPriceCentsRaw && /^\d+$/.test(startingPriceCentsRaw)
        ? Number(startingPriceCentsRaw)
        : null;

    const startingPricePeriod = String(
      formData.get("startingPricePeriod") ?? "UNKNOWN",
    ) as PricingPeriod;

    const primaryCategoryId = String(formData.get("primaryCategoryId") ?? "").trim();

    const targetAudience = normalizeList(String(formData.get("targetAudience") ?? ""));
    const keyFeatures = normalizeList(String(formData.get("keyFeatures") ?? ""));
    const integrations = normalizeList(String(formData.get("integrations") ?? ""));

    await prisma.tool.update({
      where: { id },
      data: {
        name: name || "Untitled",
        shortDescription: shortDescription || "Overview coming soon.",
        websiteUrl,
        pricingModel,
        startingPrice,
        pricingNotes,
        startingPriceCents,
        startingPricePeriod,
        primaryCategoryId: primaryCategoryId || undefined,
        targetAudience,
        keyFeatures,
        integrations,
      },
    });

    redirect(`/admin/tools/${slug}`);
  }

  async function publish(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.tool.update({ where: { id }, data: { status: "ACTIVE" } });
    redirect(`/admin/tools/${slug}`);
  }

  async function unpublish(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.tool.update({ where: { id }, data: { status: "DRAFT" } });
    redirect(`/admin/tools/${slug}`);
  }

  async function toggleFeatured(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    const next = String(formData.get("next") ?? "0");
    if (!id) return;
    await prisma.tool.update({ where: { id }, data: { isFeatured: next === "1" } });
    redirect(`/admin/tools/${slug}`);
  }

  return (
    <main className="min-h-screen bg-(--color-bg)">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-xs text-(--color-text-muted)">
          <Link href="/admin" className="underline underline-offset-2">
            Admin
          </Link>
          <span className="mx-1">/</span>
          <Link href="/admin/tools" className="underline underline-offset-2">
            Tools
          </Link>
          <span className="mx-1">/</span>
          <span className="font-mono">/{tool.slug}</span>
        </div>

        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold">{tool.name}</h1>
            <p className="mt-2 text-sm text-(--color-text-muted)">
              Edit the draft, then publish when it’s ready.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="pill">status: {tool.status}</span>
              {tool.isFeatured ? <span className="pill">featured</span> : null}
              <span className="pill">category: {tool.primaryCategory?.name ?? "—"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <Link href={`/tools/${tool.slug}`} className="pill underline underline-offset-2">
              Public page →
            </Link>

            <form action={toggleFeatured}>
              <input type="hidden" name="id" value={tool.id} />
              <input type="hidden" name="next" value={tool.isFeatured ? "0" : "1"} />
              <button className="pill underline underline-offset-2" type="submit">
                {tool.isFeatured ? "Unfeature" : "Feature"}
              </button>
            </form>

            {tool.status === "ACTIVE" ? (
              <form action={unpublish}>
                <input type="hidden" name="id" value={tool.id} />
                <button className="pill underline underline-offset-2" type="submit">
                  Unpublish →
                </button>
              </form>
            ) : (
              <form action={publish}>
                <input type="hidden" name="id" value={tool.id} />
                <button className="pill underline underline-offset-2" type="submit">
                  Publish →
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          <div className="md:col-span-3 card p-6">
            <h2 className="text-sm font-semibold">Edit tool</h2>

            <form action={save} className="mt-5 space-y-4">
              <input type="hidden" name="id" value={tool.id} />

              <label className="block">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
                  Name
                </div>
                <input
                  name="name"
                  defaultValue={tool.name}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--color-text-main) outline-none focus:border-white/20"
                />
              </label>

              <label className="block">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
                  Short description
                </div>
                <textarea
                  name="shortDescription"
                  defaultValue={tool.shortDescription}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--color-text-main) outline-none focus:border-white/20"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
                    Website
                  </div>
                  <input
                    name="websiteUrl"
                    defaultValue={tool.websiteUrl ?? ""}
                    placeholder="https://…"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--color-text-main) outline-none focus:border-white/20"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
                    Primary category
                  </div>
                  <select
                    name="primaryCategoryId"
                    defaultValue={tool.primaryCategoryId}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--color-text-main) outline-none focus:border-white/20"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
                    Pricing model
                  </div>
                  <select
                    name="pricingModel"
                    defaultValue={tool.pricingModel}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--color-text-main) outline-none focus:border-white/20"
                  >
                    {Object.values(PricingModel).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
                    Starting price (display)
                  </div>
                  <input
                    name="startingPrice"
                    defaultValue={tool.startingPrice ?? ""}
                    placeholder="e.g. $19/mo"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--color-text-main) outline-none focus:border-white/20"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
                    Starting price cents (optional)
                  </div>
                  <input
                    name="startingPriceCents"
                    defaultValue={tool.startingPriceCents ?? ""}
                    placeholder="e.g. 1900"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--color-text-main) outline-none focus:border-white/20"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
                    Starting price period
                  </div>
                  <select
                    name="startingPricePeriod"
                    defaultValue={tool.startingPricePeriod}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--color-text-main) outline-none focus:border-white/20"
                  >
                    {Object.values(PricingPeriod).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
                  Pricing notes
                </div>
                <textarea
                  name="pricingNotes"
                  defaultValue={tool.pricingNotes ?? ""}
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--color-text-main) outline-none focus:border-white/20"
                />
              </label>

              <label className="block">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
                  Target audience (comma separated)
                </div>
                <input
                  name="targetAudience"
                  defaultValue={(tool.targetAudience ?? []).join(", ")}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--color-text-main) outline-none focus:border-white/20"
                />
              </label>

              <label className="block">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
                  Key features (comma separated)
                </div>
                <input
                  name="keyFeatures"
                  defaultValue={(tool.keyFeatures ?? []).join(", ")}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--color-text-main) outline-none focus:border-white/20"
                />
              </label>

              <label className="block">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--color-text-muted)">
                  Integrations (comma separated)
                </div>
                <input
                  name="integrations"
                  defaultValue={(tool.integrations ?? []).join(", ")}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--color-text-main) outline-none focus:border-white/20"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-(--color-accent) px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(124,92,255,0.25)] hover:brightness-110"
              >
                Save changes
              </button>
            </form>
          </div>

          <div className="md:col-span-2 card p-6">
            <h2 className="text-sm font-semibold">Quick actions</h2>
            <p className="mt-2 text-sm text-(--color-text-muted)">Publish makes it visible on /tools.</p>

            <div className="mt-4 flex flex-col gap-2 text-sm">
              {tool.status === "ACTIVE" ? (
                <form action={unpublish}>
                  <input type="hidden" name="id" value={tool.id} />
                  <button
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/7"
                    type="submit"
                  >
                    Unpublish (back to draft)
                  </button>
                </form>
              ) : (
                <form action={publish}>
                  <input type="hidden" name="id" value={tool.id} />
                  <button
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/7"
                    type="submit"
                  >
                    Publish (make active)
                  </button>
                </form>
              )}

              <form action={toggleFeatured}>
                <input type="hidden" name="id" value={tool.id} />
                <input type="hidden" name="next" value={tool.isFeatured ? "0" : "1"} />
                <button
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/7"
                  type="submit"
                >
                  {tool.isFeatured ? "Remove featured" : "Mark as featured"}
                </button>
              </form>

              <Link
                href="/admin/submissions"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center hover:bg-white/7"
              >
                Back to submissions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
