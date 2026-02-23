// app/messages/MessagesClient.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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

/* ─── palette (Messenger/IG-ish) ─── */
const P = {
  bg: "#ffffff",
  panel: "#ffffff",
  faint: "#f4f5f7",
  line: "rgba(0,0,0,.08)",
  text: "#111827",
  sub: "rgba(17,24,39,.70)",
  muted: "rgba(17,24,39,.45)",
  soft: "rgba(17,24,39,.08)",

  // Messenger blues
  brandBlue: "#1877F2",
  bubbleMe: "#1877F2",
  bubbleOther: "#f2f3f5",

  // Badges
  danger: "#ff3b30",
  success: "#22c55e",
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

function isNearBottom(el: HTMLElement, thresholdPx = 140) {
  const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
  return distance <= thresholdPx;
}

function scrollToBottom(el: HTMLElement, behavior: ScrollBehavior) {
  el.scrollTo({ top: el.scrollHeight, behavior });
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
      type="button"
      onClick={onClick}
      className="w-full text-left transition-colors"
      style={{
        padding: "14px 14px",
        borderBottom: `1px solid ${P.line}`,
        backgroundColor: isActive ? "rgba(24,119,242,.06)" : "transparent",
        borderLeft: isActive ? `3px solid ${P.brandBlue}` : "3px solid transparent",
      }}
    >
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: P.faint, border: `1px solid ${P.line}` }}
          >
            <Sailboat className="h-5 w-5" style={{ color: "rgba(0,0,0,.20)" }} />
          </div>
          {convo.unreadCount > 0 ? (
            <span
              style={{
                position: "absolute",
                right: -2,
                top: -2,
                minWidth: 18,
                height: 18,
                padding: "0 6px",
                borderRadius: 999,
                backgroundColor: P.danger,
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 800,
                border: "2px solid #fff",
              }}
            >
              {convo.unreadCount > 99 ? "99+" : convo.unreadCount}
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <span
                className="truncate text-sm"
                style={{
                  color: P.text,
                  fontWeight: convo.unreadCount > 0 ? 700 : 600,
                }}
              >
                {convo.otherUser.name}
              </span>
              {convo.otherUser.isVerified && (
                <Shield className="h-3.5 w-3.5 shrink-0" style={{ color: P.success }} />
              )}
            </div>
            <span
              className="shrink-0 text-xs"
              style={{
                color: convo.unreadCount > 0 ? P.text : P.muted,
                fontWeight: convo.unreadCount > 0 ? 700 : 500,
              }}
            >
              {formatTime(convo.lastMessage.createdAt)}
            </span>
          </div>

          <p
            className="mt-1 truncate text-sm"
            style={{ color: convo.unreadCount > 0 ? P.text : P.sub }}
          >
            {convo.lastMessage.isFromMe && (
              <span style={{ color: P.muted, fontWeight: 600 }}>You: </span>
            )}
            {convo.lastMessage.body}
          </p>

          {convo.listing && (
            <div
              className="mt-2 flex items-center gap-2 rounded-xl p-2"
              style={{ backgroundColor: P.faint, border: `1px solid ${P.line}` }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(0,0,0,.05)" }}
              >
                <Sailboat className="h-4 w-4" style={{ color: "rgba(0,0,0,.22)" }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs" style={{ color: P.text, fontWeight: 600 }}>
                  {convo.listing.title}
                </div>
                <div className="text-xs" style={{ color: P.brandBlue, fontWeight: 800 }}>
                  {formatPrice(convo.listing.priceCents, convo.listing.currency)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isMe = message.isFromMe;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[76%] px-4 py-2.5"
        style={{
          borderRadius: isMe ? "18px 18px 6px 18px" : "18px 18px 18px 6px",
          backgroundColor: isMe ? P.bubbleMe : P.bubbleOther,
          color: isMe ? "#fff" : P.text,
          boxShadow: isMe ? "0 1px 0 rgba(0,0,0,.06)" : "0 1px 0 rgba(0,0,0,.03)",
        }}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.body}</p>
        <div
          className="mt-1 flex items-center justify-end gap-1"
          style={{ color: isMe ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.35)" }}
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

  const searchParams = useSearchParams();

  const messagesScrollRef = useRef<HTMLDivElement | null>(null);
  const didInitialScrollRef = useRef(false);
  const shouldAutoScrollRef = useRef(true);

  const totalUnread = useMemo(
    () => conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0),
    [conversations]
  );

  // If URL has ?conversation=, open it
  useEffect(() => {
    const convoId = searchParams.get("conversation");
    if (convoId && !activeConvoId) {
      setActiveConvoId(convoId);
      setShowMobileChat(true);
    }
  }, [searchParams, activeConvoId]);

  // Load conversations
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

  // Load convo detail
  useEffect(() => {
    if (!activeConvoId) {
      setConvoDetail(null);
      didInitialScrollRef.current = false;
      return;
    }

    async function fetchMessages() {
      setLoadingMessages(true);
      try {
        const res = await fetch(`/api/messages/${activeConvoId}`);
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setConvoDetail(data);

        // Once convo opens, refresh conversations so unread pills update (readAt gets set server-side)
        const listRes = await fetch("/api/messages").catch(() => null);
        if (listRes?.ok) {
          const listData = await listRes.json();
          setConversations(listData);
        }
      } catch {
        // keep silent in UI for now
      } finally {
        setLoadingMessages(false);
        didInitialScrollRef.current = false; // allow initial snap after render
      }
    }

    fetchMessages();
  }, [activeConvoId]);

  // Track whether user is near bottom (so we don’t yank scroll around)
  useEffect(() => {
    const el = messagesScrollRef.current;
    if (!el) return;

    const onScroll = () => {
      shouldAutoScrollRef.current = isNearBottom(el, 140);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [convoDetail?.id]);

  // Smart auto-scroll:
  // - on first render of a conversation: snap to bottom (no smooth)
  // - on subsequent new messages: only scroll if user is already near bottom
  useEffect(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    if (!convoDetail) return;

    if (!didInitialScrollRef.current) {
      didInitialScrollRef.current = true;
      scrollToBottom(el, "auto");
      return;
    }

    if (shouldAutoScrollRef.current) {
      scrollToBottom(el, "smooth");
    }
  }, [convoDetail?.messages, convoDetail]);

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

      // append locally
      setConvoDetail((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, data.message],
            }
          : prev
      );

      // update list last message
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
                unreadCount: 0,
              }
            : c
        )
      );

      setMessageText("");

      // Always scroll after *you* send
      const el = messagesScrollRef.current;
      if (el) scrollToBottom(el, "smooth");
      shouldAutoScrollRef.current = true;
    } catch {
      // keep simple for now
    } finally {
      setSending(false);
    }
  };

  // ── Loading state ──
  if (loading) {
    return (
      <main
        className="flex items-center justify-center"
        style={{
          height: "calc(100vh - var(--site-header-offset, 64px))",
          backgroundColor: P.bg,
        }}
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
        style={{
          height: "calc(100vh - var(--site-header-offset, 64px))",
          backgroundColor: P.bg,
        }}
      >
        <div className="text-center">
          <p className="mb-4 text-sm" style={{ color: P.sub }}>
            {error}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm no-underline transition-all"
            style={{ backgroundColor: P.brandBlue, color: "#fff", fontWeight: 700 }}
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="mx-auto w-full max-w-7xl px-4 sm:px-6"
      style={{
        height: "calc(100vh - var(--site-header-offset, 64px))",
        backgroundColor: P.bg,
        paddingTop: 14,
        paddingBottom: 14,
      }}
    >
      <div
        className="grid h-full overflow-hidden rounded-2xl"
        style={{
          gridTemplateColumns: "380px 1fr",
          border: `1px solid ${P.line}`,
          backgroundColor: P.panel,
        }}
      >
        {/* ── Sidebar: Conversation List ── */}
        <div
          className={`h-full flex-col border-r ${showMobileChat ? "hidden md:flex" : "flex"}`}
          style={{ borderColor: P.line, backgroundColor: P.panel }}
        >
          {/* Header */}
          <div style={{ borderBottom: `1px solid ${P.line}` }}>
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl" style={{ color: P.text, fontWeight: 800 }}>
                    Messages
                  </h1>
                  {totalUnread > 0 ? (
                    <span
                      style={{
                        height: 22,
                        padding: "0 10px",
                        borderRadius: 999,
                        backgroundColor: "rgba(255,59,48,.12)",
                        color: P.danger,
                        fontSize: 12,
                        fontWeight: 800,
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      {totalUnread > 99 ? "99+" : totalUnread}
                    </span>
                  ) : null}
                </div>

                <button
                  type="button"
                  className="rounded-xl p-2 transition-colors"
                  style={{ color: P.muted, backgroundColor: "transparent" }}
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>

              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: "rgba(0,0,0,.35)" }}
                />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="h-10 w-full rounded-xl border-0 pl-10 pr-4 text-sm outline-none"
                  style={{ backgroundColor: P.faint, color: P.text }}
                />
              </div>
            </div>

            {/* Tabs (visual only for now) */}
            <div className="flex">
              {["All", "Unread", "Archived"].map((tab, i) => (
                <button
                  key={tab}
                  type="button"
                  className="flex-1 py-3 text-sm transition-colors"
                  style={{
                    color: i === 0 ? P.text : P.muted,
                    fontWeight: i === 0 ? 800 : 600,
                    borderBottom:
                      i === 0 ? `2px solid ${P.brandBlue}` : "2px solid transparent",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <Sailboat className="mx-auto mb-3 h-12 w-12" style={{ color: "rgba(0,0,0,.12)" }} />
                <p className="text-sm" style={{ color: P.sub }}>
                  No messages yet
                </p>
                <p className="mt-1 text-xs" style={{ color: P.muted }}>
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
        <div className={`h-full flex flex-1 flex-col ${!showMobileChat ? "hidden md:flex" : "flex"}`}>
          {convoDetail ? (
            <>
              {/* Chat header */}
              <div
                className="flex h-16 items-center justify-between px-4"
                style={{
                  borderBottom: `1px solid ${P.line}`,
                  backgroundColor: P.panel,
                }}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowMobileChat(false)}
                    className="rounded-xl p-2 transition-colors md:hidden"
                    style={{ color: P.sub }}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: P.faint, border: `1px solid ${P.line}` }}
                  >
                    <Sailboat className="h-4 w-4" style={{ color: "rgba(0,0,0,.22)" }} />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: P.text, fontWeight: 800 }}>
                        {convoDetail.otherUser?.name ?? "Unknown"}
                      </span>
                      {convoDetail.otherUser?.isVerified && (
                        <Shield className="h-4 w-4" style={{ color: P.success }} />
                      )}
                    </div>
                    {convoDetail.otherUser?.profileSlug && (
                      <Link
                        href={`/profile/${convoDetail.otherUser.profileSlug}`}
                        className="text-xs no-underline"
                        style={{ color: P.muted, fontWeight: 600 }}
                      >
                        View profile
                      </Link>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="rounded-xl p-2 transition-colors"
                    style={{ color: P.muted }}
                  >
                    <Info className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="rounded-xl p-2 transition-colors"
                    style={{ color: P.muted }}
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
                    borderBottom: `1px solid ${P.line}`,
                  }}
                >
                  <div
                    className="flex h-14 w-20 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "rgba(0,0,0,.05)" }}
                  >
                    <Sailboat className="h-6 w-6" style={{ color: "rgba(0,0,0,.20)" }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm" style={{ color: P.text, fontWeight: 700 }}>
                      {convoDetail.listing.title}
                    </div>
                    <div className="text-sm" style={{ color: P.brandBlue, fontWeight: 900 }}>
                      {formatPrice(convoDetail.listing.priceCents, convoDetail.listing.currency)}
                    </div>
                  </div>
                  <Link
                    href={`/buy/${convoDetail.listing.slug}`}
                    className="rounded-xl border px-3 py-1.5 text-xs no-underline transition-colors"
                    style={{
                      borderColor: "rgba(0,0,0,.14)",
                      backgroundColor: P.panel,
                      color: P.text,
                      fontWeight: 700,
                    }}
                  >
                    View listing
                  </Link>
                </div>
              )}

              {/* Messages */}
              <div
                ref={messagesScrollRef}
                className="flex-1 overflow-y-auto p-4"
                style={{
                  backgroundColor: P.bg,
                }}
              >
                {loadingMessages ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" style={{ color: "rgba(0,0,0,.25)" }} />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {convoDetail.messages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}
                  </div>
                )}
              </div>

              {/* Compose */}
              <div
                className="p-4"
                style={{ borderTop: `1px solid ${P.line}`, backgroundColor: P.panel }}
              >
                <div className="flex items-end gap-3">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="rounded-xl p-2 transition-colors"
                      style={{ color: P.muted }}
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="rounded-xl p-2 transition-colors"
                      style={{ color: P.muted }}
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
                      style={{
                        backgroundColor: P.faint,
                        color: P.text,
                        boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)",
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!messageText.trim() || sending}
                    className="rounded-2xl p-3 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: P.brandBlue, color: "#fff" }}
                  >
                    {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ── Empty state ── */
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div
                className="mb-4 flex h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: P.faint, border: `1px solid ${P.line}` }}
              >
                <Sailboat className="h-10 w-10" style={{ color: "rgba(0,0,0,.15)" }} />
              </div>
              <h3 className="mb-2 text-lg" style={{ color: P.text, fontWeight: 800 }}>
                {conversations.length > 0 ? "Select a conversation" : "No messages yet"}
              </h3>
              <p className="max-w-sm text-sm" style={{ color: P.sub }}>
                {conversations.length > 0
                  ? "Choose a conversation from the list to view messages."
                  : "Start a conversation by contacting a seller on any listing."}
              </p>
              <Link
                href="/buy"
                className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm no-underline transition-all"
                style={{ backgroundColor: P.brandBlue, color: "#fff", fontWeight: 800 }}
              >
                Browse boats
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}