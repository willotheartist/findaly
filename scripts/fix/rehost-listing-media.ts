// scripts/fix/rehost-listing-media.ts
import "dotenv/config";
import { prisma } from "@/lib/db";
import { put } from "@vercel/blob";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import { Readable } from "stream";

const MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024;

const TARGET_HOSTS = new Set([
  "europeanyachtbrokers.com",
  "www.europeanyachtbrokers.com",
]);

const ALLOW_HOSTS = new Set([
  "blob.vercel-storage.com",
  "vercel-storage.com",
  "findaly.co",
  "www.findaly.co",
]);

type ErrorWithMessage = {
  message?: string;
};

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

  const value = ct.toLowerCase();
  if (value.includes("jpeg")) return "jpg";
  if (value.includes("jpg")) return "jpg";
  if (value.includes("png")) return "png";
  if (value.includes("webp")) return "webp";
  if (value.includes("gif")) return "gif";
  if (value.includes("avif")) return "avif";
  return "jpg";
}

function safeNameFromUrl(u: string) {
  try {
    const pathname = new URL(u).pathname;
    const base = path.basename(pathname) || "photo";
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

  const contentType = res.headers.get("content-type");
  const contentLength = res.headers.get("content-length");

  if (contentLength && Number(contentLength) > MAX_FILE_SIZE_BYTES) {
    throw new Error(`too_large content-length=${contentLength}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buf = Buffer.from(arrayBuffer);

  if (buf.length > MAX_FILE_SIZE_BYTES) {
    throw new Error(`too_large bytes=${buf.length}`);
  }

  return { buf, contentType };
}

async function uploadToBlobOrLocal(
  buf: Buffer,
  contentType: string | null,
  originalUrl: string
) {
  const hasBlobToken =
    typeof process.env.BLOB_READ_WRITE_TOKEN === "string" &&
    process.env.BLOB_READ_WRITE_TOKEN.length > 0;

  const safeName = safeNameFromUrl(originalUrl);
  const ext = extFromContentType(contentType);
  const filename = `${randomUUID()}-${safeName || "photo"}.${ext}`;

  if (hasBlobToken) {
    const blobPath = `listings/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${filename}`;

    const uploaded = await put(blobPath, Readable.from(buf), {
      access: "public",
      contentType: contentType || "image/jpeg",
    });

    return uploaded.url;
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const fullPath = path.join(uploadDir, filename);
  await fs.writeFile(fullPath, buf);

  return `/uploads/${filename}`;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const maybe = error as ErrorWithMessage;
    if (typeof maybe.message === "string") return maybe.message;
  }
  return String(error);
}

async function main() {
  console.log("[rehost] starting…");

  const media = await prisma.listingMedia.findMany({
    select: { id: true, url: true, listingId: true },
  });

  const candidates = media.filter((item) => {
    if (!item.url) return false;
    if (isRelative(item.url)) return false;

    const host = hostOf(item.url);
    if (!host) return false;
    if (ALLOW_HOSTS.has(host)) return false;

    return TARGET_HOSTS.has(host);
  });

  console.log(`[rehost] candidates: ${candidates.length} / total media: ${media.length}`);

  let ok = 0;
  let fail = 0;

  for (const item of candidates) {
    try {
      const { buf, contentType } = await fetchImage(item.url);
      const newUrl = await uploadToBlobOrLocal(buf, contentType, item.url);

      await prisma.listingMedia.update({
        where: { id: item.id },
        data: { url: newUrl },
      });

      ok++;
      console.log(`[ok] ${item.id} (listing ${item.listingId}) -> ${newUrl}`);
    } catch (error: unknown) {
      fail++;
      console.log(
        `[fail] ${item.id} (listing ${item.listingId}) :: ${item.url} :: ${getErrorMessage(error)}`
      );
    }
  }

  const remaining = await prisma.listingMedia.count({
    where: { url: { contains: "europeanyachtbrokers.com" } },
  });

  console.log(`[rehost] done. ok=${ok} fail=${fail} remaining_eYC=${remaining}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});