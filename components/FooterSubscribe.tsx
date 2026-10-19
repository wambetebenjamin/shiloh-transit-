"use client";

import { useState } from "react";
import { useCaptchaToken } from "./CaptchaProvider";

/** Footer subscribe form, posted to /api/contact with a captcha token. */
export default function FooterSubscribe() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const getToken = useCaptchaToken();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setState("error");
      return;
    }
    setState("sending");
    try {
      const captchaToken = await getToken("contact");
      const local = email.split("@")[0] || "Traveller";
      const name = local.length >= 2 ? local : "Traveller";
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message: "Please add me to the Shiloh Transit newsletter and route updates.",
          captchaToken,
        }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <p style={{ color: "var(--primary-color)", fontWeight: 600 }}>
        Thank you. You are on the list.
      </p>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: "1rem" }}>
      <input
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
      />
      <button className="btn" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending..." : "Subscribe"}
      </button>
      {state === "error" ? (
        <p style={{ color: "#fecaca", fontSize: "0.85rem" }}>
          Something went wrong. Please try again or WhatsApp us.
        </p>
      ) : null}
    </form>
  );
}
