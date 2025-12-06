import React from "react";

export default function EatsPage() {
  return (
    <main className="min-h-screen bg-[#eceae3]">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:px-10 md:pt-16">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Food & cafés in your city
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-neutral-700 md:text-base">
          Restaurants, brunch spots, coffee and late-night eats. This page will
          show places users actually want to try.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-neutral-600">
            Placeholder for the Eats directory. We’ll plug listings in here from
            the database.
          </p>
        </div>
      </div>
    </main>
  );
}
