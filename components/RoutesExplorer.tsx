"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { CITIES, ROUTES } from "@/lib/data";
import { todayISO } from "@/lib/utils";
import RouteCard from "./RouteCard";

/**
 * All routes listing, filterable by departure city, arrival city and
 * date with framer-motion filter animations.
 */
export default function RoutesExplorer() {
  const params = useSearchParams();
  const [from, setFrom] = useState(params.get("from") ?? "");
  const [to, setTo] = useState(params.get("to") ?? "");
  const [date, setDate] = useState(params.get("date") ?? todayISO());

  const filtered = useMemo(() => {
    return ROUTES.filter((route) => {
      if (from && route.from !== from) return false;
      if (to && route.to !== to) return false;
      return true;
    });
  }, [from, to]);

  const clear = () => {
    setFrom("");
    setTo("");
    setDate(todayISO());
  };

  return (
    <div className="section__container">
      <div
        className="mb-8 rounded-3xl p-8 md:p-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.88), rgba(255,255,255,0.88)), url(/images/matatu.jpg), url(/img/showcase.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "var(--extra-light)",
        }}
      >
        <h1 className="section__header" style={{ textAlign: "left" }}>
          All routes
        </h1>
        <p
          className="mt-2 max-w-[600px]"
          style={{ color: "var(--text-light)" }}
        >
          Filter by departure city, arrival city and travel date. Every card
          shows the operator, times, duration, live seats and fare.
        </p>
      </div>

      <div
        className="mb-8 grid gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-5 md:grid-cols-[1fr_1fr_1fr_auto]"
        aria-label="Route filters"
      >
        <div className="field">
          <label htmlFor="filter-from">Departure city</label>
          <select
            id="filter-from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          >
            <option value="">Any departure</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="filter-to">Arrival city</label>
          <select
            id="filter-to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          >
            <option value="">Any arrival</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="filter-date">Date</label>
          <input
            id="filter-date"
            type="date"
            value={date}
            min={todayISO()}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="flex items-end gap-3">
          <button
            type="button"
            className="btn"
            style={{
              backgroundColor: "var(--white)",
              color: "var(--text-dark)",
              border: "1px solid var(--text-light)",
            }}
            onClick={clear}
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal size={16} />
              Clear
            </span>
          </button>
        </div>
      </div>

      <p className="mb-4 text-sm" style={{ color: "var(--text-light)" }} aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "route" : "routes"} found
        {date ? ` for ${date}` : ""}
      </p>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((route, index) => (
            <RouteCard
              key={route.id}
              route={route}
              date={date}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 ? (
        <div
          className="rounded-2xl p-10 text-center"
          style={{ backgroundColor: "var(--extra-light)" }}
        >
          <p className="mb-2 font-semibold">No routes match these filters</p>
          <p style={{ color: "var(--text-light)" }}>
            Try a different departure or arrival city.
          </p>
        </div>
      ) : null}
    </div>
  );
}
