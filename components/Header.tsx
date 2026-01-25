// components/Header.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bell,
  Heart,
  MessageCircle,
  Search,
  User,
  ExternalLink,
} from "lucide-react";
import HeaderDropdownClient from "@/components/HeaderDropdownClient";
import { getCurrentUser, getSessionToken } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

const TOP_NAV = [
  { label: "Buy", href: "/buy" },
  { label: "Sell", href: "/sell" },
  { label: "Charter", href: "/charter" },
  { label: "Destinations", href: "/destinations" },
  { label: "Brands", href: "/brands" },
  { label: "Brokers", href: "/brokers" },
  { label: "Builders", href: "/builders" },
  { label: "Services", href: "/services" },
  { label: "News", href: "/news" },
  { label: "Guides", href: "/guides" },
  { label: "Events", href: "/events" },
  { label: "Deals", href: "/deals" },
];

function Row2Link({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="px-2 py-2 text-sm text-slate-700 no-underline hover:text-slate-900"
    >
      {children}
    </Link>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex flex-col items-center justify-center gap-1 rounded-md px-2 py-1 text-slate-700 no-underline hover:bg-slate-100"
    >
      {children}
    </Link>
  );
}

async function getPrimaryProfileSlugForUser(userId: string) {
  const p = await prisma.profile.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { slug: true },
  });
  return p?.slug ?? null;
}

