// app/settings/page.tsx
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import SettingsClient from "./_components/SettingsClient";

type SP = { profile?: string; setup?: string };

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<SP> | SP;
}) {
  const sp = await Promise.resolve(searchParams ?? {});
  const wantedSlug = typeof sp.profile === "string" ? sp.profile : null;

  const user = await getCurrentUser();

  // ✅ IMPORTANT FIX:
  // Preserve where user is trying to go.
  if (!user) {
    const qp: string[] = [];
    if (typeof sp.profile === "string" && sp.profile) qp.push(`profile=${encodeURIComponent(sp.profile)}`);
    if (typeof sp.setup === "string" && sp.setup) qp.push(`setup=${encodeURIComponent(sp.setup)}`);

    const backTo = "/settings" + (qp.length ? `?${qp.join("&")}` : "");
    redirect(`/login?redirect=${encodeURIComponent(backTo)}`);
  }

  const profiles = await prisma.profile.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      tagline: true,
      location: true,
      about: true,
      website: true,
      email: true,
      phone: true,
      isVerified: true,
      avatarUrl: true,
      companyLogoUrl: true,
    },
  });

  if (!profiles.length) {
    redirect("/signup");
  }

  const active =
    (wantedSlug && profiles.find((p) => p.slug === wantedSlug)?.slug) || profiles[0].slug;

  return <SettingsClient profiles={profiles} activeSlug={active} />;
}
