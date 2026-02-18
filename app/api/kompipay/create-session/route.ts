// app/api/kompipay/create-session/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/site";
import { getCurrentUser } from "@/lib/auth/session";
import {
  KOMPIPAY_PRICE_KEYS,
  type KompiPayProductKey,
} from "@/lib/kompipay/products";

type Body = {
  productKey: KompiPayProductKey;
  listingId?: string;
  quantity?: number;
};

function assertEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function requiresListing(productKey: KompiPayProductKey) {
  return (
    productKey.startsWith("FEATURED_LISTING") ||
    productKey.startsWith("BOOST_") ||
    productKey.startsWith("FINANCE_PRIORITY")
  );
}

function errorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return String(err);
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as Body;
    const productKey = body.productKey;
    const quantity = Math.max(1, Number(body.quantity ?? 1));

    const priceKey = KOMPIPAY_PRICE_KEYS[productKey];
    if (!priceKey)
      return NextResponse.json({ error: "Invalid productKey" }, { status: 400 });

    const listingId: string | undefined = body.listingId;

    // Listing ownership required for listing-related products
    if (requiresListing(productKey)) {
      if (!listingId) {
        return NextResponse.json(
          { error: "listingId required" },
          { status: 400 }
        );
      }

      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: {
          id: true,
          profile: {
            select: { userId: true },
          },
        },
      });

      if (!listing)
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });

      if (listing.profile.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const baseUrl = getSiteUrl();
    const successUrl = `${baseUrl}/billing/success?productKey=${encodeURIComponent(
      productKey
    )}`;
    const cancelUrl = `${baseUrl}/billing/cancel?productKey=${encodeURIComponent(
      productKey
    )}`;

    // Create internal intent first (audit + idempotency)
    const intent = await prisma.paymentIntent.create({
      data: {
        userId: user.id,
        productKey,
        listingId: listingId ?? null,
        quantity,
        status: "PENDING",
        provider: "KOMPIPAY",
        metadata: {
          productKey,
          listingId: listingId ?? null,
        },
      },
      select: { id: true },
    });

    const apiKey = assertEnv("KOMPIPAY_API_KEY");
    const apiBase =
      process.env.KOMPIPAY_API_BASE_URL || "https://api.kompipay.com";

    const kpRes = await fetch(`${apiBase}/v1/checkout/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        priceKey,
        quantity,
        customer: {
          externalUserId: user.id,
          email: user.email ?? undefined,
        },
        metadata: {
          paymentIntentId: intent.id,
          userId: user.id,
          listingId: listingId ?? "",
          productKey,
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      }),
    });

    if (!kpRes.ok) {
      const txt = await kpRes.text();
      await prisma.paymentIntent.update({
        where: { id: intent.id },
        data: { status: "FAILED" },
      });
      return NextResponse.json(
        { error: "KompiPay session create failed", details: txt },
        { status: 502 }
      );
    }

    const kpJson: unknown = await kpRes.json();
    const kp =
      typeof kpJson === "object" && kpJson !== null
        ? (kpJson as Record<string, unknown>)
        : null;

    const kompipaySessionId =
      typeof kp?.id === "string" ? (kp.id as string) : undefined;
    const checkoutUrl =
      typeof kp?.checkout_url === "string"
        ? (kp.checkout_url as string)
        : undefined;

    if (!checkoutUrl) {
      await prisma.paymentIntent.update({
        where: { id: intent.id },
        data: { status: "FAILED" },
      });
      return NextResponse.json(
        { error: "KompiPay missing checkout_url" },
        { status: 502 }
      );
    }

    if (kompipaySessionId) {
      await prisma.paymentIntent.update({
        where: { id: intent.id },
        data: { kompipaySessionId },
      });
    }

    return NextResponse.json({ checkout_url: checkoutUrl });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Unexpected error", details: errorMessage(err) },
      { status: 500 }
    );
  }
}
