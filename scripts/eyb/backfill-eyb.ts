/**
 * scripts/eyb/backfill-eyb.ts
 *
 * ULTRA-POLITE EYB backfill (designed to avoid stressing EYB in ANY way):
 * - Forces single-thread (concurrency = 1) regardless of flags.
 * - Global request throttle (min gap between ALL HTTP requests).
 * - Additional per-listing delay + jitter.
 * - Exponential backoff on 429/403/5xx.
 * - Disk cache per listing to avoid re-fetching EYB if you re-run.
 *
 * Updates existing Findaly listings: eyb_001..eyb_196
 * - Resolves EYB WP slug from Findaly slug (eyb-...-YEAR) via patterns + search fallback.
 * - Extracts Description + Features from HTML.
 * - Gets images via WP media endpoint.
 * - Writes:
 *   - Listing.description (only if placeholder / too short / equals title)
 *   - Listing.features (only if empty unless --force-features)
 *   - Listing.videoUrl (only if empty)
 *   - ListingMedia (only if empty unless --force-media)
 *
 * Run (recommended):
 *   cd ~/development/findaly
 *   pnpm tsx scripts/eyb/backfill-eyb.ts --start=1 --end=196
 *
 * Optional flags:
 *   --start=1 --end=196
 *   --force-media
 *   --force-features
 *   --listingDelay=12000        (ms between listings; default 12000)
 *   --requestGap=2500           (ms between ALL HTTP requests; default 2500)
 *   --jitter=1500               (random 0..jitter ms; default 1500)
 *   --cache=1                   (default 1; set 0 to disable)
 */

import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import * as cheerio from "cheerio";

const EYB_BASE = "https://europeanyachtbrokers.com";

// -------------------- args --------------------

function getArg(name: string, def?: string) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (!hit) return def;
  return hit.split("=").slice(1).join("=");
}
function hasFlag(name: string) {
  return process.argv.includes(`--${name}`);
}

const START = Number(getArg("start", "1"));
const END = Number(getArg("end", "196"));

// Hard force single-thread
const CONCURRENCY = 1;

const FORCE_MEDIA = hasFlag("force-media");
const FORCE_FEATURES = hasFlag("force-features");

const LISTING_DELAY_MS = Math.max(0, Number(getArg("listingDelay", "12000"))); // default 12s
const REQUEST_GAP_MS = Math.max(0, Number(getArg("requestGap", "2500"))); // default 2.5s between ALL requests
const JITTER_MS = Math.max(0, Number(getArg("jitter", "1500"))); // default 0..1.5s random
const CACHE_ENABLED = String(getArg("cache", "1")).trim() !== "0";

const CACHE_DIR = path.join(process.cwd(), ".cache", "eyb-backfill");
if (CACHE_ENABLED) fs.mkdirSync(CACHE_DIR, { recursive: true });

// -------------------- helpers --------------------

