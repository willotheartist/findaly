/* scripts/eyb/enrich-eyb.ts
   Hybrid EYB enricher:
   - WP REST: resolve yacht post + media
   - HTML: parse JetEngine/Elementor rendered specs + description
*/

import { z } from "zod";
import * as cheerio from "cheerio";

const EYB_BASE = "https://europeanyachtbrokers.com";

const Args = z.object({
  url: z.string().url(),
});

type WpRendered = {
  rendered?: string;
};

type WpYacht = {
  id: number;
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

type Enriched = {
  source: "eyb";
  sourceUrl: string;
  wpPostId: number;
  slug: string;
  title: string;
  priceRaw?: string;
  priceNumber?: number;
  currency?: string;
  year?: number;
  lengthM?: number;
  beamM?: number;
  draughtM?: number;
  cabins?: number;
  bathrooms?: number;
  location?: string;
  descriptionText?: string;
  descriptionHtml?: string;
  features?: string[];
  featuredImage?: string;
  images?: MediaImage[];
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson<T>(url: string, tries = 3): Promise<T> {
  let lastErr: unknown;

  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          "user-agent":
            "FindalyBot/1.0 (compatible; enrichment script; +https://findaly.co)",
          accept: "application/json,text/plain,*/*",
        },
      });

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return (await res.json()) as T;
    } catch (error: unknown) {
      lastErr = error;
      await sleep(350 * (i + 1));
    }
  }

  throw lastErr;
}

async function fetchHtml(url: string, tries = 3): Promise<string> {
  let lastErr: unknown;

  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          "user-agent":
            "FindalyBot/1.0 (compatible; enrichment script; +https://findaly.co)",
          accept: "text/html,application/xhtml+xml",
        },
      });

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return await res.text();
    } catch (error: unknown) {
      lastErr = error;
      await sleep(350 * (i + 1));
    }
  }

  throw lastErr;
}

function extractSpecMap($: cheerio.CheerioAPI): Record<string, string> {
  const out: Record<string, string> = {};

  const valueNodes = $(".jet-listing-dynamic-field__content")
    .toArray()
    .map((el) => $(el));

  for (const valueNode of valueNodes) {
    const value = valueNode.text().replace(/\s+/g, " ").trim();
    if (!value) continue;

    const container = valueNode.closest(
      ".elementor-widget, .elementor-element, .jet-listing-dynamic-field"
    );

    const label =
      container
        .find("h1,h2,h3,h4,h5,.elementor-heading-title")
        .first()
        .text()
        .replace(/\s+/g, " ")
        .trim() || "";

    const label2 =
      label ||
      container
        .prevAll("h1,h2,h3,h4,h5,.elementor-heading-title")
        .first()
        .text()
        .replace(/\s+/g, " ")
        .trim();

    const finalLabel = (label2 || "")
      .replace(/[:|]+$/g, "")
      .trim()
      .toLowerCase();

    if (!finalLabel) continue;
    if (!out[finalLabel]) out[finalLabel] = value;
  }

  return out;
}

function pickFirstTextMatch(
  specMap: Record<string, string>,
  keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = specMap[key.toLowerCase()];
    if (value) return value;
  }
  return undefined;
}

function parseMoney(s: string): { currency?: string; number?: number } {
  const raw = s.replace(/\s+/g, " ").trim();

  const currency = raw.includes("€")
    ? "EUR"
    : raw.includes("$")
      ? "USD"
      : raw.includes("£")
        ? "GBP"
        : undefined;

  const numStr = raw
    .replace(/[^\d.,]/g, "")
    .replace(/\.(?=\d{3}\b)/g, "")
    .replace(/,(?=\d{3}\b)/g, "");

  const n = Number(numStr.replace(",", "."));
  return { currency, number: Number.isFinite(n) ? n : undefined };
}

function parseNumberLike(s: string): number | undefined {
  const match = s.replace(",", ".").match(/-?\d+(\.\d+)?/);
  if (!match) return undefined;

  const n = Number(match[0]);
  return Number.isFinite(n) ? n : undefined;
}

