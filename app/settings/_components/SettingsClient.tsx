// app/settings/_components/SettingsClient.tsx
"use client";

import Link from "next/link";
import * as React from "react";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  User,
  Image as ImageIcon,
} from "lucide-react";

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

type ProfileDTO = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  location: string | null;
  about: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  isVerified: boolean;
  avatarUrl?: string | null;
  companyLogoUrl?: string | null;
};

type Props = {
  profiles: ProfileDTO[];
  activeSlug: string;
};

export default function SettingsClient({ profiles, activeSlug }: Props) {
  const activeProfile = useMemo(() => {
    return profiles.find((p) => p.slug === activeSlug) ?? profiles[0];
  }, [profiles, activeSlug]);

  // Match listing vibe: dark green + warm yellow
  const brandDark = "#0a211f";
  const brandAccent = "#fff86c";

  const [profileSlug] = useState(activeProfile.slug);

  const [name, setName] = useState(activeProfile.name ?? "");
  const [tagline, setTagline] = useState(activeProfile.tagline ?? "");
  const [location, setLocation] = useState(activeProfile.location ?? "");
  const [website, setWebsite] = useState(activeProfile.website ?? "");
  const [email, setEmail] = useState(activeProfile.email ?? "");
  const [phone, setPhone] = useState(activeProfile.phone ?? "");
  const [about, setAbout] = useState(activeProfile.about ?? "");

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    activeProfile.avatarUrl ?? null
  );
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(
    activeProfile.companyLogoUrl ?? null
  );

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const onSwitchProfile = (slug: string) => {
    window.location.href = `/settings?profile=${encodeURIComponent(slug)}`;
  };

  async function uploadAndSave(file: File, field: "avatarUrl" | "companyLogoUrl") {
    setErr(null);
    setOk(false);
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const uploadJson: unknown = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok) {
        const msg =
          typeof uploadJson === "object" && uploadJson !== null && "error" in uploadJson
            ? String((uploadJson as { error?: unknown }).error ?? "UPLOAD_FAILED")
            : "UPLOAD_FAILED";
        throw new Error(msg);
      }

      const url =
        typeof uploadJson === "object" && uploadJson !== null && "url" in uploadJson
          ? String((uploadJson as { url?: unknown }).url ?? "")
          : "";

      if (!url) throw new Error("UPLOAD_NO_URL");

      const patchRes = await fetch("/api/profile/media", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          profileId: activeProfile.id,
          [field]: url,
        }),
      });

      const patchJson: unknown = await patchRes.json().catch(() => ({}));
      if (!patchRes.ok) {
        const msg =
          typeof patchJson === "object" && patchJson !== null && "error" in patchJson
            ? String((patchJson as { error?: unknown }).error ?? "SAVE_FAILED")
            : "SAVE_FAILED";
        throw new Error(msg);
      }

      const profileObj =
        typeof patchJson === "object" && patchJson !== null && "profile" in patchJson
          ? (patchJson as { profile?: unknown }).profile
          : null;

      const nextAvatar =
        typeof profileObj === "object" && profileObj !== null && "avatarUrl" in profileObj
          ? (profileObj as { avatarUrl?: unknown }).avatarUrl
          : null;

      const nextLogo =
        typeof profileObj === "object" && profileObj !== null && "companyLogoUrl" in profileObj
          ? (profileObj as { companyLogoUrl?: unknown }).companyLogoUrl
          : null;

      if (field === "avatarUrl") setAvatarUrl(typeof nextAvatar === "string" ? nextAvatar : url);
      if (field === "companyLogoUrl")
        setCompanyLogoUrl(typeof nextLogo === "string" ? nextLogo : url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "UPLOAD_FAILED");
    } finally {
      setSaving(false);
    }
  }

  function ImageDrop({
    label,
    value,
    onPick,
    onClear,
  }: {
    label: string;
    value: string | null;
    onPick: (file: File) => void;
    onClear: () => void;
  }) {
    return (
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-slate-900">{label}</div>
          {value ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Clear
            </button>
          ) : null}
        </div>

        <label className="block">
          <div
            className="flex h-32 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition hover:border-slate-300"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) onPick(f);
            }}
          >
            {value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="h-full w-full object-contain p-3" />
            ) : (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <ImageIcon className="h-4 w-4" />
                Drag & drop or click
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPick(f);
              }}
            />
          </div>

          {value ? (
            <div className="mt-2 truncate text-xs text-slate-500">{value}</div>
          ) : null}
        </label>
      </div>
    );
  }

  const onSave = async () => {
    setErr(null);
    setOk(false);
    setSaving(true);

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug: profileSlug,
          name: name.trim(),
          tagline: tagline.trim() || null,
          location: location.trim() || null,
          website: website.trim() || null,
          email: email.trim() || null,
          phone: phone.trim() || null,
          about: about.trim() || null,
        }),
      });

      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const maybeErr =
          typeof data === "object" && data !== null && "error" in data
            ? (data as { error?: unknown }).error
            : undefined;
        setErr(String(maybeErr ?? "SAVE_FAILED"));
        setSaving(false);
        return;
      }

      setOk(true);
      setSaving(false);
    } catch {
      setErr("NETWORK_ERROR");
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Top header (premium, like listing page spacing) */}
      <div className="border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "rgba(10,33,31,.06)" }}
                >
                  <User className="h-5 w-5" style={{ color: brandDark }} />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Settings
                  </h1>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Shield className="h-4 w-4 text-slate-400" />
                      Profile management
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <BadgeCheck
                        className="h-4 w-4"
                        style={{ color: activeProfile.isVerified ? "#2196F3" : "#cbd5e1" }}
                      />
                      {activeProfile.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </div>
              </div>

              {/* underline bar like listing page */}
              <div
                className="mt-5 h-[3px] w-20 rounded-full"
                style={{ backgroundColor: "#1a7a5c" }}
              />
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              <Link
                href={`/profile/${activeProfile.slug}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 no-underline shadow-sm transition hover:border-slate-300"
              >
                View profile
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </Link>

              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className={cx(
                  "inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
                  saving && "opacity-70"
                )}
                style={{
                  backgroundColor: brandDark,
                  color: brandAccent,
                }}
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving" : "Save"}
              </button>
            </div>
          </div>

          {/* profile switcher */}
          {profiles.length > 1 ? (
            <div className="mt-7 grid gap-2 sm:max-w-lg">
              <div className="text-sm font-semibold text-slate-900">Editing profile</div>
              <select
                value={activeProfile.slug}
                onChange={(e) => onSwitchProfile(e.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-300"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.slug}>
                    {p.name} — /profile/{p.slug}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {err ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {err}
            </div>
          ) : null}

          {ok ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              Saved.
            </div>
          ) : null}
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left column */}
          <div className="lg:col-span-8">
            {/* Media */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-lg font-semibold text-slate-900">Profile images</div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <ImageDrop
                  label="Avatar"
                  value={avatarUrl}
                  onPick={(f) => uploadAndSave(f, "avatarUrl")}
                  onClear={() => setAvatarUrl(null)}
                />
                <ImageDrop
                  label="Company logo"
                  value={companyLogoUrl}
                  onPick={(f) => uploadAndSave(f, "companyLogoUrl")}
                  onClear={() => setCompanyLogoUrl(null)}
                />
              </div>
              <div className="mt-3 text-xs text-slate-500">
                Logos look best as transparent PNGs. (No stress if not.)
              </div>
            </div>

            {/* Basics */}
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-lg font-semibold text-slate-900">Basics</div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-slate-900">
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                    placeholder="Your name"
                  />
                  <div className="mt-2 text-xs text-slate-500">
                    Public URL: <span className="font-semibold">/profile/{activeProfile.slug}</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-slate-900">
                    Tagline
                  </label>
                  <input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                    placeholder="Broker / Dealer / Shipyard…"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-slate-900">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-lg font-semibold text-slate-900">About</div>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={7}
                className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                placeholder="Short, clear description of who you are and what you sell."
              />
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-4">
            {/* Contact */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-lg font-semibold text-slate-900">Contact</div>

              <div className="mt-5 grid gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-900">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                      placeholder="https://…"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-900">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                      placeholder="you@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-900">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                      placeholder="+44…"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="p-6">
                <button
                  type="button"
                  onClick={onSave}
                  disabled={saving}
                  className={cx(
                    "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    saving && "opacity-70"
                  )}
                  style={{ backgroundColor: brandDark, color: brandAccent }}
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving" : "Save changes"}
                </button>

                <div className="mt-3 text-center text-sm text-slate-600">
                  Public profile{" "}
                  <Link
                    href={`/profile/${activeProfile.slug}`}
                    className="font-semibold text-slate-900 no-underline hover:underline"
                  >
                    /profile/{activeProfile.slug}
                  </Link>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50 p-6">
                <Link
                  href="/upgrade"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 no-underline shadow-sm transition hover:border-slate-300"
                >
                  Upgrade plan
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </Link>
              </div>
            </div>

            {/* tiny helper */}
            <div className="mt-6 text-center text-sm text-slate-600">
              Need help?{" "}
              <Link href="/contact" className="font-semibold text-slate-900 no-underline hover:underline">
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </div>

      <input type="hidden" value={profileSlug} readOnly />
    </main>
  );
}