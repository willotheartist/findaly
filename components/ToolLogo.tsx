"use client";

import * as React from "react";

type Props = {
  name: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  className?: string;
};

function getDomain(url?: string | null) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function clearbitFromWebsite(url?: string | null) {
  const domain = getDomain(url);
  if (!domain) return null;
  return `https://logo.clearbit.com/${domain}`;
}

export default function ToolLogo({
  name,
  logoUrl,
  websiteUrl,
  className = "",
}: Props) {
  const [broken, setBroken] = React.useState(false);

  const src = logoUrl || clearbitFromWebsite(websiteUrl);

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
