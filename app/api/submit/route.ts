import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function safeStr(v: unknown) {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const name = safeStr(body?.name);
  if (!name) {
    return NextResponse.json({ ok: false, error: "Missing name" }, { status: 400 });
  }

  const websiteUrl = safeStr(body?.websiteUrl);
  const category = safeStr(body?.category);
  const notes = safeStr(body?.notes);
  const email = safeStr(body?.email);

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;

  const userAgent = req.headers.get("user-agent") ?? null;

  await prisma.submission.create({
    data: {
      name,
      websiteUrl,
      category,
      notes,
      email,
      ip,
      userAgent,
    },
  });

  return NextResponse.json({ ok: true });
}
