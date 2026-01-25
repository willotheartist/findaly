import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import SettingsClient from "./_components/SettingsClient";

type SP = { profile?: string };

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<SP> | SP;
}) {
  const sp = await Promise.resolve(searchParams ?? {});
  const wantedSlug = typeof sp.profile === "string" ? sp.profile : null;

  const user = await getCurrentUser();
  if (!user) redirect("/login");

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
    },
  });

  if (!profiles.length) {
    // This should not happen if signup always creates a profile,
    // but fail safe: send them to signup.
    redirect("/signup");
  }

  const active =
    (wantedSlug && profiles.find((p) => p.slug === wantedSlug)?.slug) || profiles[0].slug;

  return <SettingsClient profiles={profiles} activeSlug={active} />;
}
