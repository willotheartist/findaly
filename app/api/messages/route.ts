// app/api/messages/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conversations = await prisma.conversation.findMany({
    where: {
      messages: { some: { OR: [{ senderId: user.id }, { receiverId: user.id }] } },
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
              profiles: { take: 1, select: { name: true, isVerified: true } },
            },
          },
          receiver: {
            select: {
              id: true,
              email: true,
              profiles: { take: 1, select: { name: true, isVerified: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // ✅ Compute unread per conversation (receiver = me, readAt = null)
  const convoIds = conversations.map((c) => c.id);
  const unreadAgg = await prisma.message.groupBy({
    by: ["conversationId"],
    where: {
      conversationId: { in: convoIds },
      receiverId: user.id,
      readAt: null,
    },
    _count: { _all: true },
  });

  const unreadMap = new Map<string, number>(
    unreadAgg.map((r) => [r.conversationId, r._count._all])
  );

  const result = conversations
    .map((convo) => {
      const lastMessage = convo.messages[0];
      if (!lastMessage) return null;

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
        unreadCount: unreadMap.get(convo.id) ?? 0,
      };
    })
    .filter(Boolean);

  return NextResponse.json(result);
}