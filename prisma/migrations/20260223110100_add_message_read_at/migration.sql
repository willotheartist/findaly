-- DropIndex
DROP INDEX "Message_conversationId_receiverId_readAt_idx";

-- DropIndex
DROP INDEX "Message_receiverId_readAt_idx";

-- CreateIndex
CREATE INDEX "Message_receiverId_readAt_createdAt_idx" ON "Message"("receiverId", "readAt", "createdAt");
