-- CreateTable
CREATE TABLE "ExternalClaim" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "toolId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "sentiment" INTEGER NOT NULL,
    "claim" TEXT NOT NULL,
    "strength" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "evidence" JSONB,

    CONSTRAINT "ExternalClaim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExternalClaim_toolId_topic_idx" ON "ExternalClaim"("toolId", "topic");

-- CreateIndex
CREATE INDEX "ExternalClaim_toolId_sourceType_idx" ON "ExternalClaim"("toolId", "sourceType");

-- CreateIndex
CREATE INDEX "ExternalClaim_sourceType_idx" ON "ExternalClaim"("sourceType");

-- AddForeignKey
ALTER TABLE "ExternalClaim" ADD CONSTRAINT "ExternalClaim_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
