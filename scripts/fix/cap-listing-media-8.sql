-- Keep max 8 photos per listing (lowest sort first, stable tie-break by createdAt/id)
-- Deletes the rest.

WITH ranked AS (
  SELECT
    id,
    "listingId",
    ROW_NUMBER() OVER (
      PARTITION BY "listingId"
      ORDER BY "sort" ASC, "createdAt" ASC, id ASC
    ) AS rn
  FROM "ListingMedia"
)
DELETE FROM "ListingMedia"
WHERE id IN (
  SELECT id FROM ranked WHERE rn > 8
);