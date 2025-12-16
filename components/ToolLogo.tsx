"use client";

import * as React from "react";

type Props = {
  name: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  className?: string;
};

function normalizeUrl(url?: string | null) {
  if (!url) return null;
  try {
    return new URL(url).toString();
  } catch {
    try {
      return new URL(`https://${url}`).toString();
    } catch {
      return null;
    }
  }
}

function domainFromWebsite(url?: string | null) {
  const u = normalizeUrl(url);
  if (!u) return null;
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function googleFavicon(domain: string, size = 128) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
}

export default function ToolLogo({ name, logoUrl, websiteUrl, className = "" }: Props) {
  const domain = domainFromWebsite(websiteUrl);
  const src = (logoUrl && logoUrl.trim()) || (domain ? googleFavicon(domain, 128) : null);

  const [broken, setBroken] = React.useState(false);

  // ✅ reset error state whenever src changes (filter/sort safe)
  React.useEffect(() => {
    setBroken(false);
  }, [src]);

  return (
    <div
      className={
        "h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 " +
        className
      }
      aria-label={`${name} logo`}
      title={name}
    >
      {src && !broken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${name} logo`}
          className="h-full w-full object-contain p-2"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setBroken(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white/70">
          {name?.slice(0, 1)?.toUpperCase() || "?"}
        </div>
      )}
    </div>
  );
}
