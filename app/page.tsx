import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#eceae3]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-16 pt-10 md:px-10 md:pt-16">
        {/* Top nav */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">
              Findaly
            </span>
          </div>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#beauty" className="transition hover:opacity-70">
              Beauty
            </a>
            <a href="#fitness" className="transition hover:opacity-70">
              Fitness
            </a>
            <a href="#eats" className="transition hover:opacity-70">
              Eats
            </a>
            <a href="#places" className="transition hover:opacity-70">
              Places
            </a>
          </nav>

          <div className="flex items-center gap-4 text-sm">
            <a
              href="#claim"
              className="hidden text-sm underline-offset-4 hover:underline md:inline"
            >
              Claim a business
            </a>
            <button className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              Sign in
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="grid flex-1 items-center gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Left: copy + search */}
          <div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Find what matters
              <br />
              in your city.
            </h1>

            <p className="mt-4 max-w-xl text-sm text-neutral-700 md:text-base">
              Discover trusted clinics, coaches, restaurants and local places —
              all in one clean, modern directory built to help you choose
              confidently.
            </p>

            {/* Search bar */}
            <div className="mt-8 max-w-xl rounded-2xl bg-white p-2 shadow-sm">
              <form className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="flex flex-1 items-center gap-2 rounded-xl bg-[#eceae3] px-3 py-2">
                  <span className="text-lg">🔍</span>
                  <input
                    className="w-full bg-transparent text-sm outline-none md:text-base"
                    placeholder="Search for clinics, coaches, cafés, places..."
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center rounded-xl bg-[#a0c4ff] px-4 py-2 text-sm font-medium text-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:text-base"
                >
                  Use my location
                </button>
              </form>
            </div>

            {/* Quick links */}
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-neutral-700 md:text-sm">
              <span className="font-medium text-neutral-900">
                Popular right now:
              </span>
              <button className="rounded-full bg-white px-3 py-1 shadow-sm">
                Botox clinics near me
              </button>
              <button className="rounded-full bg-white px-3 py-1 shadow-sm">
                Gyms in Manchester
              </button>
              <button className="rounded-full bg-white px-3 py-1 shadow-sm">
                Brunch spots
              </button>
            </div>
          </div>

          {/* Right: category cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <div
              id="beauty"
              className="rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
                Beauty
              </p>
              <h2 className="mt-1 text-lg font-semibold">Clinics & salons</h2>
              <p className="mt-1 text-xs text-neutral-700">
                Botox, skin, hair, nails and more — discover trusted local
                experts.
              </p>
            </div>

            <div
              id="fitness"
              className="rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
                Fitness
              </p>
              <h2 className="mt-1 text-lg font-semibold">Gyms & coaches</h2>
              <p className="mt-1 text-xs text-neutral-700">
                Gyms, PTs, yoga, running clubs and more in your area.
              </p>
            </div>

            <div
              id="eats"
              className="rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
                Eats
              </p>
              <h2 className="mt-1 text-lg font-semibold">Food & cafés</h2>
              <p className="mt-1 text-xs text-neutral-700">
                Restaurants, brunch spots, coffee and late-night eats.
              </p>
            </div>

            <div
              id="places"
              className="rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
                Places
              </p>
              <h2 className="mt-1 text-lg font-semibold">Things to do</h2>
              <p className="mt-1 text-xs text-neutral-700">
                Attractions, experiences, parks, museums and more.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-10 border-t border-black/5 pt-4 text-xs text-neutral-600">
          © {new Date().getFullYear()} Findaly. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
