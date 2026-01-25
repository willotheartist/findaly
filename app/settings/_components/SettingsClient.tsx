//·app/settings/_components/SettingsClient.tsx
"use client";

import Link from "next/link";
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
};

type Props = {
  profiles: ProfileDTO[];
  activeSlug: string;
};

export default function SettingsClient({ profiles, activeSlug }: Props) {
  const activeProfile = useMemo(() => {
    return profiles.find((p) => p.slug === activeSlug) ?? profiles[0];
  }, [profiles, activeSlug]);

  // Accent: simple + consistent. (No “account-type pills”, no rainbow UI.)
  const accent = "#ff6a00";

  const [profileSlug] = useState(activeProfile.slug);

  const [name, setName] = useState(activeProfile.name ?? "");
  const [tagline, setTagline] = useState(activeProfile.tagline ?? "");
  const [location, setLocation] = useState(activeProfile.location ?? "");
  const [website, setWebsite] = useState(activeProfile.website ?? "");
  const [email, setEmail] = useState(activeProfile.email ?? "");
  const [phone, setPhone] = useState(activeProfile.phone ?? "");
  const [about, setAbout] = useState(activeProfile.about ?? "");

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  // If user switches profile dropdown, jump to /settings?profile=...
  const onSwitchProfile = (slug: string) => {
    window.location.href = `/settings?profile=${encodeURIComponent(slug)}`;
  };

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
        const maybeErr = typeof data === "object" && data !== null && "error" in data ? (data as { error?: unknown }).error : undefined;
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
    <main className="w-full bg-white">
      {/* Top */}
      <section className="relative w-full overflow-hidden bg-linear-to-br from-slate-50 via-white to-orange-50/30">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full opacity-25 blur-3xl"
            style={{ backgroundColor: accent }}
          />
          <div className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-3xl" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="settings-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#settings-grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-12">
          <div className="mb-4 text-sm text-slate-600">
            <Link href="/" className="no-underline hover:text-slate-900">
              Home
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="font-semibold text-slate-900">Settings</span>
          </div>

          {/* Header card */}
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
            <div className="p-6 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200/80">
                    <User className="h-6 w-6 text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Profile settings</h1>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <Shield className="h-4 w-4 text-slate-400" />
                        Signed in
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <BadgeCheck
                          className="h-4 w-4"
                          style={{ color: activeProfile.isVerified ? accent : "#94a3b8" }}
                        />
                        {activeProfile.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Link
                    href="/upgrade"
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 no-underline shadow-sm transition hover:border-slate-300"
                  >
                    <Building2 className="h-4 w-4 text-slate-400" />
                    Upgrade
                  </Link>

                  <button
                    type="button"
                    onClick={onSave}
                    disabled={saving}
                    className={cx(
                      "inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110",
                      saving && "opacity-70"
                    )}
                    style={{ backgroundColor: accent }}
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving" : "Save"}
                  </button>
                </div>
              </div>

              {/* Profile selector (only if multiple) */}
              {profiles.length > 1 ? (
                <div className="mt-5 grid gap-2 sm:max-w-md">
                  <div className="text-sm font-semibold text-slate-900">Editing</div>
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
                <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {err}
                </div>
              ) : null}

              {ok ? (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  Saved.
                </div>
              ) : null}
            </div>

            <div className="border-t border-slate-100 bg-slate-50 p-4 sm:p-5">
              <div className="text-sm text-slate-600">
                Public profile:{" "}
                <Link
                  href={`/profile/${activeProfile.slug}`}
                  className="font-semibold text-slate-900 no-underline hover:text-slate-900"
                >
                  /profile/{activeProfile.slug}
                </Link>
              </div>
            </div>
          </div>

          <div className="h-10" />
        </div>
      </section>

      {/* Content */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left */}
            <div className="lg:col-span-8">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="text-lg font-bold text-slate-900">Basics</div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-900">Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                      placeholder="William M"
                    />
                    <div className="mt-2 text-xs text-slate-500">
                      URL stays as <span className="font-semibold">/profile/{activeProfile.slug}</span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-900">Tagline</label>
                    <input
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                      placeholder="Broker / Dealer / Shipyard…"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-900">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                        placeholder="Beirut, Lebanon"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="text-lg font-bold text-slate-900">About</div>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={6}
                  className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                  placeholder="Short, punchy bio."
                />
              </div>
            </div>

            {/* Right */}
            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="text-lg font-bold text-slate-900">Contact</div>

                <div className="mt-5 grid gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-900">Website</label>
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
                    <label className="mb-1.5 block text-sm font-semibold text-slate-900">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                        placeholder="you@…"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-900">Phone</label>
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

              <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                <div className="p-6">
                  <button
                    type="button"
                    onClick={onSave}
                    disabled={saving}
                    className={cx(
                      "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110",
                      saving && "opacity-70"
                    )}
                    style={{ backgroundColor: accent }}
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving" : "Save changes"}
                  </button>

                  <div className="mt-3 text-center text-sm text-slate-600">
                    <Link
                      href={`/profile/${activeProfile.slug}`}
                      className="font-semibold text-slate-900 no-underline hover:text-slate-900"
                    >
                      View profile
                    </Link>
                  </div>
                </div>

                <div className="border-t border-slate-100 bg-slate-50 p-6">
                  <Link
                    href="/upgrade"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 no-underline shadow-sm transition hover:border-slate-300"
                  >
                    Upgrade plan
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-slate-600">
                <Link href="/contact" className="font-semibold text-slate-900 no-underline hover:text-[#ff6a00]">
                  Contact support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* keep slug in payload */}
      <input type="hidden" value={profileSlug} readOnly />
    </main>
  );
}
