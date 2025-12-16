-- CreateEnum
CREATE TYPE "DataConfidence" AS ENUM ('SEEDED', 'ENRICHED', 'VERIFIED');

-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "bestFor" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "cons" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'SEEDED',
ADD COLUMN     "featureFlags" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "hasFreePlan" BOOLEAN,
ADD COLUMN     "hasFreeTrial" BOOLEAN,
ADD COLUMN     "lastVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "notFor" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "pricingUrl" TEXT,
ADD COLUMN     "pros" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "replacementFor" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "switchReasons" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "trialDays" INTEGER;

-- CreateIndex
CREATE INDEX "Tool_dataConfidence_status_idx" ON "Tool"("dataConfidence", "status");

-- CreateIndex
CREATE INDEX "Tool_lastVerifiedAt_idx" ON "Tool"("lastVerifiedAt");
