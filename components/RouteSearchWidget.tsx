"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { CITIES } from "@/lib/data";
import { todayISO } from "@/lib/utils";

/**
 * Full-width hero route search widget: From, To, Date, Passengers.
 * Submitting navigates to the results page with a loading bar shown
 * during the transition.
 */
export default function RouteSearchWidget() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(todayISO());
  const [passengers, setPassengers] = useState(1);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!from || !to) {
      setError("Choose both a departure city and an arrival city.");
      return;
    }
    if (from === to) {
      setError("Departure and arrival city must be different.");
      return;
    }
    if (!date) {
      setError("Choose your travel date.");
      return;
    }
    setSearching(true);
    const params = new URLSearchParams({
      from,
      to,
      date,
      passengers: String(passengers),
    });
    router.push(`/results?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-[5px_5px_20px_rgba(0,0,0,0.18)] md:p-5"
      aria-label="Route search"
    >
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto_auto] lg:items-end">
        <div className="field">
          <label htmlFor="search-from">From</label>
          <select
            id="search-from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
          >
            <option value="">Departure city</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="search-to">To</label>
          <select
            id="search-to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          >
            <option value="">Arrival city</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="search-date">Date</label>
          <input
            id="search-date"
            type="date"
            value={date}
            min={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="field" style={{ minWidth: 110 }}>
          <label htmlFor="search-pax">Passengers</label>
          <input
            id="search-pax"
            type="number"
            min={1}
            max={10}
            value={passengers}
            onChange={(e) => setPassengers(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
            required
          />
        </div>
        <button className="btn" type="submit" disabled={searching}>
          <span className="inline-flex items-center gap-2">
            <Search size={18} />
            {searching ? "Searching..." : "Search routes"}
          </span>
        </button>
      </div>
      {error ? (
        <p role="alert" className="error" style={{ color: "#b91c1c", marginTop: 10, fontSize: "0.9rem" }}>
          {error}
        </p>
      ) : null}
      {searching ? <span className="search-progress" aria-hidden="true" /> : null}
    </form>
  );
}
