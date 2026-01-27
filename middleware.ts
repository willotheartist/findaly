// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/admin/session";

const ADMIN_COOKIE = "findaly_admin";
const USER_COOKIE = "findaly_session";

// Routes that require user authentication
const PROTECTED_USER_ROUTES = [
  "/settings",
  "/my-listings", 
  "/messages",
  "/searches",
  "/saved",
  "/alerts",
  "/add-listing",
];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_USER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ---------------------------
  // Guard protected user routes
  // ---------------------------
  if (isProtectedRoute(pathname)) {
    const token = req.cookies.get(USER_COOKIE)?.value;
    
    if (!token) {
      // No session cookie - redirect to login
      const url = new URL("/login", req.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // Token exists - let the request through
    // The server component will validate the token against the database
    const response = NextResponse.next();
    
    // Pass the token to server components via a header
    // This ensures the token is available even if cookies() has issues
    response.headers.set("x-session-token", token);
    
    return response;
  }

  // ---------------------------
  // Guard /admin (admin auth)
  // ---------------------------
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

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
  matcher: [
    // Protected user routes
    "/settings",
    "/settings/:path*",
    "/my-listings",
    "/my-listings/:path*",
    "/messages",
    "/messages/:path*",
    "/searches",
    "/searches/:path*",
    "/saved",
    "/saved/:path*",
    "/alerts",
    "/alerts/:path*",
    "/add-listing",
    "/add-listing/:path*",
    // Admin routes
    "/admin/:path*",
  ],
};