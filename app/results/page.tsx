"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { SearchX } from "lucide-react";
import type { Route } from "@/lib/data";
import RouteCard from "@/components/RouteCard";

type SearchResponse = {
  count: number;
  results: Route[];
  date: string;
  passengers: number;
};

/**
 * Results page for the hero route search. Submits the search to
 * /api/routes/search with a top loading bar while the request runs.
 */
function ResultsExplorer() {
  const params = useSearchParams();
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const date = params.get("date") ?? "";
  const passengers = Number(params.get("passengers") || 1);

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Route[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/routes/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ from, to, date, passengers }),
        });
        const data = (await res.json()) as SearchResponse & { error?: string };
        if (!res.ok) throw new Error(data.error || "Search failed");
        if (active) setResults(data.results ?? []);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [from, to, date, passengers]);

  return (
    <div className="section__container">
      {loading ? <div className="top-progress" aria-hidden="true"><span /></div> : null}

      <div className="mb-8">
        <span className="chip">Search results</span>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          {from} to {to}
        </h1>
        <p className="mt-2" style={{ color: "var(--text-light)" }}>
          {date} for {passengers} {passengers === 1 ? "passenger" : "passengers"}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[280px] animate-pulse rounded-2xl"
              style={{ backgroundColor: "var(--extra-light)" }}
            />
          ))}
        </div>
      ) : error ? (
        <div
          className="rounded-2xl p-8 text-center"
          style={{ backgroundColor: "var(--extra-light)" }}
        >
          <p className="mb-4 font-semibold">{error}</p>
          <Link href="/routes" className="btn">
            Browse all routes
          </Link>
        </div>
      ) : results.length === 0 ? (
        <div
          className="rounded-2xl p-10 text-center"
          style={{ backgroundColor: "var(--extra-light)" }}
        >
          <SearchX
            size={42}
            className="mx-auto mb-4"
            style={{ color: "var(--primary-color)" }}
            aria-hidden="true"
          />
          <p className="mb-2 text-lg font-semibold">
            No departures match your search
          </p>
          <p className="mb-6" style={{ color: "var(--text-light)" }}>
            Try a nearby date or another corridor. Our operators run more routes
            every day.
          </p>
          <Link href="/routes" className="btn">
            Browse all routes
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {results.map((route, index) => (
              <RouteCard
                key={route.id}
                route={route}
                date={date}
                passengers={passengers}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="section__container">
          <p style={{ color: "var(--text-light)" }}>Loading results...</p>
        </div>
      }
    >
      <ResultsExplorer />
    </Suspense>
  );
}
