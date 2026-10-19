import { Suspense } from "react";
import type { Metadata } from "next";
import TicketView from "@/components/TicketView";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  description: "Your Shiloh Transit e-ticket with QR code, PDF download and calendar link.",
};

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="section__container">
          <p style={{ color: "var(--text-light)" }}>Loading your ticket...</p>
        </div>
      }
    >
      <TicketView />
    </Suspense>
  );
}
