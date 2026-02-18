/*
  Warnings:

  - The values [BOOST,FINANCE_PRIORITY] on the enum `ProductKey` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `amountCents` on the `PaymentIntent` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `PaymentIntent` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceId` on the `PaymentIntent` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `PaymentIntent` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `PaymentIntent` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `PaymentIntent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[kompipaySessionId]` on the table `PaymentIntent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductKey_new" AS ENUM ('FEATURED_LISTING', 'FEATURED_LISTING_14D', 'BOOST_7D', 'BOOST_14D', 'FINANCE_PRIORITY_14D', 'BROKER_PRO_MONTHLY', 'VERIFIED_BROKER_MONTHLY');
ALTER TABLE "PaymentIntent" ALTER COLUMN "productKey" TYPE "ProductKey_new" USING ("productKey"::text::"ProductKey_new");
ALTER TYPE "ProductKey" RENAME TO "ProductKey_old";
ALTER TYPE "ProductKey_new" RENAME TO "ProductKey";
DROP TYPE "public"."ProductKey_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "PaymentIntent" DROP CONSTRAINT "PaymentIntent_profileId_fkey";

-- DropIndex
DROP INDEX "Listing_boostLevel_idx";

-- DropIndex
DROP INDEX "Listing_featuredUntil_idx";

-- DropIndex
DROP INDEX "Listing_featured_idx";

-- DropIndex
DROP INDEX "Listing_financePriority_idx";

-- DropIndex
DROP INDEX "PaymentIntent_createdAt_idx";

-- DropIndex
DROP INDEX "PaymentIntent_profileId_idx";

-- DropIndex
DROP INDEX "PaymentIntent_sessionId_key";

-- DropIndex
DROP INDEX "PaymentIntent_userId_idx";

-- DropIndex
DROP INDEX "Profile_brokerPlan_idx";

-- DropIndex
DROP INDEX "User_createdAt_idx";

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "boostUntil" TIMESTAMP(3),
ADD COLUMN     "financePriorityUntil" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PaymentIntent" DROP COLUMN "amountCents",
DROP COLUMN "currency",
DROP COLUMN "invoiceId",
DROP COLUMN "profileId",
DROP COLUMN "sessionId",
DROP COLUMN "subscriptionId",
ADD COLUMN     "appliedAt" TIMESTAMP(3),
ADD COLUMN     "kompipayCustomerId" TEXT,
ADD COLUMN     "kompipayEventId" TEXT,
ADD COLUMN     "kompipaySessionId" TEXT,
ADD COLUMN     "kompipaySubId" TEXT;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "brokerProActiveUntil" TIMESTAMP(3),
ADD COLUMN     "kompipayCustomerId" TEXT,
ADD COLUMN     "kompipaySubscriptionId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE INDEX "PaymentIntent_userId_createdAt_idx" ON "PaymentIntent"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_kompipaySessionId_key" ON "PaymentIntent"("kompipaySessionId");
