"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import type { Route } from "@/lib/data";
import { formatKES } from "@/lib/utils";

/**
 * Route card: operator, departure and arrival times, duration,
 * available seats, fare and a Select button. Enters with a fade up
 * animation and animates out when filters change.
 */
export default function RouteCard({
  route,
  date,
  passengers,
  index = 0,
}: {
  route: Route;
  date?: string;
  passengers?: number;
  index?: number;
}) {
  const href = `/routes/${route.id}${
    date ? `?date=${date}&passengers=${passengers ?? 1}` : ""
  }`;
  const low = route.seatsAvailable <= 8;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
      className="flex flex-col rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[5px_5px_20px_rgba(0,0,0,0.07)]"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="chip">{route.operator}</span>
        <span className="text-sm" style={{ color: "var(--text-light)" }}>
          {route.coach}
        </span>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-center">
          <div className="text-2xl font-bold">{route.departure}</div>
          <div className="text-sm" style={{ color: "var(--text-light)" }}>
            {route.from}
          </div>
        </div>
        <div className="flex-1 text-center">
          <div className="mb-1 text-xs" style={{ color: "var(--text-light)" }}>
            {route.duration}
          </div>
          <div
            className="mx-auto h-px w-full"
            style={{ backgroundColor: "#d1d5db" }}
          />
          <ArrowRight
            size={14}
            className="mx-auto"
            style={{ color: "var(--primary-color)" }}
            aria-hidden="true"
          />
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{route.arrival}</div>
          <div className="text-sm" style={{ color: "var(--text-light)" }}>
            {route.to}
          </div>
        </div>
      </div>

      <div
        className="mb-4 flex items-center justify-between rounded-xl px-4 py-3 text-sm"
        style={{ backgroundColor: "var(--extra-light)" }}
      >
        <span className="inline-flex items-center gap-2 font-semibold">
          <Users size={15} aria-hidden="true" />
          {route.seatsAvailable} seats left
        </span>
        <span style={{ color: low ? "#b91c1c" : "var(--text-light)" }}>
          {low ? "Filling fast" : "Good availability"}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3">
        <div>
          <div className="text-xs" style={{ color: "var(--text-light)" }}>
            Fare from
          </div>
          <div className="text-lg font-bold" style={{ color: "var(--primary-color)" }}>
            {formatKES(route.baseFare)}
          </div>
        </div>
        <Link href={href} className="btn">
          Select
        </Link>
      </div>
    </motion.article>
  );
}
