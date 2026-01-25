// lib/auth/profile.ts
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

/**
 * Returns the current user's primary profile.
 * NOTE: Profile.userId is indexed but not unique, so we use findFirst.
 */
export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await prisma.profile.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" }, // "primary" profile = earliest created
    select: { id: true, userId: true, slug: true, name: true },
  });

  return profile;
}
