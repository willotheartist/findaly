// app/api/messages/enquire/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

function clean(s: unknown, max = 5000) {
  const v = typeof s === "string" ? s : "";
  return v.replace(/\u0000/g, "").trim().slice(0, max);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | {
        listingId?: string;
        message?: string;
        name?: string;
        email?: string;
        phone?: string;
      }
    | null;

  const listingId = clean(body?.listingId, 128);
  if (!listingId) {
    return NextResponse.json({ error: "MISSING_LISTING_ID" }, { status: 400 });
  }

  const msg = clean(body?.message, 4000);
  const name = clean(body?.name, 120);
  const email = clean(body?.email, 200);
  const phone = clean(body?.phone, 80);

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: {
      id: true,
      title: true,
      slug: true,
      profile: { select: { userId: true } },
    },
  });

  if (!listing) {
    return NextResponse.json({ error: "LISTING_NOT_FOUND" }, { status: 404 });
  }

  const sellerUserId = listing.profile.userId;

  // prevent messaging yourself
  if (sellerUserId === user.id) {
    return NextResponse.json({ error: "CANNOT_MESSAGE_SELF" }, { status: 400 });
  }

  // 1) Find existing conversation for this listing between these two users (either direction)
  const existing = await prisma.conversation.findFirst({
    where: {
      listingId: listing.id,
      messages: {
        some: {
          OR: [
            { senderId: user.id, receiverId: sellerUserId },
            { senderId: sellerUserId, receiverId: user.id },
          ],
        },
      },
    },
    select: { id: true },
  });

  // 2) Create conversation if none
  const conversation =
    existing ??
    (await prisma.conversation.create({
      data: { listingId: listing.id },
      select: { id: true },
    }));

  // 3) Build body (include contact fields if provided)
  const lines: string[] = [];
  if (name) lines.push(`Name: ${name}`);
  if (email) lines.push(`Email: ${email}`);
  if (phone) lines.push(`Phone: ${phone}`);
  const header = lines.length ? `${lines.join("\n")}\n\n` : "";

  const finalBody =
    header +
    (msg ||
      `Hi, I'm interested in the ${listing.title}. Is it still available?`);

  // 4) Create message
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: user.id,
      receiverId: sellerUserId,
      body: finalBody,
    },
    select: { id: true },
  });

  return NextResponse.json({ conversationId: conversation.id });
}