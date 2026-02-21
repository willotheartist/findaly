/**
 * WaazaFinancing — Drop-in React component for Findaly
 */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const WAAZA_ORIGIN = (process.env.NEXT_PUBLIC_WAAZA_URL || "https://www.waaza.co").trim();

interface WaazaFinancingProps {
  price?: number | null;
  year?: number | null;
  usage?: string | null;
  currency?: string | null;
  country?: string | null;
  className?: string;
}

function safeOrigin(input: string) {
  try {
    return new URL(input).origin;
  } catch {
    return "https://www.waaza.co";
  }
}

export default function WaazaFinancing({
  price,
  year,
  usage,
  currency,
  country,
  className,
}: WaazaFinancingProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Start with a compact default so it doesn't look like a big empty block.
  const [iframeHeight, setIframeHeight] = useState(340);

  const validPrice = typeof price === "number" && price > 0 ? price : null;
  const validYear =
    typeof year === "number" && year >= 1950 && year <= new Date().getFullYear() + 2
      ? year
      : null;

  const validUsage = ["private", "charter", "commercial"].includes(usage ?? "")
    ? usage
    : "private";

  const validCurrency = ["EUR", "USD", "GBP"].includes((currency ?? "").toUpperCase())
    ? (currency ?? "EUR").toUpperCase()
    : "EUR";

  const canRender = validPrice !== null && validYear !== null;

  const waazaOrigin = useMemo(() => safeOrigin(WAAZA_ORIGIN), []);
  const widgetUrl = useMemo(() => {
    if (!canRender) return "";
    const qs = new URLSearchParams();
    qs.set("price", String(validPrice));
    qs.set("year", String(validYear));
    qs.set("usage", String(validUsage ?? "private"));
    qs.set("currency", String(validCurrency));
    if (country) qs.set("country", country);
    return `${waazaOrigin}/widget/findaly?${qs.toString()}`;
  }, [canRender, validPrice, validYear, validUsage, validCurrency, country, waazaOrigin]);

  useEffect(() => {
    if (!canRender) return;

    function handleMessage(e: MessageEvent) {
      // Only accept messages from the Waaza origin (strict)
      if (e.origin !== waazaOrigin) return;

      const data = e.data as unknown;

      if (
        data &&
        typeof data === "object" &&
        (data as any).type === "waaza:resize" &&
        typeof (data as any).height === "number"
      ) {
        const h = Math.max(260, Math.min(1200, (data as any).height));
        setIframeHeight(h);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [canRender, waazaOrigin]);

  useEffect(() => {
    if (iframeRef.current && widgetUrl) iframeRef.current.src = widgetUrl;
  }, [widgetUrl]);

  if (!canRender) {
    return (
      <div
        className={className}
        style={{
          width: "100%",
          borderRadius: 16,
          border: "1px solid #e5e5e5",
          background: "#ffffff",
          padding: 18,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>
          Financing available
        </div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          Contact the broker to discuss financing options for this vessel.
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        width: "100%",
        borderRadius: 16,
        border: "1px solid #e5e5e5",
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      <iframe
        ref={iframeRef}
        src={widgetUrl}
        title="Yacht Financing Calculator — Waaza"
        loading="lazy"
        style={{
          width: "100%",
          height: iframeHeight,
          border: "none",
          display: "block",
          background: "transparent",
        }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}