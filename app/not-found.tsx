import Link from "next/link";
import { Bus } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/data";

export default function NotFound() {
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
        <Bus
          size={64}
          style={{ color: "var(--primary-color)", margin: "0 auto 1.5rem" }}
          aria-hidden="true"
        />
        <h1 className="section__header">This route doesn&apos;t exist</h1>
        <p className="section__description" style={{ marginBottom: "2rem" }}>
          The page you are looking for has moved, or the link is broken. Let us
          get you back on the road.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/" className="btn">
            Back to Home
          </Link>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              backgroundColor: "var(--white)",
              color: "var(--text-dark)",
              border: "1px solid var(--text-light)",
            }}
          >
            WhatsApp +254112272061
          </a>
        </div>
      </div>
    </div>
  );
}
