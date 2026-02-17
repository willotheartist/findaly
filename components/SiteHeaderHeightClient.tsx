// components/SiteHeaderHeightClient.tsx
"use client";

import * as React from "react";

type FontsApi = { ready?: Promise<unknown> };

function getFonts(): FontsApi | undefined {
  return (document as unknown as { fonts?: FontsApi }).fonts;
}

export default function SiteHeaderHeightClient() {
  React.useLayoutEffect(() => {
    const root = document.documentElement;

    const header = document.querySelector<HTMLElement>('[data-site-header="true"]');
    if (!header) return;

    const set = () => {
      const h = Math.ceil(header.getBoundingClientRect().height);
      root.style.setProperty("--site-header-h", `${h}px`);
    };

    set();

    const ro = new ResizeObserver(() => set());
    ro.observe(header);

    const onResize = () => set();
    window.addEventListener("resize", onResize);

    // fonts can change header height after load (guarded + typed)
    const fonts = getFonts();
    const ready = fonts?.ready;
    if (ready) {
      ready.then(() => set()).catch(() => {});
    }

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
