import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { conversationId, receiverId, listingId, message } = body;

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  if (!receiverId) {
    return NextResponse.json({ error: "Receiver is required" }, { status: 400 });
  }

  // Prevent messaging yourself
  if (receiverId === user.id) {
    return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });
  }

  // Verify receiver exists
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });

  if (!receiver) {
    return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
  }

  let convoId = conversationId;

  // If no conversationId, find or create one
  if (!convoId) {
    // Look for existing conversation between these users about this listing
    const existingConvo = await prisma.conversation.findFirst({
      where: {
        listingId: listingId || null,
        messages: {
          some: {
            OR: [
              { senderId: user.id, receiverId },
              { senderId: receiverId, receiverId: user.id },
            ],
          },
        },
      },
    });

    if (existingConvo) {
      convoId = existingConvo.id;
    } else {
      // Create new conversation
      const newConvo = await prisma.conversation.create({
        data: {
          listingId: listingId || null,
        },
      });
      convoId = newConvo.id;
    }
  }

  // Create the message
  const newMessage = await prisma.message.create({
    data: {
      conversationId: convoId,
      senderId: user.id,
      receiverId,
      body: message.trim(),
    },
    select: {
      id: true,
      body: true,
      createdAt: true,
      senderId: true,
    },
  });

  return NextResponse.json({
    success: true,
    conversationId: convoId,
    message: {
      id: newMessage.id,
      body: newMessage.body,
      createdAt: newMessage.createdAt,
      isFromMe: true,
    },
  });
}