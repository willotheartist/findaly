// app/my-listings/[id]/edit/EditListingClient.tsx
"use client";

import ListingWizard from "@/app/add-listing/ListingWizard";
import type { FormData } from "@/app/add-listing/_types/listing";

export default function EditListingClient({
  listingId,
  initial,
}: {
  listingId: string;
  initial: Partial<FormData>;
}) {
  return (
    <ListingWizard
      mode="edit"
      initial={initial}
      submitUrl={`/api/listings/${listingId}`}
      submitMethod="PATCH"
    />
  );
}
