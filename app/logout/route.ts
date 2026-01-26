import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, clearSession, getClearSessionCookieOptions } from "@/lib/auth/session";

function cookieDomainFor(req: Request) {
  const host = new URL(req.url).hostname;
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) return undefined;
  if (host === "findaly.co" || host.endsWith(".findaly.co")) return ".findaly.co";
  return undefined;
}

export async function GET(req: Request) {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value ?? null;

  await clearSession(token);

  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set(COOKIE_NAME, "", getClearSessionCookieOptions(cookieDomainFor(req)));
  return res;
}
