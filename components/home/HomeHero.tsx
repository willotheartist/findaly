// components/home/HomeHero.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  MapPin,
  Search,
  Briefcase,
  X,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";

/* ============================================
   CONFIGURATION
============================================ */

const HERO_MODES = [
  {
    id: "buy",
    label: "Buy",
    headlineStart: "Find your",
    headlineAccent: "dream",
    headlineEnd: "yacht",
    sub: "10,000+ boats from trusted brokers & private sellers worldwide.",
    image: "/hero-buy.jpg",
    tabBg: "#5B7CFF",
    tabText: "#ffffff",
  },
  {
    id: "sell",
    label: "Sell",
    headlineStart: "List your",
    headlineAccent: "boat",
    headlineEnd: "today",
    sub: "Reach millions of buyers. Simple listing, powerful exposure.",
    image: "/hero-sell.jpg",
    tabBg: "#7CFFB2",
    tabText: "#0B0F14",
  },
  {
    id: "charter",
    label: "Charter",
    headlineStart: "Find your",
    headlineAccent: "dream",
    headlineEnd: "yacht",
    sub: "Day trips to week-long adventures. Crewed or bareboat.",
    image: "/hero-charter.jpg",
    tabBg: "#F4F4F4",
    tabText: "#0B0F14",
  },
  {
    id: "pros",
    label: "Professionals",
    headlineStart: "Find marine",
    headlineAccent: "pros",
    headlineEnd: "",
    sub: "Brokers, surveyors, captains, finance & insurance specialists.",
    image: "/hero-pros.jpg",
    tabBg: "#1F2430",
    tabText: "#ffffff",
  },
] as const;

type HeroMode = (typeof HERO_MODES)[number];
type PanelKey = "none" | "location" | "checkin" | "checkout" | "guests";

/* ============================================
   DATE HELPERS
============================================ */

