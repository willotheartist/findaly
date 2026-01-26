// lib/auth/session.ts
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export const COOKIE_NAME = "findaly_session";

/**
 * If you run both findaly.co and www.findaly.co, set COOKIE_DOMAIN in prod:
 * COOKIE_DOMAIN=.findaly.co
 *
 * In local dev, leave undefined.
 */
function getCookieDomain(): string | undefined {
  const env = process.env.COOKIE_DOMAIN?.trim();
  return env || undefined;
}

function baseCookieOptions(expires?: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(expires ? { expires } : {}),
    ...(process.env.NODE_ENV === "production" && getCookieDomain()
      ? { domain: getCookieDomain() }
      : {}),
  };
}

/**
 * Some routes import this. Keep it for compatibility.
 * Use it like: res.cookies.set(COOKIE_NAME, "", getClearSessionCookieOptions())
 */
export function getClearSessionCookieOptions() {
  return baseCookieOptions(new Date(0));
}

export async function getSessionToken() {
  const c = await cookies();
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

  const c = await cookies();
  c.set(COOKIE_NAME, token, baseCookieOptions(expiresAt));

  return token;
}

/**
 * Some code may call clearSession(req). Allow it (ignore the arg).
 */
export async function clearSession(_req?: unknown) {
  const token = await getSessionToken();
  if (token) {
    await prisma.session.delete({ where: { token } }).catch(() => {});
  }

  const c = await cookies();
  c.set(COOKIE_NAME, "", getClearSessionCookieOptions());
}
