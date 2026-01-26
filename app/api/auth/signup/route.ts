import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { COOKIE_NAME, createSession, getSessionCookieOptions } from "@/lib/auth/session";
import { AccountType } from "@prisma/client";

function cookieDomainFor(req: Request) {
  const host = new URL(req.url).hostname;
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) return undefined;
  if (host === "findaly.co" || host.endsWith(".findaly.co")) return ".findaly.co";
  return undefined;
}

function slugify(v: string) {
  return v
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function uniqueProfileSlug(base: string) {
  const slug = base || "profile";
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? slug : `${slug}-${i + 1}`;
    const exists = await prisma.profile.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
  }
  return `${slug}-${Date.now().toString(36)}`;
}

function parseAccountType(v: unknown): AccountType {
  const s = String(v ?? "PRIVATE").toUpperCase();
  if (s === "BROKER") return AccountType.BROKER;
  if (s === "DEALER") return AccountType.DEALER;
  if (s === "SHIPYARD") return AccountType.SHIPYARD;
  if (s === "SERVICE_PRO") return AccountType.SERVICE_PRO;
  if (s === "CREW") return AccountType.CREW;
  if (s === "EMPLOYER") return AccountType.EMPLOYER;
  return AccountType.PRIVATE;
}

export async function POST(req: Request) {
  const bodyUnknown: unknown = await req.json().catch(() => null);
  if (!bodyUnknown || typeof bodyUnknown !== "object") {
    return NextResponse.json({ error: "BAD_JSON" }, { status: 400 });
  }

  const body = bodyUnknown as Record<string, unknown>;

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const accountType = parseAccountType(body.accountType);
  const profileName = String(body.profileName ?? "").trim();
  const remember = Boolean(body.remember ?? true);

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "EMAIL_REQUIRED" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "PASSWORD_MIN_8" }, { status: 400 });
  }
  if (!profileName) {
    return NextResponse.json({ error: "PROFILE_NAME_REQUIRED" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json({ error: "EMAIL_TAKEN" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const baseSlug = slugify(profileName);
  const slug = await uniqueProfileSlug(baseSlug);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      accountType,
      profiles: {
        create: { slug, name: profileName },
      },
    },
    select: { id: true, profiles: { select: { slug: true } } },
  });

  const { token, expiresAt } = await createSession(user.id, remember);

  const res = NextResponse.json(
    { ok: true, profileSlug: user.profiles[0]?.slug ?? null },
    { status: 200 }
  );
  res.cookies.set(COOKIE_NAME, token, getSessionCookieOptions(expiresAt, cookieDomainFor(req)));
  return res;
}
