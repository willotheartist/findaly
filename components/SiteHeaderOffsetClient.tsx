// components/SiteHeaderOffsetClient.tsx
"use client";

import * as React from "react";

type FontsApi = { ready?: Promise<unknown> };

function getFonts(): FontsApi | undefined {
  return (document as unknown as { fonts?: FontsApi }).fonts;
}

export default function SiteHeaderOffsetClient() {
  React.useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>('[data-site-header="true"]');
    if (!header) return;

    let raf = 0;

    const set = () => {
      // bottom of the header *as it appears on screen*
      const bottom = Math.max(0, Math.round(header.getBoundingClientRect().bottom));
      root.style.setProperty("--site-header-offset", `${bottom}px`);
    };

    const tick = () => {
      raf = 0;
      set();
    };

    const requestTick = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(tick);
    };

    set();
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);

    // also update if layout/fonts shift (guarded + typed)
    const fonts = getFonts();
    const ready = fonts?.ready;
    if (ready) {
      ready.then(() => set()).catch(() => {});
    }

    const ro = new ResizeObserver(() => requestTick());
    ro.observe(header);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
      ro.disconnect();
    };
  }, []);

  return null;
}
