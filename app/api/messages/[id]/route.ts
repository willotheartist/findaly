import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify user is part of this conversation
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
          sender: {
            select: {
              id: true,
              email: true,
              profiles: {
                take: 1,
                select: { name: true },
              },
            },
          },
        },
      },
    },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  // Check user is a participant
  const isParticipant = conversation.messages.some(
    (m) => m.senderId === user.id || m.sender.id === user.id
  );

  // Also check if user received any messages in this convo
  const receivedMessage = await prisma.message.findFirst({
    where: {
      conversationId: id,
      receiverId: user.id,
    },
  });

  if (!isParticipant && !receivedMessage) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get the other participant
  const allParticipantIds = new Set<string>();
  conversation.messages.forEach((m) => {
    allParticipantIds.add(m.senderId);
  });
  if (receivedMessage) {
    allParticipantIds.add(receivedMessage.senderId);
  }

  const otherUserId = [...allParticipantIds].find((id) => id !== user.id);

  let otherUser = null;
  if (otherUserId) {
    const other = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: {
        id: true,
        email: true,
        profiles: {
          take: 1,
          select: { name: true, isVerified: true, slug: true },
        },
      },
    });
    if (other) {
      const profile = other.profiles[0];
      otherUser = {
        id: other.id,
        name: profile?.name ?? other.email.split("@")[0],
        email: other.email,
        isVerified: profile?.isVerified ?? false,
        profileSlug: profile?.slug ?? null,
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