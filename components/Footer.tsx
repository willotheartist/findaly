// components/Footer.tsx
import Link from "next/link";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-slate-600 no-underline hover:text-slate-900"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-[#E9FF63]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Top */}
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-xl font-extrabold tracking-tight text-[#F56462]">
              findaly
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-000">
              A modern marketplace for yachts — buy, sell, and charter with confidence.
            </p>
          </div>

          {/* Columns */}
          <div className="grid gap-8 sm:grid-cols-2 md:col-span-3 md:grid-cols-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">Marketplace</div>
              <div className="mt-3 grid gap-2">
                <FooterLink href="/buy">Buy</FooterLink>
                <FooterLink href="/sell">Sell</FooterLink>
                <FooterLink href="/charter">Charter</FooterLink>
                <FooterLink href="/destinations">Destinations</FooterLink>
                <FooterLink href="/brands">Brands</FooterLink>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-900">Resources</div>
              <div className="mt-3 grid gap-2">
                <FooterLink href="/guides">Guides</FooterLink>
                <FooterLink href="/news">News</FooterLink>
                <FooterLink href="/services">Services</FooterLink>
                <FooterLink href="/events">Events</FooterLink>
                <FooterLink href="/deals">Deals</FooterLink>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-900">Company</div>
              <div className="mt-3 grid gap-2">
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
                <FooterLink href="/support">Support</FooterLink>
                <FooterLink href="/privacy">Privacy</FooterLink>
                <FooterLink href="/terms">Terms</FooterLink>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Findaly. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <FooterLink href="/add-listing">List a yacht</FooterLink>
            <FooterLink href="/login">Sign in</FooterLink>
            <FooterLink href="/signup">Create account</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
