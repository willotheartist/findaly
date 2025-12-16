-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "findalyScore" DOUBLE PRECISION,
ADD COLUMN     "findalyScoreMeta" JSONB;

-- CreateTable
CREATE TABLE "ToolSource" (
    "id" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ToolSource_toolId_type_idx" ON "ToolSource"("toolId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "ToolSource_toolId_type_key" ON "ToolSource"("toolId", "type");

-- AddForeignKey
ALTER TABLE "ToolSource" ADD CONSTRAINT "ToolSource_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