function extractFeatures($: cheerio.CheerioAPI): string[] {
  const items = $(".jet-check-list__item-content")
    .toArray()
    .map((el) => $(el).text().replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const out: string[] = [];

  for (const item of items) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}

function extractDescription(
  $: cheerio.CheerioAPI,
  wpPostId: number
): { html?: string; text?: string } {
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

  const descHeading = postRoot
    .find(".elementor-heading-title")
    .toArray()
    .map((el) => $(el))
    .find((heading) => heading.text().replace(/\s+/g, " ").trim().toLowerCase() === "description");

  if (descHeading) {
    const headingWidget = descHeading.closest(
      ".elementor-widget, .elementor-element, .elementor-column, section"
    );

    const row = headingWidget.closest(
      ".elementor-section, section, .elementor-container, .elementor-row, .elementor-inner-section"
    );

    let content = row.find(".jet-listing-dynamic-field__content").first();

    if (!content.length) {
      const col = headingWidget.closest(".elementor-column");
      const nextCol = col.nextAll(".elementor-column").first();
      if (nextCol.length) {
        content = nextCol.find(".jet-listing-dynamic-field__content").first();
      }
    }

    if (content.length) {
      content.find(".jet-listing-grid, .jet-listing-grid__items, .jet-listing-grid__item").remove();
      content.find(".MuiStack-root, [data-testid='chat-ai-message--markdown']").remove();

      const html = content.html() || undefined;
      const text = content.text().replace(/\s+/g, " ").trim();

      if (text && text.length > 120 && text.length < 50000) {
        return { html, text };
      }
    }
  }

  const genericHeading = postRoot
    .find("h1,h2,h3,h4,h5,h6,strong,.elementor-heading-title")
    .toArray()
    .map((el) => $(el))
    .find((heading) => heading.text().replace(/\s+/g, " ").trim().toLowerCase() === "description");

  if (genericHeading) {
    const block = genericHeading.closest(
      "section, .elementor-section, .elementor-element, article, main, div"
    );
    const content = block.find(".jet-listing-dynamic-field__content").first();

    if (content.length) {
      content.find(".jet-listing-grid, .jet-listing-grid__items, .jet-listing-grid__item").remove();
      content.find(".MuiStack-root, [data-testid='chat-ai-message--markdown']").remove();

      const html = content.html() || undefined;
      const text = content.text().replace(/\s+/g, " ").trim();

      if (text && text.length > 120 && text.length < 50000) {
        return { html, text };
      }
    }
  }

  return {};
}

async function getYachtBySlug(slug: string) {
  const url = `${EYB_BASE}/wp-json/wp/v2/yachts?slug=${encodeURIComponent(slug)}`;
  const arr = await fetchJson<WpYacht[]>(url);
  if (!arr.length) throw new Error(`No yacht found for slug: ${slug}`);
  return arr[0];
}

async function getMediaByParent(parentId: number) {
  const images: MediaImage[] = [];

  for (let page = 1; page <= 20; page++) {
    const url = `${EYB_BASE}/wp-json/wp/v2/media?parent=${parentId}&per_page=50&page=${page}`;

    let batch: WpMedia[] = [];
    try {
      batch = await fetchJson<WpMedia[]>(url, 2);
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

function slugFromUrl(url: string) {
  const u = new URL(url);
  const parts = u.pathname.split("/").filter(Boolean);
  const yachtsIdx = parts.indexOf("yachts");

  if (yachtsIdx === -1 || !parts[yachtsIdx + 1]) {
    throw new Error(`URL doesn't look like an EYB yachts URL: ${url}`);
  }

  return parts[yachtsIdx + 1];
}

async function main() {
  const args = Args.parse({ url: process.argv[2] });

  const slug = slugFromUrl(args.url);
  const yacht = await getYachtBySlug(slug);

  const wpPostId = Number(yacht.id);
  const title = String(yacht.title?.rendered || slug);

  let featuredImage: string | undefined;
  if (yacht.featured_media) {
    try {
      const media = await fetchJson<WpMedia>(`${EYB_BASE}/wp-json/wp/v2/media/${yacht.featured_media}`);
      featuredImage = media.source_url ? String(media.source_url) : undefined;
    } catch {
      // ignore
    }
  }

  const images = await getMediaByParent(wpPostId);
  const html = await fetchHtml(args.url);
  const $ = cheerio.load(html);
  const specMap = extractSpecMap($);

  const priceText =
    pickFirstTextMatch(specMap, ["price"]) ||
    $("body")
      .find("*")
      .toArray()
      .map((el) => $(el).text().trim())
      .find((text) => /€\s?[\d.,]+|£\s?[\d.,]+|\$\s?[\d.,]+/.test(text));

  const money = priceText ? parseMoney(priceText) : {};

  const yearRaw = pickFirstTextMatch(specMap, ["year built", "year", "built"]);
  const lengthRaw = pickFirstTextMatch(specMap, ["length", "loa"]);
  const beamRaw = pickFirstTextMatch(specMap, ["beam"]);
  const draughtRaw = pickFirstTextMatch(specMap, ["draught", "draft"]);
  const cabinsRaw = pickFirstTextMatch(specMap, ["guest cabins", "cabins"]);
  const bathsRaw = pickFirstTextMatch(specMap, ["guest bathrooms", "bathrooms"]);
  const location =
    pickFirstTextMatch(specMap, ["location"]) ||
    pickFirstTextMatch(specMap, ["marina", "region"]);

  const features = extractFeatures($);
  const desc = extractDescription($, wpPostId);

  const enriched: Enriched = {
    source: "eyb",
    sourceUrl: args.url,
    wpPostId,
    slug,
    title,
    priceRaw: priceText,
    priceNumber: money.number,
    currency: money.currency,
    year: yearRaw ? Math.round(parseNumberLike(yearRaw) || NaN) : undefined,
    lengthM: lengthRaw ? parseNumberLike(lengthRaw) : undefined,
    beamM: beamRaw ? parseNumberLike(beamRaw) : undefined,
    draughtM: draughtRaw ? parseNumberLike(draughtRaw) : undefined,
    cabins: cabinsRaw ? Math.round(parseNumberLike(cabinsRaw) || NaN) : undefined,
    bathrooms: bathsRaw ? Math.round(parseNumberLike(bathsRaw) || NaN) : undefined,
    location,
    descriptionText: desc.text,
    descriptionHtml: desc.html,
    features,
    featuredImage,
    images,
  };

  process.stdout.write(JSON.stringify(enriched, null, 2) + "\n");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});