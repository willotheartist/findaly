import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{ slug: string }>;
};

function decode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params;
  const slug = decode(raw || "");
  if (!slug) return { title: "Use case" };

  const uc = await prisma.useCase.findUnique({ where: { slug } });
  if (!uc) return { title: "Use case not found" };

  const title = `${uc.name} — best tools by category`;
  const description = `Browse categories where ${uc.name} matters, then jump to best lists, comparisons, and alternatives.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function UseCasePage({ params }: Props) {
  const { slug: raw } = await params;
  const slug = decode(raw || "");
  if (!slug) notFound();

  const uc = await prisma.useCase.findUnique({
    where: { slug },
  });
  if (!uc) notFound();

  // Find categories that have at least one active tool tagged with this use case
  const categories = await prisma.category.findMany({
    where: {
      tools: {
        some: {
          status: "ACTIVE",
          useCases: { some: { slug: uc.slug } },
        },
      },
    },
    orderBy: [{ name: "asc" }],
  });

  if (!categories.length) notFound();

  // Optional: show a few example tools per category
  const sampleByCategory = await Promise.all(
    categories.map(async (c) => {
      const tools = await prisma.tool.findMany({
        where: {
          status: "ACTIVE",
          primaryCategoryId: c.id,
          useCases: { some: { slug: uc.slug } },
        },
        orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
        take: 4,
      });
      return { category: c, tools };
    }),
  );

  return (
    <main className="min-h-screen bg-(--color-bg)">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-xs text-(--color-text-muted)">
          <Link href="/tools" className="underline underline-offset-2">
            Tools
          </Link>
          <span className="mx-1">/</span>
          <Link href="/use-cases" className="underline underline-offset-2">
            Use cases
          </Link>
          <span className="mx-1">/</span>
          <span>{uc.name}</span>
        </div>

        <h1 className="mt-3 text-3xl font-semibold">{uc.name}</h1>
        <p className="mt-2 max-w-3xl text-sm text-(--color-text-muted)">
          Browse the categories where this matters. Each category links to a “best” page you can rank
          for, plus comparisons and alternatives.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          {categories.slice(0, 10).map((c) => (
            <Link
              key={c.id}
              href={`/best/${c.slug}-tools-for-${uc.slug}`}
              className="rounded-full border border-black/10 bg-(--color-surface) px-3 py-1 underline underline-offset-2"
            >
              Best {c.name} tools for {uc.name}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {sampleByCategory.map(({ category, tools }) => (
            <div
              key={category.id}
              className="rounded-2xl border border-black/5 bg-(--color-surface) p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold">{category.name}</h2>
                  <p className="mt-2 text-sm text-(--color-text-muted)">
                    Shortlist + jump straight to the best list.
                  </p>
                </div>

                <Link
                  href={`/best/${category.slug}-tools-for-${uc.slug}`}
                  className="rounded-full border border-black/10 bg-(--color-surface) px-3 py-1 text-xs underline underline-offset-2"
                >
                  View best →
                </Link>
              </div>

              {tools.length ? (
                <div className="mt-4 space-y-2 text-sm">
                  {tools.map((t) => (
                    <div key={t.id} className="flex items-center justify-between gap-3">
                      <Link href={`/tools/${t.slug}`} className="underline underline-offset-2">
                        {t.name}
                      </Link>
                      <span className="text-xs text-(--color-text-muted)">{String(t.pricingModel)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-(--color-text-muted)">No tools yet.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
