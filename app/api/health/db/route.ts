// app/api/health/db/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ErrorWithDetails = {
  name?: string;
  message?: string;
  code?: string | number;
  meta?: unknown;
  cause?: unknown;
};

function getErrorDetails(error: unknown): ErrorWithDetails {
  if (error instanceof Error) {
    const maybeWithDetails = error as ErrorWithDetails;
    return {
      name: error.name,
      message: error.message,
      code: maybeWithDetails.code,
      meta: maybeWithDetails.meta,
      cause: maybeWithDetails.cause,
    };
  }

  if (typeof error === "object" && error !== null) {
    const maybeWithDetails = error as ErrorWithDetails;
    return {
      name: maybeWithDetails.name,
      message:
        typeof maybeWithDetails.message === "string"
          ? maybeWithDetails.message
          : String(error),
      code: maybeWithDetails.code,
      meta: maybeWithDetails.meta,
      cause: maybeWithDetails.cause,
    };
  }

  return {
    message: String(error),
  };
}

export async function GET() {
  const startedAt = Date.now();

  try {
    const result = await prisma.$queryRaw<Array<{ ok: number }>>`SELECT 1 as ok`;

    return NextResponse.json({
      ok: true,
      result,
      ms: Date.now() - startedAt,
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      vercelEnv: process.env.VERCEL_ENV || null,
      region: process.env.VERCEL_REGION || null,
    });
  } catch (error: unknown) {
    const details = getErrorDetails(error);

    return NextResponse.json(
      {
        ok: false,
        ms: Date.now() - startedAt,
        hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
        vercelEnv: process.env.VERCEL_ENV || null,
        region: process.env.VERCEL_REGION || null,
        error: {
          name: details.name ?? null,
          message: details.message ?? "Unknown error",
          code: details.code ?? null,
          meta: details.meta ?? null,
          cause: details.cause ? String(details.cause) : null,
        },
      },
      { status: 500 }
    );
  }
}