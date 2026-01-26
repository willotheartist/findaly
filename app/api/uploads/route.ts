// app/api/uploads/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024; // 12MB per image
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

function extFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/avif":
      return "avif";
    default:
      return "bin";
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const files = form.getAll("files");

    if (!files.length) {
      return NextResponse.json({ error: "No files received" }, { status: 400 });
    }

    const urls: string[] = [];

    // Check if we have Vercel Blob token (production)
    const hasBlobToken =
      typeof process.env.BLOB_READ_WRITE_TOKEN === "string" &&
      process.env.BLOB_READ_WRITE_TOKEN.length > 0;

    for (const item of files) {
      if (!(item instanceof File)) continue;

      if (!ALLOWED_MIME.has(item.type)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${item.type}` },
          { status: 400 }
        );
      }

      if (item.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File too large (max ${Math.round(MAX_FILE_SIZE_BYTES / 1024 / 1024)}MB)` },
          { status: 400 }
        );
      }

      const ext = extFromMime(item.type);
      const safeName = (item.name || "photo")
        .toLowerCase()
        .replace(/[^a-z0-9.\-_]+/g, "-")
        .slice(0, 80);

      if (hasBlobToken) {
        // ✅ Production: Use Vercel Blob
        const blobPath = `listings/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
        const blob = await put(blobPath, item, { access: "public" });
        urls.push(blob.url);
      } else {
        // ✅ Local dev: Write to public/uploads
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadDir, { recursive: true });

        const filename = `${randomUUID()}.${ext}`;
        const fullPath = path.join(uploadDir, filename);

        const buf = Buffer.from(await item.arrayBuffer());
        await fs.writeFile(fullPath, buf);

        urls.push(`/uploads/${filename}`);
      }
    }

    return NextResponse.json({ ok: true, urls });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}