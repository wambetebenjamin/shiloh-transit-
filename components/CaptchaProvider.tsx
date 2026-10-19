"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (el: HTMLElement, options: Record<string, unknown>) => number;
      reset: (id?: number) => void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadRecaptchaScript(): Promise<void> {
  if (!SITE_KEY || typeof window === "undefined") return Promise.resolve();
  if (window.grecaptcha) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("reCAPTCHA failed to load"));
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

type ChallengeFn = () => Promise<string>;

const CaptchaChallengeContext = createContext<ChallengeFn>(async () => "");

export function useCaptchaChallenge(): ChallengeFn {
  return useContext(CaptchaChallengeContext);
}

/**
 * Returns a function that resolves a reCAPTCHA v3 token for an
 * action. When Google scores the token below 0.5 the visible v2
 * challenge is surfaced and its token is returned instead. The server
 * re-verifies every token before processing a submission.
 */
export function useCaptchaToken(): (action: string) => Promise<string> {
  const challenge = useCaptchaChallenge();

  return useCallback(
    async (action: string): Promise<string> => {
      if (!SITE_KEY) return "";
      try {
        await loadRecaptchaScript();
        const token = await new Promise<string>((resolve, reject) => {
          const timer = window.setTimeout(
            () => reject(new Error("reCAPTCHA timed out")),
            8000
          );
          window.grecaptcha!.ready(() => {
            window
              .grecaptcha!.execute(SITE_KEY, { action })
              .then((value) => {
                window.clearTimeout(timer);
                resolve(value);
              })
              .catch((error) => {
                window.clearTimeout(timer);
                reject(error);
              });
          });
        });
        try {
          const res = await fetch("/api/recaptcha/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, action }),
          });
          const data = (await res.json()) as {
            ok?: boolean;
            challengeRequired?: boolean;
          };
          if (data.ok === false && data.challengeRequired) {
            const v2Token = await challenge();
            return v2Token || token;
          }
        } catch {
          // The submission endpoint verifies again server-side.
        }
        return token;
      } catch {
        return "";
      }
    },
    [challenge]
  );
}

export function CaptchaProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const resolverRef = useRef<((token: string) => void) | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);

  const challenge = useCallback<ChallengeFn>(() => {
    if (!SITE_KEY) return Promise.resolve("");
    return new Promise<string>((resolve) => {
      resolverRef.current = resolve;
      setOpen(true);
    });
  }, []);

  useEffect(() => {
    if (!open || !SITE_KEY || !widgetRef.current || widgetIdRef.current !== null) {
      return;
    }
    let cancelled = false;
    loadRecaptchaScript()
      .then(() => {
        if (
          cancelled ||
          !window.grecaptcha ||
          !widgetRef.current ||
          widgetIdRef.current !== null
        ) {
          return;
        }
        widgetIdRef.current = window.grecaptcha.render(widgetRef.current, {
          sitekey: SITE_KEY,
          callback: (token: string) => {
            resolverRef.current?.(token);
            resolverRef.current = null;
            widgetIdRef.current = null;
            setOpen(false);
          },
        });
      })
      .catch(() => {
        resolverRef.current?.("");
        resolverRef.current = null;
        setOpen(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const cancel = () => {
    resolverRef.current?.("");
    resolverRef.current = null;
    widgetIdRef.current = null;
    setOpen(false);
  };

  return (
    <CaptchaChallengeContext.Provider value={challenge}>
      {children}
      {open ? (
        <div
          className="cookie-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Security check"
        >
          <div className="cookie-panel" style={{ maxWidth: 420 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Security check</h3>
            <p
              style={{
                color: "var(--text-light)",
                marginBottom: 16,
                fontSize: "0.95rem",
              }}
            >
              Please complete the reCAPTCHA challenge below to continue with
              your submission.
            </p>
            <div ref={widgetRef} />
            <button
              type="button"
              className="btn"
              style={{ marginTop: 16, backgroundColor: "var(--text-light)" }}
              onClick={cancel}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </CaptchaChallengeContext.Provider>
  );
}