function atMidnight(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBefore(a: Date, b: Date) {
  return a.getTime() < b.getTime();
}

function isAfter(a: Date, b: Date) {
  return a.getTime() > b.getTime();
}

function addMonths(d: Date, n: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

function startOfMonth(d: Date) {
  return atMidnight(new Date(d.getFullYear(), d.getMonth(), 1));
}

function endOfMonth(d: Date) {
  return atMidnight(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}

function startOfWeek(d: Date) {
  const x = atMidnight(d);
  const day = x.getDay();
  const mondayIndex = (day + 6) % 7;
  x.setDate(x.getDate() - mondayIndex);
  return x;
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function fmtShort(d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function monthLabel(d: Date) {
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function daysGrid(month: Date) {
  const s = startOfWeek(startOfMonth(month));
  const e = endOfMonth(month);
  const last = startOfWeek(addDays(e, 6));
  const out: Date[] = [];
  for (let cur = s; cur.getTime() <= last.getTime(); cur = addDays(cur, 1)) {
    out.push(cur);
  }
  return out;
}

/* ============================================
   POPULAR LOCATIONS DATA
============================================ */

const POPULAR_LOCATIONS = [
  { name: "French Riviera", country: "France", emoji: "🇫🇷" },
  { name: "Balearic Islands", country: "Spain", emoji: "🇪🇸" },
  { name: "Greek Islands", country: "Greece", emoji: "🇬🇷" },
  { name: "Croatian Coast", country: "Croatia", emoji: "🇭🇷" },
  { name: "Amalfi Coast", country: "Italy", emoji: "🇮🇹" },
  { name: "Caribbean", country: "Multiple", emoji: "🌴" },
  { name: "British Virgin Islands", country: "BVI", emoji: "🇻🇬" },
  { name: "Thailand", country: "Asia", emoji: "🇹🇭" },
];

/* ============================================
   MAIN HERO COMPONENT
============================================ */

export default function HomeHero() {
  const [activeMode, setActiveMode] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const mode = HERO_MODES[activeMode];

  const changeMode = useCallback(
    (index: number) => {
      if (index === activeMode) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveMode(index);
        setIsTransitioning(false);
      }, 150);
    },
    [activeMode]
  );

  return (
    <section className="relative w-full px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-3xl">
        {/* Background Images */}
        {HERO_MODES.map((m, i) => (
          <div
            key={m.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              i === activeMode ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={m.image}
              alt={m.label}
              fill
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/50" />

        {/* Content */}
        <div
          className="relative flex flex-col items-center justify-center px-4"
          style={{
            // More “VH aware” spacing so the hero feels airy and consistent
            paddingTop: "clamp(3rem, 6vh, 4rem)",
            paddingBottom: "clamp(12rem, 18vh, 15rem)", // leaves room for the bar
            minHeight: "clamp(520px, 72vh, 660px)",
          }}
        >
          <div
            className={`text-center transition-all duration-200 ${
              isTransitioning
                ? "translate-y-2 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            {/* Main Headline */}
            <h1
              className="mx-auto max-w-5xl text-[42px] leading-[0.95] tracking-tight text-white sm:text-[60px] lg:text-[82px]"
              style={{
                fontFamily: '"Inter Tight", "Inter", system-ui, sans-serif',
                fontWeight: 500,
                textShadow: "0 2px 32px rgba(0,0,0,0.4)",
              }}
            >
              {mode.headlineStart}{" "}
              <span
                style={{
                  fontFamily:
                    '"Instrument Serif", "Times New Roman", Georgia, serif',
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                {mode.headlineAccent}
              </span>{" "}
              {mode.headlineEnd}
            </h1>

            {/* Subtitle */}
            <p
              className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed sm:text-[20px]"
              style={{
                fontFamily: '"Inter Tight", "Inter", system-ui, sans-serif',
                fontWeight: 400,
                color: "#E7FF63",
                textShadow: "0 1px 16px rgba(0,0,0,0.4)",
              }}
            >
              {mode.sub}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <HeroSearchBar
          mode={mode}
          activeMode={activeMode}
          onChangeMode={changeMode}
        />
      </div>
    </section>
  );
}

/* ============================================
   SEARCH BAR COMPONENT
============================================ */

function HeroSearchBar({
  mode,
  activeMode,
  onChangeMode,
}: {
  mode: HeroMode;
  activeMode: number;
  onChangeMode: (i: number) => void;
}) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);

  // Panel state
  const [openPanel, setOpenPanel] = useState<PanelKey>("none");

  // Charter state
  const [charterLocation, setCharterLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(2);

  // Buy state
  const [buyQuery, setBuyQuery] = useState("");
  const [buyLocation, setBuyLocation] = useState("");

  // Pros state
  const [prosService, setProsService] = useState("");
  const [prosLocation, setProsLocation] = useState("");

  // Close panel on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpenPanel("none");
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPanel("none");
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Handle search submit
  const handleSearch = () => {
    setOpenPanel("none");

    if (mode.id === "charter") {
      const params = new URLSearchParams();
      if (charterLocation) params.set("location", charterLocation);
      if (checkIn) params.set("checkin", checkIn.toISOString().slice(0, 10));
      if (checkOut) params.set("checkout", checkOut.toISOString().slice(0, 10));
      if (guests) params.set("guests", String(guests));
      router.push(`/charter${params.toString() ? `?${params}` : ""}`);
    } else if (mode.id === "buy") {
      const params = new URLSearchParams();
      if (buyQuery) params.set("q", buyQuery);
      if (buyLocation) params.set("location", buyLocation);
      router.push(`/buy${params.toString() ? `?${params}` : ""}`);
    } else if (mode.id === "pros") {
      const params = new URLSearchParams();
      if (prosService) params.set("service", prosService);
      if (prosLocation) params.set("location", prosLocation);
      router.push(`/services${params.toString() ? `?${params}` : ""}`);
    }
  };

  // Select location from suggestions
  const selectLocation = (location: string) => {
    if (mode.id === "charter") {
      setCharterLocation(location);
    } else if (mode.id === "buy") {
      setBuyLocation(location);
    } else if (mode.id === "pros") {
      setProsLocation(location);
    }
    // Auto-advance to next field for charter
    if (mode.id === "charter") {
      setOpenPanel("checkin");
    } else {
      setOpenPanel("none");
    }
  };

  // Date selection handler
  const handleDateSelect = (date: Date) => {
    if (openPanel === "checkin") {
      setCheckIn(date);
      setOpenPanel("checkout");
    } else if (openPanel === "checkout") {
      if (checkIn && isBefore(date, checkIn)) {
        setCheckOut(checkIn);
        setCheckIn(date);
      } else {
        setCheckOut(date);
      }
      setOpenPanel("guests");
    }
  };

  return (
    <div
      ref={wrapRef}
      className="absolute bottom-6 left-1/2 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 sm:bottom-8 sm:w-[calc(100%-3rem)]"
    >
      {/* Tabs (attached look) */}
      <div className="relative z-10 flex justify-center">
        <div className="flex overflow-hidden rounded-t-2xl">
          {HERO_MODES.map((m, i) => {
            const isActive = i === activeMode;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setOpenPanel("none");
                  onChangeMode(i);
                }}
                className="relative px-7 py-3 text-[14px] font-medium transition-all sm:px-10 sm:text-[15px]"
                style={{
                  fontFamily: '"Inter Tight", "Inter", system-ui, sans-serif',
                  backgroundColor: m.tabBg,
                  color: m.tabText,
                  transform: isActive ? "translateY(0)" : "translateY(6px)",
                  opacity: isActive ? 1 : 0.92,
                  zIndex: isActive ? 20 : 10,
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Search Bar (no shadows, premium border) */}
      <div
        className="relative z-20 overflow-hidden bg-white"
        style={{
          marginTop: -1,
          borderRadius: 28, // more “Airbnb pill” radius
          border: "1px solid rgba(15,23,42,0.10)",
        }}
      >
        {mode.id === "sell" ? (
          /* Sell Mode - Simple CTA */
          <div className="flex items-center justify-between px-6 py-6 sm:px-8 sm:py-7">
            <div>
              <div
                className="text-[15px] font-semibold text-slate-900 sm:text-[16px]"
                style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
              >
                Ready to sell your boat?
              </div>
              <div
                className="mt-1 text-[13px] text-slate-500 sm:text-[14px]"
                style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
              >
                Create a listing in minutes. Free for private sellers.
              </div>
            </div>
            <Link
              href="/add-listing"
              className="ml-4 shrink-0 rounded-full bg-[#7CFFB2] px-5 py-2.5 text-[13px] font-semibold text-slate-900 transition-all hover:brightness-95 sm:px-6 sm:py-3 sm:text-[14px]"
              style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
            >
              Create a listing
            </Link>
          </div>
        ) : (
          /* Buy / Charter / Pros Mode */
          <div className="flex items-stretch">
            {/* Fields */}
            <div className="flex flex-1 flex-col sm:flex-row">
              {mode.id === "buy" && (
                <>
                  <SearchField
                    label="Search"
                    placeholder="Brand, model, keyword..."
                    value={buyQuery}
                    onChange={setBuyQuery}
                    icon={<Search className="h-4 w-4" />}
                    isActive={false}
                    onClick={() => setOpenPanel("none")}
                    hasDivider
                  />
                  <SearchField
                    label="Location"
                    placeholder="Anywhere"
                    value={buyLocation}
                    onChange={setBuyLocation}
                    icon={<MapPin className="h-4 w-4" />}
                    isActive={openPanel === "location"}
                    onClick={() =>
                      setOpenPanel(
                        openPanel === "location" ? "none" : "location"
                      )
                    }
                    hasDivider={false}
                  />
                </>
              )}

              {mode.id === "charter" && (
                <>
                  <SearchField
                    label="Location"
                    placeholder="Where are you going?"
                    value={charterLocation}
                    onChange={setCharterLocation}
                    icon={<MapPin className="h-4 w-4" />}
                    isActive={openPanel === "location"}
                    onClick={() =>
                      setOpenPanel(
                        openPanel === "location" ? "none" : "location"
                      )
                    }
                    hasDivider
                    className="flex-[1.3]"
                  />

                  <SearchFieldButton
                    label="Check-in"
                    value={checkIn ? fmtShort(checkIn) : "Add dates"}
                    isEmpty={!checkIn}
                    isActive={openPanel === "checkin"}
                    onClick={() =>
                      setOpenPanel(openPanel === "checkin" ? "none" : "checkin")
                    }
                    hasDivider
                  />

                  <SearchFieldButton
                    label="Check-out"
                    value={checkOut ? fmtShort(checkOut) : "Add dates"}
                    isEmpty={!checkOut}
                    isActive={openPanel === "checkout"}
                    onClick={() =>
                      setOpenPanel(
                        openPanel === "checkout" ? "none" : "checkout"
                      )
                    }
                    hasDivider
                  />

                  <SearchFieldButton
                    label="Guests"
                    value={
                      guests > 0
                        ? `${guests} guest${guests !== 1 ? "s" : ""}`
                        : "Add guests"
                    }
                    isEmpty={guests === 0}
                    isActive={openPanel === "guests"}
                    onClick={() =>
                      setOpenPanel(openPanel === "guests" ? "none" : "guests")
                    }
                    hasDivider={false}
                  />
                </>
              )}

              {mode.id === "pros" && (
                <>
                  <SearchFieldSelect
                    label="Service"
                    value={prosService}
                    onChange={setProsService}
                    icon={<Briefcase className="h-4 w-4" />}
                    options={[
                      { value: "", label: "All services" },
                      { value: "broker", label: "Yacht Broker" },
                      { value: "surveyor", label: "Marine Surveyor" },
                      { value: "captain", label: "Captain / Crew" },
                      { value: "mechanic", label: "Marine Mechanic" },
                      { value: "detailing", label: "Yacht Detailing" },
                      { value: "transport", label: "Boat Transport" },
                      { value: "insurance", label: "Marine Insurance" },
                      { value: "finance", label: "Yacht Finance" },
                    ]}
                    hasDivider
                  />
                  <SearchField
                    label="Location"
                    placeholder="City or region"
                    value={prosLocation}
                    onChange={setProsLocation}
                    icon={<MapPin className="h-4 w-4" />}
                    isActive={openPanel === "location"}
                    onClick={() =>
                      setOpenPanel(
                        openPanel === "location" ? "none" : "location"
                      )
                    }
                    hasDivider={false}
                  />
                </>
              )}
            </div>

            {/* Search Button (bigger, like your design) */}
            <div className="flex items-center pr-4">
              <button
                type="button"
                onClick={handleSearch}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5BC0EB] text-white transition-all hover:brightness-95 active:scale-95"
                aria-label="Search"
              >
                <Search className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}

        {/* Panels */}
        {openPanel === "location" && mode.id !== "sell" && (
          <LocationPanel
            onSelect={selectLocation}
            onClose={() => setOpenPanel("none")}
          />
        )}

        {(openPanel === "checkin" || openPanel === "checkout") && (
          <DatePanel
            selectedDate={openPanel === "checkin" ? checkIn : checkOut}
            minDate={openPanel === "checkout" ? checkIn : null}
            onSelect={handleDateSelect}
            onClose={() => setOpenPanel("none")}
            title={
              openPanel === "checkin"
                ? "Select check-in date"
                : "Select check-out date"
            }
          />
        )}

        {openPanel === "guests" && (
          <GuestsPanel
            value={guests}
            onChange={setGuests}
            onClose={() => setOpenPanel("none")}
          />
        )}
      </div>
    </div>
  );
}

/* ============================================
   SEARCH FIELD COMPONENTS
============================================ */

function SearchField({
  label,
  placeholder,
  value,
  onChange,
  icon,
  isActive,
  onClick,
  hasDivider,
  className = "",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  hasDivider: boolean;
  className?: string;
}) {
  return (
    <div className={`flex-1 ${className}`}>
      <div className="relative h-[84px]">
        {/* Divider (Airbnb style) */}
        {hasDivider ? (
          <div className="pointer-events-none absolute right-0 top-1/2 h-11 w-px -translate-y-1/2 bg-slate-200" />
        ) : null}

        <div
          className={`flex h-full cursor-text items-center gap-3 px-6 transition-colors ${
            isActive ? "bg-slate-50/60" : "hover:bg-slate-50/40"
          }`}
          onClick={onClick}
        >
          <div className="shrink-0 text-slate-400">{icon}</div>

          <div className="min-w-0 flex-1">
            <div
              className="text-[12px] font-semibold text-slate-900"
              style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
            >
              {label}
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="mt-1 w-full bg-transparent text-[15px] font-medium text-slate-700 placeholder:text-slate-500 focus:outline-none"
              style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchFieldButton({
  label,
  value,
  isEmpty,
  isActive,
  onClick,
  hasDivider,
}: {
  label: string;
  value: string;
  isEmpty: boolean;
  isActive: boolean;
  onClick: () => void;
  hasDivider: boolean;
}) {
  return (
    <div className="flex-1">
      <div className="relative h-[84px]">
        {hasDivider ? (
          <div className="pointer-events-none absolute right-0 top-1/2 h-11 w-px -translate-y-1/2 bg-slate-200" />
        ) : null}

        <button
          type="button"
          className={`flex h-full w-full items-center px-6 text-left transition-colors ${
            isActive ? "bg-slate-50/60" : "hover:bg-slate-50/40"
          }`}
          onClick={onClick}
        >
          <div className="min-w-0 flex-1">
            <div
              className="text-[12px] font-semibold text-slate-900"
              style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
            >
              {label}
            </div>
            <div
              className={`mt-1 truncate text-[15px] font-medium ${
                isEmpty ? "text-slate-500" : "text-slate-700"
              }`}
              style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
            >
              {value}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

function SearchFieldSelect({
  label,
  value,
  onChange,
  icon,
  options,
  hasDivider,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  options: { value: string; label: string }[];
  hasDivider: boolean;
}) {
  return (
    <div className="flex-1">
      <div className="relative h-[84px]">
        {hasDivider ? (
          <div className="pointer-events-none absolute right-0 top-1/2 h-11 w-px -translate-y-1/2 bg-slate-200" />
        ) : null}

        <div className="flex h-full items-center gap-3 px-6">
          <div className="shrink-0 text-slate-400">{icon}</div>
          <div className="min-w-0 flex-1">
            <div
              className="text-[12px] font-semibold text-slate-900"
              style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
            >
              {label}
            </div>
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1 w-full appearance-none bg-transparent text-[15px] font-medium text-slate-700 focus:outline-none"
              style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   LOCATION PANEL
============================================ */

function LocationPanel({
  onSelect,
  onClose,
}: {
  onSelect: (location: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="border-t border-slate-100 p-4">
      <div className="flex items-center justify-between">
        <div
          className="text-[12px] font-semibold uppercase tracking-wide text-slate-500"
          style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
        >
          Popular destinations
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {POPULAR_LOCATIONS.map((loc) => (
          <button
            key={loc.name}
            type="button"
            onClick={() => onSelect(loc.name)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-left transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            <span className="text-lg">{loc.emoji}</span>
            <div className="min-w-0">
              <div
                className="truncate text-[13px] font-medium text-slate-900"
                style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
              >
                {loc.name}
              </div>
              <div
                className="text-[11px] text-slate-500"
                style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
              >
                {loc.country}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   DATE PANEL
============================================ */

function DatePanel({
  selectedDate,
  minDate,
  onSelect,
  onClose,
  title,
}: {
  selectedDate: Date | null;
  minDate: Date | null;
  onSelect: (date: Date) => void;
  onClose: () => void;
  title: string;
}) {
  const today = useMemo(() => atMidnight(new Date()), []);
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(selectedDate ?? today)
  );

  const grid = useMemo(() => daysGrid(viewMonth), [viewMonth]);
  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);

  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const isOutside = (d: Date) => isBefore(d, monthStart) || isAfter(d, monthEnd);

  const isDisabled = (d: Date) => {
    if (isBefore(d, today)) return true;
    if (minDate && isBefore(d, minDate)) return true;
    return false;
  };

  const isSelected = (d: Date) => (selectedDate ? isSameDay(d, selectedDate) : false);

  return (
    <div className="border-t border-slate-100 p-4">
      <div className="flex items-center justify-between">
        <div
          className="text-[13px] font-medium text-slate-700"
          style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
        >
          {title}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mx-auto mt-4 max-w-sm">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMonth(addMonths(viewMonth, -1))}
            disabled={isBefore(startOfMonth(addMonths(viewMonth, -1)), startOfMonth(today))}
            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div
            className="text-[14px] font-semibold text-slate-900"
            style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
          >
            {monthLabel(viewMonth)}
          </div>
          <button
            type="button"
            onClick={() => setViewMonth(addMonths(viewMonth, 1))}
            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="pb-2 text-center text-[11px] font-medium text-slate-400"
              style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
            >
              {day}
            </div>
          ))}

          {grid.map((d) => {
            const outside = isOutside(d);
            const disabled = isDisabled(d);
            const selected = isSelected(d);
            const isToday = isSameDay(d, today);

            if (outside) return <div key={d.toISOString()} className="h-10" />;

            return (
              <button
                key={d.toISOString()}
                type="button"
                onClick={() => !disabled && onSelect(d)}
                disabled={disabled}
                className={`
                  h-10 rounded-lg text-[13px] font-medium transition-all
                  ${
                    selected
                      ? "bg-slate-900 text-white"
                      : disabled
                      ? "cursor-not-allowed text-slate-300"
                      : "text-slate-700 hover:bg-slate-100"
                  }
                  ${isToday && !selected ? "ring-1 ring-slate-300" : ""}
                `}
                style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================
   GUESTS PANEL
============================================ */

function GuestsPanel({
  value,
  onChange,
  onClose,
}: {
  value: number;
  onChange: (v: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="border-t border-slate-100 p-4">
      <div className="flex items-center justify-between">
        <div
          className="text-[12px] font-semibold uppercase tracking-wide text-slate-500"
          style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
        >
          Number of guests
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
        <div>
          <div
            className="text-[14px] font-medium text-slate-900"
            style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
          >
            Adults
          </div>
          <div
            className="text-[12px] text-slate-500"
            style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
          >
            Ages 13 or above
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onChange(Math.max(1, value - 1))}
            disabled={value <= 1}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition-colors hover:border-slate-400 disabled:border-slate-200 disabled:text-slate-300"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span
            className="w-8 text-center text-[16px] font-semibold text-slate-900"
            style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
          >
            {value}
          </span>
          <button
            type="button"
            onClick={() => onChange(Math.min(20, value + 1))}
            disabled={value >= 20}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition-colors hover:border-slate-400 disabled:border-slate-200 disabled:text-slate-300"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl bg-slate-900 px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-slate-800"
          style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
