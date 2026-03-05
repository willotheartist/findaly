// scripts/fix/rehost-listing-media.ts
// Run:
//   DOTENV_CONFIG_PATH=.env.local pnpm tsx -r dotenv/config scripts/fix/rehost-listing-media.ts
//
// What it does:
// - Finds ListingMedia.url pointing at europeanyachtbrokers.com (or any target host you add)
// - Downloads each image (max 12MB, matching your API limits)
// - Uploads to Vercel Blob if BLOB_READ_WRITE_TOKEN exists
// - Otherwise saves locally to /public/uploads and stores /uploads/... in DB
// - Updates ListingMedia.url to the new hosted URL
//
// Fix for TS2345:
// - @vercel/blob PutBody typing can reject ArrayBuffer because it can be ArrayBuffer | SharedArrayBuffer.
// - We upload using Node Readable stream (Readable.from(Buffer)) which satisfies PutBody typings.

import "dotenv/config";
import { prisma } from "@/lib/db";
import { put } from "@vercel/blob";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import { Readable } from "stream";

const MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024; // 12MB

// Migrate THESE hosts (strict: only touches these domains)
const TARGET_HOSTS = new Set([
  "europeanyachtbrokers.com",
  "www.europeanyachtbrokers.com",
]);

// Hosts/URL patterns that are already "ours" and should never be migrated
const ALLOW_HOSTS = new Set([
  "blob.vercel-storage.com",
  "vercel-storage.com",
  "findaly.co",
  "www.findaly.co",
]);

function hostOf(u: string) {
  try {
    return new URL(u).host;
  } catch {
    return "";
  }
}

function isRelative(u: string) {
  return u.startsWith("/uploads/");
}

function extFromContentType(ct: string | null) {
  if (!ct) return "jpg";
  const v = ct.toLowerCase();
  if (v.includes("jpeg")) return "jpg";
  if (v.includes("jpg")) return "jpg";
  if (v.includes("png")) return "png";
  if (v.includes("webp")) return "webp";
  if (v.includes("gif")) return "gif";
  if (v.includes("avif")) return "avif";
  return "jpg";
}

function safeNameFromUrl(u: string) {
  try {
    const p = new URL(u).pathname;
    const base = path.basename(p) || "photo";
    return base
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]+/g, "-")
      .slice(0, 80);
  } catch {
    return "photo";
  }
}

async function fetchImage(url: string) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`fetch ${res.status} ${res.statusText}`);

  const ct = res.headers.get("content-type");
  const len = res.headers.get("content-length");

  if (len && Number(len) > MAX_FILE_SIZE_BYTES) {
    throw new Error(`too_large content-length=${len}`);
  }

  const ab = await res.arrayBuffer();
  const buf = Buffer.from(ab);

  if (buf.length > MAX_FILE_SIZE_BYTES) {
    throw new Error(`too_large bytes=${buf.length}`);
  }

  return { buf, contentType: ct };
}

async function uploadToBlobOrLocal(buf: Buffer, contentType: string | null, originalUrl: string) {
  const hasBlobToken =
    typeof process.env.BLOB_READ_WRITE_TOKEN === "string" &&
    process.env.BLOB_READ_WRITE_TOKEN.length > 0;

  const safeName = safeNameFromUrl(originalUrl);
  const ext = extFromContentType(contentType);
  const filename = `${randomUUID()}-${safeName || "photo"}.${ext}`;

  if (hasBlobToken) {
    // ✅ Prod: Vercel Blob
    // Use a Node Readable stream to satisfy PutBody typings reliably.
    const blobPath = `listings/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${filename}`;

    const uploaded = await put(blobPath, Readable.from(buf), {
      access: "public",
      contentType: contentType || "image/jpeg",
    });

    return uploaded.url;
  }

  // ✅ Local dev: /public/uploads (same as your API routes)
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const fullPath = path.join(uploadDir, filename);
  await fs.writeFile(fullPath, buf);
  return `/uploads/${filename}`;
}

async function main() {
  console.log("[rehost] starting…");

  const media = await prisma.listingMedia.findMany({
    select: { id: true, url: true, listingId: true },
  });

  const candidates = media.filter((m) => {
    if (!m.url) return false;
    if (isRelative(m.url)) return false;

    const host = hostOf(m.url);
    if (!host) return false;
    if (ALLOW_HOSTS.has(host)) return false;

    return TARGET_HOSTS.has(host);
  });

  console.log(`[rehost] candidates: ${candidates.length} / total media: ${media.length}`);

  let ok = 0;
  let fail = 0;

  for (const m of candidates) {
    try {
      const { buf, contentType } = await fetchImage(m.url);
      const newUrl = await uploadToBlobOrLocal(buf, contentType, m.url);

      await prisma.listingMedia.update({
        where: { id: m.id },
        data: { url: newUrl },
      });

      ok++;
      console.log(`[ok] ${m.id} (listing ${m.listingId}) -> ${newUrl}`);
    } catch (e: any) {
      fail++;
      console.log(`[fail] ${m.id} (listing ${m.listingId}) :: ${m.url} :: ${e?.message || e}`);
    }
  }

  const remaining = await prisma.listingMedia.count({
    where: { url: { contains: "europeanyachtbrokers.com" } },
  });

  console.log(`[rehost] done. ok=${ok} fail=${fail} remaining_eYC=${remaining}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});