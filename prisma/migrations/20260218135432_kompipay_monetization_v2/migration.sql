/*
  Warnings:

  - The values [FEATURED_LISTING] on the enum `ProductKey` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductKey_new" AS ENUM ('FEATURED_LISTING_14D', 'FEATURED_LISTING_30D', 'BOOST_7D', 'BOOST_14D', 'FINANCE_PRIORITY_14D', 'FINANCE_PRIORITY_30D', 'BROKER_PRO_MONTHLY', 'VERIFIED_BROKER_MONTHLY');
ALTER TABLE "PaymentIntent" ALTER COLUMN "productKey" TYPE "ProductKey_new" USING ("productKey"::text::"ProductKey_new");
ALTER TYPE "ProductKey" RENAME TO "ProductKey_old";
ALTER TYPE "ProductKey_new" RENAME TO "ProductKey";
DROP TYPE "public"."ProductKey_old";
COMMIT;

-- AlterTable
ALTER TABLE "PaymentIntent" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";
