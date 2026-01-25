// lib/auth/session.ts
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export const COOKIE_NAME = "findaly_session";

export function getSessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  };
}

export function getClearSessionCookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
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
 * IMPORTANT:
 * In Next.js Route Handlers, mutating cookies() inside helper functions is not reliable.
 * So we only create the DB session here and RETURN {token, expiresAt}.
 * The caller must set the cookie on the NextResponse.
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
 * Deletes session record for a token. Cookie clearing must be done by caller via NextResponse.
 */
export async function clearSession(token?: string | null) {
  const t = token ?? (await getSessionToken());
  if (t) {
    await prisma.session.delete({ where: { token: t } }).catch(() => {});
  }
}
