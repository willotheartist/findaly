// app/messages/MessagesClient.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  MoreHorizontal,
  Send,
  Paperclip,
  Image as ImageIcon,
  Info,
  CheckCheck,
  Sailboat,
  ArrowLeft,
  Filter,
  Loader2,
  Shield,
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

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Conversation = {
  id: string;
  otherUser: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
  };
  listing: {
    id: string;
    title: string;
    slug: string;
    priceCents: number | null;
    currency: string;
  } | null;
  lastMessage: {
    id: string;
    body: string;
    createdAt: string;
    isFromMe: boolean;
  };
  unreadCount: number;
};

type Message = {
  id: string;
  body: string;
  createdAt: string;
  isFromMe: boolean;
  senderName: string;
};

type ConversationDetail = {
  id: string;
  listing: {
    id: string;
    title: string;
    slug: string;
    priceCents: number | null;
    currency: string;
  } | null;
  otherUser: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    profileSlug: string | null;
  } | null;
  messages: Message[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatPrice(cents: number | null, currency: string) {
  if (!cents) return "POA";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return date.toLocaleDateString("en-GB", { weekday: "short" });
  } else {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function ConversationItem({
  convo,
  isActive,
  onClick,
}: {
  convo: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 transition-colors"
      style={{
        borderBottom: "1px solid rgba(0,0,0,.06)",
        backgroundColor: isActive ? "rgba(10,33,31,.03)" : "transparent",
        borderLeft: isActive ? `3px solid ${P.dark}` : "3px solid transparent",
      }}
    >
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: P.faint, border: "1px solid rgba(0,0,0,.08)" }}
          >
            <Sailboat className="h-5 w-5" style={{ color: "rgba(0,0,0,.25)" }} />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <span
                className="truncate text-sm"
                style={{
                  color: P.text,
                  fontWeight: convo.unreadCount > 0 ? 600 : 500,
                }}
              >
                {convo.otherUser.name}
              </span>
              {convo.otherUser.isVerified && (
                <Shield className="h-3.5 w-3.5 shrink-0" style={{ color: P.green }} />
              )}
            </div>
            <span
              className="shrink-0 text-xs"
              style={{
                color: convo.unreadCount > 0 ? P.dark : "rgba(0,0,0,.35)",
                fontWeight: convo.unreadCount > 0 ? 600 : 400,
              }}
            >
              {formatTime(convo.lastMessage.createdAt)}
            </span>
          </div>

          <p
            className="mt-1 truncate text-sm"
            style={{ color: convo.unreadCount > 0 ? P.text : "rgba(0,0,0,.45)" }}
          >
            {convo.lastMessage.isFromMe && (
              <span style={{ color: "rgba(0,0,0,.35)" }}>You: </span>
            )}
            {convo.lastMessage.body}
          </p>

          {convo.listing && (
            <div
              className="mt-2 flex items-center gap-2 rounded-lg p-2"
              style={{ backgroundColor: P.faint }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded"
                style={{ backgroundColor: "rgba(0,0,0,.06)" }}
              >
                <Sailboat className="h-4 w-4" style={{ color: "rgba(0,0,0,.25)" }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs" style={{ color: P.text, fontWeight: 500 }}>
                  {convo.listing.title}
                </div>
                <div className="text-xs" style={{ color: P.green, fontWeight: 600 }}>
                  {formatPrice(convo.listing.priceCents, convo.listing.currency)}
                </div>
              </div>
            </div>
          )}
        </div>

        {convo.unreadCount > 0 && (
          <div
            className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full px-1.5"
            style={{ backgroundColor: P.dark }}
          >
            <span className="text-xs" style={{ color: P.accent, fontWeight: 700 }}>
              {convo.unreadCount}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isMe = message.isFromMe;
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[70%] px-4 py-2.5"
        style={{
          borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          backgroundColor: isMe ? P.dark : P.faint,
          color: isMe ? P.white : P.text,
        }}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.body}</p>
        <div
          className="mt-1 flex items-center justify-end gap-1"
          style={{ color: isMe ? "rgba(255,255,255,.50)" : "rgba(0,0,0,.30)" }}
        >
          <span className="text-xs">
            {new Date(message.createdAt).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isMe && <CheckCheck className="h-3.5 w-3.5" />}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function MessagesClient() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [convoDetail, setConvoDetail] = useState<ConversationDetail | null>(null);
  const [messageText, setMessageText] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const convoId = searchParams.get("conversation");
    if (convoId && !activeConvoId) {
      setActiveConvoId(convoId);
      setShowMobileChat(true);
    }
  }, [searchParams, activeConvoId]);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch("/api/messages");
        if (!res.ok) {
          if (res.status === 401) {
            setError("Please log in to view messages");
            return;
          }
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setConversations(data);
      } catch {
        setError("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activeConvoId) {
      setConvoDetail(null);
      return;
    }

    async function fetchMessages() {
      setLoadingMessages(true);
      try {
        const res = await fetch(`/api/messages/${activeConvoId}`);
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setConvoDetail(data);
      } catch {
        console.error("Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    }
    fetchMessages();
  }, [activeConvoId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convoDetail?.messages]);

  const handleSend = async () => {
    if (!messageText.trim() || !convoDetail?.otherUser || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConvoId,
          receiverId: convoDetail.otherUser.id,
          listingId: convoDetail.listing?.id,
          message: messageText.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to send");

      const data = await res.json();

      setConvoDetail((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, data.message],
            }
          : null
      );

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvoId
            ? {
                ...c,
                lastMessage: {
                  id: data.message.id,
                  body: data.message.body,
                  createdAt: data.message.createdAt,
                  isFromMe: true,
                },
              }
            : c
        )
      );

      setMessageText("");
    } catch {
      console.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // ── Loading state ──
  if (loading) {
    return (
      <main
        className="flex items-center justify-center"
        style={{ height: "calc(100vh - 64px)", backgroundColor: P.white }}
      >
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "rgba(0,0,0,.25)" }} />
      </main>
    );
  }

  // ── Error / auth state ──
  if (error) {
    return (
      <main
        className="flex items-center justify-center"
        style={{ height: "calc(100vh - 64px)", backgroundColor: P.white }}
      >
        <div className="text-center">
          <p className="mb-4 text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
            {error}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm no-underline transition-all"
            style={{ backgroundColor: P.dark, color: P.accent, fontWeight: 600 }}
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex" style={{ height: "calc(100vh - 64px)", backgroundColor: P.white }}>
      {/* ── Sidebar: Conversation List ── */}
      <div
        className={`w-full flex-col border-r md:w-96 ${
          showMobileChat ? "hidden md:flex" : "flex"
        }`}
        style={{ borderColor: "rgba(0,0,0,.08)", backgroundColor: P.white }}
      >
        {/* Header */}
        <div className="p-4" style={{ borderBottom: "1px solid rgba(0,0,0,.08)" }}>
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl" style={{ color: P.text, fontWeight: 700 }}>
              Messages
            </h1>
            <button
              className="rounded-lg p-2 transition-colors"
              style={{ color: "rgba(0,0,0,.45)" }}
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: "rgba(0,0,0,.30)" }}
            />
            <input
              type="text"
              placeholder="Search messages..."
              className="h-10 w-full rounded-xl border-0 pl-10 pr-4 text-sm outline-none"
              style={{ backgroundColor: P.faint, color: P.text }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ borderBottom: "1px solid rgba(0,0,0,.08)" }}>
          {["All", "Unread", "Archived"].map((tab, i) => (
            <button
              key={tab}
              className="flex-1 py-3 text-sm transition-colors"
              style={{
                color: i === 0 ? P.text : "rgba(0,0,0,.45)",
                fontWeight: i === 0 ? 600 : 400,
                borderBottom: i === 0 ? `2px solid ${P.dark}` : "2px solid transparent",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <Sailboat className="mx-auto mb-3 h-12 w-12" style={{ color: "rgba(0,0,0,.12)" }} />
              <p className="text-sm" style={{ color: "rgba(0,0,0,.45)" }}>
                No messages yet
              </p>
              <p className="mt-1 text-xs" style={{ color: "rgba(0,0,0,.30)" }}>
                Start a conversation by contacting a seller
              </p>
            </div>
          ) : (
            conversations.map((convo) => (
              <ConversationItem
                key={convo.id}
                convo={convo}
                isActive={convo.id === activeConvoId}
                onClick={() => {
                  setActiveConvoId(convo.id);
                  setShowMobileChat(true);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Chat Panel ── */}
      <div className={`flex flex-1 flex-col ${!showMobileChat ? "hidden md:flex" : "flex"}`}>
        {convoDetail ? (
          <>
            {/* Chat header */}
            <div
              className="flex h-16 items-center justify-between px-4"
              style={{
                borderBottom: "1px solid rgba(0,0,0,.08)",
                backgroundColor: P.white,
              }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="rounded-lg p-2 transition-colors md:hidden"
                  style={{ color: "rgba(0,0,0,.55)" }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: P.faint, border: "1px solid rgba(0,0,0,.08)" }}
                >
                  <Sailboat className="h-4 w-4" style={{ color: "rgba(0,0,0,.25)" }} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span style={{ color: P.text, fontWeight: 600 }}>
                      {convoDetail.otherUser?.name ?? "Unknown"}
                    </span>
                    {convoDetail.otherUser?.isVerified && (
                      <Shield className="h-4 w-4" style={{ color: P.green }} />
                    )}
                  </div>
                  {convoDetail.otherUser?.profileSlug && (
                    <Link
                      href={`/profile/${convoDetail.otherUser.profileSlug}`}
                      className="text-xs no-underline"
                      style={{ color: "rgba(0,0,0,.40)" }}
                    >
                      View profile
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="rounded-lg p-2 transition-colors"
                  style={{ color: "rgba(0,0,0,.40)" }}
                >
                  <Info className="h-5 w-5" />
                </button>
                <button
                  className="rounded-lg p-2 transition-colors"
                  style={{ color: "rgba(0,0,0,.40)" }}
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Listing context bar */}
            {convoDetail.listing && (
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  backgroundColor: P.faint,
                  borderBottom: "1px solid rgba(0,0,0,.06)",
                }}
              >
                <div
                  className="flex h-14 w-20 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "rgba(0,0,0,.06)" }}
                >
                  <Sailboat className="h-6 w-6" style={{ color: "rgba(0,0,0,.20)" }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm" style={{ color: P.text, fontWeight: 500 }}>
                    {convoDetail.listing.title}
                  </div>
                  <div className="text-sm" style={{ color: P.green, fontWeight: 700 }}>
                    {formatPrice(convoDetail.listing.priceCents, convoDetail.listing.currency)}
                  </div>
                </div>
                <Link
                  href={`/buy/${convoDetail.listing.slug}`}
                  className="rounded-lg border px-3 py-1.5 text-xs no-underline transition-colors"
                  style={{
                    borderColor: "rgba(0,0,0,.14)",
                    backgroundColor: P.white,
                    color: P.text,
                    fontWeight: 500,
                  }}
                >
                  View listing
                </Link>
              </div>
            )}

            {/* Messages */}
            <div
              className="flex-1 space-y-4 overflow-y-auto p-4"
              style={{ backgroundColor: P.white }}
            >
              {loadingMessages ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: "rgba(0,0,0,.25)" }} />
                </div>
              ) : (
                <>
                  {convoDetail.messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Compose */}
            <div className="p-4" style={{ borderTop: "1px solid rgba(0,0,0,.08)", backgroundColor: P.white }}>
              <div className="flex items-end gap-3">
                <div className="flex gap-1">
                  <button
                    className="rounded-lg p-2 transition-colors"
                    style={{ color: "rgba(0,0,0,.35)" }}
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button
                    className="rounded-lg p-2 transition-colors"
                    style={{ color: "rgba(0,0,0,.35)" }}
                  >
                    <ImageIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full resize-none rounded-2xl border-0 px-4 py-3 text-sm outline-none"
                    style={{ backgroundColor: P.faint, color: P.text }}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!messageText.trim() || sending}
                  className="rounded-xl p-3 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ backgroundColor: P.dark, color: P.accent }}
                >
                  {sending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ── Empty state ── */
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div
              className="mb-4 flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: P.faint, border: "1px solid rgba(0,0,0,.08)" }}
            >
              <Sailboat className="h-10 w-10" style={{ color: "rgba(0,0,0,.15)" }} />
            </div>
            <h3 className="mb-2 text-lg" style={{ color: P.text, fontWeight: 600 }}>
              {conversations.length > 0 ? "Select a conversation" : "No messages yet"}
            </h3>
            <p className="max-w-sm text-sm" style={{ color: "rgba(0,0,0,.45)" }}>
              {conversations.length > 0
                ? "Choose a conversation from the list to view messages"
                : "Start a conversation by contacting a seller on any listing"}
            </p>
            <Link
              href="/buy"
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm no-underline transition-all"
              style={{ backgroundColor: P.dark, color: P.accent, fontWeight: 600 }}
            >
              Browse boats
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}