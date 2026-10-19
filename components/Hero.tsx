"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import RouteSearchWidget from "./RouteSearchWidget";

/**
 * Homepage hero. The search widget slides in on load with GSAP.
 * The background image layers a Pexels highway bus photo over the
 * template hero background as a fallback.
 */
export default function Hero() {
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(eyebrowRef.current, { y: 24, opacity: 0, duration: 0.6 })
        .from(titleRef.current, { y: 30, opacity: 0, duration: 0.7 }, "-=0.35")
        .from(subRef.current, { y: 24, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(
          widgetRef.current,
          { x: -70, opacity: 0, duration: 0.9 },
          "-=0.3"
        );
    });
    return () => ctx.revert();
  }, []);

  return (
    <header id="home" className="hero-shell">
      <div className="header__container">
        <div className="header__content" style={{ gridColumn: "1 / -1" }}>
          <p ref={eyebrowRef}>
            KENYA&apos;S BUS AND MATATU BOOKING PLATFORM
          </p>
          <h1 ref={titleRef} className="break-words">
            Book your seat. Ride with confidence.
          </h1>
          <p
            ref={subRef}
            className="mx-auto mb-8 max-w-[640px] !text-center"
            style={{
              color: "var(--text-light)",
              fontWeight: 400,
              fontSize: "1.05rem",
            }}
          >
            Search any route across Kenya, pick your seat on a live seat map,
            pay with M-Pesa or card and get your e-ticket in seconds.
          </p>
          <div ref={widgetRef} className="mx-auto w-full max-w-[980px] text-left">
            <RouteSearchWidget />
          </div>
        </div>
      </div>
    </header>
  );
}
