"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, XCircle, LogIn, MapPin } from "lucide-react";
import { readBookings, updateStoredBooking, type StoredBooking } from "@/lib/store";
import {
  departureDate,
  formatDateLong,
  formatKES,
} from "@/lib/utils";

const TWO_HOURS = 2 * 60 * 60 * 1000;

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [notice, setNotice] = useState("");
  const [cancelRef, setCancelRef] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      setBookings(readBookings());
    }
  }, [status]);

  const email = (session?.user as { email?: string } | undefined)?.email ?? "";

  const { upcoming, past } = useMemo(() => {
    const mine = bookings.filter(
      (b) => b.passenger.email === email || b.accountEmail === email
    );
    const now = Date.now();
    const up: StoredBooking[] = [];
    const pa: StoredBooking[] = [];
    for (const b of mine) {
      const dep = departureDate(b.date, b.departure).getTime();
      if (b.status !== "cancelled" && dep + 24 * 60 * 60 * 1000 > now) {
        up.push(b);
      } else {
        pa.push(b);
      }
    }
    up.sort((a, b) => a.date.localeCompare(b.date));
    pa.sort((a, b) => b.date.localeCompare(a.date));
    return { upcoming: up, past: pa };
  }, [bookings, email]);

  const cancelBooking = (booking: StoredBooking) => {
    setNotice("");
    const dep = departureDate(booking.date, booking.departure).getTime();
    if (dep - Date.now() < TWO_HOURS) {
      setNotice(
        "Cancellations are blocked within 2 hours of departure. Contact WhatsApp support if you need help."
      );
      return;
    }
    setCancelRef(booking.ref);
    const updated = updateStoredBooking(booking.ref, { status: "cancelled" });
    if (updated) {
      setBookings(readBookings());
      // Best effort status sync to the server record.
      fetch("/api/payment/mpesa/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref: booking.ref, status: "cancelled" }),
      }).catch(() => undefined);
    }
    setCancelRef("");
  };

  if (status === "loading") {
    return (
      <div className="section__container">
        <p style={{ color: "var(--text-light)" }}>Loading your bookings...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="section__container text-center">
        <LogIn
          size={52}
          className="mx-auto mb-5"
          style={{ color: "var(--primary-color)" }}
          aria-hidden="true"
        />
        <h1 className="section__header">My Bookings</h1>
        <p className="section__description mb-6">
          Sign in to see your past and upcoming trips, view tickets and manage
          cancellations.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/auth/signin?next=/my-bookings" className="btn">
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="btn"
            style={{
              backgroundColor: "var(--white)",
              color: "var(--text-dark)",
              border: "1px solid var(--text-light)",
            }}
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  const renderBooking = (booking: StoredBooking, list: "upcoming" | "past") => {
    const cancelled = booking.status === "cancelled";
    return (
      <motion.article
        key={booking.ref}
        layout
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[5px_5px_20px_rgba(0,0,0,0.06)]"
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="chip">{booking.ref}</span>
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{
              backgroundColor:
                booking.status === "paid"
                  ? "#dcfce7"
                  : cancelled
                    ? "#fee2e2"
                    : "#fef9c3",
              color:
                booking.status === "paid"
                  ? "#166534"
                  : cancelled
                    ? "#991b1b"
                    : "#854d0e",
            }}
          >
            {cancelled
              ? "CANCELLED"
              : booking.status === "paid"
                ? "PAID"
                : "PENDING"}
          </span>
        </div>

        <h4 className="mb-1 text-lg font-bold">
          {booking.routeLabel}
        </h4>
        <p className="mb-3 flex flex-wrap items-center gap-3 text-sm" style={{ color: "var(--text-light)" }}>
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} aria-hidden="true" /> {booking.operator}
          </span>
          <span>{formatDateLong(booking.date)}</span>
          <span>
            {booking.departure} to {booking.arrival}
          </span>
          <span>Seat {booking.seats.join(", ")}</span>
          <span className="font-semibold" style={{ color: "var(--text-dark)" }}>
            {formatKES(booking.total)}
          </span>
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/booking-confirmation?ref=${booking.ref}`}
            className="btn inline-flex items-center gap-2"
          >
            <Ticket size={16} aria-hidden="true" /> View Ticket
          </Link>
          {list === "upcoming" && !cancelled ? (
            <button
              type="button"
              className="btn inline-flex items-center gap-2"
              style={{
                backgroundColor: "var(--white)",
                color: "#b91c1c",
                border: "1px solid #fecaca",
              }}
              onClick={() => cancelBooking(booking)}
              disabled={cancelRef === booking.ref}
            >
              <XCircle size={16} aria-hidden="true" /> Cancel
            </button>
          ) : null}
        </div>
      </motion.article>
    );
  };

  return (
    <div className="section__container">
      <div className="mb-8">
        <span className="chip">Passenger dashboard</span>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">My Bookings</h1>
        <p className="mt-2" style={{ color: "var(--text-light)" }}>
          Signed in as {email}
        </p>
      </div>

      {notice ? (
        <p
          role="alert"
          className="mb-6 rounded-xl p-4 text-sm font-semibold"
          style={{ backgroundColor: "#fef2f2", color: "#991b1b" }}
        >
          {notice}
        </p>
      ) : null}

      <h2 className="mb-4 text-xl font-bold">Upcoming trips</h2>
      {upcoming.length === 0 ? (
        <div
          className="mb-10 rounded-2xl p-8 text-center"
          style={{ backgroundColor: "var(--extra-light)" }}
        >
          <p className="mb-4 font-semibold">No upcoming trips yet</p>
          <Link href="/routes" className="btn">
            Book your next seat
          </Link>
        </div>
      ) : (
        <div className="mb-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {upcoming.map((b) => renderBooking(b, "upcoming"))}
          </AnimatePresence>
        </div>
      )}

      <h2 className="mb-4 text-xl font-bold">Past and cancelled trips</h2>
      {past.length === 0 ? (
        <div
          className="rounded-2xl p-8 text-center"
          style={{ backgroundColor: "var(--extra-light)" }}
        >
          <p style={{ color: "var(--text-light)" }}>
            Your completed trips will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {past.map((b) => renderBooking(b, "past"))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
