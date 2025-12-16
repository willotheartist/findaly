"use client";

import React, { useState } from "react";

type ClaimListingPanelProps = {
  city: string;
  category: string;
  slug: string;
};

export function ClaimListingPanel({
  city,
  category,
  slug,
}: ClaimListingPanelProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/claim-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          website,
          message,
          city,
          category,
          slug,
        }),
      });

      const text = await res.text();
      let data: { ok?: boolean; error?: string } | null = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error("Server returned an unexpected response.");
      }

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to submit claim.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setWebsite("");
      setMessage("");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div id="claim" className="rounded-2xl bg-black p-4 text-sm text-white">
      <h2 className="text-sm font-semibold">Own this business?</h2>
      <p className="mt-2 text-sm text-neutral-200">
        Claim this listing to update details, add photos and see how many people
        view your profile each week.
      </p>

      <form onSubmit={handleSubmit} className="mt-3 space-y-2">
        <input
          required
          type="text"
          placeholder="Your name"
          className="w-full rounded-lg bg-(--color-surface) px-3 py-2 text-sm text-(--text) outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          required
          type="email"
          placeholder="Work email"
          className="w-full rounded-lg bg-(--color-surface) px-3 py-2 text-sm text-(--text) outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="url"
          placeholder="Business website"
          className="w-full rounded-lg bg-(--color-surface) px-3 py-2 text-sm text-(--text) outline-none"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <textarea
          placeholder="Anything we should know?"
          className="w-full min-h-[70px] rounded-lg bg-(--color-surface) px-3 py-2 text-sm text-(--text) outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-1 w-full rounded-xl bg-(--color-surface) px-4 py-2 text-sm font-medium text-(--text) transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Submitting..." : "Claim this listing"}
        </button>
      </form>

      {status === "success" && (
        <p className="mt-2 text-xs text-emerald-300">
          Thanks — we&apos;ve received your claim. We&apos;ll be in touch soon.
        </p>
      )}

      {status === "error" && (
        <p className="mt-2 text-xs text-red-300">
          {errorMessage || "Something went wrong. Please try again."}
        </p>
      )}

      <button className="mt-3 w-full rounded-xl border border-white/40 px-4 py-2 text-xs font-medium text-white/90 transition hover:-translate-y-0.5 hover:bg-(--color-surface)/10">
        Boost visibility (coming soon)
      </button>
    </div>
  );
}
