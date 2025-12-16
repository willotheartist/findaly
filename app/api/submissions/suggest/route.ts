import { NextResponse } from "next/server";

function normalizeUrl(input: string) {
  const raw = (input || "").trim();
  if (!raw) return "";
  try {
    const u = new URL(raw.includes("://") ? raw : `https://${raw}`);
    u.hash = "";
    return u.toString();
  } catch {
    return "";
  }
}

function titleCaseFromHostname(hostname: string) {
  // ex: "linear.app" -> "Linear"
  const base = hostname.replace(/^www\./, "").split(".")[0] || hostname;
  const cleaned = base.replace(/[-_]+/g, " ").trim();
  if (!cleaned) return "";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("url") ?? "";
  const normalizedUrl = normalizeUrl(input);

  if (!normalizedUrl) {
    return NextResponse.json({});
  }

  let hostname = "";
  try {
    hostname = new URL(normalizedUrl).hostname.replace(/^www\./, "");
  } catch {
    hostname = "";
  }

  // Best-effort: fetch the page title (may fail; that’s okay)
  let suggestedName = titleCaseFromHostname(hostname);

  try {
    const res = await fetch(normalizedUrl, {
      redirect: "follow",
      // keep it light; many sites block bots anyway
      headers: { "user-agent": "FindalyBot/1.0" },
      cache: "no-store",
    });

    if (res.ok) {
      const html = await res.text();
      const m = html.match(/<title[^>]*>([^<]{1,80})<\/title>/i);
      if (m?.[1]) {
        const t = m[1].replace(/\s+/g, " ").trim();
        // if title looks sane, prefer it (but keep it short)
        if (t.length >= 2 && t.length <= 60) {
          // common patterns: "Linear | Issue tracking..." -> "Linear"
          const first = t.split("|")[0]?.split("—")[0]?.split("-")[0]?.trim();
          if (first && first.length >= 2 && first.length <= 40) suggestedName = first;
        }
      }
    }
  } catch {
    // ignore network/title failures
  }

  return NextResponse.json({
    normalizedUrl,
    hostname,
    suggestedName,
  });
}
