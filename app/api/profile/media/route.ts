// app/api/profile/media/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { profileId, avatarUrl, companyLogoUrl } = body as {
      profileId: string;
      avatarUrl?: string | null;
      companyLogoUrl?: string | null;
    };

    if (!profileId) {
      return NextResponse.json({ error: "Missing profileId" }, { status: 400 });
    }

    // Ensure profile belongs to user
    const profile = await prisma.profile.findFirst({
      where: { id: profileId, userId: user.id },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.profile.update({
      where: { id: profileId },
      data: {
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
        ...(companyLogoUrl !== undefined ? { companyLogoUrl } : {}),
      },
      select: {
        avatarUrl: true,
        companyLogoUrl: true,
      },
    });

    return NextResponse.json({ ok: true, profile: updated });
  } catch (e) {
    console.error("Profile media update error:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