export default async function Header() {
  const dropdownPanel =
    "bg-white border border-slate-200 shadow-[0_30px_90px_rgba(2,6,23,0.14)]";

  // auth-aware header (server-side)
  const user = await getCurrentUser().catch(() => null);
  const isAuthed = Boolean(user?.id);

  let profileSlug: string | null = null;
  if (isAuthed && user?.id) {
    profileSlug = await getPrimaryProfileSlugForUser(user.id);
  }

  const myProfileHref = profileSlug ? `/profile/${profileSlug}` : "/profile";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      {/* Row 1 */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="mr-1 inline-flex items-center gap-2 rounded-md px-2 py-1 no-underline hover:bg-slate-100"
          aria-label="Findaly home"
        >
          <span className="text-2xl font-extrabold tracking-tight text-[#ff6a00]">
            findaly
          </span>
        </Link>

        {/* CTA */}
        <Link
          href="/add-listing"
          className="hidden items-center gap-2 rounded-md bg-[#ff6a00] px-4 py-2 text-sm font-semibold text-white no-underline hover:brightness-95 md:inline-flex"
        >
          + List a yacht
        </Link>

        {/* Search */}
        <div className="flex flex-1 items-center">
          <form action="/search" className="w-full">
            <div className="relative w-full">
              <input
                name="q"
                placeholder="Search yachts, parts, services…"
                className="h-11 w-full rounded-md border border-slate-200 bg-slate-100 px-4 pr-12 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-slate-300"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#ff6a00] text-white hover:brightness-95"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right icons (desktop) */}
        <div className="hidden items-center gap-2 md:flex">
          <IconLink href="/searches" label="My searches">
            <Search className="h-5 w-5" />
            <span className="text-[11px] leading-none">Searches</span>
          </IconLink>

          <IconLink href="/saved" label="Saved">
            <Heart className="h-5 w-5" />
            <span className="text-[11px] leading-none">Saved</span>
          </IconLink>

          <IconLink href="/messages" label="Messages">
            <MessageCircle className="h-5 w-5" />
            <span className="text-[11px] leading-none">Messages</span>
          </IconLink>

          <IconLink href="/alerts" label="Alerts">
            <Bell className="h-5 w-5" />
            <span className="text-[11px] leading-none">Alerts</span>
          </IconLink>

          {!isAuthed ? (
            <Link
              href="/login"
              className="ml-1 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-800 no-underline hover:bg-slate-100"
            >
              <User className="h-4 w-4" />
              Sign in
            </Link>
          ) : (
            <HeaderDropdownClient
              label="Account"
              align="right"
              triggerClassName="ml-1 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-800 hover:bg-slate-100"
              panelClassName={dropdownPanel}
            >
              <div className="p-2">
                <Link
                  href={myProfileHref}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-slate-800 no-underline hover:bg-slate-100"
                >
                  My profile
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </Link>
                <Link
                  href="/settings"
                  className="rounded-md px-3 py-2 text-sm no-underline hover:bg-slate-100"
                >
                  Settings
                </Link>
                <div className="my-2 border-t border-slate-200" />
                <Link
                  href="/logout"
                  className="rounded-md px-3 py-2 text-sm no-underline hover:bg-slate-100"
                >
                  Log out
                </Link>
              </div>
            </HeaderDropdownClient>
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <HeaderDropdownClient
            label="Menu"
            align="right"
            triggerClassName="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
            panelClassName={dropdownPanel}
          >
            <div className="p-2">
              <Link
                href="/add-listing"
                className="mb-2 flex items-center justify-center rounded-md bg-[#ff6a00] px-3 py-2 text-sm font-semibold text-white no-underline hover:brightness-95"
              >
                + List a yacht
              </Link>

              <div className="grid gap-1">
                {TOP_NAV.map((i) => (
                  <Link
                    key={i.href}
                    href={i.href}
                    className="rounded-md px-3 py-2 text-sm text-slate-800 no-underline hover:bg-slate-100"
                  >
                    {i.label}
                  </Link>
                ))}
              </div>

              <div className="my-2 border-t border-slate-200" />

              <div className="grid gap-1">
                <Link
                  href="/saved"
                  className="rounded-md px-3 py-2 text-sm no-underline hover:bg-slate-100"
                >
                  Saved
                </Link>
                <Link
                  href="/messages"
                  className="rounded-md px-3 py-2 text-sm no-underline hover:bg-slate-100"
                >
                  Messages
                </Link>
                <Link
                  href="/alerts"
                  className="rounded-md px-3 py-2 text-sm no-underline hover:bg-slate-100"
                >
                  Alerts
                </Link>

                {!isAuthed ? (
                  <Link
                    href="/login"
                    className="rounded-md px-3 py-2 text-sm no-underline hover:bg-slate-100"
                  >
                    Sign in
                  </Link>
                ) : (
                  <>
                    <Link
                      href={myProfileHref}
                      className="rounded-md px-3 py-2 text-sm no-underline hover:bg-slate-100"
                    >
                      My profile
                    </Link>
                    <Link
                      href="/settings"
                      className="rounded-md px-3 py-2 text-sm no-underline hover:bg-slate-100"
                    >
                      Settings
                    </Link>
                    <Link
                      href="/logout"
                      className="rounded-md px-3 py-2 text-sm no-underline hover:bg-slate-100"
                    >
                      Log out
                    </Link>
                  </>
                )}
              </div>
            </div>
          </HeaderDropdownClient>
        </div>
      </div>

      {/* Row 2 */}
      <div className="hidden border-t border-slate-200 md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6">
          {TOP_NAV.map((i, idx) => (
            <div key={i.href} className="flex items-center">
              <Row2Link href={i.href}>{i.label}</Row2Link>
              {idx !== TOP_NAV.length - 1 ? (
                <span className="mx-1 text-slate-300">•</span>
              ) : null}
            </div>
          ))}

          <div className="ml-auto flex items-center gap-2 py-2">
            <HeaderDropdownClient
              label="More"
              align="right"
              triggerClassName="inline-flex items-center gap-1 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-100"
              panelClassName={dropdownPanel}
            >
              <div className="grid gap-1 p-1">
                <Link
                  href="/support"
                  className="rounded-md px-3 py-2 text-sm no-underline hover:bg-slate-100"
                >
                  Support
                </Link>
                <Link
                  href="/about"
                  className="rounded-md px-3 py-2 text-sm no-underline hover:bg-slate-100"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="rounded-md px-3 py-2 text-sm no-underline hover:bg-slate-100"
                >
                  Contact
                </Link>
              </div>
            </HeaderDropdownClient>
          </div>
        </div>
      </div>
    </header>
  );
}
