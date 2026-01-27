// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/admin/session";

const ADMIN_COOKIE = "findaly_admin";
const USER_COOKIE = "findaly_session";

// Routes that require user authentication
const PROTECTED_USER_ROUTES = ["/settings", "/my-listings", "/messages"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ---------------------------
  // Guard protected user routes
  // ---------------------------
  const isProtectedUserRoute = PROTECTED_USER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedUserRoute) {
    const token = req.cookies.get(USER_COOKIE)?.value;
    
    if (token) {
      // User has session cookie, allow through
      return NextResponse.next();
    }

    // No session - redirect to login with proper redirect param
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", pathname);
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
  matcher: ["/admin/:path*", "/settings/:path*", "/my-listings/:path*", "/messages/:path*"],
};