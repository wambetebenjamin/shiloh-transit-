"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Branded loading screen: a bus silhouette drives across a thin road
 * line while a percentage counter climbs from 0 to 100. The screen
 * fades out after at most 3 seconds. A skip button appears after
 * 1 second. Under prefers-reduced-motion only the text counter is
 * shown.
 */
export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setLeaving(true);
      window.setTimeout(() => setGone(true), 380);
    };

    const start = performance.now();
    const duration = 2400;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setProgress(Math.round(t * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };
    raf = requestAnimationFrame(tick);

    const skipTimer = window.setTimeout(() => setShowSkip(true), 1000);
    const hardCap = window.setTimeout(finish, 3000);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(skipTimer);
      window.clearTimeout(hardCap);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`loading-screen${leaving ? " is-leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Shiloh Transit"
    >
      <span className="loading-brand">Shiloh Transit</span>
      <div className="loading-road" aria-hidden="true">
        <svg
          className="loading-bus"
          width="76"
          height="36"
          viewBox="0 0 76 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 25V11c0-3.3 2.4-6.1 5.6-6.7l36.6-2.4C52 1.2 56.4 3.4 59.4 6.7l5.8 6.4c1.9 2.1 2.8 4.4 2.8 7V25H6z"
            fill="#0a0a0a"
          />
          <rect x="12" y="9" width="13" height="8" rx="1.5" fill="#ffffff" />
          <rect x="29" y="8.4" width="13" height="8" rx="1.5" fill="#ffffff" />
          <rect x="46" y="7.8" width="10" height="8" rx="1.5" fill="#ffffff" />
          <rect x="60" y="17" width="8" height="5" rx="1.5" fill="#2887ff" />
          <circle cx="20" cy="26" r="5.5" fill="#0a0a0a" stroke="#2887ff" strokeWidth="2" />
          <circle cx="53" cy="26" r="5.5" fill="#0a0a0a" stroke="#2887ff" strokeWidth="2" />
        </svg>
      </div>
      <div className="loading-percent">{progress}%</div>
      <button
        type="button"
        className={`loading-skip${showSkip ? " is-visible" : ""}`}
        onClick={() => {
          setProgress(100);
          finishedRef.current = false;
          const finishNow = () => {
            if (finishedRef.current) return;
            finishedRef.current = true;
            setLeaving(true);
            window.setTimeout(() => setGone(true), 380);
          };
          finishNow();
        }}
      >
        Skip
      </button>
    </div>
  );
}
