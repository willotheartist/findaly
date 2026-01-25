// app/add-listing/page.tsx
"use client";

import ListingWizard from "./ListingWizard";

export default function AddListingPage() {
  return (
    <ListingWizard
      mode="create"
      submitUrl="/api/listings"
      submitMethod="POST"
    />
  );
}
