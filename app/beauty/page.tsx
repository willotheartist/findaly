import React from "react";

export default function BeautyPage() {
  return (
    <main className="min-h-screen bg-[#eceae3]">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:px-10 md:pt-16">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Beauty in your city
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-neutral-700 md:text-base">
          Explore clinics, salons, aesthetics and more. Soon this page will list
          all beauty businesses for a selected city, with filters and maps.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-neutral-600">
            This is a placeholder for the Beauty directory. We’ll hook this into
            city-specific pages and real listings using the database.
          </p>
        </div>
      </div>
    </main>
  );
}
