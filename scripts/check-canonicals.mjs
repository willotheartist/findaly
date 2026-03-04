/**
 * Audit canonicals for URLs in your sitemap.
 * Prints mismatches like:
 *   BAD  https://www.findaly.co/brands   canonical -> https://www.findaly.co/
 */
const SITEMAP = process.env.SITEMAP || "https://www.findaly.co/sitemap.xml";
const LIMIT = Number(process.env.LIMIT || 0); // 0 = all
const CONCURRENCY = Number(process.env.CONCURRENCY || 8);

function extractLocs(xml) {
  // simple + robust enough for standard sitemaps
  return [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(m => m[1].trim());
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  return m ? m[1].trim() : null;
}

function normalize(u) {
  try {
    const url = new URL(u);
    url.hash = "";
    // Normalize trailing slash (keep "/" only)
    if (url.pathname !== "/" && url.pathname.endsWith("/")) url.pathname = url.pathname.slice(0, -1);
    return url.toString();
  } catch {
    return u;
  }
}

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      // pretend to be a crawler-ish UA
      "user-agent": "Mozilla/5.0 (compatible; CanonicalAudit/1.0; +https://www.findaly.co)"
    }
  });
  const text = await res.text();
  return { status: res.status, text };
}

async function main() {
  const sm = await fetchText(SITEMAP);
  if (sm.status !== 200) {
    console.error("Failed to fetch sitemap:", SITEMAP, "status:", sm.status);
    process.exit(1);
  }

  let urls = extractLocs(sm.text);
  if (LIMIT > 0) urls = urls.slice(0, LIMIT);

  console.log(`Sitemap: ${SITEMAP}`);
  console.log(`URLs: ${urls.length}\n`);

  let i = 0;
  let bad = 0;

  async function worker() {
    while (true) {
      const idx = i++;
      if (idx >= urls.length) return;

      const url = urls[idx];
      try {
        const { status, text } = await fetchText(url);
        const canonical = extractCanonical(text);
        const nUrl = normalize(url);
        const nCan = canonical ? normalize(canonical) : null;

        if (!canonical) {
          bad++;
          console.log(`NO-CANON  ${url}   (status ${status})`);
          continue;
        }

        if (nCan !== nUrl) {
          bad++;
          console.log(`BAD      ${url}\n         canonical -> ${canonical}\n`);
        }
      } catch (e) {
        bad++;
        console.log(`ERR      ${url}   ${String(e)}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  console.log(`\nDone. bad=${bad} / total=${urls.length}`);
  process.exit(bad ? 2 : 0);
}

main();
