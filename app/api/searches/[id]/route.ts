import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

type Ctx = { params: Promise<{ id: string }> | { id: string } };

export async function PATCH(req: Request, ctx: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { id } = await Promise.resolve(ctx.params);
  if (!id) return NextResponse.json({ error: "ID_REQUIRED" }, { status: 400 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "BAD_JSON" }, { status: 400 });

  const name = String(body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "NAME_REQUIRED" }, { status: 400 });

  const updated = await prisma.savedSearch.updateMany({
    where: { id, userId: user.id },
    data: { name },
  });

  if (updated.count === 0) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { id } = await Promise.resolve(ctx.params);
  if (!id) return NextResponse.json({ error: "ID_REQUIRED" }, { status: 400 });

  const deleted = await prisma.savedSearch.deleteMany({
    where: { id, userId: user.id },
  });

  if (deleted.count === 0) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  return NextResponse.json({ ok: true }, { status: 200 });
}
