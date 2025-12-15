import Link from "next/link";

export default function AdminHome() {
  return (
    <main className="min-h-screen bg-(--color-bg)">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="card p-7 md:p-10">
          <p className="section-kicker">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Findaly admin
          </h1>
          <p className="mt-3 max-w-2xl text-sm muted md:text-base">
            Review submissions, publish drafts, and keep the directory clean.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            <Link href="/admin/submissions" className="pill underline underline-offset-2">
              Submissions →
            </Link>
            <Link href="/admin/tools" className="pill underline underline-offset-2">
              Draft tools →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
