-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('KOMPIPAY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ProductKey" AS ENUM ('FEATURED_LISTING', 'BOOST', 'FINANCE_PRIORITY', 'BROKER_PRO_MONTHLY', 'VERIFIED_BROKER_MONTHLY');

-- CreateEnum
CREATE TYPE "BrokerPlan" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "boostLevel" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "featuredUntil" TIMESTAMP(3),
ADD COLUMN     "financePriority" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "brokerPlan" "BrokerPlan" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "verifiedUntil" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "PaymentIntent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "provider" "PaymentProvider" NOT NULL DEFAULT 'KOMPIPAY',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "productKey" "ProductKey" NOT NULL,
    "sessionId" TEXT,
    "subscriptionId" TEXT,
    "invoiceId" TEXT,
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "amountCents" INTEGER,
    "userId" TEXT NOT NULL,
    "profileId" TEXT,
    "listingId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "PaymentIntent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_sessionId_key" ON "PaymentIntent"("sessionId");

-- CreateIndex
CREATE INDEX "PaymentIntent_status_idx" ON "PaymentIntent"("status");

-- CreateIndex
CREATE INDEX "PaymentIntent_productKey_idx" ON "PaymentIntent"("productKey");

-- CreateIndex
CREATE INDEX "PaymentIntent_createdAt_idx" ON "PaymentIntent"("createdAt");

-- CreateIndex
CREATE INDEX "PaymentIntent_userId_idx" ON "PaymentIntent"("userId");

-- CreateIndex
CREATE INDEX "PaymentIntent_profileId_idx" ON "PaymentIntent"("profileId");

-- CreateIndex
CREATE INDEX "PaymentIntent_listingId_idx" ON "PaymentIntent"("listingId");

-- CreateIndex
CREATE INDEX "Listing_featured_idx" ON "Listing"("featured");

-- CreateIndex
CREATE INDEX "Listing_featuredUntil_idx" ON "Listing"("featuredUntil");

-- CreateIndex
CREATE INDEX "Listing_financePriority_idx" ON "Listing"("financePriority");

-- CreateIndex
CREATE INDEX "Listing_boostLevel_idx" ON "Listing"("boostLevel");

-- CreateIndex
CREATE INDEX "Profile_brokerPlan_idx" ON "Profile"("brokerPlan");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
