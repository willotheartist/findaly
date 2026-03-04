// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

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
      "cache-control": "public, max-age=86400",
    },
  });
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // ---------------------------
  // ✅ Canonical host redirect (PERMANENT): findaly.co -> www.findaly.co
  // ---------------------------
  const host = (req.headers.get("host") || "").toLowerCase();
  if (host === "findaly.co") {
    const url = req.nextUrl.clone();
    url.hostname = "www.findaly.co";
    return NextResponse.redirect(url, 308);
  }

  // ---------------------------
  // ✅ Purge legacy site sections
  // ---------------------------
  if (isLegacyRoute(pathname)) {
    return gone410();
  }

  // ---------------------------
  // ✅ Guard protected user routes
  // ---------------------------
  if (isProtectedRoute(pathname)) {
    const token = req.cookies.get(USER_COOKIE)?.value;

    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirect", pathname + (search || ""));
      return NextResponse.redirect(url);
    }

    // ✅ Pass token to server components via request header
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-session-token", token);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // ---------------------------
  // ✅ Guard /admin (EDGE-SAFE)
  //
  // IMPORTANT:
  // Middleware runs on the Edge runtime.
  // Do NOT import Prisma, pg, node:crypto, or anything that touches lib/db.ts here.
  //
  // We do a lightweight gate here (presence check).
  // Real verification should happen inside /admin pages or /api/admin routes (Node runtime).
  // ---------------------------
  if (pathname.startsWith("/admin")) {
    // Allow admin login/logout pages
    if (pathname === "/admin/login" || pathname.startsWith("/admin/logout")) {
      return NextResponse.next();
    }

    const secret = (process.env.ADMIN_SECRET || "").trim();
    const token = (req.cookies.get(ADMIN_COOKIE)?.value || "").trim();

    // If secret missing OR token missing -> bounce to login.
    // (Keeps behavior similar to your existing intent without importing server-only code.)
    if (!secret || !token) {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("next", pathname + (search || ""));
      return NextResponse.redirect(url);
    }

    // Token exists -> allow request through.
    // ✅ Verification MUST occur in Node runtime (admin layout/page or API).
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // ✅ Run middleware on all pages so host canonical redirect applies everywhere.
    // Exclude Next internals + common static assets.
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};