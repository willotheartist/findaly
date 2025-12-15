import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function isValidUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function clean(s: unknown, max = 5000) {
  const v = String(s ?? "").trim();
  if (!v) return null;
  return v.length > max ? v.slice(0, max) : v;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const name = clean(body?.name, 120);
    const websiteUrl = clean(body?.websiteUrl, 500);
    const category = clean(body?.category, 80);
    const notes = clean(body?.notes, 2000);
    const email = clean(body?.email, 200);

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (websiteUrl && !isValidUrl(websiteUrl)) {
      return NextResponse.json({ error: "Website URL must be a valid URL" }, { status: 400 });
    }

    // best-effort metadata
    const userAgent = req.headers.get("user-agent") ?? null;

    // Works on Vercel/most proxies; falls back gracefully
    const xff = req.headers.get("x-forwarded-for");
    const ip = xff ? xff.split(",")[0]?.trim() : null;

    const submission = await prisma.submission.create({
      data: {
        name,
        websiteUrl,
        category,
        notes,
        email,
        ip,
        userAgent,
        // status defaults to NEW
      },
      select: { id: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, submission }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
