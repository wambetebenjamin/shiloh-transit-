"use client";

import { RefreshCw, MessageCircle, AlertTriangle } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/data";

/** Branded 500 screen used by the error boundary and the /500 route. */
export default function ServerErrorScreen({
  onRetry,
}: {
  onRetry?: () => void;
}) {
  const retry = onRetry ?? (() => window.location.reload());

  return (
    <div
      className="section__container"
      style={{
        minHeight: "65vh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
      }}
    >
      <div>
        <AlertTriangle
          size={60}
          style={{ color: "var(--primary-color)", margin: "0 auto 1.5rem" }}
          aria-hidden="true"
        />
        <h1 className="section__header">Something went wrong on our end</h1>
        <p className="section__description" style={{ marginBottom: "2rem" }}>
          Our servers hit a bump on the road. Please try again, and if the
          problem continues, reach us on WhatsApp at +254112272061.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button type="button" className="btn" onClick={retry}>
            <span
              className="inline-flex items-center gap-2"
              style={{ color: "inherit" }}
            >
              <RefreshCw size={17} aria-hidden="true" /> Try Again
            </span>
          </button>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn inline-flex items-center gap-2"
            style={{
              backgroundColor: "var(--white)",
              color: "var(--text-dark)",
              border: "1px solid var(--text-light)",
            }}
          >
            <MessageCircle size={17} aria-hidden="true" /> WhatsApp
            +254112272061
          </a>
        </div>
      </div>
    </div>
  );
}
