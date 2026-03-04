import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();

  try {
    // simplest possible query — proves DB connectivity + Prisma works
    const result = await prisma.$queryRaw`SELECT 1 as ok`;

    return NextResponse.json({
      ok: true,
      result,
      ms: Date.now() - startedAt,
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      vercelEnv: process.env.VERCEL_ENV || null,
      region: process.env.VERCEL_REGION || null,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        ms: Date.now() - startedAt,
        hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
        vercelEnv: process.env.VERCEL_ENV || null,
        region: process.env.VERCEL_REGION || null,
        error: {
          name: e?.name || null,
          message: e?.message || String(e),
          code: e?.code || null,
          // Prisma often nests useful info here:
          meta: e?.meta || null,
          cause: e?.cause ? String(e.cause) : null,
        },
      },
      { status: 500 }
    );
  }
}