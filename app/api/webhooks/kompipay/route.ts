// app/api/webhooks/kompipay/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import {
  PRODUCT_EFFECTS,
  type KompiPayProductKey,
} from "@/lib/kompipay/products";

function assertEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function verifySignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const a = Buffer.from(signature, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function addDays(from: Date, days: number) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}

function errorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return String(err);
}

async function applyEffect(params: {
  productKey: KompiPayProductKey;
  userId: string;
  listingId?: string | null;
  subscriptionId?: string | null;
  customerId?: string | null;
}) {
  const { productKey, userId, listingId } = params;
  const effect = PRODUCT_EFFECTS[productKey];
  const now = new Date();
  if (!effect) return;

  if (effect.kind === "FEATURED") {
    if (!listingId) return;
    const until = addDays(now, effect.days);
    await prisma.listing.update({
      where: { id: listingId },
      data: { featured: true, featuredUntil: until },
    });
    return;
  }

  if (effect.kind === "BOOST") {
    if (!listingId) return;
    const until = addDays(now, effect.days);
    await prisma.listing.update({
      where: { id: listingId },
      data: { boostLevel: effect.level, boostUntil: until },
    });
    return;
  }

  if (effect.kind === "FINANCE_PRIORITY") {
    if (!listingId) return;
    const until = addDays(now, effect.days);
    await prisma.listing.update({
      where: { id: listingId },
      data: { financePriority: true, financePriorityUntil: until },
    });
    return;
  }

  if (effect.kind === "BROKER_PRO") {
    const until = addDays(now, effect.days);
    await prisma.profile.updateMany({
      where: { userId },
      data: {
        brokerPlan: "PRO",
        brokerProActiveUntil: until,
        kompipaySubscriptionId: params.subscriptionId ?? undefined,
        kompipayCustomerId: params.customerId ?? undefined,
      },
    });
    return;
  }

  if (effect.kind === "VERIFIED_BROKER") {
    const until = addDays(now, effect.days);
    await prisma.profile.updateMany({
      where: { userId },
      data: {
        isVerified: true,
        verifiedUntil: until,
        kompipaySubscriptionId: params.subscriptionId ?? undefined,
        kompipayCustomerId: params.customerId ?? undefined,
      },
    });
  }
}

export async function POST(req: Request) {
  try {
    const secret = assertEnv("KOMPIPAY_WEBHOOK_SECRET");

    const rawBody = await req.text();
    const signature =
      req.headers.get("x-kompipay-signature") ||
      req.headers.get("kompipay-signature") ||
      null;

    const ok = verifySignature(rawBody, signature, secret);
    if (!ok) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

    const event: unknown = JSON.parse(rawBody);
    const evt =
      typeof event === "object" && event !== null
        ? (event as Record<string, unknown>)
        : {};

    const eventId = typeof evt.id === "string" ? evt.id : undefined;
    const type = typeof evt.type === "string" ? evt.type : undefined;

    const data =
      typeof evt.data === "object" && evt.data !== null
        ? (evt.data as Record<string, unknown>)
        : {};

    const sessionId =
      (typeof data.sessionId === "string" && data.sessionId) ||
      (typeof data.checkoutSessionId === "string" && data.checkoutSessionId) ||
      (typeof data.checkout_session_id === "string" && data.checkout_session_id) ||
      undefined;

    const meta =
      typeof data.metadata === "object" && data.metadata !== null
        ? (data.metadata as Record<string, unknown>)
        : {};

    const paymentIntentId =
      typeof meta.paymentIntentId === "string" ? meta.paymentIntentId : undefined;

    const productKey =
      typeof meta.productKey === "string"
        ? (meta.productKey as KompiPayProductKey)
        : undefined;

    const userId = typeof meta.userId === "string" ? meta.userId : undefined;

    const listingIdRaw = typeof meta.listingId === "string" ? meta.listingId : undefined;
    const listingId = listingIdRaw && listingIdRaw.length ? listingIdRaw : null;

    const subscriptionId =
      (typeof data.subscriptionId === "string" && data.subscriptionId) ||
      (typeof data.subscription_id === "string" && data.subscription_id) ||
      null;

    const customerId =
      (typeof data.customerId === "string" && data.customerId) ||
      (typeof data.customer_id === "string" && data.customer_id) ||
      null;

    const appliesOn =
      type === "payment.succeeded" ||
      type === "checkout.session.completed" ||
      type === "invoice.paid" ||
      type === "subscription.renewed" ||
      type === "subscription.created";

    const cancelsOn =
      type === "subscription.canceled" ||
      type === "subscription.deleted" ||
      type === "invoice.payment_failed";

    const intent = paymentIntentId
      ? await prisma.paymentIntent.findUnique({ where: { id: paymentIntentId } })
      : sessionId
      ? await prisma.paymentIntent.findFirst({ where: { kompipaySessionId: sessionId } })
      : null;

    if (!intent) {
      return NextResponse.json({ received: true, note: "No intent matched" }, { status: 200 });
    }

    if (eventId && intent.kompipayEventId && intent.kompipayEventId === eventId) {
      return NextResponse.json({ received: true, deduped: true }, { status: 200 });
    }

    if (cancelsOn) {
      await prisma.paymentIntent.update({
        where: { id: intent.id },
        data: {
          status: type?.includes("canceled") || type?.includes("deleted") ? "CANCELED" : "FAILED",
          kompipayEventId: eventId ?? intent.kompipayEventId ?? null,
        },
      });
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (!appliesOn) {
      await prisma.paymentIntent.update({
        where: { id: intent.id },
        data: { kompipayEventId: eventId ?? intent.kompipayEventId ?? null },
      });
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (!intent.appliedAt) {
      const pk = (productKey ?? intent.productKey) as KompiPayProductKey;
      const uid = userId ?? intent.userId;
      const lid = listingId ?? intent.listingId ?? null;

      await applyEffect({
        productKey: pk,
        userId: uid,
        listingId: lid,
        subscriptionId,
        customerId,
      });

      await prisma.paymentIntent.update({
        where: { id: intent.id },
        data: {
          status: "PAID",
          appliedAt: new Date(),
          kompipayEventId: eventId ?? intent.kompipayEventId ?? null,
          kompipaySubId: subscriptionId ?? intent.kompipaySubId ?? null,
          kompipayCustomerId: customerId ?? intent.kompipayCustomerId ?? null,
        },
      });
    } else {
      await prisma.paymentIntent.update({
        where: { id: intent.id },
        data: {
          status: "PAID",
          kompipayEventId: eventId ?? intent.kompipayEventId ?? null,
          kompipaySubId: subscriptionId ?? intent.kompipaySubId ?? null,
          kompipayCustomerId: customerId ?? intent.kompipayCustomerId ?? null,
        },
      });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Webhook error", details: errorMessage(err) },
      { status: 500 }
    );
  }
}
