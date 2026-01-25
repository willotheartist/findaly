import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all conversations where user has sent or received messages
  const conversations = await prisma.conversation.findMany({
    where: {
      messages: {
        some: {
          OR: [{ senderId: user.id }, { receiverId: user.id }],
        },
      },
    },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          slug: true,
          priceCents: true,
          currency: true,
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
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
                select: { name: true, isVerified: true },
              },
            },
          },
          receiver: {
            select: {
              id: true,
              email: true,
              profiles: {
                take: 1,
                select: { name: true, isVerified: true },
              },
            },
          },
        },
      },
      _count: {
        select: {
          messages: {
            where: {
              receiverId: user.id,
              // TODO: add `readAt` field to Message model for proper unread tracking
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform data for frontend
  const result = conversations.map((convo) => {
    const lastMessage = convo.messages[0];
    if (!lastMessage) return null;

    // Determine the other party in the conversation
    const otherUser =
      lastMessage.senderId === user.id ? lastMessage.receiver : lastMessage.sender;

    const otherProfile = otherUser.profiles[0];

    return {
      id: convo.id,
      otherUser: {
        id: otherUser.id,
        name: otherProfile?.name ?? otherUser.email.split("@")[0],
        email: otherUser.email,
        isVerified: otherProfile?.isVerified ?? false,
      },
      listing: convo.listing
        ? {
            id: convo.listing.id,
            title: convo.listing.title,
            slug: convo.listing.slug,
            priceCents: convo.listing.priceCents,
            currency: convo.listing.currency,
          }
        : null,
      lastMessage: {
        id: lastMessage.id,
        body: lastMessage.body,
        createdAt: lastMessage.createdAt,
        isFromMe: lastMessage.senderId === user.id,
      },
      // TODO: proper unread count once readAt is added
      unreadCount: 0,
    };
  }).filter(Boolean);

  return NextResponse.json(result);
}