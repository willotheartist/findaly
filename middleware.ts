// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/admin/session";

const ADMIN_COOKIE = "findaly_admin";
const USER_COOKIE = "findaly_session";

// ✅ Legacy site sections to purge (old Findaly)
const LEGACY_PREFIXES = ["/alternatives", "/use-cases", "/best", "/compare"];

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

function isLegacyRoute(pathname: string): boolean {
  return LEGACY_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function gone410() {
  return new NextResponse("Gone", {
    status: 410,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      // cache a bit so bots don’t hammer you
      "cache-control": "public, max-age=86400",
    },
  });
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // ---------------------------
  // ✅ Purge legacy site sections
  // ---------------------------
  if (isLegacyRoute(pathname)) {
    return gone410();
  }

  // ---------------------------
  // Guard protected user routes
  // ---------------------------
  if (isProtectedRoute(pathname)) {
    const token = req.cookies.get(USER_COOKIE)?.value;

    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirect", pathname + (search || ""));
      return NextResponse.redirect(url);
    }

    // ✅ IMPORTANT FIX:
    // Pass token to server components via a REQUEST header.
    // (Response headers are not readable via next/headers in server components.)
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-session-token", token);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
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
    // ✅ Legacy routes (purge)
    "/alternatives/:path*",
    "/use-cases/:path*",
    "/best/:path*",
    "/compare/:path*",

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