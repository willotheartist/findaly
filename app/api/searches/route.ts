import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

function toInt(v: unknown) {
  const n = typeof v === "string" ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) ? n : null;
}

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") ?? "BUY";
  const take = toInt(url.searchParams.get("take")) ?? 50;

  const rows = await prisma.savedSearch.findMany({
    where: { userId: user.id, kind },
    orderBy: { createdAt: "desc" },
    take: Math.min(Math.max(take, 1), 100),
    select: {
      id: true,
      name: true,
      kind: true,
      replayUrl: true,
      createdAt: true,
      updatedAt: true,
      lastUsedAt: true,
    },
  });

  return NextResponse.json({ ok: true, searches: rows }, { status: 200 });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "BAD_JSON" }, { status: 400 });

  const name = String(body.name ?? "").trim();
  const kind = String(body.kind ?? "BUY").trim() || "BUY";
  const query = body.query ?? null;
  const replayUrl = String(body.replayUrl ?? "").trim();

  if (!name) return NextResponse.json({ error: "NAME_REQUIRED" }, { status: 400 });
  if (!query || typeof query !== "object") return NextResponse.json({ error: "QUERY_REQUIRED" }, { status: 400 });
  if (!replayUrl.startsWith("/")) return NextResponse.json({ error: "REPLAY_URL_REQUIRED" }, { status: 400 });

  const created = await prisma.savedSearch.create({
    data: {
      userId: user.id,
      name,
      kind,
      query,
      replayUrl,
    },
    select: { id: true, name: true, replayUrl: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, search: created }, { status: 200 });
}
