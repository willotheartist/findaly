// app/api/cron/expire-upgrades/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Daily cron job to expire paid upgrades.
 *
 * Vercel Cron config (add to vercel.json):
 * {
 *   "crons": [
 *     {
 *       "path": "/api/cron/expire-upgrades",
 *       "schedule": "0 3 * * *"
 *     }
 *   ]
 * }
 *
 * Protected by CRON_SECRET env var to prevent public access.
 */

function assertCronSecret(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return; // no secret configured = allow (dev mode)

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    throw new Error("Unauthorized");
  }
}

export async function GET(request: Request) {
  try {
    assertCronSecret(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results: Record<string, number> = {};

  try {
    // 1. Expire featured listings
    const expiredFeatured = await prisma.listing.updateMany({
      where: {
        featured: true,
        featuredUntil: { lt: now },
      },
      data: {
        featured: false,
        featuredUntil: null,
      },
    });
    results.expiredFeatured = expiredFeatured.count;

    // 2. Expire boosts
    const expiredBoosts = await prisma.listing.updateMany({
      where: {
        boostLevel: { gt: 0 },
        boostUntil: { lt: now },
      },
      data: {
        boostLevel: 0,
        boostUntil: null,
      },
    });
    results.expiredBoosts = expiredBoosts.count;

    // 3. Expire finance priority
    const expiredFinance = await prisma.listing.updateMany({
      where: {
        financePriority: true,
        financePriorityUntil: { lt: now },
      },
      data: {
        financePriority: false,
        financePriorityUntil: null,
      },
    });
    results.expiredFinance = expiredFinance.count;

    // 4. Expire Broker Pro subscriptions
    const expiredBrokerPro = await prisma.profile.updateMany({
      where: {
        brokerPlan: "PRO",
        brokerProActiveUntil: { lt: now },
      },
      data: {
        brokerPlan: "FREE",
        brokerProActiveUntil: null,
      },
    });
    results.expiredBrokerPro = expiredBrokerPro.count;

    // 5. Expire verified broker status
    const expiredVerified = await prisma.profile.updateMany({
      where: {
        isVerified: true,
        verifiedUntil: { lt: now },
      },
      data: {
        isVerified: false,
        verifiedUntil: null,
      },
    });
    results.expiredVerified = expiredVerified.count;

    console.log("[cron/expire-upgrades]", results);

    return NextResponse.json({
      ok: true,
      expired: results,
      ranAt: now.toISOString(),
    });
  } catch (error) {
    console.error("[cron/expire-upgrades] Error:", error);
    return NextResponse.json(
      { error: "Cron job failed" },
      { status: 500 }
    );
  }
}