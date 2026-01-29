// lib/auth/session.ts
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { cookies, headers } from "next/headers";

export const COOKIE_NAME = "findaly_session";

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
 * Get the session token from cookies or x-session-token header
 */
export async function getSessionToken(): Promise<string | null> {
  // cookies()
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (cookie?.value) return cookie.value;
  } catch (e) {
    console.warn("[getSessionToken] cookies() failed:", e);
  }

  // headers()
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

    // stale cookie
    if (!session) {
      await clearSessionCookieOnly();
      return null;
    }

    // expired
    if (session.expiresAt <= now) {
      await prisma.session.delete({ where: { token } }).catch(() => {});
      await clearSessionCookieOnly();
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("[getCurrentUser] DB error:", error);
    return null;
  }
}

export async function createSession(userId: string, remember = true) {
  const token = crypto.randomBytes(32).toString("hex");
  const ttlMs = remember
    ? 1000 * 60 * 60 * 24 * 30
    : 1000 * 60 * 60 * 8;

  const expiresAt = new Date(Date.now() + ttlMs);

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, baseCookieOptions(expiresAt));

  return token;
}

export async function clearSession() {
  const token = await getSessionToken();

  if (token) {
    await prisma.session.delete({ where: { token } }).catch(() => {});
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", getClearSessionCookieOptions());
}
