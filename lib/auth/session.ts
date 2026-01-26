// lib/auth/session.ts
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export const COOKIE_NAME = "findaly_session";

type CookieDomain = string | undefined;

export function getSessionCookieOptions(expiresAt: Date, domain?: CookieDomain) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
    ...(domain ? { domain } : {}),
  };
}

export function getClearSessionCookieOptions(domain?: CookieDomain) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
    ...(domain ? { domain } : {}),
  };
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

/**
 * Route Handlers must set cookies on the NextResponse.
 * This only creates the DB session and returns token + expiry.
 */
export async function createSession(userId: string, remember = true) {
  const token = crypto.randomBytes(32).toString("hex");
  const ttlMs = remember ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 8; // 30d vs 8h
  const expiresAt = new Date(Date.now() + ttlMs);

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  return { token, expiresAt };
}

/**
 * Deletes the DB session record.
 * Cookie clearing must be done by caller via NextResponse.
 */
export async function clearSession(token?: string | null) {
  const t = token ?? (await getSessionToken());
  if (t) {
    await prisma.session.delete({ where: { token: t } }).catch(() => {});
  }
}
