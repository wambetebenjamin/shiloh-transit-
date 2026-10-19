"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Download,
  MessageCircle,
  CalendarPlus,
  Ticket as TicketIcon,
} from "lucide-react";
import {
  getStoredBooking,
  type StoredBooking,
} from "@/lib/store";
import {
  formatDateLong,
  formatKES,
} from "@/lib/utils";

function googleCalendarHref(booking: StoredBooking): string {
  const [y, m, d] = booking.date.split("-").map(Number);
  const [hh, mm] = booking.departure.split(":").map(Number);
  const start = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0);
  const end = new Date(start.getTime() + 60 * 60 * 1000 * 6);
  const fmt = (date: Date) =>
    `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
      date.getDate()
    ).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}${String(
      date.getMinutes()
    ).padStart(2, "0")}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Shiloh Transit: ${booking.routeLabel}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Booking ${booking.ref} with ${booking.operator}. Seat ${booking.seats.join(
      ", "
    )}. Departure ${booking.departure}.`,
    location: `${booking.from}, Kenya`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function TicketView() {
  const params = useSearchParams();
  const ref = params.get("ref") ?? "";
  const [booking, setBooking] = useState<StoredBooking | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [qr, setQr] = useState("");
  const [pdfBusy, setPdfBusy] = useState(false);
  const ticketRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = ref ? getStoredBooking(ref) : undefined;
    if (stored) {
      setBooking(stored);
      setLoaded(true);
      return;
    }
    // Fall back to the session gated API when signed in.
    (async () => {
      try {
        const res = await fetch(`/api/bookings/${encodeURIComponent(ref)}`);
        if (res.ok) {
          const data = (await res.json()) as { booking?: StoredBooking };
          if (data.booking) setBooking(data.booking);
        }
      } catch {
        // Ignore, the empty state below explains what to do.
      } finally {
        setLoaded(true);
      }
    })();
  }, [ref]);

  useEffect(() => {
    if (!booking) return;
    let cancelled = false;
    (async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        const payload = JSON.stringify({
          bookingReference: booking.ref,
          route: booking.routeLabel,
          date: booking.date,
          seats: booking.seats,
          passenger: booking.passenger.fullName,
          operator: booking.operator,
          issuer: "Shiloh Transit",
        });
        const url = await QRCode.toDataURL(payload, {
          width: 220,
          margin: 1,
          color: { dark: "#0a0a0a", light: "#ffffff" },
        });
        if (!cancelled) setQr(url);
      } catch {
        // QR is a convenience; the reference text remains visible.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [booking]);

  const downloadPdf = async () => {
    if (!booking || !ticketRef.current || pdfBusy) return;
    setPdfBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const img = canvas.toDataURL("image/png");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const width = pageWidth - 40;
      const height = (canvas.height / canvas.width) * width;
      pdf.addImage(
        img,
        "PNG",
        20,
        20,
        width,
        Math.min(height, pageHeight - 40)
      );
      pdf.save(`shiloh-transit-ticket-${booking.ref}.pdf`);
    } finally {
      setPdfBusy(false);
    }
  };

  const shareWhatsApp = () => {
    if (!booking) return;
    const text = `My Shiloh Transit e-ticket%0ABooking: ${booking.ref}%0ARoute: ${booking.routeLabel}%0ADate: ${booking.date}%0ASeat: ${booking.seats.join(
      ", "
    )}%0APassenger: ${booking.passenger.fullName}%0AOperator: ${booking.operator}`;
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  if (!loaded) {
    return (
      <div className="section__container">
        <p style={{ color: "var(--text-light)" }}>Loading your ticket...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="section__container text-center">
        <TicketIcon
          size={54}
          className="mx-auto mb-5"
          style={{ color: "var(--primary-color)" }}
          aria-hidden="true"
        />
        <h1 className="section__header">Ticket not found</h1>
        <p className="section__description mb-6">
          We could not find a booking for reference{" "}
          <strong>{ref || "(none)"}</strong>. Check your email or open My
          Bookings while signed in.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn">
            Back to Home
          </Link>
          <Link
            href="/my-bookings"
            className="btn"
            style={{
              backgroundColor: "var(--white)",
              color: "var(--text-dark)",
              border: "1px solid var(--text-light)",
            }}
          >
            My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(
    `My Shiloh Transit e-ticket. Booking ${booking.ref}, ${booking.routeLabel}, ${booking.date}, seat ${booking.seats.join(", ")}.`
  )}`;

  return (
    <div className="section__container">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 16 }}
        className="mx-auto max-w-[640px]"
      >
        <div className="mb-6 text-center">
          <span className="chip">Booking confirmed</span>
          <h1 className="mt-3 text-3xl font-bold">Your e-ticket is ready</h1>
          <p className="mt-2" style={{ color: "var(--text-light)" }}>
            Show the QR code below at boarding. A copy has been saved to My
            Bookings.
          </p>
        </div>

        <div className="ticket" ref={ticketRef}>
          <div className="ticket__head flex items-center justify-between px-6 py-4">
            <div>
              <div className="text-lg font-extrabold tracking-wide">
                SHILOH TRANSIT
              </div>
              <div className="text-xs opacity-90">
                Book your seat. Ride with confidence.
              </div>
            </div>
            <div className="rounded-full bg-white px-3 py-1 text-xs font-bold" style={{ color: "#2887ff" }}>
              {booking.status === "paid" ? "PAID" : booking.status.toUpperCase()}
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto]">
            <div className="grid gap-3 text-sm">
              <div>
                <div style={{ color: "#737373" }}>Booking reference</div>
                <div className="text-xl font-bold" style={{ color: "#2887ff" }}>
                  {booking.ref}
                </div>
              </div>
              <div>
                <div style={{ color: "#737373" }}>Route</div>
                <div className="font-semibold">
                  {booking.routeLabel} ({booking.operator})
                </div>
              </div>
              <div>
                <div style={{ color: "#737373" }}>Date</div>
                <div className="font-semibold">{formatDateLong(booking.date)}</div>
              </div>
              <div>
                <div style={{ color: "#737373" }}>Departure</div>
                <div className="font-semibold">
                  {booking.departure} to {booking.arrival} ({booking.duration})
                </div>
              </div>
              <div>
                <div style={{ color: "#737373" }}>Seat number</div>
                <div className="font-semibold">{booking.seats.join(", ")}</div>
              </div>
              <div>
                <div style={{ color: "#737373" }}>Passenger</div>
                <div className="font-semibold">{booking.passenger.fullName}</div>
              </div>
              <div>
                <div style={{ color: "#737373" }}>Fare paid</div>
                <div className="font-semibold">{formatKES(booking.total)}</div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              {qr ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qr}
                  alt={`QR code for booking ${booking.ref}`}
                  width={180}
                  height={180}
                  style={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
              ) : (
                <div
                  className="grid h-[180px] w-[180px] place-items-center rounded-lg text-sm"
                  style={{ backgroundColor: "#f3f4f6", color: "#737373" }}
                >
                  Generating QR...
                </div>
              )}
              <div className="text-center text-xs" style={{ color: "#737373" }}>
                Scan at boarding
              </div>
            </div>
          </div>

          <div
            className="mx-6 mb-2"
            style={{ borderTop: "2px dashed #d1d5db" }}
            aria-hidden="true"
          />
          <div
            className="px-6 py-3 text-center text-xs"
            style={{ color: "#737373" }}
          >
            This ticket is issued by Shiloh Transit, Nairobi, Kenya. Support:
            +254112272061
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <motion.button
            type="button"
            className="btn inline-flex items-center gap-2"
            onClick={downloadPdf}
            disabled={pdfBusy}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download size={17} aria-hidden="true" />
            {pdfBusy ? "Preparing PDF..." : "Download as PDF"}
          </motion.button>
          <a
            href={whatsappShare}
            target="_blank"
            rel="noopener noreferrer"
            className="btn inline-flex items-center gap-2"
            style={{ backgroundColor: "var(--text-dark)" }}
          >
            <MessageCircle size={17} aria-hidden="true" />
            Share via WhatsApp
          </a>
          <a
            href={googleCalendarHref(booking)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn inline-flex items-center gap-2"
            style={{
              backgroundColor: "var(--white)",
              color: "var(--text-dark)",
              border: "1px solid var(--text-light)",
            }}
          >
            <CalendarPlus size={17} aria-hidden="true" />
            Add to Google Calendar
          </a>
        </div>
      </motion.div>
    </div>
  );
}
