import Link from "next/link";
import { prisma } from "@/lib/db";
import { Search } from "lucide-react";
import HeaderDropdownClient from "@/components/HeaderDropdownClient";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-2 py-1 text-sm text-(--color-text-muted) hover:bg-white/5 hover:text-(--color-text-main) no-underline decoration-transparent"
    >
      {children}
    </Link>
  );
}

function Divider() {
  return <span className="mx-2 hidden h-4 w-px bg-white/10 md:inline-block" />;
}

function DropItem({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc?: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl px-3 py-2 no-underline decoration-transparent hover:bg-white/6"
    >
      <div className="text-sm font-medium text-(--color-text-main)">{title}</div>
      {desc ? (
        <div className="mt-0.5 text-xs text-(--color-text-muted)">{desc}</div>
      ) : null}
    </Link>
  );
}

export default async function Header() {
  const categories = await prisma.category.findMany({
    orderBy: [{ name: "asc" }],
    take: 8,
  });

  const [firstTool, secondTool] = await Promise.all([
    prisma.tool.findFirst({
      where: { status: "ACTIVE" },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
      select: { slug: true, name: true },
    }),
    prisma.tool.findFirst({
      where: { status: "ACTIVE" },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
      skip: 1,
      select: { slug: true, name: true },
    }),
  ]);

  const compareHref =
    firstTool && secondTool
      ? `/compare/${firstTool.slug}-vs-${secondTool.slug}`
      : "/tools";
  const alternativesHref = "/alternatives";

  const dropdownPanel =
    "bg-[#0b0b0f]/95 backdrop-blur-2xl border border-white/12 ring-1 ring-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.70)]";

  const dropdownTrigger =
    "rounded-md px-2 py-1 text-sm text-(--color-text-muted) hover:bg-white/5 hover:text-(--color-text-main) no-underline decoration-transparent";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="mr-1 inline-flex items-center gap-2 rounded-md px-2 py-1 no-underline decoration-transparent hover:bg-white/5"
            aria-label="Findaly home"
          >
            {/* Lucide icon, not boxed */}
            <Search className="h-5 w-5 text-(--color-text-main)" aria-hidden />
            {/* Tight wordmark */}
            <span className="text-base font-semibold tracking-tight text-(--color-text-main)">
              Findaly
            </span>
          </Link>

          <Divider />

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="/tools">Tools</NavLink>
            <NavLink href="/best">Best</NavLink>
            <NavLink href="/use-cases">Use cases</NavLink>

            <HeaderDropdownClient
              label="Browse"
              align="left"
              triggerClassName={dropdownTrigger}
              panelClassName={dropdownPanel}
            >
              <DropItem href="/tools" title="All tools" desc="Search and filter the database" />

              {categories.length ? (
                <>
                  <div className="my-2 border-t border-white/10" />
                  {categories.map((c) => (
                    <DropItem
                      key={c.id}
                      href={`/tools/category/${c.slug}`}
                      title={c.name}
                      desc={`Browse ${c.name} tools`}
                    />
                  ))}
                </>
              ) : null}
            </HeaderDropdownClient>

            <NavLink href={compareHref}>Compare</NavLink>
            <NavLink href={alternativesHref}>Alternatives</NavLink>

            <HeaderDropdownClient
              label="Company"
              align="left"
              triggerClassName={dropdownTrigger}
              panelClassName={dropdownPanel}
            >
              <DropItem href="/about" title="About" desc="What Findaly is" />
              <DropItem href="/submit" title="Submit a tool" desc="Add to the directory" />
              <DropItem href="/contact" title="Contact" desc="Questions or partnerships" />
            </HeaderDropdownClient>
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Link
            href="/tools"
            className="hidden rounded-full border border-white/12 bg-white/6 px-3 py-2 text-sm text-(--color-text-muted) no-underline decoration-transparent hover:border-white/20 hover:bg-white/10 md:inline-flex"
          >
            Search tools…
            <span className="ml-2 rounded-md border border-white/12 bg-white/6 px-1.5 text-xs opacity-70">
              ⌘K
            </span>
          </Link>

          <NavLink href="/login">Log in</NavLink>

          <Link
            href="/signup"
            className="rounded-full bg-(--color-accent) px-3 py-2 text-sm font-medium text-white no-underline decoration-transparent shadow-[0_10px_30px_rgba(124,92,255,0.25)] hover:brightness-110"
          >
            Sign up
          </Link>

          {/* Mobile */}
          <div className="md:hidden">
            <HeaderDropdownClient
              label="Menu"
              align="right"
              triggerClassName={dropdownTrigger}
              panelClassName={dropdownPanel}
            >
              <DropItem href="/tools" title="Tools" />
              <DropItem href="/best" title="Best" />
              <DropItem href="/use-cases" title="Use cases" />
              <DropItem href={compareHref} title="Compare" />
              <DropItem href={alternativesHref} title="Alternatives" />

              {categories.length ? (
                <>
                  <div className="my-2 border-t border-white/10" />
                  {categories.slice(0, 6).map((c) => (
                    <DropItem key={c.id} href={`/tools/category/${c.slug}`} title={c.name} />
                  ))}
                </>
              ) : null}

              <div className="my-2 border-t border-white/10" />
              <DropItem href="/submit" title="Submit a tool" />
              <DropItem href="/about" title="About" />
              <DropItem href="/contact" title="Contact" />
              <div className="my-2 border-t border-white/10" />
              <DropItem href="/login" title="Log in" />
              <DropItem href="/signup" title="Sign up" />
            </HeaderDropdownClient>
          </div>
        </div>
      </div>
    </header>
  );
}
