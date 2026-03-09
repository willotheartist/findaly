// scripts/eyb/backfill-eyb.ts
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
 *   --listingDelay=12000
 *   --requestGap=2500
 *   --jitter=1500
 *   --cache=1
 */

import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import * as cheerio from "cheerio";
import type { PrismaClient } from "@prisma/client";

const EYB_BASE = "https://europeanyachtbrokers.com";

type WpRendered = {
  rendered?: string;
};

type WpYacht = {
  id: number;
  slug?: string;
  featured_media?: number;
  title?: WpRendered;
};

type WpMedia = {
  id: number;
  source_url?: string;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: {
      full?: {
        source_url?: string;
      };
    };
  };
};

type MediaImage = {
  id: number;
  url: string;
  width?: number;
  height?: number;
};

type ListingLike = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  features: PrismaJsonValue[] | null;
  videoUrl: string | null;
  media: Array<{ id: string; url: string; sort: number }>;
};

type PrismaJsonPrimitive = string | number | boolean | null;
type PrismaJsonValue = PrismaJsonPrimitive | PrismaJsonObject | PrismaJsonArray;
type PrismaJsonObject = { [key: string]: PrismaJsonValue };
type PrismaJsonArray = PrismaJsonValue[];

function getArg(name: string, def?: string) {
  const hit = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  if (!hit) return def;
  return hit.split("=").slice(1).join("=");
}

function hasFlag(name: string) {
  return process.argv.includes(`--${name}`);
}

const START = Number(getArg("start", "1"));
const END = Number(getArg("end", "196"));
const CONCURRENCY = 1;
const FORCE_MEDIA = hasFlag("force-media");
const FORCE_FEATURES = hasFlag("force-features");
const LISTING_DELAY_MS = Math.max(0, Number(getArg("listingDelay", "12000")));
const REQUEST_GAP_MS = Math.max(0, Number(getArg("requestGap", "2500")));
const JITTER_MS = Math.max(0, Number(getArg("jitter", "1500")));
const CACHE_ENABLED = String(getArg("cache", "1")).trim() !== "0";

