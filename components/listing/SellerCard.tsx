// components/listing/SellerCard.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  MapPin,
  MessageCircle,
  Phone,
  Building2,
  User,
  Clock,
  Star,
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

/* ─── palette (match BuyPageClient) ─── */
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

type Seller = {
  id: string;
  userId?: string;
  name: string;
  type: "pro" | "private";
  company?: string;
  location: string;
  phone?: string;
  responseTime?: string;
  memberSince: string;
  listingsCount?: number;
  verified?: boolean;
  rating?: number;
  reviewCount?: number;
  profileSlug?: string;
};

type Listing = {
  id: string;
  title: string;
  price: number;
  currency?: string;
};

function formatPrice(price: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function SellerCard({ seller, listing }: { seller: Seller; listing: Listing }) {
  const router = useRouter();
  const [showPhone, setShowPhone] = useState(false);
  const [messageText, setMessageText] = useState(
    `Hi, I'm interested in the ${listing.title} listed at ${formatPrice(listing.price, listing.currency)}. Is it still available?`
  );

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    const msg = messageText.trim();
    if (!msg || sending) return;

    setSending(true);
    setSent(false);
    setError(null);

    try {
      const receiverId = seller.userId || seller.id;

      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId,
          listingId: listing.id,
          message: msg,
        }),
      });

      if (!res.ok) {
        const data = await res.json();

        if (res.status === 401) {
          router.push(`/login?redirect=/buy/${listing.id}`);
          return;
        }

        throw new Error(data.error || "Failed to send message");
      }

      const data = await res.json();
      setSent(true);

      setTimeout(() => {
        router.push(`/messages?conversation=${data.conversationId}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const profileHref = seller.profileSlug
    ? `/profile/${seller.profileSlug}`
    : `/profile/${seller.id}`;

  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: "rgba(0,0,0,.10)", backgroundColor: P.white }}
    >
      {/* Seller header */}
      <div className="p-5" style={{ borderBottom: "1px solid rgba(0,0,0,.06)" }}>
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: P.faint, border: "1px solid rgba(0,0,0,.08)" }}
          >
            {seller.type === "pro" ? (
              <Building2 className="h-6 w-6" style={{ color: "rgba(0,0,0,.45)" }} />
            ) : (
              <User className="h-6 w-6" style={{ color: "rgba(0,0,0,.45)" }} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link
                href={profileHref}
                className="no-underline transition-colors"
                style={{ color: P.text, fontWeight: 600 }}
              >
                {seller.company || seller.name}
              </Link>
              {seller.verified && <Shield className="h-5 w-5" style={{ color: P.green }} />}
            </div>
            {seller.company && (
              <div className="text-sm" style={{ color: "rgba(0,0,0,.50)" }}>
                {seller.name}
              </div>
            )}
            <div className="mt-1 flex items-center gap-1 text-sm" style={{ color: "rgba(0,0,0,.45)" }}>
              <MapPin className="h-3.5 w-3.5" />
              {seller.location}
            </div>
          </div>
          {seller.type === "pro" && (
            <span
              className="rounded-md px-2.5 py-1 text-xs"
              style={{ backgroundColor: P.dark, color: P.accent, fontWeight: 700 }}
            >
              PRO
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          {seller.rating != null && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" style={{ color: "#e5a100", fill: "#e5a100" }} />
              <span style={{ color: P.text, fontWeight: 600 }}>{seller.rating}</span>
              {seller.reviewCount != null && (
                <span style={{ color: "rgba(0,0,0,.40)" }}>({seller.reviewCount})</span>
              )}
            </div>
          )}
          {seller.listingsCount != null && (
            <div style={{ color: "rgba(0,0,0,.45)" }}>
              <span style={{ color: P.text, fontWeight: 600 }}>{seller.listingsCount}</span> listings
            </div>
          )}
        </div>

        {seller.responseTime && (
          <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: P.green }}>
            <Clock className="h-4 w-4" />
            {seller.responseTime}
          </div>
        )}
      </div>

      {/* Contact form */}
      <div className="p-5">
        <div className="mb-4">
          <label
            className="mb-2 block text-sm"
            style={{ color: P.text, fontWeight: 500 }}
          >
            Your message
          </label>
          <textarea
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
              if (sent) setSent(false);
              if (error) setError(null);
            }}
            id="contact-message"
            rows={4}
            className="w-full resize-none rounded-xl border p-3 text-sm outline-none transition-colors"
            style={{
              borderColor: "rgba(0,0,0,.12)",
              backgroundColor: P.faint,
              color: P.text,
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-3 flex items-start gap-2 rounded-lg border p-3 text-sm"
            style={{
              borderColor: "rgba(217,64,89,.20)",
              backgroundColor: "rgba(217,64,89,.04)",
              color: P.rose,
            }}
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Success */}
        {sent && (
          <div
            className="mb-3 flex items-start gap-2 rounded-lg border p-3 text-sm"
            style={{
              borderColor: "rgba(26,122,92,.20)",
              backgroundColor: "rgba(26,122,92,.04)",
              color: P.green,
            }}
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            Message sent! Redirecting to messages...
          </div>
        )}

        {/* Send button */}
        <button
          type="button"
          disabled={sending || !messageText.trim() || sent}
          onClick={handleSend}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: P.dark,
            color: P.accent,
            fontWeight: 600,
          }}
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MessageCircle className="h-4 w-4" />
          )}
          {sending ? "Sending…" : sent ? "Sent ✓" : "Send message"}
        </button>

        {/* Phone button */}
        {seller.phone && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowPhone(!showPhone)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm transition-all"
              style={{
                borderColor: "rgba(0,0,0,.12)",
                backgroundColor: P.white,
                color: P.text,
                fontWeight: 500,
              }}
            >
              <Phone className="h-4 w-4" style={{ color: "rgba(0,0,0,.45)" }} />
              {showPhone ? seller.phone : "Show phone number"}
            </button>
          </div>
        )}

        <p className="mt-4 text-center text-xs" style={{ color: "rgba(0,0,0,.35)" }}>
          Member since {seller.memberSince} ·{" "}
          <Link href={profileHref} className="no-underline" style={{ color: P.green }}>
            View all listings
          </Link>
        </p>
      </div>
    </div>
  );
}