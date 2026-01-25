import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/admin/session";

const ADMIN_COOKIE = "findaly_admin";
const USER_COOKIE = "findaly_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ---------------------------------------------
  // Canonical host: force non-www in production
  // (avoid cookie host mismatches without touching cookie domain)
  // ---------------------------------------------
  if (process.env.NODE_ENV === "production") {
    const host = req.headers.get("host") || "";
    if (host.startsWith("www.")) {
      const url = req.nextUrl.clone();
      url.host = host.replace(/^www\./, "");
      return NextResponse.redirect(url);
    }
  }

  // ---------------------------
  // Guard /settings (user auth)
  // ---------------------------
  if (pathname.startsWith("/settings")) {
    const token = req.cookies.get(USER_COOKIE)?.value;
    if (token) return NextResponse.next();

    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // ---------------------------
  // Guard /admin (admin auth)
  // ---------------------------
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Allow login + logout
  if (pathname === "/admin/login" || pathname.startsWith("/admin/logout")) {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SECRET || "";

  if (!secret) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const ok = await verifyAdminToken(token, secret);

  if (ok) return NextResponse.next();

  const url = new URL("/admin/login", req.url);
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/settings/:path*"],
};
