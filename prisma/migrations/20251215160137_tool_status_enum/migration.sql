/*
  Warnings:

  - The `status` column on the `Tool` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `updatedAt` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `UseCase` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ToolStatus" AS ENUM ('ACTIVE', 'DISCONTINUED', 'DRAFT');

-- DropIndex

-- BACKFILL updatedAt NULLS
UPDATE "Category"
SET "updatedAt" = COALESCE("updatedAt", "createdAt", NOW())
WHERE "updatedAt" IS NULL;

UPDATE "UseCase"
SET "updatedAt" = COALESCE("updatedAt", "createdAt", NOW())
WHERE "updatedAt" IS NULL;

DROP INDEX "Tool_slug_idx";

-- DropIndex
DROP INDEX "Tool_status_idx";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "status",
ADD COLUMN     "status" "ToolStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "UseCase" ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Tool_primaryCategoryId_status_idx" ON "Tool"("primaryCategoryId", "status");
