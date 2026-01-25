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
  Phone,
  Video,
  Info,
  CheckCheck,
  Sailboat,
  ArrowLeft,
  Filter,
  Loader2,
} from "lucide-react";

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

function formatPrice(cents: number | null, currency: string) {
  if (!cents) return "POA";
  const amount = cents / 100;
  const symbols: Record<string, string> = {
    EUR: "€",
    GBP: "£",
    USD: "$",
    AED: "AED ",
  };
  const symbol = symbols[currency] || "";
  return `${symbol}${amount.toLocaleString()}`;
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
      className={`w-full text-left p-4 border-b border-slate-100 transition-colors hover:bg-slate-50 ${
        isActive ? "bg-orange-50/50 border-l-2 border-l-[#ff6a00]" : ""
      }`}
    >
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <div className="h-12 w-12 rounded-full bg-linear-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-400">
            <Sailboat className="h-5 w-5" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className={`truncate text-sm ${
                  convo.unreadCount > 0 ? "font-semibold text-slate-900" : "font-medium text-slate-700"
                }`}
              >
                {convo.otherUser.name}
              </span>
              {convo.otherUser.isVerified && (
                <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
                </svg>
              )}
            </div>
            <span className={`text-xs shrink-0 ${convo.unreadCount > 0 ? "text-[#ff6a00] font-medium" : "text-slate-400"}`}>
              {formatTime(convo.lastMessage.createdAt)}
            </span>
          </div>

          <p className={`mt-1 text-sm truncate ${convo.unreadCount > 0 ? "text-slate-900" : "text-slate-500"}`}>
            {convo.lastMessage.isFromMe && <span className="text-slate-400">You: </span>}
            {convo.lastMessage.body}
          </p>

          {convo.listing && (
            <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-slate-50">
              <div className="h-8 w-8 rounded bg-slate-200 flex items-center justify-center">
                <Sailboat className="h-4 w-4 text-slate-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-slate-700 truncate">{convo.listing.title}</div>
                <div className="text-xs text-[#ff6a00] font-medium">
                  {formatPrice(convo.listing.priceCents, convo.listing.currency)}
                </div>
              </div>
            </div>
          )}
        </div>

        {convo.unreadCount > 0 && (
          <div className="shrink-0 h-5 min-w-5 px-1.5 rounded-full bg-[#ff6a00] flex items-center justify-center">
            <span className="text-xs font-semibold text-white">{convo.unreadCount}</span>
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
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
          isMe ? "bg-[#ff6a00] text-white rounded-br-md" : "bg-slate-100 text-slate-900 rounded-bl-md"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.body}</p>
        <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? "text-white/70" : "text-slate-400"}`}>
          <span className="text-xs">
            {new Date(message.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </span>
          {isMe && <CheckCheck className="h-3.5 w-3.5" />}
        </div>
      </div>
    </div>
  );
}

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

  if (loading) {
    return (
      <main className="flex h-[calc(100vh-64px)] items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex h-[calc(100vh-64px)] items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-slate-600 mb-4">{error}</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff6a00] text-sm font-semibold text-white hover:bg-[#e55f00] transition-colors"
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-[calc(100vh-64px)] bg-white">
      <div
        className={`w-full md:w-96 border-r border-slate-200 flex flex-col bg-white ${
          showMobileChat ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-900">Messages</h1>
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
              <Filter className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-100 text-sm outline-none border-0 focus:ring-2 focus:ring-[#ff6a00]/20 transition-all"
            />
          </div>
        </div>

        <div className="flex border-b border-slate-100">
          <button className="flex-1 py-3 text-sm font-medium text-[#ff6a00] border-b-2 border-[#ff6a00]">
            All
          </button>
          <button className="flex-1 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
            Unread
          </button>
          <button className="flex-1 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
            Archived
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <Sailboat className="h-12 w-12 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No messages yet</p>
              <p className="text-xs text-slate-400 mt-1">Start a conversation by contacting a seller</p>
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

      <div className={`flex-1 flex flex-col ${!showMobileChat ? "hidden md:flex" : "flex"}`}>
        {convoDetail ? (
          <>
            <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-slate-600" />
                </button>
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-400">
                  <Sailboat className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900">{convoDetail.otherUser?.name ?? "Unknown"}</span>
                    {convoDetail.otherUser?.isVerified && (
                      <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{convoDetail.otherUser?.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
                  <Info className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>

            {convoDetail.listing && (
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-20 rounded-lg bg-linear-to-br from-slate-200 to-slate-100 flex items-center justify-center">
                    <Sailboat className="h-6 w-6 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900">{convoDetail.listing.title}</div>
                    <div className="text-sm font-bold text-[#ff6a00]">
                      {formatPrice(convoDetail.listing.priceCents, convoDetail.listing.currency)}
                    </div>
                  </div>
                  <Link
                    href={`/buy/${convoDetail.listing.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:border-slate-300 transition-colors"
                  >
                    View listing
                  </Link>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
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

            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="flex items-end gap-3">
                <div className="flex gap-1">
                  <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
                    <ImageIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1 relative">
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
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 text-sm outline-none border-0 resize-none focus:ring-2 focus:ring-[#ff6a00]/20 transition-all"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!messageText.trim() || sending}
                  className="p-3 rounded-xl bg-[#ff6a00] text-white hover:bg-[#e55f00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Sailboat className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {conversations.length > 0 ? "Select a conversation" : "No messages yet"}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm">
              {conversations.length > 0
                ? "Choose a conversation from the list to view messages"
                : "Start a conversation by contacting a seller on any listing"}
            </p>
            <Link
              href="/buy"
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff6a00] text-sm font-semibold text-white hover:bg-[#e55f00] transition-colors"
            >
              Browse boats
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
