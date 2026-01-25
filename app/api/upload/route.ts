import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 });
    }

    const safeName = (file.name || "photo")
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]+/g, "-")
      .slice(0, 80);

    const path = `listings/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

    const blob = await put(path, file, { access: "public" });

    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
