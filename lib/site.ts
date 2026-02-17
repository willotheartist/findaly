// lib/site.ts
export function getSiteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) return env.replace(/\/+$/, "");

  // Vercel fallback (no protocol sometimes)
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const withProto = vercel.startsWith("http") ? vercel : `https://${vercel}`;
    return withProto.replace(/\/+$/, "");
  }

  // Final fallback
  return "http://localhost:3000";
}

export function absoluteUrl(pathOrUrl: string) {
  if (!pathOrUrl) return getSiteUrl();
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;

  const base = getSiteUrl();
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

export function truncate(str: string, n: number) {
  if (!str) return "";
  const s = str.replace(/\s+/g, " ").trim();
  if (s.length <= n) return s;
  return `${s.slice(0, n - 1).trim()}…`;
}
