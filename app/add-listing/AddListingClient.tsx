"use client";

import ListingWizard from "./ListingWizard";

export default function AddListingClient() {
  return (
    <ListingWizard
      mode="create"
      submitUrl="/api/listings"
      submitMethod="POST"
    />
  );
}
