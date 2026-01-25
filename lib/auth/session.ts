// lib/auth/session.ts
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

const COOKIE_NAME = "findaly_session";

async function cookieStore() {
  // In your setup, cookies() is typed as Promise<ReadonlyRequestCookies>
  return await cookies();
}

export async function getSessionToken() {
  const c = await cookieStore();
  return c.get(COOKIE_NAME)?.value ?? null;
}

export async function getCurrentUser() {
  const token = await getSessionToken();
  if (!token) return null;

  const now = new Date();
  const session = await prisma.session.findUnique({
    where: { token },
    select: {
      expiresAt: true,
      user: { select: { id: true, email: true, accountType: true, role: true } },
    },
  });

  if (!session) return null;
  if (session.expiresAt <= now) return null;

  return session.user;
}

export async function createSession(userId: string, remember = true) {
  const token = crypto.randomBytes(32).toString("hex");
  const ttlMs = remember ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 8; // 30d vs 8h
  const expiresAt = new Date(Date.now() + ttlMs);

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  const c = await cookieStore();
  const isProd = process.env.NODE_ENV === "production";

  // IMPORTANT:
  // Do NOT set "domain" here. In some deployments it can cause the cookie to be rejected,
  // which looks like "login works then immediately logs out" + redirect loops.
  // Instead, canonicalize host in middleware (www -> apex).
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function clearSession() {
  const token = await getSessionToken();
  if (token) {
    await prisma.session.delete({ where: { token } }).catch(() => {});
  }

  const c = await cookieStore();
  const isProd = process.env.NODE_ENV === "production";

  c.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    expires: new Date(0),
  });
}
