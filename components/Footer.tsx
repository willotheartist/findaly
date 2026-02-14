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
      className="text-sm text-slate-700 no-underline hover:text-slate-900"
    >
      {children}
    </Link>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-semibold text-slate-900">{children}</div>;
}

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand + email */}
          <div className="lg:col-span-4">
            <div className="text-xl font-extrabold tracking-tight text-slate-900">
              findaly
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-700">
              A modern marketplace for yachts — buy, sell, and charter with
              confidence. Built for brokers, brands, and serious buyers.
            </p>

            {/* Swap-ish email block (no shadow) */}
            <div className="mt-8">
              <div className="relative max-w-sm">
                <label className="sr-only" htmlFor="footer-email">
                  Email
                </label>

                {/* playful underline */}
                <svg
                  className="pointer-events-none absolute -left-2 -top-5 h-16 w-[360px] max-w-[95vw]"
                  viewBox="0 0 360 80"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M28 55 C60 40, 95 62, 128 50 C170 34, 212 66, 252 48 C288 32, 320 55, 346 46"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M44 30 C58 22, 66 22, 78 30"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 40 C14 46, 18 50, 26 52"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="relative flex items-center border border-slate-300 bg-white px-4 py-3">
                  <input
                    id="footer-email"
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Submit email"
                    className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:text-slate-900"
                  >
                    <span className="text-lg leading-none">→</span>
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Get new listings, market drops, and broker insights. No spam.
                </p>
              </div>
            </div>
          </div>

          {/* Links grid (Swap-style density) */}
          <div className="lg:col-span-8">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {/* Marketplace */}
              <div>
                <FooterHeading>Marketplace</FooterHeading>
                <div className="mt-4 grid gap-2">
                  <FooterLink href="/buy">Buy</FooterLink>
                  <FooterLink href="/sell">Sell</FooterLink>
                  <FooterLink href="/charter">Charter</FooterLink>
                  <FooterLink href="/add-listing">List a yacht</FooterLink>
                  <FooterLink href="/saved-searches">Saved searches</FooterLink>
                  <FooterLink href="/alerts">Price alerts</FooterLink>
                  <FooterLink href="/messages">Messages</FooterLink>
                </div>
              </div>

              {/* Explore */}
              <div>
                <FooterHeading>Explore</FooterHeading>
                <div className="mt-4 grid gap-2">
                  <FooterLink href="/destinations">Destinations</FooterLink>
                  <FooterLink href="/brands">Yacht brands</FooterLink>
                  <FooterLink href="/brokers">Brokers</FooterLink>
                  <FooterLink href="/shipyards">Shipyards</FooterLink>
                  <FooterLink href="/services">Services</FooterLink>
                  <FooterLink href="/parts">Parts & equipment</FooterLink>
                  <FooterLink href="/crew-jobs">Crew jobs</FooterLink>
                </div>
              </div>

              {/* Learn */}
              <div>
                <FooterHeading>Learn</FooterHeading>
                <div className="mt-4 grid gap-2">
                  <FooterLink href="/guides/buying-a-yacht">Buying guide</FooterLink>
                  <FooterLink href="/guides/selling-a-yacht">Selling guide</FooterLink>
                  <FooterLink href="/guides/charter-guide">Charter guide</FooterLink>
                  <FooterLink href="/guides/survey-inspection">Survey & inspection</FooterLink>
                  <FooterLink href="/guides/finance">Finance & ownership</FooterLink>
                  <FooterLink href="/news">News</FooterLink>
                  <FooterLink href="/reports">Reports</FooterLink>
                </div>
              </div>

              {/* Company */}
              <div>
                <FooterHeading>Company</FooterHeading>
                <div className="mt-4 grid gap-2">
                  <FooterLink href="/about">About</FooterLink>
                  <FooterLink href="/contact">Contact</FooterLink>
                  <FooterLink href="/support">Support</FooterLink>
                  <FooterLink href="/careers">Careers</FooterLink>
                  <FooterLink href="/blog">Blog</FooterLink>
                  <FooterLink href="/faq">FAQ</FooterLink>
                </div>

                <div className="mt-8">
                  <FooterHeading>Socials</FooterHeading>
                  <div className="mt-4 grid gap-2">
                    <FooterLink href="/instagram">Instagram</FooterLink>
                    <FooterLink href="/linkedin">LinkedIn</FooterLink>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary dense row (Swap-like) */}
            <div className="mt-10 grid gap-8 border-t border-slate-200 pt-10 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <FooterHeading>For Brokers</FooterHeading>
                <div className="mt-4 grid gap-2">
                  <FooterLink href="/brokers/join">Join as a broker</FooterLink>
                  <FooterLink href="/brokers/dashboard">Broker dashboard</FooterLink>
                  <FooterLink href="/brokers/pricing">Pricing</FooterLink>
                  <FooterLink href="/brokers/faq">Broker FAQ</FooterLink>
                </div>
              </div>

              <div>
                <FooterHeading>Trust & Safety</FooterHeading>
                <div className="mt-4 grid gap-2">
                  <FooterLink href="/verification">Verification</FooterLink>
                  <FooterLink href="/safety">Safety tips</FooterLink>
                  <FooterLink href="/scams">Avoid scams</FooterLink>
                  <FooterLink href="/report">Report a listing</FooterLink>
                </div>
              </div>

              <div>
                <FooterHeading>Legal</FooterHeading>
                <div className="mt-4 grid gap-2">
                  <FooterLink href="/privacy">Privacy Policy</FooterLink>
                  <FooterLink href="/cookies">Cookies</FooterLink>
                  <FooterLink href="/terms">Terms</FooterLink>
                  <FooterLink href="/disclaimer">Disclaimer</FooterLink>
                </div>
              </div>

              <div>
                <FooterHeading>Account</FooterHeading>
                <div className="mt-4 grid gap-2">
                  <FooterLink href="/login">Sign in</FooterLink>
                  <FooterLink href="/signup">Create account</FooterLink>
                  <FooterLink href="/my-listings">My listings</FooterLink>
                  <FooterLink href="/settings">Settings</FooterLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Findaly. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <FooterLink href="/add-listing">List a yacht</FooterLink>
            <FooterLink href="/buy">Browse listings</FooterLink>
            <FooterLink href="/brokers">Find a broker</FooterLink>
            <FooterLink href="/contact">Get in touch</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
