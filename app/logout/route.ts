import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  clearSession,
  getClearSessionCookieOptions,
} from "@/lib/auth/session";

export async function GET(req: Request) {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value ?? null;

  await clearSession(token);

  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set(COOKIE_NAME, "", getClearSessionCookieOptions());
  return res;
}
