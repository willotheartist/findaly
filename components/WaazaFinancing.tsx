/**
 * WaazaFinancing — Drop-in React component for Findaly
 * 
 * Usage:
 * 
 * import WaazaFinancing from '@/components/WaazaFinancing';
 * 
 * <WaazaFinancing
 *   price={listing.price}
 *   year={listing.yearBuilt}
 *   usage={listing.usageType}       // "private" | "charter" | "commercial"
 *   currency={listing.currency}     // "EUR" | "USD" | "GBP" (default: "EUR")
 *   country={listing.location?.country}  // optional, improves readiness calc
 * />
 * 
 * Data contract:
 *   price    — number, in major units (e.g. 685000 not cents). Required.
 *   year     — number, full year (e.g. 2019). Required.
 *   usage    — "private" | "charter" | "commercial". Defaults to "private".
 *   currency — "EUR" | "USD" | "GBP". Defaults to "EUR".
 *   country  — string, vessel location country. Optional.
 */

"use client";

import { useEffect, useRef, useState } from "react";

const WAAZA_ORIGIN = process.env.NEXT_PUBLIC_WAAZA_URL || "https://www.waaza.co";

interface WaazaFinancingProps {
  price?: number | null;
  year?: number | null;
  usage?: string | null;
  currency?: string | null;
  country?: string | null;
  className?: string;
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
  const [iframeHeight, setIframeHeight] = useState(480);

  // ── Validate inputs ──
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

  // Don't render if essential data is missing
  const canRender = validPrice !== null && validYear !== null;

  // ── Build widget URL ──
  const widgetUrl = canRender
    ? `${WAAZA_ORIGIN}/widget/findaly?` +
      `price=${validPrice}` +
      `&year=${validYear}` +
      `&usage=${encodeURIComponent(validUsage ?? "private")}` +
      `&currency=${encodeURIComponent(validCurrency)}` +
      (country ? `&country=${encodeURIComponent(country)}` : "")
    : "";

  // ── Listen for resize messages from widget ──
  useEffect(() => {
    if (!canRender) return;

    function handleMessage(e: MessageEvent) {
      // Only accept messages from Waaza origin
      if (!e.origin.includes("waaza")) return;

      if (e.data?.type === "waaza:resize" && typeof e.data.height === "number") {
        setIframeHeight(e.data.height);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [canRender]);

  // ── Update iframe when listing data changes (client nav) ──
  useEffect(() => {
    if (iframeRef.current && widgetUrl) {
      iframeRef.current.src = widgetUrl;
    }
  }, [widgetUrl]);

  // ── Fallback when data is missing ──
  if (!canRender) {
    return (
      <div
        className={className}
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: "24px",
          background: "#f9f8f5",
          borderRadius: 16,
          border: "1px solid #e8e8e4",
          textAlign: "center",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>
          Financing available
        </div>
        <div style={{ fontSize: 13, color: "#9ca3af" }}>
          Contact the broker to discuss financing options for this vessel.
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ maxWidth: 592, margin: "0 auto" }}>
      <iframe
        ref={iframeRef}
        src={widgetUrl}
        title="Yacht Financing Calculator — Waaza"
        loading="lazy"
        style={{
          width: "100%",
          height: iframeHeight,
          border: "none",
          borderRadius: 16,
          display: "block",
        }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}