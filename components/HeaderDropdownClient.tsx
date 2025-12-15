"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";

export default function HeaderDropdownClient({
  label,
  align = "left",
  children,
  triggerClassName = "",
  panelClassName = "",
}: {
  label: string;
  align?: "left" | "right";
  children: React.ReactNode;
  triggerClassName?: string;
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      if (!wrap.contains(e.target as Node)) setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Optional: auto-close when any link inside is clicked
  const onPanelClickCapture = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");
    if (link) setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        className={`group inline-flex items-center gap-1 ${triggerClassName}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="menu"
      >
        {label}
        <span className="text-xs opacity-60 transition group-hover:opacity-80">
          ▾
        </span>
      </button>

      {open ? (
        <div
          id={panelId}
          role="menu"
          onClickCapture={onPanelClickCapture}
          className={[
            "absolute top-[3.1rem] z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl",
            align === "right" ? "right-0" : "left-0",
            panelClassName,
          ].join(" ")}
        >
          <div className="p-2">{children}</div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * (Optional) If you ever want menu items to be client links that close automatically:
 * you can use this, but you don't need it right now since we close on click-capture above.
 */
export function DropdownLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
