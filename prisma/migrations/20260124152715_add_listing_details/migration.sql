-- CreateEnum
CREATE TYPE "VesselCondition" AS ENUM ('NEW', 'USED');

-- CreateEnum
CREATE TYPE "SellerType" AS ENUM ('PRIVATE', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('FIXED', 'NEGOTIABLE', 'POA', 'AUCTION');

-- CreateEnum
CREATE TYPE "CharterPricePeriod" AS ENUM ('HOUR', 'DAY', 'WEEK');

-- CreateEnum
CREATE TYPE "PartsCondition" AS ENUM ('NEW', 'USED', 'REFURBISHED');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "acceptOffers" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "beamFt" DOUBLE PRECISION,
ADD COLUMN     "beamM" DOUBLE PRECISION,
ADD COLUMN     "berths" INTEGER,
ADD COLUMN     "boatCategory" TEXT,
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "cabins" INTEGER,
ADD COLUMN     "charterAvailableFrom" TIMESTAMP(3),
ADD COLUMN     "charterAvailableTo" TIMESTAMP(3),
ADD COLUMN     "charterCrew" INTEGER,
ADD COLUMN     "charterGuests" INTEGER,
ADD COLUMN     "charterIncluded" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "charterPricePeriod" "CharterPricePeriod",
ADD COLUMN     "charterType" TEXT,
ADD COLUMN     "customFeatures" TEXT,
ADD COLUMN     "displacement" TEXT,
ADD COLUMN     "draftFt" DOUBLE PRECISION,
ADD COLUMN     "draftM" DOUBLE PRECISION,
ADD COLUMN     "electronics" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "engineCount" INTEGER,
ADD COLUMN     "engineMake" TEXT,
ADD COLUMN     "engineModel" TEXT,
ADD COLUMN     "enginePower" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "features" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "fuelCapacity" TEXT,
ADD COLUMN     "fuelType" TEXT,
ADD COLUMN     "heads" INTEGER,
ADD COLUMN     "hullColor" TEXT,
ADD COLUMN     "hullMaterial" TEXT,
ADD COLUMN     "hullType" TEXT,
ADD COLUMN     "lengthFt" DOUBLE PRECISION,
ADD COLUMN     "lying" TEXT,
ADD COLUMN     "marina" TEXT,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "partsCategory" TEXT,
ADD COLUMN     "partsCompatibility" TEXT,
ADD COLUMN     "partsCondition" "PartsCondition",
ADD COLUMN     "priceType" "PriceType" NOT NULL DEFAULT 'NEGOTIABLE',
ADD COLUMN     "recentWorks" TEXT,
ADD COLUMN     "safetyEquipment" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "sellerCompany" TEXT,
ADD COLUMN     "sellerEmail" TEXT,
ADD COLUMN     "sellerLocation" TEXT,
ADD COLUMN     "sellerName" TEXT,
ADD COLUMN     "sellerPhone" TEXT,
ADD COLUMN     "sellerType" "SellerType" NOT NULL DEFAULT 'PRIVATE',
ADD COLUMN     "sellerWebsite" TEXT,
ADD COLUMN     "sellerWhatsapp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "serviceAreas" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "serviceCategory" TEXT,
ADD COLUMN     "serviceDescription" TEXT,
ADD COLUMN     "serviceExperience" TEXT,
ADD COLUMN     "serviceName" TEXT,
ADD COLUMN     "taxStatus" TEXT,
ADD COLUMN     "urgent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vesselCondition" "VesselCondition",
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "virtualTourUrl" TEXT,
ALTER COLUMN "intent" SET DEFAULT 'SALE';

-- CreateIndex
CREATE INDEX "Listing_boatCategory_idx" ON "Listing"("boatCategory");

-- CreateIndex
CREATE INDEX "Listing_country_idx" ON "Listing"("country");

-- CreateIndex
CREATE INDEX "Listing_priceCents_idx" ON "Listing"("priceCents");

-- CreateIndex
CREATE INDEX "Listing_year_idx" ON "Listing"("year");

-- CreateIndex
CREATE INDEX "Listing_lengthM_idx" ON "Listing"("lengthM");
