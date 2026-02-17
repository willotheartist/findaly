// app/buy/[slug]/ListingPageClient.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight, // ✅ FIX: used in Sidebar
  MapPin,
  Calendar,
  Ruler,
  Anchor,
  Bed,
  Ship,
  Shield,
  MessageCircle,
  Phone,
  Building2,
  User,
  Clock,
  Check,
  ChevronDown,
  Sailboat,
  Navigation,
  Camera,
  BadgeCheck,
  CircleDot,
  Pencil,
  X,
  Trash2,
  FileText,
  Settings,
  ExternalLink,
  Sparkles,
} from "lucide-react";

import WaazaFinancing from "@/components/WaazaFinancing";

/* ─── palette ─── */
const P = {
  dark: "#0a211f",
  accent: "#fff86c",
  text: "#1a1a1a",
  sub: "#555",
  muted: "#999",
  light: "#ccc",
  line: "#e5e5e5",
  faint: "#f5f5f4",
  white: "#fff",
  green: "#1a7a5c",
  rose: "#d94059",
  blue: "#2196F3",
} as const;

/* ─── font shortcut ─── */
const f = (
  w: 300 | 400 | 500 | 600 = 400,
  s = 14,
  lh?: number
): React.CSSProperties => ({
  fontWeight: w,
  fontSize: s,
  ...(lh ? { lineHeight: `${lh}px` } : {}),
});

/* ─── types ─── */
type BoatListing = {
  id: string;
  slug: string;
  title: string;
  price: number;
  priceNegotiable?: boolean;
  currency: string;
  location: string;
  country: string;
  year: number;
  length: number;
  lengthM: number;
  beam: number;
  beamM: number;
  draft: number;
  draftM: number;
  displacement?: string;
  type: string;
  category: string;
  brand: string;
  model: string;
  hullMaterial: string;
  hullType: string;
  hullColor?: string;
  engineMake?: string;
  engineModel?: string;
  enginePower?: number;
  engineHours?: number;
  fuelType: string;
  fuelCapacity?: number;
  cabins?: number;
  berths?: number;
  heads?: number;
  features: string[];
  electronics: string[];
  safetyEquipment: string[];
  images: string[];
  videoUrl?: string;
  seller: {
    id: string;
    slug: string; // ✅ FIX: route is /profile/[slug]
    name: string;
    type: "pro" | "private";
    company?: string;
    location: string;
    phone?: string;
    responseTime?: string;
    memberSince: string;
    listingsCount?: number;
    verified?: boolean;
    website?: string;
  };
  description: string;
  condition: string;
  taxStatus?: string;
  lying?: string;
  badge?: "featured" | "verified" | "hot" | "new" | "price-drop";
  createdAt: string;
  updatedAt: string;
};

type SimilarCard = {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  country: string;
  year: number;
  lengthFt: number;
  image?: string;
  badge?: "Featured" | "Verified" | "Hot";
  sellerName?: string;
};

function fmtPrice(price: number, cur = "EUR") {
  if (!price) return "Price on application";
  const s = cur === "GBP" ? "£" : cur === "USD" ? "$" : "€";
  return `${s}${price.toLocaleString("en")}`;
}

