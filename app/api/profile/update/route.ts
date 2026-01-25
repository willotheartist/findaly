import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

function cleanUrl(v: string) {
  const s = v.trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `https://${s}`;
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "BAD_JSON" }, { status: 400 });

  const slug = String(body.slug ?? "").trim();
  if (!slug) return NextResponse.json({ error: "SLUG_REQUIRED" }, { status: 400 });

  const name = String(body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "NAME_REQUIRED" }, { status: 400 });

  const tagline = body.tagline === null ? null : String(body.tagline ?? "").trim() || null;
  const location = body.location === null ? null : String(body.location ?? "").trim() || null;
  const about = body.about === null ? null : String(body.about ?? "").trim() || null;

  const websiteRaw = body.website === null ? null : String(body.website ?? "").trim() || null;
  const website = websiteRaw ? cleanUrl(websiteRaw) : null;

  const email = body.email === null ? null : String(body.email ?? "").trim() || null;
  const phone = body.phone === null ? null : String(body.phone ?? "").trim() || null;

  // ensure the profile belongs to this user
  const profile = await prisma.profile.findUnique({
    where: { slug },
    select: { id: true, userId: true },
  });

  if (!profile) return NextResponse.json({ error: "PROFILE_NOT_FOUND" }, { status: 404 });
  if (profile.userId !== user.id) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      name,
      tagline,
      location,
      website,
      email,
      phone,
      about,
    },
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
