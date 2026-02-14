"use client";

import * as React from "react";

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

    // fonts can change header height after load
    // @ts-ignore
    if (document.fonts?.ready) {
      // @ts-ignore
      document.fonts.ready.then(() => set()).catch(() => {});
    }

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
