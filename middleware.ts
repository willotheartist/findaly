// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/admin/session";

const ADMIN_COOKIE = "findaly_admin";
const USER_COOKIE = "findaly_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // -------------------------------------------------------------------------
  // Canonical host + https (prevents "refresh logs me out" due to host mismatch)
  // -------------------------------------------------------------------------
  if (process.env.NODE_ENV === "production") {
    const host = req.headers.get("host") || "";
    const proto = req.headers.get("x-forwarded-proto") || req.nextUrl.protocol.replace(":", "");

    // Force https
    if (proto === "http") {
      const url = req.nextUrl.clone();
      url.protocol = "https:";
      return NextResponse.redirect(url);
    }

    // Force non-www (optional but strongly recommended)
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

  // Fail closed in prod. In dev, if not configured, still redirect to login.
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
