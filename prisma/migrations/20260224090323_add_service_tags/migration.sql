-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "serviceTags" JSONB NOT NULL DEFAULT '[]';
