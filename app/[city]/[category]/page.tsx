import React from "react";

type CityCategoryPageProps = {
  params: {
    city: string;
    category: string;
  };
};

const CATEGORY_TITLES: Record<string, string> = {
  beauty: "Beauty",
  fitness: "Fitness",
  eats: "Food & cafés",
  places: "Things to do",
};

export default function CityCategoryPage({ params }: CityCategoryPageProps) {
  const cityName =
    params.city.charAt(0).toUpperCase() + params.city.slice(1).replace(/-/g, " ");
  const categoryKey = params.category.toLowerCase();
  const categoryTitle = CATEGORY_TITLES[categoryKey] ?? "Listings";

  return (
    <main className="min-h-screen bg-[#eceae3]">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:px-10 md:pt-16">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {categoryTitle} in {cityName}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-neutral-700 md:text-base">
          This page will show all {categoryTitle.toLowerCase()} in {cityName},
          with filters, map view and sponsored placements.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-neutral-600">
            Placeholder for {categoryTitle.toLowerCase()} in {cityName}. Soon we
            will render real listings from the database here.
          </p>
        </div>
      </div>
    </main>
  );
}
