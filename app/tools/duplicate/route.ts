import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function slugify(s: string) {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = (searchParams.get("name") ?? "").trim();
  const websiteUrl = (searchParams.get("websiteUrl") ?? "").trim();

  const normalized = normalizeUrl(websiteUrl);
  const slug = name ? slugify(name) : "";

  // Try match by website URL first (strongest)
  if (normalized) {
    const hit = await prisma.tool.findFirst({
      where: { websiteUrl: normalized },
      select: { slug: true, name: true, websiteUrl: true },
    });
    if (hit) return NextResponse.json({ tool: hit });
  }

  // Then match by slug
  if (slug) {
    const hit = await prisma.tool.findUnique({
      where: { slug },
      select: { slug: true, name: true, websiteUrl: true },
    });
    if (hit) return NextResponse.json({ tool: hit });
  }

  return NextResponse.json(null);
}
