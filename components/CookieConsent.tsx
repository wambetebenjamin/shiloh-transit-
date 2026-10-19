"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "shiloh_transit_consent";

type Prefs = {
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

const TOGGLES: {
  key: keyof Prefs | "necessary";
  title: string;
  description: string;
  locked?: boolean;
}[] = [
  {
    key: "necessary",
    title: "Necessary",
    description:
      "Required for core site functions such as security, session handling and remembering your consent choices. Always on.",
    locked: true,
  },
  {
    key: "functional",
    title: "Functional",
    description:
      "Remembers preferences such as chosen routes and form details to improve your booking experience.",
  },
  {
    key: "analytics",
    title: "Analytics",
    description:
      "Helps us understand how travellers use the site so we can improve routes, pages and performance.",
  },
  {
    key: "marketing",
    title: "Marketing",
    description:
      "Used to show relevant Shiloh Transit offers on other platforms you visit.",
  },
];

/**
 * Cookie consent banner following the Kenya Data Protection Act 2019.
 * Choices are stored in localStorage under shiloh_transit_consent and
 * the banner never shows again once a choice is saved.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({
    functional: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const persist = (choices: Prefs) => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          necessary: true,
          ...choices,
          updatedAt: new Date().toISOString(),
          framework: "Kenya Data Protection Act 2019",
        })
      );
    } catch {
      // Storage may be blocked; still hide the banner for this session.
    }
    setVisible(false);
    setModalOpen(false);
  };

  if (!visible) return null;

  return (
    <>
      <div className="cookie-banner" role="region" aria-label="Cookie consent">
        <div
          className="mx-auto flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between"
          style={{ maxWidth: "var(--max-width)" }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-light)" }}>
            We use cookies and similar storage to run this site and improve your
            booking experience, in line with the Kenya Data Protection Act 2019.
            You can accept all cookies or manage your preferences. Read our{" "}
            <Link
              href="/legal/cookie-policy"
              style={{ color: "var(--primary-color)", textDecoration: "underline" }}
            >
              cookie policy
            </Link>
            .
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn"
              onClick={() =>
                persist({ functional: true, analytics: true, marketing: true })
              }
            >
              Accept All
            </button>
            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: "var(--white)",
                color: "var(--text-dark)",
                border: "1px solid var(--text-light)",
              }}
              onClick={() => setModalOpen(true)}
            >
              Manage Preferences
            </button>
          </div>
        </div>
      </div>

      {modalOpen ? (
        <div
          className="cookie-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Manage cookie preferences"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="cookie-panel">
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 6 }}>
              Manage Preferences
            </h3>
            <p
              style={{
                color: "var(--text-light)",
                fontSize: "0.9rem",
                marginBottom: 18,
              }}
            >
              Choose which categories of cookies and storage Shiloh Transit may
              use. Necessary storage is always on because the site cannot work
              without it.
            </p>
            <div style={{ display: "grid", gap: 16 }}>
              {TOGGLES.map((item) => {
                const on =
                  item.locked || (prefs[item.key as keyof Prefs] ?? false);
                return (
                  <div
                    key={item.title}
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{ fontWeight: 600, marginBottom: 2 }}
                        id={`consent-${item.title}`}
                      >
                        {item.title}
                        {item.locked ? " (locked)" : ""}
                      </div>
                      <p
                        style={{
                          color: "var(--text-light)",
                          fontSize: "0.85rem",
                          lineHeight: 1.55,
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-pressed={on}
                      aria-labelledby={`consent-${item.title}`}
                      aria-label={`${item.title} cookies`}
                      className={`consent-toggle${on ? " is-on" : ""}`}
                      disabled={item.locked}
                      onClick={() => {
                        if (item.locked) return;
                        const key = item.key as keyof Prefs;
                        setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
                      }}
                    >
                      <span />
                    </button>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 22,
                flexWrap: "wrap",
              }}
            >
              <button type="button" className="btn" onClick={() => persist(prefs)}>
                Save preferences
              </button>
              <button
                type="button"
                className="btn"
                style={{
                  backgroundColor: "var(--white)",
                  color: "var(--text-dark)",
                  border: "1px solid var(--text-light)",
                }}
                onClick={() =>
                  persist({ functional: true, analytics: true, marketing: true })
                }
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
