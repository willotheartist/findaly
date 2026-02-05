//·components/Header.tsx
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  Heart,
  MessageCircle,
  Search,
  User,
  ExternalLink,
  Ship,
  Settings,
  LifeBuoy,
  Plus,
  LogOut,
  Bookmark,
  LayoutGrid,
} from "lucide-react";
import HeaderDropdownClient from "@/components/HeaderDropdownClient";
import LogoutButtonClient from "@/components/LogoutButtonClient";
import { getCurrentUser } from "@/lib/auth/session";
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

async function getPrimaryProfileForUser(userId: string) {
  const p = await prisma.profile.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { slug: true, name: true, avatarUrl: true },
  });
  return p ?? null;
}

function initials(name?: string | null, email?: string | null) {
  const base = (name || "").trim() || (email || "").trim();
  if (!base) return "U";
  const parts = base.split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (a + b).toUpperCase();
}

function accountLabel(accountType?: string | null) {
  if (!accountType) return "Account";
  return accountType
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/(^|\s)\S/g, (t) => t.toUpperCase());
}

function MenuItem({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 no-underline hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#E9FF63]/60"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-slate-900">
          {title}
        </div>
        {subtitle ? (
          <div className="truncate text-xs text-slate-500">{subtitle}</div>
        ) : null}
      </div>
      <ExternalLink className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-500" />
    </Link>
  );
}

export default async function Header() {
  const dropdownPanel = "bg-white border border-slate-200";

  const user = await getCurrentUser().catch(() => null);
  const isAuthed = Boolean(user?.id);

  const profile = isAuthed && user?.id ? await getPrimaryProfileForUser(user.id) : null;

  const myProfileHref = profile?.slug ? `/profile/${profile.slug}` : "/profile";
  const displayName = profile?.name || (user?.email ? user.email.split("@")[0] : "Account");
  const displayEmail = user?.email ?? "";
  const displayAccount = accountLabel(user?.accountType ?? null);
  const avatarUrl = profile?.avatarUrl ?? null;

  return (
    <header
      data-site-header="true"
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white"
    >
      <div className="h-px w-full bg-[#E9FF63]" />

      {/* Row 1 */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="mr-1 inline-flex items-center gap-2 rounded-md px-2 py-1 no-underline hover:bg-slate-100"
          aria-label="Findaly home"
        >
          <span className="text-2xl font-extrabold tracking-tight text-[#F56462]">
            findaly
          </span>
        </Link>

        {/* CTA */}
        <Link
          href="/add-listing"
          className="hidden items-center gap-2 rounded-md border border-[#F56462] bg-white px-4 py-2 text-sm font-semibold text-[#F56462] no-underline hover:bg-[#F56462] hover:text-white md:inline-flex"
        >
          <Plus className="h-4 w-4" />
          List a yacht
        </Link>

        {/* Search */}
        <div className="flex flex-1 items-center">
          <form action="/search" className="w-full">
            <div className="relative w-full">
              <input
                name="q"
                placeholder="Search yachts, parts, services…"
                className="h-11 w-full rounded-md border border-slate-200 bg-slate-100 px-4 pr-12 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-slate-300 focus:bg-white"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#F56462] text-white hover:brightness-95"
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
              align="right"
              triggerClassName="ml-1 rounded-full p-0.5 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#E9FF63]/60"
              panelClassName={dropdownPanel}
              label={
                <span className="inline-flex items-center gap-2">
                  <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={displayName}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-slate-700">
                        {initials(profile?.name ?? null, user?.email ?? null)}
                      </span>
                    )}
                  </span>
                </span>
              }
            >
              <div className="p-3">
                {/* Top identity block */}
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-200 bg-slate-50">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={displayName}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-extrabold text-slate-700">
                        {initials(profile?.name ?? null, user?.email ?? null)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {displayName}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-slate-500">
                      {displayAccount}{displayEmail ? ` • ${displayEmail}` : ""}
                    </div>
                  </div>
                </div>

                {/* Primary CTA row */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    href={myProfileHref}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 no-underline hover:bg-slate-50"
                  >
                    <User className="h-4 w-4 text-slate-600" />
                    View profile
                  </Link>
                  <Link
                    href="/add-listing"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#F56462] bg-white px-3 py-2 text-sm font-semibold text-[#F56462] no-underline hover:bg-[#F56462] hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                    List a yacht
                  </Link>
                </div>

                <div className="my-3 h-px w-full bg-slate-200" />

                {/* Menu items */}
                <div className="grid gap-1">
                  <MenuItem
                    href="/my-listings"
                    icon={<Ship className="h-4 w-4" />}
                    title="My listings"
                    subtitle="Edit, pause, manage"
                  />
                  <MenuItem
                    href="/messages"
                    icon={<MessageCircle className="h-4 w-4" />}
                    title="Messages"
                    subtitle="Inquiries & chats"
                  />
                  <MenuItem
                    href="/saved"
                    icon={<Bookmark className="h-4 w-4" />}
                    title="Saved"
                    subtitle="Favourites & boats"
                  />
                  <MenuItem
                    href="/searches"
                    icon={<LayoutGrid className="h-4 w-4" />}
                    title="Saved searches"
                    subtitle="Alerts & filters"
                  />
                  <MenuItem
                    href="/alerts"
                    icon={<Bell className="h-4 w-4" />}
                    title="Alerts"
                    subtitle="Price drops & updates"
                  />
                </div>

                <div className="my-3 h-px w-full bg-slate-200" />

                {/* Secondary */}
                <div className="grid gap-1">
                  <MenuItem
                    href="/settings"
                    icon={<Settings className="h-4 w-4" />}
                    title="Settings"
                    subtitle="Account & security"
                  />
                  <MenuItem
                    href="/support"
                    icon={<LifeBuoy className="h-4 w-4" />}
                    title="Help & support"
                    subtitle="Contact Findaly"
                  />
                </div>

                <div className="my-3 h-px w-full bg-slate-200" />

                {/* Logout */}
                <div className="rounded-2xl border border-slate-200 bg-white p-1">
                  <LogoutButtonClient
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  />
                  <div className="pointer-events-none -mt-[34px] ml-3 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700">
                    <LogOut className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </HeaderDropdownClient>
          )}
        </div>

        {/* Mobile menu stays as-is in your current build.
            If you want, next we can apply the same avatar dropdown on mobile too. */}
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
              label={<span className="text-sm text-slate-700">More</span>}
              align="right"
              triggerClassName="inline-flex items-center gap-1 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-100"
              panelClassName={dropdownPanel}
            >
              <div className="p-2">
                <div className="grid gap-1">
                  <Link
                    href="/support"
                    className="rounded-xl px-3 py-2 text-sm text-slate-800 no-underline hover:bg-slate-100"
                  >
                    Support
                  </Link>
                  <Link
                    href="/about"
                    className="rounded-xl px-3 py-2 text-sm text-slate-800 no-underline hover:bg-slate-100"
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-xl px-3 py-2 text-sm text-slate-800 no-underline hover:bg-slate-100"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </HeaderDropdownClient>
          </div>
        </div>
      </div>
    </header>
  );
}
