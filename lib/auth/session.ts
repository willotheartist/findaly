// lib/auth/session.ts
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { cookies, headers } from "next/headers";

export const COOKIE_NAME = "findaly_session";

/**
 * If you run both findaly.co and www.findaly.co, set COOKIE_DOMAIN in prod:
 * COOKIE_DOMAIN=.findaly.co
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

export function getClearSessionCookieOptions() {
  return baseCookieOptions(new Date(0));
}

/**
 * Get the session token from cookies or from the x-session-token header
 * (which middleware sets as a fallback).
 */
export async function getSessionToken(): Promise<string | null> {
  // Try reading from cookies first
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (cookie?.value) return cookie.value;
  } catch (e) {
    console.warn("[getSessionToken] cookies() failed:", e);
  }

  // Fallback: try reading from header (set by middleware)
  try {
    const headerStore = await headers();
    const headerToken = headerStore.get("x-session-token");
    if (headerToken) return headerToken;
  } catch (e) {
    console.warn("[getSessionToken] headers() failed:", e);
  }

  return null;
}

async function clearSessionCookieOnly() {
  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, "", getClearSessionCookieOptions());
  } catch (e) {
    console.warn("[clearSessionCookieOnly] cookies() failed:", e);
  }
}

export async function getCurrentUser() {
  const token = await getSessionToken();

  if (!token) return null;

  try {
    const now = new Date();

    const session = await prisma.session.findUnique({
      where: { token },
      select: {
        expiresAt: true,
        user: {
          select: {
            id: true,
            email: true,
            accountType: true,
            role: true,
          },
        },
      },
    });

    // ✅ IMPORTANT FIX:
    // Cookie exists but session row doesn't => stale cookie => clear it.
    if (!session) {
      await clearSessionCookieOnly();
      return null;
    }

    // Expired session => delete row + clear cookie
    if (session.expiresAt <= now) {
      await prisma.session.delete({ where: { token } }).catch(() => {});
      await clearSessionCookieOnly();
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("[getCurrentUser] Database error:", error);
    // Defensive: if DB errors while token exists, do NOT clear cookie automatically.
    // (Keeps you from random logouts during transient DB issues.)
    return null;
  }
}

export async function createSession(userId: string, remember = true) {
  const token = crypto.randomBytes(32).toString("hex");
  const ttlMs = remember ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 8; // 30d vs 8h
  const expiresAt = new Date(Date.now() + ttlMs);

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, baseCookieOptions(expiresAt));

  return token;
}

export async function clearSession(_req?: unknown) {
  const token = await getSessionToken();
  if (token) {
    await prisma.session.delete({ where: { token } }).catch(() => {});
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", getClearSessionCookieOptions());
}
