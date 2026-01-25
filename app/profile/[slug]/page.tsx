import Link from "next/link";
import { prisma } from "@/lib/db";
import { BadgeCheck, MapPin, ExternalLink, Globe, Mail, Phone } from "lucide-react";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function PublicProfilePage({ params }: PageProps) {
  const { slug } = await Promise.resolve(params);

  const profile = await prisma.profile.findUnique({
    where: { slug },
    select: {
      slug: true,
      name: true,
      tagline: true,
      location: true,
      about: true,
      website: true,
      email: true,
      phone: true,
      isVerified: true,
    },
  });

  if (!profile) return notFound();

  return (
    <main className="w-full bg-white">
      <section className="relative w-full overflow-hidden bg-linear-to-br from-slate-50 via-white to-orange-50/30">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-[#ff6a00]/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-3xl" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="profile-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#profile-grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-5 text-sm text-slate-600">
            <Link href="/" className="no-underline hover:text-slate-900">Home</Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="font-semibold text-slate-900">Profile</span>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {profile.name}
                  </h1>

                  {profile.tagline ? (
                    <div className="mt-1 text-sm font-semibold text-slate-600">{profile.tagline}</div>
                  ) : null}

                  {profile.location ? (
                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{profile.location}</span>
                    </div>
                  ) : null}
                </div>

                <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200/80">
                  <BadgeCheck className="h-4 w-4" style={{ color: profile.isVerified ? "#ff6a00" : "#94a3b8" }} />
                  {profile.isVerified ? "Verified" : "Unverified"}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                  <div className="text-sm font-semibold text-slate-900">About</div>
                  <div className="mt-2 text-sm text-slate-600">
                    {profile.about ? profile.about : "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                  <div className="text-sm font-semibold text-slate-900">Contact</div>

                  <div className="mt-3 grid gap-2 text-sm text-slate-600">
                    {profile.website ? (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 no-underline hover:text-slate-900"
                      >
                        <Globe className="h-4 w-4 text-slate-400" />
                        <span className="truncate">{profile.website}</span>
                      </a>
                    ) : null}

                    {profile.email ? (
                      <a
                        href={`mailto:${profile.email}`}
                        className="inline-flex items-center gap-2 no-underline hover:text-slate-900"
                      >
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="truncate">{profile.email}</span>
                      </a>
                    ) : null}

                    {profile.phone ? (
                      <a
                        href={`tel:${profile.phone}`}
                        className="inline-flex items-center gap-2 no-underline hover:text-slate-900"
                      >
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="truncate">{profile.phone}</span>
                      </a>
                    ) : null}

                    {!profile.website && !profile.email && !profile.phone ? <div>—</div> : null}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/settings?profile=${encodeURIComponent(profile.slug)}`}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#ff6a00] px-5 py-3 text-sm font-semibold text-white no-underline transition-all hover:brightness-110"
                >
                  Edit profile
                </Link>

                <Link
                  href="/upgrade"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 no-underline shadow-sm transition hover:border-slate-300"
                >
                  View plans <ExternalLink className="h-4 w-4 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