const CACHE_DIR = path.join(process.cwd(), ".cache", "eyb-backfill");
if (CACHE_ENABLED) fs.mkdirSync(CACHE_DIR, { recursive: true });

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  const match =
    s.match(/https?:\/\/(?:www\.)?youtu\.be\/[A-Za-z0-9_\-]+/i) ||
    s.match(/https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[A-Za-z0-9_\-]+/i);
  return match?.[0];
}

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
): Promise<unknown> {
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
          const backoff = Math.min(120000, 8000 * Math.pow(2, i));
          await sleep(backoff + jitter());
          continue;
        }
        throw new Error(`${status} ${res.statusText}`);
      }

      return as === "json" ? await res.json() : await res.text();
    } catch (error: unknown) {
      lastErr = error;
      const backoff = Math.min(120000, 6000 * Math.pow(2, i));
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

function extractFeatures($: cheerio.CheerioAPI): string[] {
  const items = $(".jet-check-list__item-content")
    .toArray()
    .map((el) => $(el).text().replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map(normalizeFeature)
    .filter(Boolean);

  const seen = new Set<string>();
  const out: string[] = [];

  for (const item of items) {
    if (seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }

  return out;
}

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
    .find((heading) => heading.text().replace(/\s+/g, " ").trim().toLowerCase() === "description");

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

function buildCandidateEybSlugs(findalySlug: string): string[] {
  const s = (findalySlug || "").trim();
  const base = s.replace(/^eyb-/, "").replace(/^-+|-+$/g, "").replace(/-+/g, "-");

  const out: string[] = [];

  const push = (value: string) => {
    const normalized = value.replace(/^-+|-+$/g, "").replace(/-+/g, "-");
    if (normalized && !out.includes(normalized)) out.push(normalized);
  };

  push(base);

  const match = base.match(/^(.*?)-((19|20)\d{2})$/);
  if (match) {
    const stem = match[1];
    const year = match[2];
    push(`${stem}-for-sale-${year}`);
  }

  return out;
}

function findalySlugToSearchQuery(findalySlug: string): string {
  return findalySlug
    .replace(/^eyb-/, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function getWpYachtBySlug(slug: string) {
  const url = `${EYB_BASE}/wp-json/wp/v2/yachts?slug=${encodeURIComponent(slug)}`;
  const arr = await fetchJson<WpYacht[]>(url);
  return arr[0] || null;
}

async function searchWpYacht(query: string) {
  const url = `${EYB_BASE}/wp-json/wp/v2/yachts?search=${encodeURIComponent(query)}&per_page=20`;
  const arr = await fetchJson<WpYacht[]>(url);
  return Array.isArray(arr) ? arr : [];
}

async function resolveWpYacht(findalySlug: string, listingTitle: string) {
  const candidates = buildCandidateEybSlugs(findalySlug);

  for (const candidate of candidates) {
    const yacht = await getWpYachtBySlug(candidate);
    if (yacht) return { yacht, eybSlug: candidate, method: "slug" as const };
  }

  const q1 = findalySlugToSearchQuery(findalySlug);
  const s1 = await searchWpYacht(q1);
  if (s1.length) {
    const year = (findalySlug.match(/(19|20)\d{2}$/)?.[0] || "").trim();
    const best = (year && s1.find((item) => String(item.slug || "").includes(year))) || s1[0];
    return { yacht: best, eybSlug: String(best.slug || ""), method: "search(slug)" as const };
  }

  const q2 = (listingTitle || "").trim();
  if (q2) {
    const s2 = await searchWpYacht(q2);
    if (s2.length) {
      return {
        yacht: s2[0],
        eybSlug: String(s2[0].slug || ""),
        method: "search(title)" as const,
      };
    }
  }

  throw new Error(
    `No EYB yacht found. findalySlug="${findalySlug}" candidates=${JSON.stringify(
      candidates
    )} title="${listingTitle}"`
  );
}

async function getMediaByParent(parentId: number) {
  const images: MediaImage[] = [];

  for (let page = 1; page <= 20; page++) {
    const url = `${EYB_BASE}/wp-json/wp/v2/media?parent=${parentId}&per_page=50&page=${page}`;

    let batch: WpMedia[] = [];
    try {
      batch = await fetchJson<WpMedia[]>(url);
    } catch {
      break;
    }

    if (!batch.length) break;

    for (const media of batch) {
      const full = media.media_details?.sizes?.full?.source_url || media.source_url;
      if (!full) continue;

      images.push({
        id: media.id,
        url: String(full),
        width: media.media_details?.width,
        height: media.media_details?.height,
      });
    }
  }

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

type CachedEnrichment = {
  eybSlug: string;
  method: "slug" | "search(slug)" | "search(title)";
  sourceUrl: string;
  wpPostId: number;
  descriptionText?: string;
  descriptionHtml?: string;
  features: string[];
  featuredImage?: string;
  images: MediaImage[];
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
      const media = await fetchJson<WpMedia>(`${EYB_BASE}/wp-json/wp/v2/media/${yacht.featured_media}`);
      featuredImage = media.source_url ? String(media.source_url) : undefined;
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

async function replaceListingMedia(
  prismaClient: PrismaClient,
  listingId: string,
  urls: string[]
) {
  await prismaClient.listingMedia.deleteMany({ where: { listingId } });

  if (!urls.length) return;

  await prismaClient.listingMedia.createMany({
    data: urls.map((url, idx) => ({ listingId, url, sort: idx })),
  });
}

function asStringArray(value: PrismaJsonValue[] | null): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

async function main() {
  const { prisma } = await import("../../lib/db");

  console.log(
    `EYB backfill (ULTRA-POLITE): start=${START} end=${END} concurrency=${CONCURRENCY} forceMedia=${FORCE_MEDIA} forceFeatures=${FORCE_FEATURES} listingDelay=${LISTING_DELAY_MS} requestGap=${REQUEST_GAP_MS} jitter=${JITTER_MS} cache=${CACHE_ENABLED}`
  );

  for (let n = START; n <= END; n++) {
    const externalId = `eyb_${pad3(n)}`;

    try {
      const listing = (await prisma.listing.findUnique({
        where: { id: externalId },
        include: { media: { orderBy: { sort: "asc" } } },
      })) as ListingLike | null;

      if (!listing) {
        console.log(`[SKIP] ${externalId} not found`);
      } else {
        const hasMedia = (listing.media?.length || 0) > 0;
        const enriched = await enrichEybListing(listing.id, listing.slug, listing.title);

        const imgs = enriched.images.map((img) => img.url).filter(Boolean);
        const featured = enriched.featuredImage;
        const urls = featured && !imgs.includes(featured) ? [featured, ...imgs] : imgs;

        const shouldWriteDescription = isPlaceholderDescription(listing.description, listing.title);
        const nextDescription = shouldWriteDescription
          ? enriched.descriptionText?.trim() || undefined
          : listing.description || undefined;

        const currentFeatures = asStringArray(listing.features);
        const shouldWriteFeatures = FORCE_FEATURES || currentFeatures.length === 0;
        const nextVideoUrl = listing.videoUrl || enriched.youtubeUrl;

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
    } catch (error: unknown) {
      console.error(`[ERR] ${externalId}`, error);
    }

    if (LISTING_DELAY_MS > 0) {
      await sleep(LISTING_DELAY_MS + jitter());
    }
  }

  console.log("Done.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});