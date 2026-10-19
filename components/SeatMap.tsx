"use client";

import { motion } from "framer-motion";

const AVAILABLE = "#22c55e";
const RESERVED = "#d1d5db";
const SELECTED = "#2887ff";

/**
 * Visual seat grid. Available seats are green, reserved seats are
 * grey and selected seats highlight in the brand primary colour.
 */
export default function SeatMap({
  total,
  reserved,
  selected,
  onToggle,
  maxSelectable,
}: {
  total: number;
  reserved: number[];
  selected: number[];
  onToggle: (seat: number) => void;
  maxSelectable: number;
}) {
  const reservedSet = new Set(reserved);
  const rows: number[][] = [];
  for (let seat = 1; seat <= total; seat += 4) {
    rows.push(Array.from({ length: Math.min(4, total - seat + 1) }, (_, i) => seat + i));
  }

  const renderSeat = (seat: number) => {
    const isReserved = reservedSet.has(seat);
    const isSelected = selected.includes(seat);
    const backgroundColor = isSelected
      ? SELECTED
      : isReserved
        ? RESERVED
        : AVAILABLE;
    const full = !isSelected && selected.length >= maxSelectable;
    const label = isReserved
      ? `Seat ${seat}, reserved`
      : isSelected
        ? `Seat ${seat}, selected`
        : `Seat ${seat}, available`;

    return (
      <motion.button
        key={seat}
        type="button"
        className="seat grid h-11 w-11 place-items-center rounded-lg text-xs font-bold"
        style={{
          backgroundColor,
          color: isReserved ? "#4b5563" : "#ffffff",
          cursor: isReserved || full ? "not-allowed" : "pointer",
          opacity: full && !isReserved ? 0.55 : 1,
          boxShadow: isSelected ? "0 0 0 3px rgba(40,135,255,0.3)" : "none",
        }}
        disabled={isReserved || full}
        aria-pressed={isSelected}
        aria-label={label}
        whileHover={isReserved || full ? undefined : { scale: 1.08, y: -2 }}
        whileTap={isReserved || full ? undefined : { scale: 0.95 }}
        onClick={() => onToggle(seat)}
      >
        {seat}
      </motion.button>
    );
  };

  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-semibold">Seat map</h4>
        <span className="text-sm" style={{ color: "var(--text-light)" }}>
          {selected.length} of {maxSelectable} selected
        </span>
      </div>

      <div className="mx-auto max-w-[340px]">
        <div className="mb-3 flex items-center justify-between rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: "var(--text-dark)" }}>
          <span>Driver</span>
          <span aria-hidden="true">Front</span>
        </div>

        <div className="grid gap-2" role="group" aria-label="Seats">
          {rows.map((row) => (
            <div key={row[0]} className="flex items-center justify-center gap-2">
              {renderSeat(row[0])}
              {row[1] ? renderSeat(row[1]) : <span className="h-11 w-11" aria-hidden="true" />}
              <span className="h-11 w-6" aria-hidden="true" />
              {row[2] ? renderSeat(row[2]) : <span className="h-11 w-11" aria-hidden="true" />}
              {row[3] ? renderSeat(row[3]) : <span className="h-11 w-11" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
        <span className="seat-legend">
          <i style={{ backgroundColor: AVAILABLE }} /> Available
        </span>
        <span className="seat-legend">
          <i style={{ backgroundColor: RESERVED }} /> Reserved
        </span>
        <span className="seat-legend">
          <i style={{ backgroundColor: SELECTED }} /> Selected
        </span>
      </div>
    </div>
  );
}
