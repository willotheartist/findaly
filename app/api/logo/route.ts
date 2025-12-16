import { NextResponse } from "next/server";

function absolutify(base: string, href: string) {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

function pickBestIcon(links: { href: string; sizes?: string; rel?: string }[]) {
  // Prefer biggest declared size, then apple-touch-icon, then icon.
  const scored = links
    .map((l) => {
      const sizes = (l.sizes || "").toLowerCase();
      const match = sizes.match(/(\d+)\s*x\s*(\d+)/);
      const sizeScore = match ? Math.min(parseInt(match[1], 10), parseInt(match[2], 10)) : 0;
      const rel = (l.rel || "").toLowerCase();
      const relScore =
        rel.includes("apple-touch-icon") ? 1000 :
        rel.includes("icon") ? 500 :
        0;
      return { ...l, score: relScore + sizeScore };
    })
    .sort((a, b) => b.score - a.score);

  return scored[0]?.href ?? null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const site = searchParams.get("site"); // full website url

  if (!site) {
    return NextResponse.json({ error: "Missing ?site=" }, { status: 400 });
  }

  let url: URL;
  try {
    url = new URL(site.startsWith("http") ? site : `https://${site}`);
  } catch {
    return NextResponse.json({ error: "Invalid site URL" }, { status: 400 });
  }

  const origin = url.origin;
  const googleFallback = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;

  // 1) Fast path: /favicon.ico (very common)
  try {
    const ico = `${origin}/favicon.ico`;
    const r = await fetch(ico, { redirect: "follow" });
    if (r.ok) {
      const ct = r.headers.get("content-type") || "";
      if (ct.includes("image") || ico.endsWith(".ico")) {
        return NextResponse.json({ logoUrl: ico, source: "favicon.ico" }, { status: 200 });
      }
    }
  } catch {}

  // 2) Parse homepage HTML for best icon link
  try {
    const htmlRes = await fetch(origin, {
      redirect: "follow",
      headers: { "user-agent": "findaly-logo-bot/1.0" },
    });

    if (htmlRes.ok) {
      const html = await htmlRes.text();

      // very lightweight link tag extraction
      const linkTagRegex = /<link\s+[^>]*>/gi;
      const attr = (tag: string, name: string) => {
        const m = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"));
        return m?.[1];
      };

      const links: { href: string; sizes?: string; rel?: string }[] = [];
      const tags = html.match(linkTagRegex) || [];

      for (const tag of tags) {
        const rel = attr(tag, "rel");
        if (!rel) continue;
        const relLower = rel.toLowerCase();
        if (
          !relLower.includes("icon") &&
          !relLower.includes("apple-touch-icon") &&
          !relLower.includes("mask-icon")
        ) continue;

        const href = attr(tag, "href");
        if (!href) continue;

        links.push({
          rel,
          href,
          sizes: attr(tag, "sizes") || undefined,
        });
      }

      const best = pickBestIcon(links);
      if (best) {
        const abs = absolutify(origin, best);
        if (abs) return NextResponse.json({ logoUrl: abs, source: "html<link>" }, { status: 200 });
      }
    }
  } catch {}

  // 3) Free universal fallback
  return NextResponse.json({ logoUrl: googleFallback, source: "google-favicon" }, { status: 200 });
}
