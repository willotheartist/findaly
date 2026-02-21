// app/api/saved/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user?.id) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const url = new URL(req.url);
  const listingId = (url.searchParams.get("listingId") || "").trim();

  // If listingId provided -> return boolean
  if (listingId) {
    const existing = await prisma.savedListing.findUnique({
      where: { userId_listingId: { userId: user.id, listingId } },
      select: { id: true },
    });

    return NextResponse.json({ saved: Boolean(existing) });
  }

  // Otherwise return full saved list (for /saved page)
  const saved = await prisma.savedListing.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      listing: {
        include: {
          media: { orderBy: { sort: "asc" } },
          profile: { select: { slug: true, name: true, isVerified: true, location: true } },
        },
      },
    },
  });

  return NextResponse.json({ saved });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user?.id) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body: unknown = await req.json().catch(() => ({}));
  const obj = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  const listingId = typeof obj.listingId === "string" ? obj.listingId : "";
  if (!listingId) {
    return NextResponse.json({ error: "MISSING_LISTING_ID" }, { status: 400 });
  }

  const existing = await prisma.savedListing.findUnique({
    where: { userId_listingId: { userId: user.id, listingId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.savedListing.delete({
      where: { userId_listingId: { userId: user.id, listingId } },
    });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedListing.create({
    data: { userId: user.id, listingId },
  });

  return NextResponse.json({ saved: true });
}