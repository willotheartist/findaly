// app/api/messages/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          slug: true,
          priceCents: true,
          currency: true,
          profile: {
            select: {
              id: true,
              name: true,
              slug: true,
              isVerified: true,
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          body: true,
          createdAt: true,
          senderId: true,
          receiverId: true,
          sender: {
            select: {
              id: true,
              email: true,
              profiles: { take: 1, select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  // ✅ Authorize: user must be sender or receiver in this conversation
  const isParticipant = await prisma.message.findFirst({
    where: {
      conversationId: id,
      OR: [{ senderId: user.id }, { receiverId: user.id }],
    },
    select: { id: true },
  });

  if (!isParticipant) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ✅ Mark as read: all messages sent TO current user in this convo
  // (safe to run even if none)
  await prisma.message.updateMany({
    where: {
      conversationId: id,
      receiverId: user.id,
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  // Get other participant (robust)
  const otherUserId =
    conversation.messages.find((m) => m.senderId !== user.id)?.senderId ??
    conversation.messages.find((m) => m.receiverId !== user.id)?.receiverId ??
    null;

  let otherUser: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    profileSlug: string | null;
  } | null = null;

  if (otherUserId) {
    const other = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: {
        id: true,
        email: true,
        profiles: { take: 1, select: { name: true, isVerified: true, slug: true } },
      },
    });

    if (other) {
      const p = other.profiles[0];
      otherUser = {
        id: other.id,
        name: p?.name ?? other.email.split("@")[0],
        email: other.email,
        isVerified: p?.isVerified ?? false,
        profileSlug: p?.slug ?? null,
      };
    }
  }

  return NextResponse.json({
    id: conversation.id,
    listing: conversation.listing,
    otherUser,
    messages: conversation.messages.map((m) => ({
      id: m.id,
      body: m.body,
      createdAt: m.createdAt,
      isFromMe: m.senderId === user.id,
      senderName: m.sender.profiles[0]?.name ?? m.sender.email.split("@")[0],
    })),
  });
}