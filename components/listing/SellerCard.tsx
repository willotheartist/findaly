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
  BadgeCheck,
} from "lucide-react";

type Seller = {
  id: string; // This must be the actual User ID from your database
  userId?: string; // Alternative: explicit user ID
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
};

type Listing = {
  id: string;
  title: string;
  price: number;
  currency?: string;
};

function formatPrice(price: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("en-EU", {
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
      // Get the receiver ID - use userId if available, otherwise use id
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
          // Not logged in - redirect to login
          router.push(`/login?redirect=/buy/${listing.id}`);
          return;
        }
        
        throw new Error(data.error || "Failed to send message");
      }

      const data = await res.json();

      setSent(true);
      
      // Optional: redirect to messages after a short delay
      setTimeout(() => {
        router.push(`/messages?conversation=${data.conversationId}`);
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Seller header */}
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            {seller.type === "pro" ? (
              <Building2 className="h-6 w-6 text-slate-600" />
            ) : (
              <User className="h-6 w-6 text-slate-600" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link 
                href={`/profile/${seller.id}`}
                className="font-semibold text-slate-900 hover:text-[#ff6a00] transition-colors"
              >
                {seller.company || seller.name}
              </Link>
              {seller.verified && <BadgeCheck className="h-5 w-5 text-sky-500" />}
            </div>
            {seller.company && <div className="text-sm text-slate-500">{seller.name}</div>}
            <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              {seller.location}
            </div>
          </div>
          {seller.type === "pro" && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">Pro</span>
          )}
        </div>

        {/* Seller stats */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          {seller.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium text-slate-900">{seller.rating}</span>
              <span className="text-slate-500">({seller.reviewCount} reviews)</span>
            </div>
          )}
          {seller.listingsCount && (
            <div className="text-slate-500">
              <span className="font-medium text-slate-700">{seller.listingsCount}</span> listings
            </div>
          )}
        </div>

        {seller.responseTime && (
          <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
            <Clock className="h-4 w-4" />
            {seller.responseTime}
          </div>
        )}
      </div>

      {/* Contact form */}
      <div className="p-5">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">Your message</label>
          <textarea
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
              if (sent) setSent(false);
              if (error) setError(null);
            }}
            id="contact-message"
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-slate-300 focus:bg-white"
          />
        </div>

        {error && (
          <div className="mb-3 rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-600">
            {error}
          </div>
        )}

        {sent && (
          <div className="mb-3 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-600">
            Message sent! Redirecting to messages...
          </div>
        )}

        <button
          type="button"
          disabled={sending || !messageText.trim() || sent}
          onClick={handleSend}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all ${
            sending || !messageText.trim() || sent
              ? "cursor-not-allowed bg-[#ff6a00]/60"
              : "bg-[#ff6a00] hover:brightness-110"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          {sending ? "Sending…" : sent ? "Sent ✓" : "Send message"}
        </button>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setShowPhone(!showPhone)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
          >
            <Phone className="h-4 w-4" />
            {showPhone ? seller.phone : "Show phone"}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Member since {seller.memberSince} ·{" "}
          <Link href={`/profile/${seller.id}`} className="text-[#ff6a00] hover:underline">
            View all listings
          </Link>
        </p>
      </div>
    </div>
  );
}