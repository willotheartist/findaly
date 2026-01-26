// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024; // 12MB
const ALLOWED = new Set([
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
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File too large (max ${Math.round(MAX_FILE_SIZE_BYTES / 1024 / 1024)}MB)` },
        { status: 400 }
      );
    }

    const safeName = (file.name || "photo")
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]+/g, "-")
      .slice(0, 80);

    const hasBlobToken =
      typeof process.env.BLOB_READ_WRITE_TOKEN === "string" &&
      process.env.BLOB_READ_WRITE_TOKEN.length > 0;

    // ✅ If Blob token exists (Vercel/prod), use Vercel Blob
    if (hasBlobToken) {
      const blobPath = `listings/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
      const blob = await put(blobPath, file, { access: "public" });
      return NextResponse.json({ url: blob.url });
    }

    // ✅ Otherwise (local dev), store in /public/uploads and return /uploads/...
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = extFromMime(file.type);
    const filename = `${randomUUID()}-${safeName || "photo"}.${ext}`;
    const fullPath = path.join(uploadDir, filename);

    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(fullPath, buf);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