/* ═══════════════════════════════════════════════════════
   PHOTO MOSAIC
═══════════════════════════════════════════════════════ */
function PhotoMosaic({ images, title }: { images: string[]; title: string }) {
  const [lb, setLb] = useState<number | null>(null);
  if (!images.length)
    return (
      <div
        style={{
          height: 480,
          borderRadius: 16,
          backgroundColor: P.faint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Sailboat style={{ width: 64, height: 64, color: P.light }} />
      </div>
    );

  const side = images.slice(1, 7);
  const extra = Math.max(0, images.length - 7);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: 6,
          height: 480,
        }}
      >
        <button
          type="button"
          onClick={() => setLb(0)}
          style={{
            border: "none",
            padding: 0,
            cursor: "pointer",
            overflow: "hidden",
            borderRadius: "12px 0 0 12px",
            position: "relative",
          }}
        >
          <img
            src={images[0]}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <span
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              display: "flex",
              alignItems: "center",
              gap: 5,
              backgroundColor: "rgba(0,0,0,.55)",
              color: "#fff",
              borderRadius: 16,
              padding: "5px 12px",
              ...f(500, 12),
              backdropFilter: "blur(4px)",
            }}
          >
            <Camera style={{ width: 14, height: 14 }} /> {images.length}
          </span>
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: side.length > 0 ? "1fr 1fr" : "1fr",
            gridAutoRows: "1fr",
            gap: 6,
          }}
        >
          {side.length === 0 && (
            <div
              style={{
                borderRadius: "0 12px 12px 0",
                backgroundColor: P.faint,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Camera style={{ width: 28, height: 28, color: P.light }} />
            </div>
          )}

          {side.map((img, i) => {
            const last = i === side.length - 1;
            let br = "0";
            if (side.length <= 3) {
              if (i === side.length - 1) br = "0 12px 12px 0";
            } else {
              if (i === 1) br = "0 12px 0 0";
              if (last && side.length % 2 === 0) br = "0 0 12px 0";
              if (last && side.length % 2 !== 0) br = "0 0 12px 0";
            }
            if (side.length === 1) br = "0 12px 12px 0";
            if (side.length === 2 && i === 1) br = "0 0 12px 0";

            return (
              <button
                key={i}
                type="button"
                onClick={() => setLb(i + 1)}
                style={{
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  overflow: "hidden",
                  borderRadius: br,
                  position: "relative",
                }}
              >
                <img
                  src={img}
                  alt={`${title} ${i + 2}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {last && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 12,
                      right: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      backgroundColor: P.white,
                      borderRadius: 20,
                      padding: "7px 14px",
                      boxShadow: "0 1px 6px rgba(0,0,0,.1)",
                      ...f(500, 13),
                      color: P.text,
                    }}
                  >
                    <Camera style={{ width: 15, height: 15 }} />
                    {extra > 0 ? `+${extra} more` : "Display all photos"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {lb !== null && (
        <div
          onClick={() => setLb(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            backgroundColor: "rgba(0,0,0,.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            onClick={() => setLb(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(255,255,255,.15)",
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <X style={{ width: 22, height: 22 }} />
          </button>

          <span
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              ...f(400, 14),
              color: "rgba(255,255,255,.6)",
            }}
          >
            {lb + 1} / {images.length}
          </span>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLb(lb === 0 ? images.length - 1 : lb - 1);
              }}
              style={{
                position: "absolute",
                left: 20,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,.12)",
                border: "none",
                borderRadius: "50%",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              <ChevronLeft style={{ width: 24, height: 24 }} />
            </button>
          )}

          <img
            src={images[lb]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "88vw",
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLb(lb === images.length - 1 ? 0 : lb + 1);
              }}
              style={{
                position: "absolute",
                right: 20,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,.12)",
                border: "none",
                borderRadius: "50%",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              <ChevronRight style={{ width: 24, height: 24 }} />
            </button>
          )}
        </div>
      )}
    </>
  );
}

/* ─── Circle button ─── */
function CircleBtn({
  icon: I,
  active,
  onClick,
  label,
}: {
  icon: typeof Heart;
  active?: boolean;
  onClick?: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: `1.5px solid ${active ? P.rose : P.line}`,
        backgroundColor: P.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: active ? P.rose : P.muted,
        transition: "all .15s",
      }}
    >
      <I style={{ width: 18, height: 18 }} fill={active ? P.rose : "none"} />
    </button>
  );
}

/* ─── Key spec ─── */
function KeySpec({
  icon: I,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string | number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          backgroundColor: P.dark,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <I style={{ width: 18, height: 18, color: P.accent }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ ...f(400, 12), color: P.muted, letterSpacing: "0.02em" }}>
          {label}
        </div>
        <div
          style={{
            ...f(500, 15),
            color: P.text,
            marginTop: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

/* ─── Spec chip ─── */
function SpecChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 16px",
        borderRadius: 10,
        backgroundColor: P.faint,
        border: `1px solid ${P.line}`,
        minWidth: 0,
      }}
    >
      <span style={{ ...f(400, 13), color: P.muted }}>{label}</span>
      <span style={{ ...f(600, 14), color: P.text }}>{value}</span>
    </div>
  );
}

/* ─── Spec group ─── */
function SpecGroup({
  title,
  icon: I,
  children,
}: {
  title: string;
  icon: typeof Ruler;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <I style={{ width: 20, height: 20, color: P.muted }} />
        <h3 style={{ ...f(500, 16), color: P.text, margin: 0 }}>{title}</h3>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Feature list ─── */
function Features({ title, items, icon: I }: { title: string; items: string[]; icon: typeof Anchor }) {
  const [open, setOpen] = useState(false);
  const show = open ? items : items.slice(0, 8);
  if (!items.length) return null;

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <I style={{ width: 17, height: 17, color: P.muted }} />
        <span style={{ ...f(500, 15), color: P.text }}>{title}</span>
        <span style={{ ...f(400, 13), color: P.light, marginLeft: "auto" }}>
          {items.length}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
        {show.map((it, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              ...f(400, 14),
              color: P.sub,
              padding: "7px 0",
            }}
          >
            <Check style={{ width: 15, height: 15, color: P.green, flexShrink: 0 }} />
            {it}
          </div>
        ))}
      </div>

      {items.length > 8 && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          style={{
            marginTop: 10,
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            ...f(500, 14),
            color: P.green,
          }}
        >
          {open ? "Show less" : `Show all ${items.length}`}
          <ChevronDown
            style={{
              width: 15,
              height: 15,
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform .2s",
            }}
          />
        </button>
      )}
    </div>
  );
}

/* ─── Seller card ─── */
function Sidebar({ listing }: { listing: BoatListing }) {
  const s = listing.seller;
  const [showPhone, setShowPhone] = useState(false);
  const [sent, setSent] = useState(false);
  const isPro = s.type === "pro";

  const inp: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    border: `1px solid ${P.line}`,
    borderRadius: 8,
    ...f(400, 14),
    color: P.text,
    outline: "none",
    backgroundColor: P.white,
  };

  return (
    <div
      style={{
        border: `1px solid ${P.line}`,
        borderRadius: 16,
        backgroundColor: P.white,
        position: "sticky",
        top: 24,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "28px 28px 20px" }}>
        <div style={{ ...f(300, 38, 42), color: P.text, letterSpacing: "-0.025em" }}>
          {fmtPrice(listing.price, listing.currency)}
        </div>
        {listing.priceNegotiable && (
          <div style={{ ...f(400, 13), color: P.muted, marginTop: 4 }}>Price negotiable</div>
        )}
      </div>

      <div style={{ padding: "0 28px 20px", borderBottom: `1px solid ${P.faint}` }}>
        <Link
          href={`/profile/${s.slug}`} // ✅ FIX: route is /profile/[slug]
          style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              backgroundColor: P.faint,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: `2px solid ${P.line}`,
            }}
          >
            {isPro ? (
              <Building2 style={{ width: 22, height: 22, color: P.muted }} />
            ) : (
              <User style={{ width: 22, height: 22, color: P.muted }} />
            )}
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ ...f(500, 15), color: P.text }}>{s.company || s.name}</span>
              {s.verified && <BadgeCheck style={{ width: 16, height: 16, color: P.blue }} />}
              {isPro && (
                <span
                  style={{
                    ...f(600, 11),
                    color: P.dark,
                    backgroundColor: P.accent,
                    padding: "2px 8px",
                    borderRadius: 10,
                  }}
                >
                  PRO
                </span>
              )}
            </div>

            {s.company && s.name && s.company !== s.name && (
              <div style={{ ...f(400, 12), color: P.muted, marginTop: 2 }}>{s.name}</div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 4, ...f(400, 12), color: P.muted, marginTop: 3 }}>
              <MapPin style={{ width: 12, height: 12 }} />
              {s.location}
            </div>
          </div>

          <ChevronRight style={{ width: 18, height: 18, color: P.light, flexShrink: 0 }} />
        </Link>

        <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${P.faint}` }}>
          {s.listingsCount !== undefined && s.listingsCount > 0 && (
            <div style={{ ...f(400, 13), color: P.sub }}>
              <span style={{ ...f(600, 13), color: P.text }}>{s.listingsCount}</span> listings
            </div>
          )}
          {s.responseTime && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, ...f(400, 13), color: P.green }}>
              <Clock style={{ width: 13, height: 13 }} />
              {s.responseTime}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 12 }}>
        <input type="text" placeholder="Your name" style={inp} />
        <input type="tel" placeholder="Your telephone no." style={inp} />
        <input type="email" placeholder="Your email" style={inp} />
        <textarea
          id="contact-message"
          placeholder="Your message..."
          rows={4}
          style={{ ...inp, resize: "vertical" }}
          defaultValue={`Hi, I'm interested in the ${listing.title}. Is it still available?`}
        />

        <button
          type="button"
          onClick={() => setSent(true)}
          style={{
            width: "100%",
            padding: "14px 0",
            backgroundColor: P.dark,
            color: P.accent,
            border: "none",
            borderRadius: 10,
            ...f(500, 15),
            cursor: "pointer",
            marginTop: 4,
          }}
        >
          {sent ? "Enquiry sent ✓" : "Send enquiry"}
        </button>

        {s.phone && (
          <button
            type="button"
            onClick={() => setShowPhone(!showPhone)}
            style={{
              width: "100%",
              padding: "13px 0",
              backgroundColor: P.white,
              color: P.text,
              border: `1px solid ${P.line}`,
              borderRadius: 10,
              ...f(500, 14),
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Phone style={{ width: 16, height: 16 }} />
            {showPhone ? s.phone : "Show phone number"}
          </button>
        )}

        {s.website && (
          <a
            href={s.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "12px 0",
              ...f(400, 13),
              color: P.green,
              textDecoration: "none",
            }}
          >
            <ExternalLink style={{ width: 14, height: 14 }} /> Visit website
          </a>
        )}

        <div style={{ ...f(400, 12), color: P.light, textAlign: "center", marginTop: 4 }}>
          Member since {s.memberSince} ·{" "}
          <Link href={`/profile/${s.slug}`} style={{ color: P.green, textDecoration: "none", ...f(500, 12) }}>
            View all listings →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Similar boats — FULL WIDTH ROW (Greenacres-style)
═══════════════════════════════════════════════════════ */
function SimilarBoats({
  items,
  current,
}: {
  items: SimilarCard[];
  current: BoatListing;
}) {
  const viewMoreHref = useMemo(() => {
    const qs = new URLSearchParams();
    if (current.brand) qs.set("brand", current.brand);
    if (current.category) qs.set("category", current.category);
    if (current.country) qs.set("country", current.country);
    return `/buy?${qs.toString()}`;
  }, [current.brand, current.category, current.country]);

  if (!items?.length) return null;

  function Card({ it }: { it: SimilarCard }) {
    const price = it.price ? fmtPrice(it.price, it.currency) : "POA";
    const meta = `${it.lengthFt ? `${Math.round(it.lengthFt)} ft` : "—"} • ${it.year || "—"} • ${
      it.location || it.country || "Location"
    }`;

    const parts = meta.split("•").map((s) => s.trim()).filter(Boolean);
    const location = parts.length ? parts[parts.length - 1] : "";
    const specs = parts.length > 1 ? parts.slice(0, -1).join(" • ") : meta;

    return (
      <Link
        href={`/buy/${it.slug}`}
        className="group overflow-hidden rounded-2xl bg-white no-underline shadow-sm ring-1 ring-slate-200/70 transition-all duration-300 hover:shadow-md hover:ring-slate-300"
      >
        <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
          {it.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={it.image}
              alt={it.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-50">
              <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_30%_40%,rgba(0,0,0,0.06),transparent)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sailboat className="h-16 w-16 text-slate-200 transition-transform duration-500 group-hover:scale-110" />
              </div>
            </div>
          )}

          {it.badge ? (
            <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-sm ring-1 ring-black/5">
              <Sparkles className="h-3 w-3 text-[#ff6a00]" />
              {it.badge}
            </div>
          ) : null}
        </div>

        <div className="px-4 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="text-[22px] font-semibold tracking-tight text-slate-900">
              {price}
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200/80 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition group-hover:ring-slate-300">
                <Trash2 className="h-4 w-4 text-slate-500" />
              </div>
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200/80 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition group-hover:ring-slate-300">
                <Heart className="h-4 w-4 text-slate-600" />
              </div>
            </div>
          </div>

          <div className="mt-1.5 text-sm text-slate-700">
            {location || <span className="text-slate-500">Location</span>}
          </div>

          <div className="mt-2 text-sm text-slate-500">{specs}</div>

          <div className="mt-3 line-clamp-1 text-[15px] font-medium text-slate-900">
            {it.title}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-[10px] font-semibold text-white">
              F
            </div>
            <div className="truncate text-sm text-slate-500">{it.sellerName || "Findaly"}</div>
          </div>

          <div className="inline-flex h-9 w-11 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200/80 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition group-hover:ring-slate-300">
            <MessageCircle className="h-4 w-4 text-slate-600" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <section style={{ paddingTop: 34 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
        <h3 style={{ ...f(500, 18), color: P.text, margin: 0 }}>Similar boats for sale</h3>
        <Link href={viewMoreHref} className="text-sm font-medium text-slate-600 no-underline hover:text-slate-900">
          View more →
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 4).map((it) => (
          <Card key={it.id} it={it} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
export default function ListingPageClient({
  listing,
  isAdmin,
  similar,
}: {
  listing: BoatListing;
  isAdmin: boolean;
  similar: SimilarCard[];
}) {
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"description" | "specs" | "features">("description");

  const tabConfig = [
    { id: "description" as const, label: "Description", icon: FileText },
    { id: "specs" as const, label: "Specifications", icon: Settings },
    { id: "features" as const, label: "Features", icon: Check },
  ];

  return (
    <main style={{ minHeight: "100vh", backgroundColor: P.white }}>
      {/* Breadcrumb */}
      <div style={{ borderBottom: `1px solid ${P.faint}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/buy" style={{ display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none", ...f(400, 14), color: P.sub }}>
            <ChevronLeft style={{ width: 18, height: 18 }} /> Back to results
          </Link>
          {isAdmin && (
            <Link
              href={`/my-listings/${listing.id}/edit`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                textDecoration: "none",
                ...f(500, 13),
                color: P.white,
                backgroundColor: P.dark,
                padding: "8px 16px",
                borderRadius: 8,
              }}
            >
              <Pencil style={{ width: 14, height: 14 }} /> Edit listing
            </Link>
          )}
        </div>
      </div>

      {/* Photos */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px 0" }}>
        <PhotoMosaic images={listing.images} title={listing.title} />
      </div>

      {/* Title + actions */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ ...f(400, 26, 34), color: P.text, margin: 0, letterSpacing: "-0.01em" }}>
              {listing.title}
            </h1>
            <div style={{ width: 80, height: 3, backgroundColor: P.green, borderRadius: 2, marginTop: 16 }} />
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0, paddingTop: 2 }}>
            <CircleBtn icon={Trash2} label="Remove" />
            <CircleBtn icon={Heart} active={saved} onClick={() => setSaved(!saved)} label="Save" />
            <CircleBtn icon={Share2} label="Share" />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ borderBottom: `1px solid ${P.faint}`, margin: "24px 0 0" }} />
      </div>

      {/* Main grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 40px" }}>
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* LEFT */}
          <div style={{ minWidth: 0 }}>
            {/* Key specs */}
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4" style={{ paddingBottom: 22 }}>
              <KeySpec icon={MapPin} label={listing.country || "Location"} value={listing.location || "—"} />
              <KeySpec icon={Ruler} label="Length" value={listing.length ? `${listing.length} ft` : "—"} />
              <KeySpec icon={Bed} label="Cabins" value={listing.cabins || "—"} />
              <KeySpec icon={Calendar} label="Year" value={listing.year || "—"} />
            </div>

            {/* ✅ Waaza financing (inline Pretto-style) */}
            <div style={{ marginBottom: 28 }}>
              <WaazaFinancing
                price={listing.price || null}
                year={listing.year || null}
                usage={"private"} // if you later add listing.usageType, pass it here
                currency={listing.currency || "EUR"}
                country={listing.country || null}
              />
            </div>

            {/* Tabbed content */}
            <div style={{ border: `1px solid ${P.line}`, borderRadius: 16, overflow: "hidden", backgroundColor: P.white }}>
              <div style={{ display: "flex", borderBottom: `1px solid ${P.line}` }}>
                {tabConfig.map((t) => {
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTab(t.id)}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: "16px 12px",
                        background: "none",
                        border: "none",
                        borderBottom: active ? `3px solid ${P.green}` : "3px solid transparent",
                        cursor: "pointer",
                        ...f(active ? 500 : 400, 14),
                        color: active ? P.green : P.muted,
                        transition: "all .15s",
                      }}
                    >
                      <t.icon style={{ width: 16, height: 16 }} />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <div style={{ padding: "28px 28px 32px" }}>
                {tab === "description" && (
                  <div>
                    {listing.description ? (
                      listing.description.split("\n\n").map((p, i) => (
                        <p key={i} style={{ ...f(400, 15, 26), color: P.sub, margin: "0 0 20px", whiteSpace: "pre-wrap" }}>
                          {p}
                        </p>
                      ))
                    ) : (
                      <p style={{ ...f(400, 15), color: P.light }}>No description provided.</p>
                    )}
                  </div>
                )}

                {tab === "specs" && (
                  <div>
                    {(listing.length > 0 || listing.beam > 0 || listing.draft > 0) && (
                      <SpecGroup title="Dimensions" icon={Ruler}>
                        {listing.length > 0 && <SpecChip label="Length" value={`${listing.length} ft${listing.lengthM > 0 ? ` (${listing.lengthM}m)` : ""}`} />}
                        {listing.beam > 0 && <SpecChip label="Beam" value={`${listing.beam} ft${listing.beamM > 0 ? ` (${listing.beamM}m)` : ""}`} />}
                        {listing.draft > 0 && <SpecChip label="Draft" value={`${listing.draft} ft${listing.draftM > 0 ? ` (${listing.draftM}m)` : ""}`} />}
                        {listing.displacement && <SpecChip label="Displacement" value={listing.displacement} />}
                      </SpecGroup>
                    )}

                    {(listing.hullMaterial || listing.hullType) && (
                      <SpecGroup title="Hull & Construction" icon={Ship}>
                        {listing.hullMaterial && <SpecChip label="Material" value={listing.hullMaterial} />}
                        {listing.hullType && <SpecChip label="Hull type" value={listing.hullType} />}
                        {listing.hullColor && <SpecChip label="Colour" value={listing.hullColor} />}
                      </SpecGroup>
                    )}

                    {(listing.engineMake || listing.enginePower) && (
                      <SpecGroup title="Propulsion" icon={Navigation}>
                        {listing.engineMake && <SpecChip label="Engine" value={`${listing.engineMake}${listing.engineModel ? ` ${listing.engineModel}` : ""}`} />}
                        {listing.enginePower && <SpecChip label="Power" value={`${listing.enginePower} HP`} />}
                        {listing.engineHours && <SpecChip label="Engine hours" value={`${listing.engineHours} hrs`} />}
                        {listing.fuelType && <SpecChip label="Fuel" value={listing.fuelType} />}
                      </SpecGroup>
                    )}

                    {(listing.cabins || listing.berths || listing.heads) && (
                      <SpecGroup title="Accommodation" icon={Bed}>
                        {listing.cabins && <SpecChip label="Cabins" value={listing.cabins} />}
                        {listing.berths && <SpecChip label="Berths" value={listing.berths} />}
                        {listing.heads && <SpecChip label="Heads" value={listing.heads} />}
                      </SpecGroup>
                    )}
                  </div>
                )}

                {tab === "features" && (
                  <div>
                    <Features title="Equipment & Features" items={listing.features} icon={Anchor} />
                    <Features title="Electronics & Navigation" items={listing.electronics} icon={Navigation} />
                    <Features title="Safety Equipment" items={listing.safetyEquipment} icon={Shield} />
                    {!listing.features.length && !listing.electronics.length && !listing.safetyEquipment.length && (
                      <p style={{ ...f(400, 15), color: P.light }}>No features listed.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Listing details */}
            <div style={{ border: `1px solid ${P.line}`, borderRadius: 16, padding: 28, marginTop: 24, backgroundColor: P.white }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <CircleDot style={{ width: 18, height: 18, color: P.muted }} />
                <h3 style={{ ...f(500, 16), color: P.text, margin: 0 }}>Listing details</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                <SpecChip label="Condition" value={listing.condition || "—"} />
                {listing.taxStatus && <SpecChip label="Tax status" value={listing.taxStatus} />}
                {listing.lying && <SpecChip label="Lying" value={listing.lying} />}
                <SpecChip label="Listed" value={new Date(listing.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} />
              </div>
            </div>

            {/* Location */}
            <div style={{ marginTop: 24 }}>
              <h3 style={{ ...f(500, 16), color: P.text, margin: "0 0 16px" }}>Location</h3>
              <div style={{ height: 200, borderRadius: 12, backgroundColor: P.faint, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${P.line}` }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", backgroundColor: P.dark, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                    <MapPin style={{ width: 20, height: 20, color: P.accent }} />
                  </div>
                  <div style={{ ...f(400, 14), color: P.sub, marginTop: 12 }}>
                    {listing.location}, {listing.country}
                  </div>
                </div>
              </div>
            </div>

            {/* Safety tips */}
            <div style={{ marginTop: 24, padding: 24, borderRadius: 12, backgroundColor: "#fefce8", border: "1px solid #fef08a" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Shield style={{ width: 17, height: 17, color: "#a16207" }} />
                <span style={{ ...f(500, 14), color: "#854d0e" }}>Safety tips</span>
              </div>
              {["Always inspect the boat in person before purchase", "Use a marine surveyor for pre-purchase inspection", "Never transfer money before seeing documentation"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, ...f(400, 13), color: "#92400e", marginBottom: 6 }}>
                  <CircleDot style={{ width: 13, height: 13, marginTop: 3, flexShrink: 0 }} />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:block" style={{ minWidth: 0 }}>
            <Sidebar listing={listing} />
          </div>
        </div>

        {/* Similar section */}
        <div style={{ marginTop: 36, borderTop: `1px solid ${P.faint}`, paddingTop: 10 }}>
          <SimilarBoats items={similar} current={listing} />
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden" style={{ backgroundColor: P.white, borderTop: `1px solid ${P.line}`, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...f(300, 22, 26), color: P.text }}>{fmtPrice(listing.price, listing.currency)}</div>
            <div style={{ ...f(400, 13), color: P.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {listing.title}
            </div>
          </div>
          {isAdmin && (
            <Link
              href={`/my-listings/${listing.id}/edit`}
              style={{
                padding: "12px 16px",
                backgroundColor: P.dark,
                color: P.white,
                borderRadius: 10,
                ...f(500, 14),
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Pencil style={{ width: 14, height: 14 }} /> Edit
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("contact-message") as HTMLTextAreaElement | null;
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                el.focus();
              }
            }}
            style={{
              padding: "12px 20px",
              backgroundColor: P.dark,
              color: P.accent,
              border: "none",
              borderRadius: 10,
              ...f(500, 15),
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <MessageCircle style={{ width: 18, height: 18 }} /> Contact
          </button>
        </div>
      </div>
    </main>
  );
}