function pad3(n: number) {
  return String(n).padStart(3, "0");
}
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
function jitter() {
  return JITTER_MS > 0 ? Math.floor(Math.random() * JITTER_MS) : 0;
}
function cachePath(listingId: string) {
  return path.join(CACHE_DIR, `${listingId}.json`);
}
function readCache<T>(listingId: string): T | null {
  if (!CACHE_ENABLED) return null;
  const p = cachePath(listingId);
  if (!fs.existsSync(p)) return null;
  try {
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
function writeCache(listingId: string, data: unknown) {
  if (!CACHE_ENABLED) return;
  const p = cachePath(listingId);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

function normalizeFeature(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-")
    .replace(/^\-|\-$/g, "");
}

function isPlaceholderDescription(desc: string | null | undefined, title: string): boolean {
  const d = (desc || "").trim();
  if (!d) return true;
  if (d.toLowerCase() === (title || "").trim().toLowerCase()) return true;
  if (d.length < 40) return true;
  return false;
}

function extractYoutubeUrlFromText(s?: string): string | undefined {
  if (!s) return undefined;
  const m =
    s.match(/https?:\/\/(?:www\.)?youtu\.be\/[A-Za-z0-9_\-]+/i) ||
    s.match(/https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[A-Za-z0-9_\-]+/i);
  return m?.[0];
}

// -------------------- ultra-polite request throttle + backoff --------------------

let lastRequestAt = 0;

async function politeWaitBeforeRequest() {
  const now = Date.now();
  const nextAllowed = lastRequestAt + REQUEST_GAP_MS + jitter();
  const wait = Math.max(0, nextAllowed - now);
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
}

function isRetryableStatus(status: number) {
  return status === 429 || status === 403 || status >= 500;
}

async function fetchWithBackoff(
  url: string,
  accept: string,
  as: "json" | "text",
  tries = 6
): Promise<any> {
  let lastErr: unknown;

  for (let i = 0; i < tries; i++) {
    await politeWaitBeforeRequest();

    try {
      const res = await fetch(url, {
        headers: {
          "user-agent": "FindalyBot/1.0 (polite enrichment; +https://findaly.co)",
          accept,
        },
      });

      if (!res.ok) {
        const status = res.status;
        if (isRetryableStatus(status)) {
          const base = 8000; // 8s
          const backoff = Math.min(120000, base * Math.pow(2, i)); // cap 2 min
          await sleep(backoff + jitter());
          continue;
        }
        throw new Error(`${status} ${res.statusText}`);
      }

      return as === "json" ? await res.json() : await res.text();
    } catch (e) {
      lastErr = e;
      const base = 6000;
      const backoff = Math.min(120000, base * Math.pow(2, i));
      await sleep(backoff + jitter());
    }
  }

  throw lastErr;
}

async function fetchJson<T>(url: string): Promise<T> {
  return (await fetchWithBackoff(url, "application/json,text/plain,*/*", "json")) as T;
}

async function fetchHtml(url: string): Promise<string> {
  return (await fetchWithBackoff(url, "text/html,application/xhtml+xml", "text")) as string;
}

// -------------------- HTML extractors --------------------

function extractFeatures($: cheerio.CheerioAPI): string[] {
  const items = $(".jet-check-list__item-content")
    .toArray()
    .map((el) => $(el).text().replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map(normalizeFeature)
    .filter(Boolean);

  const seen = new Set<string>();
  const out: string[] = [];
  for (const it of items) {
    if (seen.has(it)) continue;
    seen.add(it);
    out.push(it);
  }
  return out;
}

/**
 * Targeted description extraction:
 * - Find heading ".elementor-heading-title" == "Description"
 * - Take adjacent ".jet-listing-dynamic-field__content"
 */
function extractDescriptionTextHtml(
  $: cheerio.CheerioAPI,
  wpPostId: number
): { text?: string; html?: string } {
  $("header, nav, footer, .elementor-location-header").remove();
  $(".jet-listing-grid, .jet-listing-grid__items, .jet-listing-grid__item").remove();

  $("section, .elementor-section, .e-con, .elementor-element").each((_, el) => {
    const node = $(el);
    const headingText = node
      .find("h1,h2,h3,h4,h5,h6,.elementor-heading-title")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    if (headingText === "more boats") node.remove();
  });

  const postRoot =
    $(`#post-${wpPostId}`).first().length
      ? $(`#post-${wpPostId}`).first()
      : $(`.post-${wpPostId}`).first().length
      ? $(`.post-${wpPostId}`).first()
      : $("article.hentry").first().length
      ? $("article.hentry").first()
      : $("#content").first().length
      ? $("#content").first()
      : $("main").first();

  postRoot.find(".jet-listing-grid, .jet-listing-grid__items, .jet-listing-grid__item").remove();

  const headingEl = postRoot
    .find(".elementor-heading-title")
    .toArray()
    .map((el) => $(el))
    .find((h) => h.text().replace(/\s+/g, " ").trim().toLowerCase() === "description");

  if (!headingEl) return {};

  const headingWidget = headingEl.closest(
    ".elementor-widget, .elementor-element, .elementor-column, section"
  );
  const row = headingWidget.closest(
    ".elementor-section, section, .elementor-container, .elementor-row, .elementor-inner-section"
  );

  let content = row.find(".jet-listing-dynamic-field__content").first();

  if (!content.length) {
    const col = headingWidget.closest(".elementor-column");
    const nextCol = col.nextAll(".elementor-column").first();
    if (nextCol.length) content = nextCol.find(".jet-listing-dynamic-field__content").first();
  }

  if (!content.length) return {};

  content.find(".jet-listing-grid, .jet-listing-grid__items, .jet-listing-grid__item").remove();
  content.find(".MuiStack-root, [data-testid='chat-ai-message--markdown']").remove();

  return {
    html: content.html() || undefined,
    text: content.text().replace(/\s+/g, " ").trim() || undefined,
  };
}

// -------------------- EYB slug resolving --------------------

function buildCandidateEybSlugs(findalySlug: string): string[] {
  const s = (findalySlug || "").trim();
  const base = s.replace(/^eyb-/, "").replace(/^-+|-+$/g, "").replace(/-+/g, "-");

  const out: string[] = [];
  const push = (x: string) => {
    const v = x.replace(/^-+|-+$/g, "").replace(/-+/g, "-");
    if (v && !out.includes(v)) out.push(v);
  };

  // raw base
  push(base);

  // insert "-for-sale-" before year
  const m = base.match(/^(.*?)-((19|20)\d{2})$/);
  if (m) {
    const stem = m[1];
    const year = m[2];
    push(`${stem}-for-sale-${year}`);
  }

  return out;
}

function findalySlugToSearchQuery(findalySlug: string): string {
  // "eyb-lagoon-450-f-2020" -> "lagoon 450 f 2020"
  return findalySlug
    .replace(/^eyb-/, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function getWpYachtBySlug(slug: string) {
  const url = `${EYB_BASE}/wp-json/wp/v2/yachts?slug=${encodeURIComponent(slug)}`;
  const arr = await fetchJson<any[]>(url);
  return arr?.[0] || null;
}

async function searchWpYacht(query: string) {
  const url = `${EYB_BASE}/wp-json/wp/v2/yachts?search=${encodeURIComponent(query)}&per_page=20`;
  const arr = await fetchJson<any[]>(url);
  return Array.isArray(arr) ? arr : [];
}

async function resolveWpYacht(findalySlug: string, listingTitle: string) {
  const candidates = buildCandidateEybSlugs(findalySlug);

  for (const cand of candidates) {
    const yacht = await getWpYachtBySlug(cand);
    if (yacht) return { yacht, eybSlug: cand, method: "slug" as const };
  }

  // fallback search using slug tokens (includes year)
  const q1 = findalySlugToSearchQuery(findalySlug);
  const s1 = await searchWpYacht(q1);
  if (s1.length) {
    const year = (findalySlug.match(/(19|20)\d{2}$/)?.[0] || "").trim();
    const best = (year && s1.find((x) => String(x.slug || "").includes(year))) || s1[0];
    return { yacht: best, eybSlug: String(best.slug || ""), method: "search(slug)" as const };
  }

  // last fallback: title search (less reliable)
  const q2 = (listingTitle || "").trim();
  if (q2) {
    const s2 = await searchWpYacht(q2);
    if (s2.length) {
      return { yacht: s2[0], eybSlug: String(s2[0].slug || ""), method: "search(title)" as const };
    }
  }

  throw new Error(
    `No EYB yacht found. findalySlug="${findalySlug}" candidates=${JSON.stringify(
      candidates
    )} title="${listingTitle}"`
  );
}

// -------------------- WP media --------------------

async function getMediaByParent(parentId: number) {
  const images: Array<{ id: number; url: string; width?: number; height?: number }> = [];

  for (let page = 1; page <= 20; page++) {
    const url = `${EYB_BASE}/wp-json/wp/v2/media?parent=${parentId}&per_page=50&page=${page}`;
    let batch: any[] = [];
    try {
      batch = await fetchJson<any[]>(url);
    } catch {
      break;
    }
    if (!batch.length) break;

    for (const m of batch) {
      const full = m?.media_details?.sizes?.full?.source_url || m?.source_url;
      if (!full) continue;
      images.push({
        id: m.id,
        url: String(full),
        width: m?.media_details?.width,
        height: m?.media_details?.height,
      });
    }
  }

  // dedupe by filename (strip "-300x169" etc if present)
  const seen = new Set<string>();
  return images.filter((img) => {
    try {
      const u = new URL(img.url);
      const file = (u.pathname.split("/").pop() || "").toLowerCase();
      const norm = file.replace(/-\d+(?=\.(jpg|jpeg|png|webp)$)/, "");
      if (!norm) return false;
      if (seen.has(norm)) return false;
      seen.add(norm);
      return true;
    } catch {
      if (seen.has(img.url)) return false;
      seen.add(img.url);
      return true;
    }
  });
}

// -------------------- enrichment --------------------

type CachedEnrichment = {
  eybSlug: string;
  method: "slug" | "search(slug)" | "search(title)";
  sourceUrl: string;
  wpPostId: number;
  descriptionText?: string;
  descriptionHtml?: string;
  features: string[];
  featuredImage?: string;
  images: Array<{ id: number; url: string; width?: number; height?: number }>;
  youtubeUrl?: string;
};

async function enrichEybListing(listingId: string, findalySlug: string, listingTitle: string) {
  const cached = readCache<CachedEnrichment>(listingId);
  if (cached) return cached;

  const { yacht, eybSlug, method } = await resolveWpYacht(findalySlug, listingTitle);

  const wpPostId = Number(yacht.id);
  const sourceUrl = `${EYB_BASE}/yachts/${eybSlug.replace(/^\/+|\/+$/g, "")}/`;

  const html = await fetchHtml(sourceUrl);
  const $ = cheerio.load(html);

  const desc = extractDescriptionTextHtml($, wpPostId);
  const features = extractFeatures($);
  const images = await getMediaByParent(wpPostId);

  let featuredImage: string | undefined;
  if (yacht.featured_media) {
    try {
      const m = await fetchJson<any>(`${EYB_BASE}/wp-json/wp/v2/media/${yacht.featured_media}`);
      featuredImage = m?.source_url ? String(m.source_url) : undefined;
    } catch {
      // ignore
    }
  }

  const out: CachedEnrichment = {
    eybSlug,
    method,
    sourceUrl,
    wpPostId,
    descriptionText: desc.text,
    descriptionHtml: desc.html,
    features,
    featuredImage,
    images,
    youtubeUrl: extractYoutubeUrlFromText(desc.text) || extractYoutubeUrlFromText(desc.html),
  };

  writeCache(listingId, out);
  return out;
}

// -------------------- DB update --------------------

async function replaceListingMedia(prisma: any, listingId: string, urls: string[]) {
  await prisma.listingMedia.deleteMany({ where: { listingId } });
  if (!urls.length) return;
  await prisma.listingMedia.createMany({
    data: urls.map((url, idx) => ({ listingId, url, sort: idx })),
  });
}

// -------------------- main --------------------

async function main() {
  // import Prisma AFTER dotenv so db.ts doesn't throw
  const { prisma } = await import("../../lib/db");

  console.log(
    `EYB backfill (ULTRA-POLITE): start=${START} end=${END} concurrency=${CONCURRENCY} forceMedia=${FORCE_MEDIA} forceFeatures=${FORCE_FEATURES} listingDelay=${LISTING_DELAY_MS} requestGap=${REQUEST_GAP_MS} jitter=${JITTER_MS} cache=${CACHE_ENABLED}`
  );

  // single worker
  for (let n = START; n <= END; n++) {
    const externalId = `eyb_${pad3(n)}`;

    try {
      const listing = await prisma.listing.findUnique({
        where: { id: externalId },
        include: { media: { orderBy: { sort: "asc" } } },
      });

      if (!listing) {
        console.log(`[SKIP] ${externalId} not found`);
      } else {
        const hasMedia = (listing.media?.length || 0) > 0;

        const enriched = await enrichEybListing(listing.id, listing.slug, listing.title);

        const imgs = enriched.images.map((x) => x.url).filter(Boolean);
        const featured = enriched.featuredImage;
        const urls = featured && !imgs.includes(featured) ? [featured, ...imgs] : imgs;

        const shouldWriteDescription = isPlaceholderDescription(listing.description, listing.title);
        const nextDescription = shouldWriteDescription
          ? (enriched.descriptionText?.trim() || undefined)
          : listing.description;

        const currentFeatures = Array.isArray(listing.features) ? (listing.features as any[]) : [];
        const shouldWriteFeatures = FORCE_FEATURES || currentFeatures.length === 0;

        const nextVideoUrl = listing.videoUrl ? listing.videoUrl : enriched.youtubeUrl;

        await prisma.listing.update({
          where: { id: listing.id },
          data: {
            ...(nextDescription ? { description: nextDescription } : {}),
            ...(shouldWriteFeatures ? { features: enriched.features } : {}),
            ...(nextVideoUrl ? { videoUrl: nextVideoUrl } : {}),
          },
        });

        if (!hasMedia || FORCE_MEDIA) {
          await replaceListingMedia(prisma, listing.id, urls);
        }

        console.log(
          `[OK] ${externalId} | ${listing.slug} -> ${enriched.eybSlug} (${enriched.method}) | desc=${
            nextDescription ? "yes" : "no"
          } | imgs=${urls.length} | feats=${enriched.features.length}` +
            (hasMedia && !FORCE_MEDIA ? " | media kept" : " | media replaced")
        );
      }
    } catch (e) {
      console.error(`[ERR] ${externalId}`, e);
    }

    // extra polite delay between listings
    if (LISTING_DELAY_MS > 0) {
      await sleep(LISTING_DELAY_MS + jitter());
    }
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});