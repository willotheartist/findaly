import React from "react";

type CityPageProps = {
  params: {
    city: string;
  };
};

export default function CityPage({ params }: CityPageProps) {
  const cityName =
    params.city.charAt(0).toUpperCase() + params.city.slice(1).replace(/-/g, " ");

  return (
    <main className="min-h-screen bg-[#eceae3]">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:px-10 md:pt-16">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Discover {cityName}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-neutral-700 md:text-base">
          City overview page for {cityName}. This will highlight top categories,
          featured listings and guides for this city.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Beauty
            </h2>
            <p className="mt-1 text-sm text-neutral-700">
              Top clinics and salons in {cityName}.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Fitness
            </h2>
            <p className="mt-1 text-sm text-neutral-700">
              Gyms, coaches and classes in {cityName}.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Eats
            </h2>
            <p className="mt-1 text-sm text-neutral-700">
              Cafés, restaurants and brunch spots in {cityName}.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Places
            </h2>
            <p className="mt-1 text-sm text-neutral-700">
              Things to do, attractions and more in {cityName}.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
